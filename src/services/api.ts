const API=(import.meta.env.VITE_API_URL||'http://localhost:4000/api/v1').replace(/\/$/,'');
let refreshPromise:Promise<string|null>|null=null;
let accessToken=localStorage.getItem('bratips_access')||'';
export function setToken(t:string){accessToken=t;if(t)localStorage.setItem('bratips_access',t);else localStorage.removeItem('bratips_access')}
export function getToken(){return accessToken}

async function fetchWithTimeout(url:string, options:RequestInit={}, timeoutMs=15000){
  const controller=new AbortController();
  const timer=window.setTimeout(()=>controller.abort(),timeoutMs);
  try{return await fetch(url,{...options,signal:controller.signal});}
  finally{window.clearTimeout(timer);}
}

type CacheEntry={expiresAt:number,data:any};
const cachePrefix='bratips_public_cache_v2:';
const memoryCache=new Map<string,CacheEntry>();
function cacheTtl(path:string){
  if(path.includes('/matches/live')) return 0;
  if(path.includes('/dropping-odds')) return 0;
  if(path.includes('/matches/today')) return 30_000;
  if(path.includes('/matches/')) return 60_000;
  if(path.includes('/prediction-history')) return 5*60_000;
  return 2*60_000;
}
function cacheAllowed(path:string){
  if(accessToken && (path.startsWith('/auth/') || path.startsWith('/me/') || path.startsWith('/predictions') || path.startsWith('/prediction-history'))) return false;
  if(path.includes('/admin/')) return false;
  return true;
}
function readCache(path:string){
  const now=Date.now(); const hit=memoryCache.get(path); if(hit && hit.expiresAt>now) return hit.data;
  try{const raw=sessionStorage.getItem(cachePrefix+path); if(raw){const parsed=JSON.parse(raw) as CacheEntry; if(parsed.expiresAt>now){memoryCache.set(path,parsed);return parsed.data;} sessionStorage.removeItem(cachePrefix+path);}}catch{}
  return null;
}
function writeCache(path:string,data:any,ttl:number){
  if(!ttl || !cacheAllowed(path)) return;
  const entry={expiresAt:Date.now()+ttl,data}; memoryCache.set(path,entry);
  try{sessionStorage.setItem(cachePrefix+path,JSON.stringify(entry));}catch{}
}
export function clearPublicCache(){memoryCache.clear();try{for(let i=sessionStorage.length-1;i>=0;i--){const k=sessionStorage.key(i);if(k?.startsWith(cachePrefix))sessionStorage.removeItem(k)}}catch{} }

// Returns cached data even if its TTL has expired, so the UI never has to sit on a blank
// screen just because a 30s-old cache entry ticked over.
function peekCache(path:string){
  const hit=memoryCache.get(path); if(hit) return hit.data;
  try{const raw=sessionStorage.getItem(cachePrefix+path); if(raw)return (JSON.parse(raw) as CacheEntry).data;}catch{}
  return null;
}

async function request(path:string, options:RequestInit={}, cache=true){
  const isGet=!options.method || options.method.toUpperCase()==='GET';
  const ttl=cache && isGet && cacheAllowed(path) ? cacheTtl(path) : 0;
  if(ttl){const cached=readCache(path);if(cached!==null)return cached;}
  const headers=new Headers(options.headers);
  headers.set('Content-Type','application/json');
  if(accessToken)headers.set('Authorization',`Bearer ${accessToken}`);
  let r:Response;
  try{
    r=await fetchWithTimeout(`${API}${path}`,{...options,headers,credentials:'include'});
  }catch(e:any){
    throw new Error(e?.name==='AbortError'?'The server took too long to respond. Please try again.':'Unable to reach the BraTipsters server.');
  }
  if(r.status===401&&path!='/auth/refresh'){
    try{
      if(!refreshPromise){
        refreshPromise=(async()=>{
          try{
            const rr=await fetchWithTimeout(`${API}/auth/refresh`,{method:'POST',credentials:'include'});
            if(!rr.ok)return null;
            const d=await rr.json();
            if(!d?.accessToken)return null;
            setToken(d.accessToken);
            return d.accessToken as string;
          }catch{return null}
          finally{refreshPromise=null;}
        })();
      }
      const freshToken=await refreshPromise;
      if(freshToken){
        headers.set('Authorization',`Bearer ${freshToken}`);
        r=await fetchWithTimeout(`${API}${path}`,{...options,headers,credentials:'include'});
      } else {
        setToken('');
      }
    }catch{}
  }
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d.message||'Request failed');
  if(ttl)writeCache(path,d,ttl);
  return d;
}
export const api={get:(p:string)=>request(p),post:(p:string,b:any)=>{clearPublicCache();return request(p,{method:'POST',body:JSON.stringify(b)},false)},patch:(p:string,b:any)=>{clearPublicCache();return request(p,{method:'PATCH',body:JSON.stringify(b)},false)},delete:(p:string)=>{clearPublicCache();return request(p,{method:'DELETE'},false)},
  /**
   * Stale-while-revalidate GET, for screens (like Home) that should never show
   * a blank/loading flash on a repeat visit.
   * - If we have any cached copy (even an expired one), resolve with it immediately.
   * - Always kicks off a real request in the background; if that returns different
   *   data, `onFresh` is called so the view can quietly swap it in.
   * - If there's no cached copy at all, it just behaves like a normal awaited GET.
   */
  getSWR<T=any>(p:string, onFresh?:(data:T)=>void):Promise<T>{
    const stale=peekCache(p);
    const fresh=request(p).then(d=>{
      if(onFresh && JSON.stringify(d)!==JSON.stringify(stale)) onFresh(d);
      return d;
    });
    if(stale!==null){ fresh.catch(()=>{}); return Promise.resolve(stale); }
    return fresh;
  }
};

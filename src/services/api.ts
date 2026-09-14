const API=import.meta.env.VITE_API_URL||'http://localhost:4000/api/v1';
let accessToken=localStorage.getItem('bratips_access')||'';
export function setToken(t:string){accessToken=t;if(t)localStorage.setItem('bratips_access',t);else localStorage.removeItem('bratips_access')}
export function getToken(){return accessToken}

async function fetchWithTimeout(url:string, options:RequestInit={}, timeoutMs=15000){
  const controller=new AbortController();
  const timer=window.setTimeout(()=>controller.abort(),timeoutMs);
  try{return await fetch(url,{...options,signal:controller.signal});}
  finally{window.clearTimeout(timer);}
}

async function request(path:string, options:RequestInit={}){
  const headers=new Headers(options.headers);
  headers.set('Content-Type','application/json');
  if(accessToken)headers.set('Authorization',`Bearer ${accessToken}`);
  let r:Response;
  try{
    r=await fetchWithTimeout(`${API}${path}`,{...options,headers,credentials:'include'});
  }catch(e:any){
    throw new Error(e?.name==='AbortError'?'The server took too long to respond. Please try again.':'Unable to reach the BraTips server.');
  }
  if(r.status===401&&path!='/auth/refresh'){
    try{
      const rr=await fetchWithTimeout(`${API}/auth/refresh`,{method:'POST',credentials:'include'});
      if(rr.ok){
        const d=await rr.json();
        setToken(d.accessToken);
        headers.set('Authorization',`Bearer ${d.accessToken}`);
        r=await fetchWithTimeout(`${API}${path}`,{...options,headers,credentials:'include'});
      }
    }catch{}
  }
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d.message||'Request failed');
  return d;
}
export const api={get:(p:string)=>request(p),post:(p:string,b:any)=>request(p,{method:'POST',body:JSON.stringify(b)}),patch:(p:string,b:any)=>request(p,{method:'PATCH',body:JSON.stringify(b)}),delete:(p:string)=>request(p,{method:'DELETE'})};

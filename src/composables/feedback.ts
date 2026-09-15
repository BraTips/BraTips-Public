import { ref } from 'vue';
const loadingCount=ref(0),loadingVisible=ref(false);let loadingTimer:number|undefined;
export function useGlobalLoader(){
  const start=()=>{loadingCount.value++;if(loadingTimer)window.clearTimeout(loadingTimer);loadingTimer=window.setTimeout(()=>{if(loadingCount.value>0)loadingVisible.value=true},220)};
  const stop=()=>{loadingCount.value=Math.max(0,loadingCount.value-1);if(loadingCount.value===0){if(loadingTimer)window.clearTimeout(loadingTimer);loadingTimer=undefined;loadingVisible.value=false}};
  return {loadingVisible,start,stop};
}
export type ConfirmOptions={title?:string;message:string;confirmText?:string;cancelText?:string;danger?:boolean;success?:boolean};
const confirmState=ref<ConfirmOptions|null>(null);let resolver:((value:boolean)=>void)|null=null;
export function useConfirm(){
  const ask=(options:ConfirmOptions)=>new Promise<boolean>(resolve=>{resolver=resolve;confirmState.value={title:'Confirm action',confirmText:'Confirm',cancelText:'Cancel',...options}});
  const close=(result:boolean)=>{const r=resolver;resolver=null;confirmState.value=null;r?.(result)};
  return {confirmState,ask,close};
}

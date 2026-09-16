import { ref } from 'vue';

export type ConfirmOptions={title?:string;message:string;confirmText?:string;cancelText?:string;danger?:boolean;success?:boolean};
const confirmState=ref<ConfirmOptions|null>(null); let resolver:((value:boolean)=>void)|null=null;
export function useConfirm(){
  const ask=(options:ConfirmOptions)=>new Promise<boolean>(resolve=>{resolver=resolve;confirmState.value={title:'Confirm action',confirmText:'Confirm',cancelText:'Cancel',...options}});
  const close=(result:boolean)=>{const r=resolver;resolver=null;confirmState.value=null;r?.(result)};
  return {confirmState,ask,close};
}

type Toast={title:string;message:string;type:'success'|'error'|'info'};
const toast=ref<Toast|null>(null); let toastTimer:number|undefined;
export function useToast(){
  const show=(message:string,type:Toast['type']='info',title?:string)=>{
    if(toastTimer)window.clearTimeout(toastTimer);
    toast.value={message,type,title:title||({success:'Success',error:'Something went wrong',info:'BraTipsters'}[type])};
    toastTimer=window.setTimeout(()=>{toast.value=null;toastTimer=undefined},4200);
  };
  const dismiss=()=>{if(toastTimer)window.clearTimeout(toastTimer);toastTimer=undefined;toast.value=null};
  return {toast,show,dismiss};
}

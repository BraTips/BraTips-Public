import { ref } from 'vue';
// Note: the old useGlobalLoader() (a full-screen blocking overlay tied to every
// single API call, including background polling) has been removed. Pages already
// show their own skeleton loaders for GETs, and buttons show their own busy state
// (e.g. "Saving…") for actions — a page-wide blocking modal on top of both was
// redundant and interrupted the user for things as small as marking a notification
// read. If a specific action ever needs a true blocking state, prefer a local
// per-component `busy` ref (as most forms in this app already do) over a global one.
export type ConfirmOptions={title?:string;message:string;confirmText?:string;cancelText?:string;danger?:boolean;success?:boolean};
const confirmState=ref<ConfirmOptions|null>(null);let resolver:((value:boolean)=>void)|null=null;
export function useConfirm(){
  const ask=(options:ConfirmOptions)=>new Promise<boolean>(resolve=>{resolver=resolve;confirmState.value={title:'Confirm action',confirmText:'Confirm',cancelText:'Cancel',...options}});
  const close=(result:boolean)=>{const r=resolver;resolver=null;confirmState.value=null;r?.(result)};
  return {confirmState,ask,close};
}

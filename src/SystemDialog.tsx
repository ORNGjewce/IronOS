import {useEffect,useRef,useState} from 'react';
import './systemDialog.css';
type Request={title:string;message:string;action:string;danger:boolean;resolve:(answer:boolean)=>void};
let dispatch:((request:Request)=>void)|null=null;
export function askConfirm(message:string,options?:{title?:string;action?:string;danger?:boolean}):Promise<boolean>{
 return new Promise(resolve=>{
  if(!dispatch){resolve(false);return}
  dispatch({message,title:options?.title||'CONFIRM ACTION',action:options?.action||'CONFIRM',danger:options?.danger??true,resolve});
 });
}
export function SystemDialogHost(){
 const [request,setRequest]=useState<Request|null>(null);
 const queue=useRef<Request[]>([]);
 const cancelRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  dispatch=(next)=>{queue.current.push(next);setRequest(current=>current||queue.current.shift()||null)};
  return()=>{dispatch=null;queue.current.forEach(r=>r.resolve(false));queue.current=[]};
 },[]);
 useEffect(()=>{if(!request)return;cancelRef.current?.focus();const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();request.resolve(false);setRequest(queue.current.shift()||null)}};document.addEventListener('keydown',onKey);return()=>document.removeEventListener('keydown',onKey)},[request]);
 const answer=(yes:boolean)=>{if(!request)return;request.resolve(yes);setRequest(queue.current.shift()||null)};
 if(!request)return null;
 return <div className="ironDialogOverlay" onMouseDown={e=>{if(e.target===e.currentTarget)answer(false)}}><div className="ironDialog" role="alertdialog" aria-modal="true" aria-labelledby="ironDialogTitle" aria-describedby="ironDialogMessage"><div className="ironDialogEyebrow">IRON//OS / SYSTEM CONFIRMATION</div><h2 id="ironDialogTitle">{request.title}</h2><p id="ironDialogMessage">{request.message}</p><div className="ironDialogActions"><button type="button" ref={cancelRef} className="ironDialogCancel" onClick={()=>answer(false)}>CANCEL</button><button type="button" className={request.danger?'ironDialogDanger':'ironDialogAccept'} onClick={()=>answer(true)}>{request.action}</button></div><div className="ironDialogStripe" aria-hidden="true"/></div></div>;
}

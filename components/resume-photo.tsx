"use client";
import { Camera, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { preparePhoto } from "../lib/photo";
import type { Locale } from "../lib/resume";
import { photoCopy } from "../lib/work-copy";
import { useCopy } from "./ui-language";

export function ResumePhoto({locale,photo,onChange}:{locale:Locale;photo?:string;onChange:(photo?:string)=>void}) {
  const t=useCopy(photoCopy[locale]);
  const input=useRef<HTMLInputElement>(null);
  const [busy,setBusy]=useState(false);
  const [failed,setFailed]=useState(false);
  async function select(file:File) {
    setBusy(true);
    setFailed(false);
    try {onChange(await preparePhoto(file));}
    catch {setFailed(true);}
    finally {setBusy(false);}
  }
  return <div className="photo-card">
    <div className="photo-thumb" aria-hidden="true" style={photo?{backgroundImage:`url("${photo}")`}:undefined}>{!photo&&<Camera size={23}/>}</div>
    <div className="photo-details">
      <strong>{t.title}</strong><p className="small">{t.hint}</p>
      <div className="actions">
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" aria-label={t.add} hidden onChange={event=>{
          const file=event.target.files?.[0];event.target.value="";if(file)void select(file);
        }}/>
        <button type="button" className="btn" disabled={busy} onClick={()=>input.current?.click()}>{photo?t.replace:t.add}</button>
        {photo&&<button type="button" className="icon-btn danger" disabled={busy} aria-label={t.remove} onClick={()=>{setFailed(false);onChange(undefined);}}><Trash2 size={16}/></button>}
      </div>
      {busy&&<p role="status">{t.loading}</p>}{failed&&<p className="small danger" role="alert">{t.error}</p>}
    </div>
  </div>;
}

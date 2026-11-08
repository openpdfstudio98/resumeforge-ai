"use client";
import { useEffect, useRef, useState } from "react";
import { BACKUP_LIMIT, backup, copyResume, readBackup, RECOVERY_KEY, STORAGE_KEY, type Locale, type Resume } from "../lib/resume";
import { work } from "../lib/work-copy";

export function download(blob:Blob, name:string) {
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");
  link.href=url;
  link.download=name;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function jsonDownload(resumes:Resume[],name="ResumeForge-backup") {
  download(new Blob([backup(resumes)],{type:"application/json"}),name+".json");
}
export function useResumes(locale:Locale) {
  const t=work[locale];
  const [ready,setReady]=useState(false);
  const [resumes,setResumes]=useState<Resume[]>([]);
  const [warning,setWarning]=useState<"invalid"|"stale"|"unavailable">();
  const [notice,setNotice]=useState("");
  const last=useRef<string|null>(null);
  const current=useRef<Resume[]>([]);
  const invalid=useRef(false);
  useEffect(()=>{
    function load() {
      try {
        last.current=localStorage.getItem(STORAGE_KEY);
        const data=last.current ? readBackup(last.current) : [];
        current.current=data;
        setResumes(data);
      } catch {
        invalid.current=last.current!==null;
        setWarning(invalid.current?"invalid":"unavailable");
      }
      setReady(true);
    }
    const frame=requestAnimationFrame(load);
    function onStorage(event:StorageEvent) {
      if ((event.key===STORAGE_KEY || event.key===null) && event.newValue!==last.current) setWarning("stale");
    }
    window.addEventListener("storage",onStorage);
    return ()=>{cancelAnimationFrame(frame);window.removeEventListener("storage",onStorage);};
  },[]);
  function save(next:Resume[], recover=false, removeRecovery=false) {
    const serialized=backup(next);
    if(next.length>100 || serialized.length>BACKUP_LIMIT) {setNotice(t.limit);return false;}
    if(invalid.current && !recover) {setNotice(t.invalidStorage);return false;}
    try {
      const before=localStorage.getItem(STORAGE_KEY);
      if(before!==last.current) {setWarning("stale");current.current=next;setResumes(next);return true;}
      if(removeRecovery) localStorage.removeItem(RECOVERY_KEY);
      localStorage.setItem(STORAGE_KEY,serialized);
      last.current=serialized;
      if(before && !invalid.current && !recover && !removeRecovery) {
        try {localStorage.setItem(RECOVERY_KEY,before);} catch { /* Main save is already durable. */ }
      }
      invalid.current=false;
      setWarning(undefined);
    } catch {setWarning("unavailable");}
    current.current=next;
    setResumes(next);
    setNotice("");
    return true;
  }
  function clear() {
    try {
      if(localStorage.getItem(STORAGE_KEY)!==last.current) {setWarning("stale");return;}
      localStorage.removeItem(RECOVERY_KEY);
      localStorage.removeItem(STORAGE_KEY);
      last.current=null;
      invalid.current=false;
      current.current=[];
      setResumes([]);
      setWarning(undefined);
      setNotice("");
    } catch {setWarning("unavailable");}
  }
  function restore() {
    try {
      const data=localStorage.getItem(RECOVERY_KEY);
      if(!data) {setNotice(t.missing);return;}
      if(localStorage.getItem(STORAGE_KEY)!==last.current) {setWarning("stale");return;}
      const previous=readBackup(data);
      if(save(previous,true) && last.current===backup(previous)) setNotice(t.restored);
    } catch {setNotice(t.invalidStorage);}
  }
  function raw() {
    if(last.current) download(new Blob([last.current],{type:"application/json"}),"ResumeForge-recovery.json");
  }
  async function importFile(file:File) {
    try {
      if(file.size>BACKUP_LIMIT*3) throw new Error("Large file");
      const imported=readBackup(await file.text());
      if(!imported.length) throw new Error("Empty backup");
      if(save([...imported.map(item=>copyResume(item)),...current.current])) setNotice(t.imported);
    } catch {setNotice(t.badImport);}
  }
  return {ready,resumes,warning,notice,setNotice,save,clear,restore,raw,importFile};
}

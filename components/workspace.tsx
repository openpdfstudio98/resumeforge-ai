"use client";
import { Copy, FileText, FolderOpen, LayoutTemplate, Plus, ScanLine, ShieldCheck, Trash2, Upload } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { site, type WorkRoute } from "../lib/copy";
import { copyResume, makeResume, touchResume, templateKeys, templates, type Locale, type Resume, type Template } from "../lib/resume";
import { work } from "../lib/work-copy";
const Checker = dynamic(()=>import("./checker").then(m=>m.Checker));
const Editor = dynamic(()=>import("./editor").then(m=>m.Editor));
import { jsonDownload, useResumes } from "./storage";

export function Workspace({locale,route}:{locale:Locale;route:WorkRoute}) {
  const t=work[locale];
  const s=site[locale];
  const storage=useResumes(locale);
  const {resumes,ready,save,warning,notice}=storage;
  const [query,setQuery]=useState<{id:string;template:Template}>({id:"",template:"classic-ats"});
  const [confirmation,setConfirmation]=useState<{message:string;action:()=>void}>();
  const dialog=useRef<HTMLDialogElement>(null);
  const file=useRef<HTMLInputElement>(null);
  useEffect(()=>{
    function sync() {
      const search=new URLSearchParams(location.search);
      const template=templateKeys.find(key=>key===search.get("template")) ?? "classic-ats";
      setQuery({id:search.get("id")??"",template});
    }
    const frame=requestAnimationFrame(sync);
    addEventListener("popstate",sync);
    return ()=>{cancelAnimationFrame(frame);removeEventListener("popstate",sync);};
  },[]);
  useEffect(()=>{
    if(confirmation && !dialog.current?.open) dialog.current?.showModal();
    if(!confirmation && dialog.current?.open) dialog.current.close();
  },[confirmation]);
  const root=`/${locale}`;
  const builder=`${root}/builder`;
  const sorted=[...resumes].sort((a,b)=>b.updated-a.updated);
  const selected=resumes.find(r=>r.id===query.id);
  const message=warning==="invalid"?t.invalidStorage:warning==="stale"?t.stale:warning==="unavailable"?t.saveError:"";
  function create() {
    const draft=makeResume(locale,query.template);
    if(save([draft,...resumes])) {
      history.replaceState(null,"",`${builder}?id=${draft.id}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
      setQuery({id:draft.id,template:draft.template});
    }
  }
  function duplicate(r:Resume) {
    save([copyResume(r,`${r.title} · ${t.copied}`),...resumes]);
  }
  function cards(items:Resume[]) {
    return items.length ? <div className="draft-list">{items.map(r=><article className="draft" key={r.id}>
      <span className="tile-icon"><FileText size={19}/></span><div><h3>{r.title || templates[r.template].name}</h3><p>{templates[r.template].name} · {new Intl.DateTimeFormat(locale,{dateStyle:"medium"}).format(r.updated)}</p></div>
      <div className="actions"><a className="btn" href={`${builder}?id=${r.id}`}>{t.edit}</a>
        {route==="resumes" && <>
          <button className="icon-btn" aria-label={`${t.duplicate} · ${r.title}`} onClick={()=>duplicate(r)}><Copy size={17}/></button>
          <button className="icon-btn" aria-label={`${t.backup} · ${r.title}`} onClick={()=>jsonDownload([r])}><Upload size={17}/></button>
          <button className="icon-btn danger" aria-label={`${t.remove} · ${r.title}`} onClick={()=>setConfirmation({message:t.deleteOne,action:()=>save(resumes.filter(item=>item.id!==r.id),false,true)})}><Trash2 size={17}/></button>
        </>}
      </div>
    </article>)}</div>:<div className="empty"><FolderOpen size={28}/><h3>{t.empty}</h3><p>{t.emptyHint}</p><a className="btn primary" href={builder}>{t.create}</a></div>;
  }
  if(!ready)return <div className="panel" role="status">{t.loading}</div>;
  return <>
    {message && <div className="alert" role="alert">{message}{warning==="invalid" && <div className="actions"><button className="btn" onClick={storage.raw}>{t.raw}</button><a className="btn" href={`${root}/resumes`}>{t.back}</a></div>}</div>}
    {notice && <p className="alert" role="status">{notice}</p>}
    {route==="builder" && (selected
      ? <Editor key={selected.id} locale={locale} resume={selected} warning={warning} update={r=>save(resumes.map(item=>item.id===r.id?touchResume(r):item))}/>
      : <><header className="workspace-heading"><div><h1>{s.nav.builder}</h1><p>{s.copy.builder}</p></div></header>
        <div className="panel empty"><FileText size={32}/>{query.id && <p role="alert">{t.missing}</p>}<h2>{templates[query.template].name}</h2><p>{templates[query.template].description[locale]}</p><button className="btn primary" onClick={create}><Plus size={18}/>{t.create}</button><a className="btn" href={`${root}/templates`}>{s.browse}</a></div></>)}
    {route==="ats" && <Checker key={query.id} locale={locale} resumes={resumes} id={query.id}/>}
    {route==="resumes" && <>
      <header className="workspace-heading"><div><div className="eyebrow">{t.files}</div><h1>{s.nav.resumes}</h1><p>{s.copy.resumes}</p></div><a className="btn primary" href={builder}><Plus size={18}/>{t.create}</a></header>
      <section className="panel stack"><div className="actions">
        <input ref={file} type="file" accept=".json,application/json" hidden onChange={e=>{const selected=e.target.files?.[0];e.target.value="";if(selected)void storage.importFile(selected);}}/>
        <button className="btn" onClick={()=>file.current?.click()}><Upload size={17}/>{t.import}</button><button className="btn" disabled={!resumes.length} onClick={()=>jsonDownload(resumes)}>{t.export}</button>
        <button className="btn" onClick={()=>setConfirmation({message:t.restoreAsk,action:storage.restore})}>{t.recover}</button>
      </div>{cards(sorted)}</section>
      <section className="panel privacy-row"><div><h2>{s.nav.privacy}</h2><p>{t.privacy}</p></div><button className="btn danger" onClick={()=>setConfirmation({message:t.deleteAll,action:storage.clear})}>{t.clear}</button></section>
    </>}
    {route==="dashboard" && <>
      <header className="workspace-heading"><div><div className="eyebrow">{t.overview}</div><h1>{s.nav.dashboard}</h1></div></header>
      <section className="dashboard-hero"><div className="eyebrow">RESUMEFORGE AI</div><h2>{t.dashboardTitle}</h2><p>{t.dashboardIntro}</p><a className="btn primary" href={builder}><Plus size={18}/>{t.create}</a></section>
      <div className="stats"><div className="panel"><FileText size={20}/><strong>{resumes.length}</strong><span>{t.drafts}</span></div><div className="panel"><LayoutTemplate size={20}/><strong>6</strong><span>{t.templates}</span></div><div className="panel"><ShieldCheck size={20}/><strong>100%</strong><span>{t.privacy}</span></div></div>
      <section className="panel stack"><div className="split"><h2>{t.recent}</h2><a className="text-link" href={`${root}/resumes`}>{t.viewAll}</a></div>{cards(sorted.slice(0,3))}</section>
      <h2 className="section-title">{t.tools}</h2><div className="actions"><a className="btn" href={`${root}/templates`}><LayoutTemplate size={18}/>{s.nav.templates}</a><a className="btn" href={`${root}/ats`}><ScanLine size={18}/>{s.nav.ats}</a></div>
    </>}
    <dialog ref={dialog} onCancel={()=>setConfirmation(undefined)} onClose={()=>setConfirmation(undefined)}>
      {confirmation && <><p>{confirmation.message}</p><div className="actions"><button className="btn" autoFocus onClick={()=>setConfirmation(undefined)}>{t.cancel}</button><button className="btn danger" onClick={()=>{confirmation.action();setConfirmation(undefined);}}>{t.confirm}</button></div></>}
    </dialog>
  </>;
}

"use client";
import { Globe2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "../lib/resume";
import { deviceLanguages, languageStorage, translateInterface, type DeviceLanguage, type TranslatorApi } from "../lib/ui-language";
import { useLanguage } from "./ui-language";

const copy={
  en:{button:"Language",heading:"Website language",native:"Built-in languages",device:"On-device translation",deviceHint:"Machine translation for the interface. Your resume stays in its original language. The first use can download a language pack.",choose:"Choose a language",search:"Search languages",apply:"Translate interface",busy:"Preparing translation…",fallback:"On-device translation is unavailable here. Open your browser’s Translate menu to choose another language.",failed:"This language pack could not be loaded. Try another language or use your browser’s Translate menu.",close:"Close language menu"},
  ms:{button:"Bahasa",heading:"Bahasa laman",native:"Bahasa terbina dalam",device:"Terjemahan pada peranti",deviceHint:"Terjemahan mesin untuk antara muka. Resume anda kekal dalam bahasa asal. Penggunaan pertama mungkin memuat turun pek bahasa.",choose:"Pilih bahasa",search:"Cari bahasa",apply:"Terjemahkan antara muka",busy:"Menyediakan terjemahan…",fallback:"Terjemahan pada peranti tidak tersedia di sini. Buka menu Terjemah pada pelayar untuk memilih bahasa lain.",failed:"Pek bahasa ini gagal dimuatkan. Cuba bahasa lain atau gunakan menu Terjemah pada pelayar.",close:"Tutup menu bahasa"},
};
const languageNames=new Intl.DisplayNames(["en"],{type:"language"});
const options=deviceLanguages.map(code=>({code,english:languageNames.of(code)??code,native:new Intl.DisplayNames([code],{type:"language"}).of(code)??code})).sort((a,b)=>a.english.localeCompare(b.english));
function translator() {return (window as Window & {Translator?:TranslatorApi}).Translator;}

export function LocaleLink({locale,path}:{locale:Locale;path:string}) {
  const {dictionary,setDictionary}=useLanguage();
  const t=copy[locale];
  const dialog=useRef<HTMLDialogElement>(null);
  const operation=useRef<AbortController>(null);
  const [query,setQuery]=useState("");
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState<DeviceLanguage|"">("");
  const [supported,setSupported]=useState(false);
  const [status,setStatus]=useState<"idle"|"busy"|"failed">("idle");
  useEffect(()=>{
    function sync(){setQuery(location.search);setSupported(Boolean(translator()));}
    const frame=requestAnimationFrame(sync);
    window.addEventListener("popstate",sync);
    return ()=>{cancelAnimationFrame(frame);window.removeEventListener("popstate",sync);operation.current?.abort();};
  },[]);
  const url=(language:Locale)=>`/${language}${path?"/"+path:""}${query}`;
  function reset() {
    operation.current?.abort();
    try {sessionStorage.removeItem(languageStorage);} catch { /* Storage may be disabled. */ }
    setDictionary(undefined);
  }
  async function apply() {
    const api=translator();
    if(!api||!selected)return;
    operation.current?.abort();
    const controller=new AbortController();
    operation.current=controller;
    setStatus("busy");
    try {
      const translated=await translateInterface(api,selected,controller.signal);
      if(controller.signal.aborted)return;
      try {sessionStorage.setItem(languageStorage,JSON.stringify(translated));}
      catch {setDictionary(translated);setStatus("idle");dialog.current?.close();return;}
      if(locale!=="en"){location.assign(url("en"));return;}
      setDictionary(translated);
      setStatus("idle");
      dialog.current?.close();
    } catch {if(!controller.signal.aborted)setStatus("failed");}
  }
  const filter=search.trim().toLowerCase();
  return <>
    <button type="button" className="btn locale-btn" aria-label={t.button} aria-haspopup="dialog" onClick={()=>dialog.current?.showModal()}>
      <Globe2 size={17}/><span>{t.button}</span><span className="language-code" translate="no">{(dictionary?.language??locale).toUpperCase()}</span>
    </button>
    <dialog ref={dialog} className="language-dialog" aria-labelledby="language-title" onClose={()=>{operation.current?.abort();setStatus("idle");}}>
      <div className="split"><h2 id="language-title">{t.heading}</h2><button type="button" className="icon-btn" aria-label={t.close} onClick={()=>dialog.current?.close()}><X size={18}/></button></div>
      <p className="small language-caption">{t.native}</p>
      <div className="actions"><a className="btn" lang="en" hrefLang="en" href={url("en")} onClick={reset}>English</a><a className="btn" lang="ms" hrefLang="ms" href={url("ms")} onClick={reset}>Bahasa Melayu</a></div>
      <h3>{t.device}</h3><p className="small">{t.deviceHint}</p>
      {supported?<div className="stack">
        <label className="field"><span>{t.search}</span><input type="search" value={search} onChange={event=>setSearch(event.target.value)}/></label>
        <label className="field"><span>{t.choose}</span><select value={selected} onChange={event=>setSelected(event.target.value as DeviceLanguage|"")}>
          <option value="">{t.choose}</option>{options.filter(item=>item.code===selected||[item.english,item.native,item.code].some(name=>name.toLowerCase().includes(filter))).map(item=><option key={item.code} value={item.code} lang={item.code}>{item.native} · {item.english}</option>)}
        </select></label>
        <button type="button" className="btn primary" disabled={!selected||status==="busy"} onClick={()=>void apply()}>{t.apply}</button>
        {status==="busy"&&<p role="status">{t.busy}</p>}{status==="failed"&&<p role="alert">{t.failed}</p>}
      </div>:<p className="small language-fallback">{t.fallback}</p>}
    </dialog>
  </>;
}

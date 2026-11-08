"use client";
import { useEffect, useState } from "react";
import type { Locale } from "../lib/resume";

export function LocaleLink({locale,path}:{locale:Locale;path:string}) {
  const [query,setQuery]=useState("");
  const alternate=locale==="en"?"ms":"en";
  useEffect(()=>{
    function sync(){setQuery(location.search);}
    const frame=requestAnimationFrame(sync);
    window.addEventListener("popstate",sync);
    return ()=>{cancelAnimationFrame(frame);window.removeEventListener("popstate",sync);};
  },[]);
  return <a className="btn locale-btn" lang={alternate} hrefLang={alternate} href={`/${alternate}${path?"/"+path:""}${query}`}>{locale==="en"?"BM":"EN"}<span className="sr-only">{locale==="en"?" Bahasa Melayu":" English"}</span></a>;
}

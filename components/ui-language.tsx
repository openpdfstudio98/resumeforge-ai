"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { deviceLanguages, languageStorage, type UiDictionary } from "../lib/ui-language";
import type { Locale } from "../lib/resume";

const LanguageContext=createContext<{dictionary?:UiDictionary;setDictionary:(dictionary?:UiDictionary)=>void}>({setDictionary:()=>{}});
export function UiLanguage({locale,children}:{locale:Locale;children:ReactNode}) {
  const [dictionary,setDictionary]=useState<UiDictionary>();
  useEffect(()=>{
    if(locale!=="en")return;
    const frame=requestAnimationFrame(()=>{
      try {
        const raw=sessionStorage.getItem(languageStorage);
        if(!raw)return;
        const value=JSON.parse(raw) as UiDictionary;
        if(deviceLanguages.includes(value.language)&&value.messages&&typeof value.messages==="object")setDictionary(value);
      } catch { /* The native interface remains available. */ }
    });
    return ()=>cancelAnimationFrame(frame);
  },[locale]);
  useEffect(()=>{
    if(!dictionary)return;
    const html=document.documentElement;
    const previous=html.lang;
    html.lang=dictionary.language;
    html.dir=["ar","he"].includes(dictionary.language)?"rtl":"ltr";
    return ()=>{html.lang=previous;html.removeAttribute("dir");};
  },[dictionary]);
  return <LanguageContext.Provider value={{dictionary,setDictionary}}>{children}</LanguageContext.Provider>;
}
export function useLanguage() {return useContext(LanguageContext);}
export function useUi() {
  const {dictionary}=useLanguage();
  return (source:string)=>{
    const text=dictionary?.messages[source];
    return typeof text==="string" ? text : source;
  };
}
function translated<T>(value:T,messages:Record<string,string>):T {
  if(typeof value==="string")return (typeof messages[value]==="string"?messages[value]:value) as T;
  if(Array.isArray(value))return value.map(entry=>translated(entry,messages)) as T;
  if(value&&typeof value==="object")return Object.fromEntries(Object.entries(value).map(([key,entry])=>[key,translated(entry,messages)])) as T;
  return value;
}
export function useCopy<T>(value:T):T {
  const {dictionary}=useLanguage();
  return useMemo(()=>dictionary?translated(value,dictionary.messages):value,[value,dictionary]);
}
export function Ui({children}:{children:string}) {return useUi()(children);}

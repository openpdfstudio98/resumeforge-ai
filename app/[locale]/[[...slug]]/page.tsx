import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Gallery, Home, Reading } from "../../../components/public";
import { Shell } from "../../../components/site-shell";
import { Workspace } from "../../../components/workspace";
import { guideKeys, type NavKey, type WorkRoute, workRoutes } from "../../../lib/copy";
import { type Locale, type Template } from "../../../lib/resume";
import { allPaths,indexable,indexPaths,pageInfo,siteOrigin } from "../../../lib/seo";

type Props={params:Promise<{locale:Locale;slug?:string[]}>};
export const dynamicParams=false;
export function generateStaticParams() {
  return allPaths.map(path=>({slug:path?path.split("/"):[]}));
}
export async function generateMetadata({params}:Props):Promise<Metadata> {
  const {locale,slug}=await params;
  const path=slug?.join("/")??"";
  if(!allPaths.includes(path))notFound();
  const suffix=path?"/"+path:"";
  const origin=siteOrigin();
  const publicPage=indexPaths.includes(path);
  const {title,description}=pageInfo(locale,path);
  return {
    title,description,robots:{index:publicPage&&indexable(),follow:true},
    alternates:origin&&publicPage ? {canonical:`${origin}/${locale}${suffix}`,languages:{en:`${origin}/en${suffix}`,ms:`${origin}/ms${suffix}`,"x-default":`${origin}/en${suffix}`}} : undefined,
    openGraph:{title:`${title} | ResumeForge AI`,description,type:"website",siteName:"ResumeForge AI",locale:locale==="en"?"en_US":"ms_MY",alternateLocale:[locale==="en"?"ms_MY":"en_US"],url:origin?`${origin}/${locale}${suffix}`:undefined},
    twitter:{card:"summary",title,description},
  };
}
export default async function Page({params}:Props) {
  const {locale,slug}=await params;
  const path=slug?.join("/")??"";
  if(!allPaths.includes(path))notFound();
  const [route,key]=path.split("/");
  const sidebar=workRoutes.includes(route as WorkRoute);
  const origin=siteOrigin();
  const structured=origin&&!path ? {"@context":"https://schema.org","@type":"WebApplication",name:"ResumeForge AI",url:`${origin}/${locale}`,inLanguage:locale,applicationCategory:"BusinessApplication",operatingSystem:"Any",offers:{"@type":"Offer",price:"0",priceCurrency:"USD"}} : undefined;
  return <Shell locale={locale} path={path} sidebar={sidebar}>
    {structured&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured).replace(/</g,"\\u003c")}}/>}
    {!path?<Home locale={locale}/>:sidebar?<Workspace locale={locale} route={route as WorkRoute}/>
      :route==="templates"?<Gallery locale={locale} template={key as Template|undefined}/>
      :<Reading locale={locale} path={route as NavKey} guide={key as typeof guideKeys[number]|undefined}/>}
  </Shell>;
}

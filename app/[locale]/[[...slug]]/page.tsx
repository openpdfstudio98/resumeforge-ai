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
    openGraph:{title:`${title} | Civora Resume`,description,type:"website",siteName:"Civora Resume",locale:locale==="en"?"en_US":undefined,url:origin?`${origin}/${locale}${suffix}`:undefined,images:[{url:"https://civoraresume.vercel.app/civora-social.png",width:1200,height:630,alt:"Civora Resume — free resume builder"}]},
    twitter:{card:"summary_large_image",title,description,images:["https://civoraresume.vercel.app/civora-social.png"]},
  };
}
export default async function Page({params}:Props) {
  const {locale,slug}=await params;
  const path=slug?.join("/")??"";
  if(!allPaths.includes(path))notFound();
  const [route,key]=path.split("/");
  const sidebar=workRoutes.includes(route as WorkRoute);
  const origin=siteOrigin();
  const structured=origin&&!path ? {"@context":"https://schema.org","@type":"WebApplication",name:"Civora Resume",url:`${origin}/${locale}`,inLanguage:locale,applicationCategory:"BusinessApplication",operatingSystem:"Any",offers:{"@type":"Offer",price:"0",priceCurrency:"USD"}} : undefined;
  return <Shell locale={locale} path={path} sidebar={sidebar}>
    {structured&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured).replace(/</g,"\\u003c")}}/>}
    {!path?<Home locale={locale}/>:sidebar?<Workspace locale={locale} route={route as WorkRoute}/>
      :route==="templates"?<Gallery locale={locale} template={key as Template|undefined}/>
      :<Reading locale={locale} path={route as NavKey} guide={key as typeof guideKeys[number]|undefined}/>}
  </Shell>;
}

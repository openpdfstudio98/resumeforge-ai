import type { MetadataRoute } from "next";
import { indexable,indexPaths,siteOrigin } from "../lib/seo";
import { locales } from "../lib/resume";
export default function sitemap():MetadataRoute.Sitemap {
  const origin=siteOrigin();
  if(!origin||!indexable())return [];
  return locales.flatMap(locale=>indexPaths.map(path=>{
    const suffix=path?"/"+path:"";
    return {url:`${origin}/${locale}${suffix}`,alternates:{languages:{en:`${origin}/en${suffix}`,ms:`${origin}/ms${suffix}`,"x-default":`${origin}/en${suffix}`}}};
  }));
}

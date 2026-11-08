import { articles } from "./content";
import { guideKeys, publicRoutes, site, workRoutes, type NavKey } from "./copy";
import { templateKeys, templates, type Locale } from "./resume";

export const indexPaths=["",...publicRoutes,...templateKeys.map(key=>"templates/"+key),...guideKeys.map(key=>"career/"+key)];
export const allPaths=[...indexPaths,...workRoutes];
export function siteOrigin() {
  const origin=process.env.RESUMEFORGE_SITE_URL;
  if (!origin) return undefined;
  const url=new URL(origin);
  if(!["https:","http:"].includes(url.protocol) || url.username || url.password) throw new Error("Invalid canonical origin");
  return url.origin;
}
export function indexable() {
  return Boolean(siteOrigin()) && (!process.env.VERCEL_ENV || process.env.VERCEL_ENV==="production");
}
export function pageInfo(locale:Locale,path:string) {
  const t=site[locale];
  if(!path)return {title:t.title,description:t.description};
  const [route,key]=path.split("/");
  if(route==="templates" && key) {
    const template=templates[key as typeof templateKeys[number]];
    return {title:template.name,description:template.description[locale]};
  }
  const article=articles[locale][(key||route) as keyof typeof articles.en];
  return {title:article?.title??t.nav[route as NavKey],description:article?.intro??(t.copy as Partial<Record<NavKey,string>>)[route as NavKey]??t.description};
}

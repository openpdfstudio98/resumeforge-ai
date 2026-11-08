import type { MetadataRoute } from "next";
import { indexable,siteOrigin } from "../lib/seo";
export default function robots():MetadataRoute.Robots {
  const origin=siteOrigin();
  return {rules:{userAgent:"*",allow:"/"},sitemap:indexable()?`${origin}/sitemap.xml`:undefined};
}

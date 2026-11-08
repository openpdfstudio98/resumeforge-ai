import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { locales, type Locale } from "../../lib/resume";
import { siteOrigin } from "../../lib/seo";
import { UiLanguage } from "../../components/ui-language";
import "../globals.css";

export const metadata:Metadata = {
  applicationName:"Civora",
  title:{default:"Civora",template:"%s | Civora"},
  metadataBase:siteOrigin() ? new URL(siteOrigin()!) : undefined,
  verification:{google:process.env.RESUMEFORGE_GOOGLE_VERIFICATION},
  icons:{icon:"/icon.svg"},
};
export const dynamicParams=false;
export function generateStaticParams() {
  return locales.map(locale=>({locale}));
}
export default async function Layout({children,params}:{children:ReactNode;params:Promise<{locale:string}>}) {
  const {locale}=await params;
  if(!locales.includes(locale as Locale)) notFound();
  return <html lang={locale}><body><UiLanguage locale={locale as Locale}>{children}</UiLanguage></body></html>;
}

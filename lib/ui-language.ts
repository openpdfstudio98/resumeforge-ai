import { articles } from "./content";
import { site } from "./copy";
import { atsCopy } from "./ats";
import { labels, templates } from "./resume";
import { photoCopy, work } from "./work-copy";

export const deviceLanguages = ["ar","bg","bn","cs","da","de","el","es","fi","fr","he","hi","hr","hu","id","it","ja","kn","ko","lt","mr","nl","no","pl","pt","ro","ru","sk","sl","sv","ta","te","th","tr","uk","vi","zh","zh-Hant"] as const;
export const languageStorage = "resumeforge:interface-language:v1";
export type DeviceLanguage = typeof deviceLanguages[number];
export type UiDictionary = {language:DeviceLanguage; messages:Record<string,string>};
export const extraCopy = {
  en:{steps:["Choose a layout","Make it yours","Download and apply"],stepDetails:["Start with one of six templates.","Add your experience and an optional photo.","Save a PDF or an editable Word file."],how:"From blank page to application",use:"Use this template",contact:"Contact the maintainer",finish:"Ready to share?",resumeTitle:"Untitled resume",editHint:"Start with your details, then open the sections you need.",next:"Continue to sections",back:"All resumes"},
  ms:{steps:["Pilih susun atur","Sesuaikan resume","Muat turun dan mohon"],stepDetails:["Mulakan dengan salah satu daripada enam templat.","Tambah pengalaman dan foto jika perlu.","Simpan sebagai PDF atau fail Word yang boleh diedit."],how:"Daripada halaman kosong ke permohonan",use:"Guna templat ini",contact:"Hubungi penyelenggara",finish:"Sedia untuk dikongsi?",resumeTitle:"Resume tanpa tajuk",editHint:"Mulakan dengan maklumat anda, kemudian buka bahagian yang diperlukan.",next:"Teruskan ke bahagian resume",back:"Semua resume"},
};
function strings(data:unknown):string[] {
  if(typeof data==="string") return [data];
  if(data && typeof data==="object") return Object.values(data).flatMap(strings);
  return [];
}
export const sourceMessages = [...new Set(strings([
  site.en,work.en,photoCopy.en,articles.en,labels.en,atsCopy.en,extraCopy.en,
  ...Object.values(templates).map(template=>template.description.en),
]))];

type TranslatorInstance = {translate(input:string):Promise<string>;destroy():void};
export type TranslatorApi = {
  create(options:{sourceLanguage:string;targetLanguage:string;signal:AbortSignal}):Promise<TranslatorInstance>;
};
export async function translateInterface(api:TranslatorApi,language:DeviceLanguage,signal:AbortSignal):Promise<UiDictionary> {
  // Only the static copy above is sent to the browser's on-device model.
  const translator=await api.create({sourceLanguage:"en",targetLanguage:language,signal});
  const entries:[string,string][]=[];
  try {
    for(let i=0;i<sourceMessages.length;i+=6) {
      signal.throwIfAborted();
      const batch=await Promise.all(sourceMessages.slice(i,i+6).map(async source=>[source,(await translator.translate(source)).trim()||source] as [string,string]));
      entries.push(...batch);
    }
    return {language,messages:Object.fromEntries(entries)};
  } finally {translator.destroy();}
}

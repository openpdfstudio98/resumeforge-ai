import { documentBlocks } from "./blocks";
import { type Locale, type Resume } from "./resume";

export const atsCopy = {
  en: {
    categories:["Contact","Section headings","Experience","Education & skills","Readability","Job keywords"],
    tips:["Include a valid email and a phone number with at least seven digits.","Use familiar headings such as Summary, Experience, Education and Skills.","Add role titles, date ranges and descriptions of your work or relevant projects.","List your education and specific skills that relate to the role.","Use short lines and avoid decorative symbols in important text.","Use the suggested terms only where they accurately describe your skills or experience."],
  },
  ms: {
    categories:["Maklumat hubungan","Tajuk bahagian","Pengalaman","Pendidikan & kemahiran","Kebolehbacaan","Kata kunci kerja"],
    tips:["Sertakan e-mel yang sah dan nombor telefon sekurang-kurangnya tujuh digit.","Gunakan tajuk lazim seperti Ringkasan, Pengalaman, Pendidikan dan Kemahiran.","Nyatakan jawatan, tempoh dan penerangan kerja atau projek yang berkaitan.","Senaraikan pendidikan dan kemahiran khusus yang berkaitan dengan jawatan.","Gunakan baris ringkas dan elakkan simbol hiasan dalam teks penting.","Gunakan istilah cadangan hanya jika istilah itu tepat menggambarkan pengalaman atau kemahiran anda."],
  },
};
const headings = [
  /^(?:professional summary|summary|profile|objective|ringkasan profesional|ringkasan|objektif)$/im,
  /^(?:professional experience|work experience|employment history|experience|pengalaman kerja|pengalaman)$/im,
  /^(?:education|academic background|pendidikan|kelayakan akademik)$/im,
  /^(?:technical skills|skills|kemahiran teknikal|kemahiran)$/im,
];
const stop = new Set("the and for with that this are from will our you your job role team work have must can able use using such about their into not who what all per apply including include required preferred requirements responsibility responsibilities experience candidate position untuk yang dan atau pada dalam dengan bagi dari akan kami anda kerja jawatan mesti boleh mempunyai adalah ialah secara tahun perlu serta sebagai lebih atas telah harus berkaitan".split(" "));
function tokens(input:string) {
  return input.normalize("NFKC").toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}+#-]*/gu) ?? [];
}
function section(text:string, pattern:RegExp) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex(line=>pattern.test(line.trim().replace(/:$/,"")));
  if (start<0) return "";
  const other = /^(certifications?|projects?|languages?|pensijilan|projek|bahasa|additional information|maklumat tambahan)$/i;
  const end = lines.findIndex((line,index)=>index>start && [...headings,other].some(regex=>regex.test(line.trim().replace(/:$/,""))));
  return lines.slice(start+1,end<0?undefined:end).join("\n").trim();
}
export function assess(source: Resume | string, job: string, locale: Locale) {
  const draft = typeof source !== "string" ? source : undefined;
  const text = typeof source === "string" ? source : documentBlocks(source).map(block=>block.text).join("\n");
  const clean = text.split(/\r?\n/).map(line=>line.trim().replace(/:$/,"")).join("\n");
  const {categories,tips} = atsCopy[locale];
  const experience = section(text,headings[1]);
  const education = section(text,headings[2]);
  const skills = section(text,headings[3]);
  const resumeTokens = new Set(tokens(text));
  const frequency = new Map<string,number>();
  for (const word of tokens(job)) {
    if ((word.length<3 && !["ai","ui","ux","qa","hr","qc","r","c#"].includes(word)) || !/\p{L}/u.test(word) || stop.has(word)) continue;
    frequency.set(word,(frequency.get(word) ?? 0)+1);
  }
  const relevant = [...frequency].sort((a,b)=>b[1]-a[1]).slice(0,20).map(([word])=>word);
  const missing = relevant.filter(word=>!resumeTokens.has(word));
  const contactText = draft ? draft.personal.phone : text.split(/\r?\n/).slice(0,10).join("\n");
  const phone = (contactText.match(/(?:\+?\d[\d ().-]{5,}\d)/g) ?? []).some(value=>value.replace(/\D/g,"").length>=7);
  const email = /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(draft ? draft.personal.email : text);
  const expRows = draft?.sections.experience ?? [];
  const details = draft ? expRows.some(row=>tokens(row.description).length>=6) : tokens(experience).length>=12;
  const role = draft ? expRows.some(row=>row.title.trim()) : tokens(experience).length>=3;
  const dates = draft ? expRows.some(row=>row.dates.trim()) : /(?:19|20)\d{2}/.test(experience);
  const lines = clean.split("\n").filter(Boolean);
  const counts = [
    Number(email)*10+Number(phone)*10,
    headings.filter(pattern=>pattern.test(clean)).length*5,
    Number(role)*6+Number(dates)*6+Number(details)*8,
    Number(Boolean(education))*8+Number(tokens(skills).length>=2)*7,
    text.trim() ? Number(lines.every(line=>line.length<=220))*5+Number(!/[\u2500-\u27ff]|\p{Extended_Pictographic}/u.test(text))*5 : 0,
    relevant.length ? Math.round(15*(relevant.length-missing.length)/relevant.length) : 0,
  ];
  const max = [20,20,20,15,10,relevant.length ? 15 : 0];
  const parts = categories.map((name,i)=>({name,tip:tips[i],score:counts[i],max:max[i]}));
  const total = Math.round(100*counts.reduce((a,b)=>a+b,0)/max.reduce((a,b)=>a+b,0));
  return {parts,total,missing,matched:relevant.filter(word=>resumeTokens.has(word))};
}

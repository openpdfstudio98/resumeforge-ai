import { filled, labels, type Resume, type SectionKey } from "./resume";

export type Role = "name" | "headline" | "contact" | "heading" | "title" | "meta" | "body";
export type Block = {text: string; role: Role; keep: boolean; gap: number; section?:SectionKey};
export function documentBlocks(resume: Resume): Block[] {
  const blocks: Block[] = [];
  let section:SectionKey|undefined;
  function add(value: string, role: Role, gap = 0, keep = false) {
    const text = value.trim().normalize("NFC");
    if (text) blocks.push({text,role,gap,keep,section});
  }
  const {personal:p} = resume;
  add(p.name,"name",0,true);
  add(p.headline,"headline",0,true);
  add([p.email,p.phone,p.location,p.website].map(x=>x.trim()).filter(Boolean).join("  |  "),"contact",4);
  for (const key of resume.order) {
    section=key;
    const rows = resume.sections[key].filter(filled);
    if (!rows.length) continue;
    if (key !== "custom") add(labels[resume.locale][key],"heading",12,true);
    for (const row of rows) {
      const meta = [row.organization,row.dates].map(x=>x.trim()).filter(Boolean).join("  |  ");
      add(key === "custom" ? row.title || labels[resume.locale].custom : row.title,key === "custom" ? "heading" : "title",key === "custom" ? 12 : 4,Boolean(meta || row.description.trim()));
      add(meta,"meta",0,Boolean(row.description.trim()));
      add(row.description,"body",row.title || meta ? 2 : 3);
    }
  }
  return blocks;
}

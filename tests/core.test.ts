import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { Packer } from "docx";
import { assess } from "../lib/ats";
import { generatePdf, layoutPdf, type FontBytes } from "../lib/document";
import { backup, makeResume, readBackup, reorder, sampleResume, templateKeys } from "../lib/resume";
import { wordDocument } from "../lib/word";

test("backup round-trip, malformed schema and duplicate draft rejection",()=>{
  const draft=sampleResume("ms","technical-engineer");
  assert.deepEqual(readBackup(backup([draft])),[draft]);
  assert.throws(()=>readBackup("{}"));
  assert.throws(()=>readBackup(backup([draft,draft])));
  assert.throws(()=>readBackup(backup([{...draft,color:"javascript:alert(1)"}])));
  assert.throws(()=>readBackup(backup([{...draft,order:["summary"]}])));
  assert.throws(()=>readBackup("x".repeat(4_000_001)));
  assert.deepEqual(reorder(draft.order,"skills","summary").slice(0,2),["skills","summary"]);
});

test("ATS scores actual evidence and normalizes without job terms",()=>{
  const empty=assess(makeResume("en"),"","en");
  assert.equal(empty.total,0);
  assert.equal(empty.parts[5].max,0);
  const resume=sampleResume("ms","fresh-graduate");
  const baseline=assess(resume,"","ms");
  assert.equal(baseline.total,100);
  const result=assess(resume,"Excel inventori forklift forklift","ms");
  assert.deepEqual(result.missing,["forklift"]);
  assert.deepEqual(result.matched,["excel","inventori"]);
  assert.equal(result.parts[5].score,10);
  assert.equal(result.total,95);
  const pasted=assess("Pendidikan:\nDiploma Sains\nKemahiran:\nExcel, AutoCAD","", "ms");
  assert.equal(pasted.parts[3].score,15);
});

for (const [index,template] of templateKeys.entries()) {
  test(`${template} produces extractable A4 PDF and editable A4 Word XML`,async()=>{
    const folder=mkdtempSync(join(tmpdir(),"resumeforge-export-"));
    try {
      const locale=index%2?"en":"ms";
      const resume=sampleResume(locale,template);
      resume.personal.name="Chloé Izzat";
      const body=resume.sections.experience[0];
      body.description=Array.from({length:110},(_,i)=>`Baris ${i+1} menyemak rekod kerja – contoh operasi.`).join("\n");
      const fonts=["Regular","Bold"].map(style=>readFileSync(`public/fonts/${resume.font}-${style}.ttf`).toString("base64")) as FontBytes;
      const {pages}=layoutPdf(resume,fonts);
      assert.ok(pages.length>1);
      assert.ok(pages.every(p=>p.lines.length>0&&p.lines.every(l=>l.x>=0&&l.x+l.width<596&&l.y<842)));
      const pdf=join(folder,"resume.pdf");
      const docx=join(folder,"resume.docx");
      writeFileSync(pdf,Buffer.from(generatePdf(resume,fonts).output("arraybuffer")));
      writeFileSync(docx,await Packer.toBuffer(wordDocument(resume)));
      const info=execFileSync("pdfinfo",[pdf],{encoding:"utf8"});
      assert.match(info,/595\.28 x 841\.89 pts \(A4\)/);
      assert.equal(Number(info.match(/Pages:\s+(\d+)/)?.[1]),pages.length);
      const extracted=execFileSync("pdftotext",[pdf,"-"],{encoding:"utf8"});
      assert.match(extracted,/Chloé Izzat/);
      assert.match(extracted,/Baris 110 menyemak rekod kerja – contoh operasi\./);
      assert.match(extracted,locale==="ms"?/Pengalaman Kerja/:/Work Experience/);
      assert.doesNotMatch(extracted,/ResumeForge/);
      const xml=execFileSync("unzip",["-p",docx,"word/document.xml"],{encoding:"utf8"});
      assert.match(xml,/<w:t[^>]*>Chloé Izzat<\/w:t>/);
      assert.match(xml,/<w:t[^>]*>Baris 110 menyemak rekod kerja – contoh operasi\.<\/w:t>/);
      assert.match(xml,/<w:pgSz w:w="11906" w:h="16838"/);
      assert.doesNotMatch(xml,/<w:drawing/);
    } finally {rmSync(folder,{recursive:true,force:true});}
  });
}

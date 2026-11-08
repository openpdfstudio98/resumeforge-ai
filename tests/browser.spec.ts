import { execFileSync } from "node:child_process";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { allPaths } from "../lib/seo";
import { backup, sampleResume, templateKeys, templates } from "../lib/resume";

test("all 42 localized pages and rendered internal navigation respond",async({page,request})=>{
  const links=new Set<string>();
  for(const locale of ["en","ms"]) {
    for(const path of allPaths) {
      const response=await page.goto(`/${locale}${path?"/"+path:""}`,{waitUntil:"domcontentloaded"});
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang",locale);
      await expect(page.locator("main")).toBeVisible();
      for(const href of await page.locator('a[href^="/"]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute("href")!))) links.add(href);
    }
  }
  for(const link of links) expect((await request.get(link)).ok(),link).toBeTruthy();
  expect((await request.get("/robots.txt")).ok()).toBeTruthy();
  expect((await request.get("/sitemap.xml")).ok()).toBeTruthy();
  expect((await request.get("/en/no-such-page")).status()).toBe(404);
});

test("editor covers all fields, reorder, live preview, autosave and interface language",async({page})=>{
  await page.goto("/en/builder");
  await page.getByRole("button",{name:"New resume"}).click();
  await expect(page.getByRole("button",{name:"Download PDF"})).toBeDisabled();
  const personal={"Resume title":"QA draft","Full name":"Nur QA","Professional title":"Engineer","Email":"nur@example.com","Phone":"+60 12 345 6789","City / region":"Shah Alam","Website or LinkedIn URL":"https://example.com"};
  for(const [name,value] of Object.entries(personal))await page.getByLabel(name,{exact:true}).fill(value);
  for(const [section,label] of [["Professional Summary","Professional summary"],["Skills","Skills (separate with commas or new lines)"]]) {
    await page.getByRole("button",{name:section,exact:true}).click();
    await page.getByLabel(label,{exact:true}).fill("Excel, industrial planning");
  }
  const groups=[
    ["Work Experience","Role title","Employer"],["Education","Qualification","Institution"],["Certifications","Certification","Issuer"],["Projects","Project name","Organization"],["Languages","Language","Proficiency"],["Additional Information","Section heading","Organization"],
  ];
  for(const [section,title,organization] of groups) {
    await page.getByRole("button",{name:section,exact:true}).click();
    await page.getByRole("button",{name:section==="Additional Information"?"Add custom section":"Add entry",exact:true}).click();
    const entry=page.getByRole("group",{name:"Entry 1"});
    await entry.getByLabel(title,{exact:true}).fill(`QA ${title}`);
    await entry.getByLabel(organization,{exact:true}).fill(`QA ${organization}`);
    await entry.getByLabel("Dates",{exact:true}).fill("2023 – 2026");
    await entry.getByLabel("Description",{exact:true}).fill("Mengurus data inventori dan menyediakan laporan mingguan.");
  }
  await page.getByRole("button",{name:"Move up · Education",exact:true}).click();
  await expect(page.locator(".section-toggle").nth(1)).toHaveText("Education");
  const dragHandle=page.locator(".editor-section").filter({has:page.getByRole("button",{name:"Skills",exact:true})}).locator(".drag-handle");
  const dropTarget=page.locator(".editor-section").first();
  await dragHandle.hover();
  await page.mouse.down();
  await dropTarget.hover({position:{x:24,y:16}});
  await dropTarget.hover({position:{x:28,y:19}});
  await page.mouse.up();
  await expect(page.locator(".section-toggle").first()).toHaveText("Skills");
  await page.getByRole("button",{name:"Design",exact:true}).click();
  await page.getByRole("combobox",{name:"Template",exact:true}).selectOption("modern-executive");
  await page.getByRole("combobox",{name:"Font",exact:true}).selectOption("serif");
  await page.getByRole("combobox",{name:"Text size",exact:true}).selectOption("11");
  await page.getByRole("textbox",{name:"Accent color",exact:true}).fill("#29566c");
  await page.getByRole("combobox",{name:"Document headings",exact:true}).selectOption("ms");
  await expect(page.locator(".paper-stack")).toContainText("Pengalaman Kerja");
  await expect(page.locator(".paper-stack")).toContainText("QA Section heading");
  await page.getByRole("link",{name:/Bahasa Melayu/}).click();
  await expect(page).toHaveURL(/\/ms\/builder\?id=/);
  await expect(page.getByLabel("Nama penuh",{exact:true})).toHaveValue("Nur QA");
  await page.reload();
  await expect(page.getByLabel("Nama penuh",{exact:true})).toHaveValue("Nur QA");
  await expect(page.locator(".section-toggle").first()).toHaveText("Kemahiran");
  await page.getByRole("link",{name:"Semak resume ini"}).click();
  await expect(page.getByRole("combobox",{name:"Sumber resume"})).not.toHaveValue("");
  await page.getByLabel("Huraian kerja (pilihan)").fill("Excel forklift forklift");
  await page.getByRole("button",{name:"Semak resume",exact:true}).click();
  await expect(page.getByText("forklift",{exact:true})).toBeVisible();
  await expect(page.getByText("excel",{exact:true})).toBeVisible();
});

test("browser exports real multi-page files and keeps resume content local",async({page},info)=>{
  const outbound:string[]=[];
  const token="SYNTHETIC-PRIVATE-782";
  page.on("request",request=>{
    if(!request.url().startsWith(info.project.use.baseURL??"") || request.url().includes(token) || request.postData()?.includes(token)) outbound.push(request.url());
  });
  await page.goto("/ms/resumes");
  const r=sampleResume("ms","technical-engineer");
  r.personal.name="Chloé Nur";
  r.sections.experience[0].description=Array.from({length:100},(_,i)=>`Baris ${i+1} ${token} – kerja mingguan.`).join("\n");
  await page.locator('input[type=file]').setInputFiles({name:"resume.json",mimeType:"application/json",buffer:Buffer.from(backup([r]))});
  await page.getByRole("link",{name:"Edit resume",exact:true}).click();
  await expect(page.locator(".paper").nth(1)).toBeVisible();
  const results:Record<string,string>={};
  for(const format of ["PDF","DOCX"]) {
    const wait=page.waitForEvent("download");
    await page.getByRole("button",{name:`Muat turun ${format}`}).click();
    const result=await wait;
    expect(result.suggestedFilename().replace("_"," ")).toBe(`Chloé Nur.${format.toLowerCase()}`);
    const file=info.outputPath(`resume.${format.toLowerCase()}`);
    await result.saveAs(file);
    results[format]=file;
  }
  const pdf=execFileSync("pdftotext",[results.PDF,"-"],{encoding:"utf8"});
  expect(pdf).toContain("Chloé Nur");
  expect(pdf).toContain(`Baris 100 ${token} – kerja mingguan.`);
  expect(execFileSync("unzip",["-p",results.DOCX,"word/document.xml"],{encoding:"utf8"})).toContain(`Baris 100 ${token} – kerja mingguan.`);
  expect(await page.context().cookies()).toEqual([]);
  expect(outbound).toEqual([]);
});

test("draft duplicate, backup, invalid import, restore, deletion and clear",async({page})=>{
  await page.goto("/en/resumes");
  const input=page.locator('input[type=file]');
  await input.setInputFiles({name:"bad.json",mimeType:"application/json",buffer:Buffer.from("{}")});
  await expect(page.getByRole("status").filter({hasText:"valid ResumeForge"})).toBeVisible();
  const resume=sampleResume("en","classic-ats");
  await input.setInputFiles({name:"good.json",mimeType:"application/json",buffer:Buffer.from(backup([resume]))});
  await expect(page.locator(".draft")).toHaveCount(1);
  await page.getByRole("button",{name:/^Duplicate ·/}).click();
  await expect(page.locator(".draft")).toHaveCount(2);
  await page.getByRole("button",{name:"Restore previous save"}).click();
  await page.getByRole("button",{name:"Confirm",exact:true}).click();
  await expect(page.locator(".draft")).toHaveCount(1);
  const waiting=page.waitForEvent("download");
  await page.getByRole("button",{name:"Back up all resumes"}).click();
  expect((await waiting).suggestedFilename()).toBe("ResumeForge-backup.json");
  await page.getByRole("button",{name:/^Delete ·/}).click();
  await page.getByRole("button",{name:"Confirm",exact:true}).click();
  await expect(page.locator(".draft")).toHaveCount(0);
  await input.setInputFiles({name:"good.json",mimeType:"application/json",buffer:Buffer.from(backup([resume]))});
  await page.getByRole("button",{name:"Delete all local data"}).click();
  await page.getByRole("button",{name:"Confirm",exact:true}).click();
  expect(await page.evaluate(()=>Object.keys(localStorage).filter(key=>key.startsWith("resumeforge:")))).toEqual([]);
});

test("six templates start successfully and layouts fit phone portrait and landscape",async({page})=>{
  for(const template of templateKeys) {
    await page.goto(`/en/templates/${template}`);
    await page.getByRole("link",{name:"Use this template"}).click();
    await page.getByRole("button",{name:"New resume",exact:true}).click();
    await page.getByRole("button",{name:"Design",exact:true}).click();
    await expect(page.getByRole("combobox",{name:"Template",exact:true})).toHaveValue(template);
    await expect(page.getByRole("combobox",{name:"Font",exact:true})).toHaveValue(templates[template].font);
  }
  for(const viewport of [{width:390,height:844},{width:844,height:390}]) {
    await page.setViewportSize(viewport);
    for(const path of ["/en","/ms/templates","/ms/ats","/en/builder"]) {
      await page.goto(path);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    }
    await page.getByRole("button",{name:"New resume",exact:true}).click();
    if(viewport.width<=800)await page.getByRole("button",{name:"Live preview",exact:true}).click();
    await expect(page.locator(".document-sheet")).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
  }
});

test("keyboard and axe checks on landing, editor and ATS states",async({page})=>{
  await page.goto("/en");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link",{name:"Skip to content"})).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#content$/);
  const violations=async()=> (await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze()).violations.map(({id,nodes})=>({id,targets:nodes.map(n=>n.target)}));
  expect(await violations()).toEqual([]);
  await page.goto("/en/builder");
  await page.getByRole("button",{name:"New resume",exact:true}).click();
  await expect(page.locator(".document-sheet")).toBeVisible();
  expect(await violations()).toEqual([]);
  await page.goto("/ms/ats");
  await page.getByRole("button",{name:"Semak resume",exact:true}).click();
  await expect(page.getByRole("alert").filter({hasText:"Masukkan teks resume"})).toBeVisible();
  expect(await violations()).toEqual([]);
});

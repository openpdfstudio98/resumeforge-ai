import type { Block } from "./blocks";
import type { Template } from "./resume";

type PremiumStyle = {
  sidebar:string;
  sideInk:string;
  masthead:"none"|"filled"|"rule";
  timeline:boolean;
  ornaments?:boolean;
  photo:boolean;
};

const styles:Partial<Record<Template,PremiumStyle>>={
  "citrus-studio":{sidebar:"#126B95",sideInk:"#FFFFFF",masthead:"none",timeline:false,ornaments:true,photo:true},
  "midnight-executive":{sidebar:"#253550",sideInk:"#FFFFFF",masthead:"none",timeline:true,photo:true},
  "silver-editorial":{sidebar:"#EEF1F5",sideInk:"#243247",masthead:"none",timeline:true,photo:true},
  "graphite-portfolio":{sidebar:"#363541",sideInk:"#FFFFFF",masthead:"none",timeline:false,photo:true},
  "mono-grid":{sidebar:"#FFFFFF",sideInk:"#252831",masthead:"rule",timeline:false,photo:false},
  "teal-timeline":{sidebar:"#263744",sideInk:"#FFFFFF",masthead:"filled",timeline:true,photo:true},
};

export function premiumStyle(template:Template) {
  return styles[template];
}

export function isSidebarBlock(block:Block) {
  return block.role==="contact" || block.section==="education" || block.section==="skills" ||
    block.section==="certifications" || block.section==="languages";
}

export function isTitleBlock(block:Block) {
  return block.role==="name"||block.role==="headline";
}

export function premiumText(block:Block) {
  if(isTitleBlock(block))return block.text.replace(/\s+/g," ").trim();
  return block.role==="contact"?block.text.split("  |  ").join("\n"):block.text;
}

export function sampleHasPhoto(template:Template) {
  return template==="modern-portrait"||Boolean(premiumStyle(template)?.photo);
}

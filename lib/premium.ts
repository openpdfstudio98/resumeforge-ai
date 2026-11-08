import type { Block } from "./blocks";
import type { Template } from "./resume";

type PremiumStyle = {
  sidebar:string;
  sideInk:string;
  masthead:"none"|"filled"|"rule";
  timeline:boolean;
  rightSidebar?:boolean;
  framed?:boolean;
  mastheadFill?:string;
  trim?:string;
  ornaments?:"citrus"|"violet";
  photo:boolean;
};

const styles:Partial<Record<Template,PremiumStyle>>={
  "citrus-studio":{sidebar:"#126B95",sideInk:"#FFFFFF",masthead:"none",timeline:false,ornaments:"citrus",photo:true},
  "midnight-executive":{sidebar:"#253550",sideInk:"#FFFFFF",masthead:"none",timeline:true,photo:true},
  "silver-editorial":{sidebar:"#EEF1F5",sideInk:"#243247",masthead:"none",timeline:true,photo:true},
  "graphite-portfolio":{sidebar:"#363541",sideInk:"#FFFFFF",masthead:"none",timeline:false,photo:true},
  "mono-grid":{sidebar:"#FFFFFF",sideInk:"#252831",masthead:"rule",timeline:false,photo:false},
  "teal-timeline":{sidebar:"#263744",sideInk:"#FFFFFF",masthead:"filled",timeline:true,photo:true},
  "bloom-studio":{sidebar:"#FBE9ED",sideInk:"#5C2737",masthead:"filled",mastheadFill:"#F7DCE4",rightSidebar:true,trim:"#BD667D",timeline:false,photo:true},
  "violet-atelier":{sidebar:"#F0EAFB",sideInk:"#392758",masthead:"filled",framed:true,trim:"#8F68C7",ornaments:"violet",timeline:false,photo:true},
  "ivory-editorial":{sidebar:"#F7F2E8",sideInk:"#544431",masthead:"rule",mastheadFill:"#FBF7EF",rightSidebar:true,framed:true,trim:"#9C825E",timeline:true,photo:false},
  "onyx-gold":{sidebar:"#25252B",sideInk:"#F6EDDD",masthead:"none",trim:"#B38A4C",timeline:true,photo:true},
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

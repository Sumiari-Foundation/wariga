import * as pawukon from "./pawukon";
import * as saka from "./saka";

const today = new Date("2026-03-19");

const triwara = pawukon.getTriwara(today);
const pancawara = pawukon.getPancawara(today);
const sadwara = pawukon.getSadwara(today);
const saptawara = pawukon.getSaptawara(today);
const sangawara = pawukon.getSangawara(today);
const caturwara = pawukon.getCaturwara(today);
const astawara = pawukon.getAstawara(today);
const wuku = pawukon.getWuku(today);

const uripSum = saptawara.urip + pancawara.urip;
const dwiwara = pawukon.getDwiwara(uripSum);
const ekawara = pawukon.getEkawara(uripSum);
const dasawara = pawukon.getDasawara(uripSum);

const sasihName = saka.getSasihName(today);
const sasihPhase = saka.getSasihPhase(today);

console.log(sasihName);
console.log(sasihPhase);

console.log(`Sangawara: ${sangawara?.name} Caturwara: ${caturwara?.name} Astawara: ${astawara?.name} Dasawara: ${dasawara?.name} Ekawara: ${ekawara?.name ?? "N/A"} Dwiwara: ${dwiwara?.name} Triwara: ${triwara?.name} Pancawara: ${pancawara?.name} Sadwara: ${sadwara?.name} Saptawara: ${saptawara?.name} Wuku: ${wuku?.name}`);
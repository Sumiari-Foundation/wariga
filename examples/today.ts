import { getWariga } from "../src/index.js";

const today = new Date("2026-03-19");
const wariga = getWariga(today);
const { pawukon, saka } = wariga;

console.log(saka.sasih);
console.log(saka.phase);
console.log(
    `Sangawara: ${pawukon.sangawara.name} Caturwara: ${pawukon.caturwara.name} Astawara: ${pawukon.astawara.name} Dasawara: ${pawukon.dasawara.name} Ekawara: ${pawukon.ekawara?.name ?? "N/A"} Dwiwara: ${pawukon.dwiwara.name} Triwara: ${pawukon.triwara.name} Pancawara: ${pawukon.pancawara.name} Sadwara: ${pawukon.sadwara.name} Saptawara: ${pawukon.saptawara.name} Wuku: ${pawukon.wuku?.name}`,
);

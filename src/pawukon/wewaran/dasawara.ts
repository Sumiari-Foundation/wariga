import type { PawukonItemDetails } from "../types.js";

const DASAWARA_MODULO = 10;

export const DASAWARA: readonly PawukonItemDetails[] = [
  { name: "pandita", urip: 5, direction: "Timur - Purwa", deity: "Sang Hyang Surya" },
  { name: "pati", urip: 7, direction: "Barat - Pascima", deity: "Sang Hyang Kala Mertyu" },
  { name: "suka", urip: 10, direction: "Tengah - Madya", deity: "Sang Hyang Semara" },
  { name: "duka", urip: 4, direction: "Utara - Utara", deity: "Sang Hyang Durga" },
  { name: "sri", urip: 6, direction: "Timur Laut - Airsanya", deity: "Sang Hyang Amerta" },
  { name: "manuh", urip: 2, direction: "Tengah - Madya", deity: "Sang Hyang Kala Lupa" },
  { name: "manusa", urip: 3, direction: "Barat Daya - Nairiti", deity: "Sang Hyang Suksma" },
  { name: "raja", urip: 8, direction: "Tenggara - Gneyan", deity: "Sang Hyang Kala Ngis" },
  { name: "dewa", urip: 9, direction: "Selatan - Daksina", deity: "Sang Hyang Dharma" },
  { name: "raksasa", urip: 1, direction: "Barat Laut - Wayabya", deity: "Sang Hyang Maha Kala" }
] as const;

export const getDasawara = (uripSum: number) => {
  const dasawaraIndex = uripSum % DASAWARA_MODULO;
  const dasawara = DASAWARA[dasawaraIndex];

  if (!dasawara) throw new Error("Dasawara not found");

  return dasawara;
}
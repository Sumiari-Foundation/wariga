import { getDaysSincePawukonAnchorDate } from "../../utilities/date";
import type { PawukonItemDetails } from "../types";

const SANGAWARA_MODULO = 9;

export const SANGAWARA: readonly PawukonItemDetails[] = [
  { name: "dangu", urip: 5, direction: "Timur - Purwa", deity: "Sang Hyang Iswara" },
  { name: "jangur", urip: 8, direction: "Tenggara - Gneyan", deity: "Sang Hyang Maheswara" },
  { name: "gigis", urip: 9, direction: "Selatan - Daksina", deity: "Sang Hyang Brahma" },
  { name: "nohan", urip: 3, direction: "Barat Daya - Nairiti", deity: "Sang Hyang Rudra" },
  { name: "ogan", urip: 7, direction: "Barat - Pascima", deity: "Sang Hyang Mahadewa" },
  { name: "erangan", urip: 1, direction: "Barat Laut - Wayabya", deity: "Sang Hyang Sangkara" },
  { name: "urungan", urip: 4, direction: "Utara - Utara", deity: "Sang Hyang Wisnu" },
  { name: "tulus", urip: 6, direction: "Timur Laut - Airsanya", deity: "Sang Hyang Sambhu" },
  { name: "dadi", urip: 8, direction: "Tengah - Madya", deity: "Sang Hyang Shiwa" }
] as const;

export const getSangawara = (date: Date | string | number) => {
    const daysSinceAnchorDate = getDaysSincePawukonAnchorDate(date);
    let sangawaraIndex = 0;

    if (daysSinceAnchorDate <= 3 ){
      sangawaraIndex = 0;
    } else {
      sangawaraIndex = (daysSinceAnchorDate - 3) % SANGAWARA_MODULO;
    }
    
    const sangawara = SANGAWARA[sangawaraIndex];

    if (!sangawara) throw new Error("Sangawara not found");

    return sangawara;
}
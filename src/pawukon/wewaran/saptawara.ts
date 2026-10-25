import { getDaysSincePawukonAnchorDate } from "../../utilities/date.js";
import type { PawukonItemDetails } from "../types.js";

const SAPTAWARA_MODULO = 7;

export const SAPTAWARA: readonly PawukonItemDetails[] = [
    { name: "redite", urip: 5, direction: "Timur - Purwa", deity: "Sang Hyang Bhaskara" },
    { name: "soma", urip: 4, direction: "Utara - Utara", deity: "Sang Hyang Candra" },
    { name: "anggara", urip: 3, direction: "Barat Daya - Nairiti", deity: "Sang Hyang Angkara" },
    { name: "buda", urip: 7, direction: "Barat - Pascima", deity: "Sang Hyang Udaka" },
    { name: "wraspati", urip: 8, direction: "Tenggara - Gneyan", deity: "Sang Hyang Sukra Guru" },
    { name: "sukra", urip: 6, direction: "Timur Laut - Airsanya", deity: "Sang Hyang Bregu" },
    { name: "saniscara", urip: 9, direction: "Selatan - Daksina", deity: "Sang Hyang Wasu" }
] as const;

export const getSaptawara = (date: Date | string | number) => {
    const daysSinceAnchorDate = getDaysSincePawukonAnchorDate(date);
    
    const saptawaraIndex = daysSinceAnchorDate % SAPTAWARA_MODULO;
    const saptawara = SAPTAWARA[saptawaraIndex];

    if (!saptawara) throw new Error("Saptawara not found");

    return saptawara;
}
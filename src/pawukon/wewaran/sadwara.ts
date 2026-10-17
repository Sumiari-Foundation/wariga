import { getDaysSincePawukonAnchorDate } from "../../utilities/date";
import type { PawukonItemDetails } from "../types";

const SADWARA_MODULO = 6;

export const SADWARA: readonly PawukonItemDetails[] = [
    { name: "tungleh", urip: 7, direction: "Barat - Pascima", deity: "Sang Hyang Indra" },
    { name: "aryang", urip: 6, direction: "Timur Laut - Airsanya", deity: "Sang Hyang Bharuna" },
    { name: "urukung", urip: 5, direction: "Timur - Purwa", deity: "Sang Hyang Kwera" },
    { name: "paniron", urip: 8, direction: "Tenggara - Gneyan", deity: "Sang Hyang Bayu" },
    { name: "was", urip: 9, direction: "Selatan - Daksina", deity: "Sang Hyang Bajra" },
    { name: "maulu", urip: 3, direction: "Barat Daya - Nairiti", deity: "Sang Hyang Erawan" }
] as const;

export const getSadwara = (date: Date | string | number) => {
    const daysSinceAnchorDate = getDaysSincePawukonAnchorDate(date);
    
    const sadwaraIndex = daysSinceAnchorDate % SADWARA_MODULO;
    const sadwara = SADWARA[sadwaraIndex];

    if (!sadwara) throw new Error("Sadwara not found");

    return sadwara;
}
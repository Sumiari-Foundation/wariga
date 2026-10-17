import { getDaysSincePawukonAnchorDate } from "../../utilities/date";
import type { PawukonItemDetails } from "../types";

const TRIWARA_MODULO = 3;

export const TRIWARA: readonly PawukonItemDetails[] = [
    { name: "pasah", urip: 9, direction: "Selatan - Daksina", deity: "Sang Hyang Cika" },
    { name: "beteng", urip: 4, direction: "Utara - Utara", deity: "Sang Hyang Wacika" },
    { name: "kajeng", urip: 7, direction: "Barat - Pascima", deity: "Sang Hyang Manacika" }
] as const;

export const getTriwara = (date: Date | string | number) => {
    const daysSinceAnchorDate = getDaysSincePawukonAnchorDate(date);
    
    const triwaraIndex = daysSinceAnchorDate % TRIWARA_MODULO;
    const triwara = TRIWARA[triwaraIndex];
    
    if (!triwara) throw new Error("Triwara not found");

    return triwara;
}
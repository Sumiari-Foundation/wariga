import { getDaysSincePawukonAnchorDate } from "../../utilities/date.js";
import type { PawukonItemDetails } from "../types.js";

const PANCAWARA_MODULO = 5;

export const PANCAWARA: readonly PawukonItemDetails[] = [
    { name: "paing", urip: 9, direction: "Selatan - Daksina", deity: "Reshi Garga - Dewa Brahma - Bhagawan Mercukunda" },
    { name: "pon", urip: 7, direction: "Barat - Pascima", deity: "Reshi Maitrya - Dewa Mahadewa - Bhagawan Wraspati" },
    { name: "wage", urip: 4, direction: "Utara - Utara", deity: "Reshi Kurusya - Dewa Wisnu - Bhagawan Penyarihan" },
    { name: "kliwon", urip: 8, direction: "Tengah - Madya", deity: "Reshi Kretanjala - Dewa Shiwa - Sanghyang Widhi Wasa" },
    { name: "umanis", urip: 5, direction: "Timur - Purwa", deity: "Reshi Kursika - Dewa Iswara - Bhagawan Tatulak" },
] as const;

export const getPancawara = (date: Date | string | number) => {
    const daysSinceAnchorDate = getDaysSincePawukonAnchorDate(date);
    
    const pancawaraIndex = daysSinceAnchorDate % PANCAWARA_MODULO;
    const pancawara = PANCAWARA[pancawaraIndex];

    if (!pancawara) throw new Error("Pancawara not found");

    return pancawara;
}
import { getDaysSincePawukonAnchorDate } from "../../utilities/date";
import type { PawukonItemDetails } from "../types";

const CATURWARA_MODULO = 4;

export const CATURWARA: readonly PawukonItemDetails[] = [
    { name: "sri", urip: 6, direction: "Timur Laut - Airsanya", deity: "Bhagawan Bregu" },
    { name: "laba", urip: 3, direction: "Barat Daya - Nairiti", deity: "Bhagawan Kanwa" },
    { name: "jaya", urip: 1, direction: "Barat Laut - Wayabya", deity: "Bhagawan Janaka" },
    { name: "mandala", urip: 8, direction: "Tenggara - Gneyan", deity: "Bhagawan Narada" }
] as const;

export const getCaturwara = (date: Date | string | number) => {
    let daysSinceAnchorDate = getDaysSincePawukonAnchorDate(date);

    if (daysSinceAnchorDate >= 72)
        daysSinceAnchorDate += 2;

    const caturwaraIndex = (daysSinceAnchorDate) % CATURWARA_MODULO;
    const caturwara = CATURWARA[caturwaraIndex];

    if (!caturwara) throw new Error("Caturwara not found");

    return caturwara;
}
import { getDaysSincePawukonAnchorDate } from "../../utilities/date.js";
import type { Dateable } from "../../utilities/date.js";

const INGKEL_MODULO = 6;

export interface IngkelDetails {
    name: string;
}

// Ingkel cycles every 6 days. At anchor date 2025-02-09 (day 0), ingkel = Mina (index 2).
// Cycle order verified from kalenderbali.com:
// Wong(0) → Paksi(1) → Mina(2) → Taru(3) → Sato(4) → Patra(5) → Wong(0)...
export const INGKEL: readonly IngkelDetails[] = [
    { name: "wong" },
    { name: "paksi" },
    { name: "mina" },
    { name: "taru" },
    { name: "sato" },
    { name: "patra" },
] as const;

// Anchor date (2025-02-09) lands on Mina (index 2)
const INGKEL_ANCHOR_OFFSET = 2;

export const getIngkel = (date: Dateable) => {
    const daysSinceAnchorDate = getDaysSincePawukonAnchorDate(date);

    const ingkelIndex = (daysSinceAnchorDate + INGKEL_ANCHOR_OFFSET) % INGKEL_MODULO;
    const ingkel = INGKEL[ingkelIndex];

    if (!ingkel) throw new Error("Ingkel not found");

    return ingkel;
}

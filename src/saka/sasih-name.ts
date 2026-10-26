import { getSasihOrdinal } from "./sasih-phase.js";
import type { Dateable } from "../utilities/date.js";

const SASIH = [
    "Kasa", "Karo", "Katiga", "Kapat", "Kalima", "Kanam",
    "Kapitu", "Kaulu", "Kasanga", "Kedasa", "Jyestha", "Sadha",
] as const;

/**
 * Seven leap months in every 235 sasih. 235 lunar months is one Metonic cycle
 * of 19 solar years. Ordinal 0 is the Kapitu containing 2024-01-09, and these
 * residues are the leap ordinals inside that cycle.
 */
const LEAP_CYCLE = 235;
const LEAP_RESIDUES = [6, 42, 80, 105, 141, 179, 215] as const;
const KAPITU_INDEX = 6;

function mod(value: number, period: number): number {
    return ((value % period) + period) % period;
}

function isLeapOrdinal(ordinal: number): boolean {
    return (LEAP_RESIDUES as readonly number[]).includes(mod(ordinal, LEAP_CYCLE));
}

function leapsInRange(start: number, end: number): number {
    if (end < start) return 0;

    let count = 0;
    for (const residue of LEAP_RESIDUES) {
        const earliest = Math.ceil((start - residue) / LEAP_CYCLE);
        const latest = Math.floor((end - residue) / LEAP_CYCLE);
        if (latest >= earliest) count += latest - earliest + 1;
    }
    return count;
}

/** 0-based sasih index. A leap ordinal repeats the previous sasih. */
function monthIndex(ordinal: number): number {
    const named = isLeapOrdinal(ordinal) ? ordinal - 1 : ordinal;

    if (named >= 0) {
        const advances = named - leapsInRange(1, named);
        return mod(KAPITU_INDEX + advances, SASIH.length);
    }

    const span = -named;
    const advances = span - leapsInRange(named, -1);
    return mod(KAPITU_INDEX - advances, SASIH.length);
}

export const getSasihName = (date: Dateable) => {
    const ordinal = getSasihOrdinal(date);
    const index = monthIndex(ordinal);
    const baseName = SASIH[index];
    if (!baseName) throw new Error("Sasih index out of range");

    const isLeapMonth = isLeapOrdinal(ordinal);
    return {
        monthNumber: index + 1,
        sasihName: isLeapMonth ? `Mala ${baseName}` : baseName,
        isLeapMonth,
    };
};

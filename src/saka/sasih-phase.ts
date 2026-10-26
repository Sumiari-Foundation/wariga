import { MS_PER_DAY } from "../consts/time.js";
import { getValidDate, type Dateable } from "../utilities/date.js";

const PENANGGAL = "Penanggal (Waxing)";
const PANGELONG = "Pangelong (Waning)";

/**
 * One civil day every 63 days carries two tithi. 63 solar days contain 64 tithi,
 * because a synodic month is 29.530588 days and a sasih counts 30 tithi.
 *
 * The cycle is anchored on 2024-01-09 (Pangelong 13/14). When that day is
 * Anggara Wage Pahang and it is not tilem, the extra tithi is kept instead for
 * the purnama or tilem of that half, which is then observed as day 14.
 * Those postponed days are cycle numbers 18 and 28 mod 30.
 */
const NGUNALATRI_ANCHOR_MS = Date.parse("2024-01-09T00:00:00Z");
const NGUNALATRI_PERIOD = 63;
const PAWUKON_CYCLE = 30;
const PENANGGAL_POSTPONE_RESIDUE = 18;
const PANGELONG_POSTPONE_RESIDUE = 28;
const PENANGGAL_POSTPONE_SHIFT = 4;
const PANGELONG_POSTPONE_SHIFT = 9;

/**
 * 0-based tithi of the anchor day's first tithi, Pangelong 13.
 * Penanggal 1 of that sasih is 0, so the anchor sasih is ordinal 0.
 */
const ANCHOR_TITHI_INDEX = 27;

function mod(value: number, period: number): number {
    return ((value % period) + period) % period;
}

function daysSinceNgunalatriAnchor(date: Date): number {
    const day = Math.floor(date.getTime() / MS_PER_DAY);
    const anchorDay = Math.floor(NGUNALATRI_ANCHOR_MS / MS_PER_DAY);
    return day - anchorDay;
}

/** Grid doubles strictly before `day`, relative to the anchor, ignoring postponement. */
function unshiftedBefore(day: number): number {
    if (day > 0) return Math.floor((day - 1) / NGUNALATRI_PERIOD) + 1;
    if (day < 0) {
        const earliest = Math.ceil(day / NGUNALATRI_PERIOD);
        if (earliest <= -1) return earliest;
    }
    return 0;
}

function isPostponedSource(day: number): boolean {
    if (day % NGUNALATRI_PERIOD !== 0) return false;
    const residue = mod(day / NGUNALATRI_PERIOD, PAWUKON_CYCLE);
    return residue === PENANGGAL_POSTPONE_RESIDUE || residue === PANGELONG_POSTPONE_RESIDUE;
}

function postponementShift(day: number): number {
    const residue = mod(day / NGUNALATRI_PERIOD, PAWUKON_CYCLE);
    return residue === PENANGGAL_POSTPONE_RESIDUE ? PENANGGAL_POSTPONE_SHIFT : PANGELONG_POSTPONE_SHIFT;
}

function isDoubleDay(day: number): boolean {
    if (day % NGUNALATRI_PERIOD === 0 && !isPostponedSource(day)) return true;

    const penanggalSource = day - PENANGGAL_POSTPONE_SHIFT;
    if (penanggalSource % NGUNALATRI_PERIOD === 0 && mod(penanggalSource / NGUNALATRI_PERIOD, PAWUKON_CYCLE) === PENANGGAL_POSTPONE_RESIDUE) {
        return true;
    }

    const pangelongSource = day - PANGELONG_POSTPONE_SHIFT;
    return pangelongSource % NGUNALATRI_PERIOD === 0
        && mod(pangelongSource / NGUNALATRI_PERIOD, PAWUKON_CYCLE) === PANGELONG_POSTPONE_RESIDUE;
}

/**
 * While a postponed extra tithi has left its Tuesday but not yet reached
 * purnama or tilem, every later day is one tithi behind the unshifted cycle.
 */
function postponementLag(day: number): number {
    const source = Math.floor((day - 1) / NGUNALATRI_PERIOD) * NGUNALATRI_PERIOD;
    if (!isPostponedSource(source)) return 0;
    const target = source + postponementShift(source);
    return source < day && day <= target ? -1 : 0;
}

function firstTithiIndex(day: number): number {
    return ANCHOR_TITHI_INDEX + day + unshiftedBefore(day) + postponementLag(day);
}

function tithiAt(index: number): { phase: string; dayNumber: number } {
    const wrapped = mod(index, 30);
    if (wrapped <= 14) return { phase: PENANGGAL, dayNumber: wrapped + 1 };
    return { phase: PANGELONG, dayNumber: wrapped - 14 };
}

/**
 * Sasih ordinal relative to the Kapitu that contains 2024-01-09.
 * A leap ordinal repeats the previous sasih under the name Mala.
 */
export function getSasihOrdinal(date: Dateable): number {
    const dateObj = getValidDate(date);
    return Math.floor(firstTithiIndex(daysSinceNgunalatriAnchor(dateObj)) / 30);
}

export const getSasihPhase = (date: Dateable) => {
    const dateObj = getValidDate(date);
    const day = daysSinceNgunalatriAnchor(dateObj);
    const firstIndex = firstTithiIndex(day);
    const first = tithiAt(firstIndex);

    let isPurnama = first.phase === PENANGGAL && first.dayNumber === 15;
    let isTilem = first.phase === PANGELONG && first.dayNumber === 15;

    if (isDoubleDay(day)) {
        const second = tithiAt(firstIndex + 1);
        if (second.phase === PENANGGAL && second.dayNumber === 15) isPurnama = true;
        if (second.phase === PANGELONG && second.dayNumber === 15) isTilem = true;
    }

    return {
        phase: first.phase,
        dayNumber: first.dayNumber,
        isPurnama,
        isTilem,
    };
};

import { DRIFT_PER_MONTH, LUNAR_MONTH } from "../consts/lunar-month.js";
import { getDaysSinceKasaAnchorDate, type Dateable } from "../utilities/date.js";
import { SASIH_BOUNDARIES, SASIH_BOUNDARIES_START, SASIH_BOUNDARIES_END } from "../consts/sasih-boundaries.js";

const SASIH = [
    "Kasa", "Karo", "Katiga", "Kapat", "Kalima", "Kanam",
    "Kapitu", "Kaulu", "Kasanga", "Kedasa", "Jyestha", "Sadha"
] as const;

/**
 * Get sasih name using boundary lookup table for dates within 2024–2027,
 * or formula-based calculation for dates outside that range.
 * 
 * The lookup table is used because ngunalatri (astronomical adjustments)
 * cause 1-2 day shifts at sasih boundaries that cannot be predicted
 * by a purely linear formula.
 */
export const getSasihName = (date: Dateable) => {
    const dateObj = typeof date === "string" || typeof date === "number"
        ? new Date(date)
        : date;

    if (isNaN(dateObj.getTime())) throw new Error("Invalid date");

    // Use boundary lookup table for dates within covered range
    if (dateObj >= SASIH_BOUNDARIES_START && dateObj <= SASIH_BOUNDARIES_END) {
        let currentSasihName = SASIH_BOUNDARIES[0].sasih;

        for (const boundary of SASIH_BOUNDARIES) {
            if (new Date(boundary.date) <= dateObj) {
                currentSasihName = boundary.sasih;
            } else {
                break;
            }
        }

        const isLeapMonth = currentSasihName.startsWith("Mala ");
        const baseName = isLeapMonth ? currentSasihName.replace("Mala ", "") : currentSasihName;
        const monthNumber = (SASIH as readonly string[]).indexOf(baseName) + 1;

        return {
            monthNumber,
            sasihName: currentSasihName,
            isLeapMonth,
        };
    }

    // Fallback: formula-based calculation for dates outside 2024–2027
    const daysSinceAnchorDate = getDaysSinceKasaAnchorDate(dateObj);

    const elapsedTithis = (daysSinceAnchorDate / (LUNAR_MONTH / 30));
    const totalLunarMonthsPassed = Math.floor(elapsedTithis / 30);

    const totalDriftDays = totalLunarMonthsPassed * DRIFT_PER_MONTH;
    const totalLeapMonths = Math.floor(totalDriftDays / LUNAR_MONTH);

    let currentSasihIndex = (totalLunarMonthsPassed - totalLeapMonths) % 12;
    if (currentSasihIndex < 0) currentSasihIndex += 12;

    const isLeapMonth = (totalDriftDays % LUNAR_MONTH) < DRIFT_PER_MONTH;
    let finalName = SASIH[currentSasihIndex] as string;

    if (isLeapMonth)
        finalName = "Mala " + finalName;

    return {
        monthNumber: currentSasihIndex + 1,
        sasihName: finalName,
        isLeapMonth: isLeapMonth
    };
}

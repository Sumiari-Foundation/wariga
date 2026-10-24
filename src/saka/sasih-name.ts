import { DRIFT_PER_MONTH, LUNAR_MONTH } from "../consts/lunar-month.js";
import { getDaysSinceKasaAnchorDate, type Dateable } from "../utilities/date.js";

const SASIH = [
    "Kasa", "Karo", "Katiga", "Kapat", "Kalima", "Kanam",
    "Kapitu", "Kaulu", "Kasanga", "Kedasa", "Jyestha", "Sadha"
] as const;

export const getSasihName = (date: Dateable) => {
    const daysSinceAnchorDate = getDaysSinceKasaAnchorDate(date);

    // We use elapsed Tithis logic here to be precise
    const elapsedTithis = (daysSinceAnchorDate / (LUNAR_MONTH / 30));
    const totalLunarMonthsPassed = Math.floor(elapsedTithis / 30);

    const totalDriftDays = totalLunarMonthsPassed * DRIFT_PER_MONTH;
    const totalLeapMonths = Math.floor(totalDriftDays / LUNAR_MONTH);

    // We subtract the leap months to "freeze" the index progression
    // Then we modulo 12 to loop back to Kasa (0) after Sadha (11)
    let currentSasihIndex = (totalLunarMonthsPassed - totalLeapMonths) % 12;

    // Optional: Determine if the current month IS a leap month
    // It is a leap month if the drift just crossed the threshold
    const isLeapMonth = (totalDriftDays % LUNAR_MONTH) < DRIFT_PER_MONTH;
    let finalName = SASIH[currentSasihIndex];

    if (isLeapMonth)
        finalName = "Mala " + finalName; // 'Mala' denotes an impure/leap month

    return {
        monthNumber: currentSasihIndex + 1,
        sasihName: finalName,
        isLeapMonth: isLeapMonth
    };
}
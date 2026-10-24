import { KASA_NEW_MOON_ANCHOR_DATE } from "../consts/kasa-anchor-date";
import { PAWUKON_ANCHOR_DATE } from "../consts/pawukon-anchor-date";
import { MS_PER_DAY } from "../consts/time";
import { DAYS_IN_YEAR_CYCLE } from "../consts/year-cycle";

export type Dateable = Date | string | number;

export const getValidDate = (date: Dateable) => {
    const dateObj = new Date(date);

    if (Number.isNaN(dateObj.getTime()))
        throw new Error("Invalid date");

    return dateObj;
}

const getDaysSinceAnchorDate = (date: Dateable, anchorDate: Date) => {
    const dateObj = getValidDate(date);

    const deltaTime = dateObj.getTime() - anchorDate.getTime();
    const days = Math.floor(deltaTime / MS_PER_DAY);

    const validDays = days % DAYS_IN_YEAR_CYCLE;
    const effectiveDays = validDays < 0 ? DAYS_IN_YEAR_CYCLE + validDays : validDays;

    return Math.abs(effectiveDays);
}

export const getDaysSincePawukonAnchorDate = (date: Dateable) => {
    return getDaysSinceAnchorDate(date, PAWUKON_ANCHOR_DATE);
}

export const getDaysSinceKasaAnchorDate = (date: Dateable) => {
    // Saka calendar has no 210-day cycle — use raw day difference (can be negative)
    const dateObj = getValidDate(date);
    return Math.floor((dateObj.getTime() - KASA_NEW_MOON_ANCHOR_DATE.getTime()) / MS_PER_DAY);
}
import { TITHI } from "../consts/lunar-month.js";
import { getDaysSinceKasaAnchorDate, type Dateable } from "../utilities/date.js";

export const getSasihPhase = (date: Dateable) => {
    const daysSinceAnchorDate = getDaysSinceKasaAnchorDate(date);
    
    // We add an offset to align the tithi with the Balinese calendar start
    // Anchor date (2024-07-07) is Kasa Penanggal 1, offset calibrated to match
    // reference data from kalenderbali.com
    const elapsedTithis = (daysSinceAnchorDate / TITHI) + 0.6778; 
    
    // Find the exact day within the 30-day lunar cycle
    // We use modulo 30, and Math.floor to get the whole number
    let currentTithi = Math.floor(elapsedTithis % 30) + 1;
    
    // Determine Waxing (Penanggal) vs Waning (Pangelong)
    let phase = "";
    let dayNumber = 0;

    if (currentTithi <= 15) {
        phase = "Penanggal (Waxing)";
        dayNumber = currentTithi; // Days 1 to 15
    } else {
        phase = "Pangelong (Waning)";
        dayNumber = currentTithi - 15; // Days 16 to 30 become 1 to 15
    }

    return {
        phase: phase,
        dayNumber: dayNumber,
        isPurnama: (phase === "Penanggal (Waxing)" && dayNumber === 15),
        isTilem: (phase === "Pangelong (Waning)" && dayNumber === 15)
    };
}
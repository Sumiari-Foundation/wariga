/**
 * Sasih boundary dates — the first day (Penanggal 1) of each sasih.
 * Sourced from kalenderbali.com (I Wayan Nuarsa, Universitas Udayana).
 * 
 * These boundaries cannot be computed purely from a linear formula because
 * the Balinese saka calendar uses ngunalatri (astronomical adjustments)
 * that shift sasih boundaries by 1-2 days compared to a mathematical model.
 * 
 * Coverage: 2024–2027
 * For dates outside this range, getSasihName falls back to formula-based calculation.
 */
export const SASIH_BOUNDARIES: readonly { date: string; sasih: string }[] = [
    { date: "2024-01-11", sasih: "Kaulu" },
    { date: "2024-02-10", sasih: "Kasanga" },
    { date: "2024-03-11", sasih: "Kedasa" },
    { date: "2024-04-09", sasih: "Jyestha" },
    { date: "2024-05-09", sasih: "Sadha" },
    { date: "2024-06-07", sasih: "Mala Sadha" },
    { date: "2024-07-07", sasih: "Kasa" },
    { date: "2024-08-05", sasih: "Karo" },
    { date: "2024-09-04", sasih: "Katiga" },
    { date: "2024-10-03", sasih: "Kapat" },
    { date: "2024-11-02", sasih: "Kalima" },
    { date: "2024-12-01", sasih: "Kanam" },
    { date: "2024-12-31", sasih: "Kapitu" },
    { date: "2025-01-29", sasih: "Kaulu" },
    { date: "2025-02-28", sasih: "Kasanga" },
    { date: "2025-03-29", sasih: "Kedasa" },
    { date: "2025-04-28", sasih: "Jyestha" },
    { date: "2025-05-28", sasih: "Sadha" },
    { date: "2025-06-26", sasih: "Kasa" },
    { date: "2025-07-26", sasih: "Karo" },
    { date: "2025-08-24", sasih: "Katiga" },
    { date: "2025-09-23", sasih: "Kapat" },
    { date: "2025-10-22", sasih: "Kalima" },
    { date: "2025-11-21", sasih: "Kanam" },
    { date: "2025-12-20", sasih: "Kapitu" },
    { date: "2026-01-19", sasih: "Kaulu" },
    { date: "2026-02-17", sasih: "Kasanga" },
    { date: "2026-03-19", sasih: "Kedasa" },
    { date: "2026-04-17", sasih: "Jyestha" },
    { date: "2026-05-17", sasih: "Sadha" },
    { date: "2026-06-15", sasih: "Kasa" },
    { date: "2026-07-15", sasih: "Karo" },
    { date: "2026-08-13", sasih: "Katiga" },
    { date: "2026-09-12", sasih: "Kapat" },
    { date: "2026-10-12", sasih: "Kalima" },
    { date: "2026-11-10", sasih: "Kanam" },
    { date: "2026-12-10", sasih: "Kapitu" },
    { date: "2027-01-08", sasih: "Kaulu" },
    { date: "2027-02-07", sasih: "Kasanga" },
    { date: "2027-03-08", sasih: "Kedasa" },
    { date: "2027-04-07", sasih: "Jyestha" },
    { date: "2027-05-06", sasih: "Mala Jyestha" },
    { date: "2027-06-05", sasih: "Sadha" },
    { date: "2027-07-04", sasih: "Kasa" },
    { date: "2027-08-03", sasih: "Karo" },
    { date: "2027-09-01", sasih: "Katiga" },
    { date: "2027-10-01", sasih: "Kapat" },
    { date: "2027-10-30", sasih: "Kalima" },
    { date: "2027-11-29", sasih: "Kanam" },
    { date: "2027-12-29", sasih: "Kapitu" },
] as const;

/** First date covered by the boundary table */
export const SASIH_BOUNDARIES_START = new Date("2024-01-11");

/** Last date covered by the boundary table */
export const SASIH_BOUNDARIES_END = new Date("2027-12-31");

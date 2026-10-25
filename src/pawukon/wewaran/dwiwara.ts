import type { PawukonItemDetails } from "../types.js";

const DWIWARA_MODULO = 2;

export const DWIWARA: readonly PawukonItemDetails[] = [
    { name: "menga", urip: 5, direction: "Timur - Purwa", deity: "Sang Hyang Kalima" },
    { name: "pepet", urip: 4, direction: "Utara - Utara", deity: "Sang Hyang Timir" }
] as const;

/**
 * Get the dwiwara based on the sum of the urip of the saptawara and pancawara.
 * If the urip sum is even then it's menga, otherwise it's pepet.
 * 
 * @param uripSum - The sum of the urip of the saptawara and pancawara.
 * @returns The dwiwara.
 */
export const getDwiwara = (uripSum: number) => {    
    // Use positive modulo to handle negative uripSum values safely
    const dwiwaraIndex = ((uripSum % DWIWARA_MODULO) + DWIWARA_MODULO) % DWIWARA_MODULO;
    const dwiwara = DWIWARA[dwiwaraIndex];

    if (!dwiwara) throw new Error("Dwiwara not found");

    return dwiwara;
}
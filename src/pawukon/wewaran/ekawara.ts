import type { PawukonItemDetails } from "../types";

export const EKAWARA: readonly PawukonItemDetails[] = [
    { name: "luang", urip: 1, direction: "Barat Laut - Wayabya", deity: "Sang Hyang Taya" }
] as const;

export const getEkawara = (uripSum: number) => {
    // Use positive modulo to handle negative uripSum values safely
    return EKAWARA[((uripSum % 2) + 2) % 2];
}
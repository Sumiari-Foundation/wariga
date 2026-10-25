import type { PawukonItemDetails } from "../types.js";

export const EKAWARA: readonly PawukonItemDetails[] = [
    { name: "luang", urip: 1, direction: "Barat Laut - Wayabya", deity: "Sang Hyang Taya" }
] as const;

export const getEkawara = (uripSum: number) => {
    return EKAWARA[uripSum % 2];
}
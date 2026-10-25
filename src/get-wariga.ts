import {
    getAstawara,
    getCaturwara,
    getDasawara,
    getDwiwara,
    getEkawara,
    getPancawara,
    getSadwara,
    getSangawara,
    getSaptawara,
    getTriwara,
    getWuku,
} from "./pawukon/index.js";
import type { PawukonItemDetails } from "./pawukon/types.js";
import { getSasihName, getSasihPhase } from "./saka/index.js";
import type { Dateable } from "./utilities/date.js";

export type Wariga = {
    pawukon: {
        ekawara: PawukonItemDetails | undefined;
        dwiwara: PawukonItemDetails;
        triwara: PawukonItemDetails;
        caturwara: PawukonItemDetails;
        pancawara: PawukonItemDetails;
        sadwara: PawukonItemDetails;
        saptawara: PawukonItemDetails;
        astawara: PawukonItemDetails;
        sangawara: PawukonItemDetails;
        dasawara: PawukonItemDetails;
        wuku: PawukonItemDetails | undefined;
        uripSum: number;
    };
    saka: {
        sasih: ReturnType<typeof getSasihName>;
        phase: ReturnType<typeof getSasihPhase>;
    };
};

/**
 * Pawukon cycles that depend on urip — dwiwara, dasawara, and ekawara —
 * are calculated from saptawara urip plus pancawara urip.
 * Ekawara is Luang when that sum is even, and absent when it is odd.
 */
export const getWariga = (date: Dateable): Wariga => {
    const saptawara = getSaptawara(date);
    const pancawara = getPancawara(date);
    const uripSum = saptawara.urip + pancawara.urip;

    return {
        pawukon: {
            ekawara: getEkawara(uripSum),
            dwiwara: getDwiwara(uripSum),
            triwara: getTriwara(date),
            caturwara: getCaturwara(date),
            pancawara,
            sadwara: getSadwara(date),
            saptawara,
            astawara: getAstawara(date),
            sangawara: getSangawara(date),
            dasawara: getDasawara(uripSum),
            wuku: getWuku(date),
            uripSum,
        },
        saka: {
            sasih: getSasihName(date),
            phase: getSasihPhase(date),
        },
    };
};

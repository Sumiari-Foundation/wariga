import { describe, it, expect } from "bun:test";
import { getDasawara } from "./dasawara";
import dataset from "../../../data/wewaran-dataset.json";
import negativeDataset from "../../../data/wewaran-dataset-negative.json";
import { getSaptawara, getPancawara } from "./index";

describe("getDasawara", () => {

    // --- Dataset validation ---
    // Source: balinese-date-js-lib v0.4.3 (github.com/peradnya/balinese-date-js-lib)
    // References: babadbali.com, kalenderbali.org, kalenderbali.info

    for (const entry of dataset.entries) {
        it(`${entry.date} is ${entry.dasawara}`, () => {
            const date = new Date(entry.date);
            const uripSum = getSaptawara(date).urip + getPancawara(date).urip;
            expect(getDasawara(uripSum).name).toBe(entry.dasawara);
        });
    }

    for (const entry of negativeDataset.entries) {
        it(`${entry.date} is NOT ${entry.dasawara}`, () => {
            const date = new Date(entry.date);
            const uripSum = getSaptawara(date).urip + getPancawara(date).urip;
            expect(getDasawara(uripSum).name).not.toBe(entry.dasawara);
        });
    }

    // --- Edge cases ---
    // getDasawara takes uripSum, not a date

    it("uripSum 0 → pandita", () => {
        expect(getDasawara(0).name).toBe("pandita");
    });

    it("uripSum 9 → raksasa", () => {
        expect(getDasawara(9).name).toBe("raksasa");
    });

    it("negative uripSum -1 → raksasa (positive modulo)", () => {
        expect(getDasawara(-1).name).toBe("raksasa");
    });

    it("negative uripSum -10 → pandita (positive modulo)", () => {
        expect(getDasawara(-10).name).toBe("pandita");
    });
});

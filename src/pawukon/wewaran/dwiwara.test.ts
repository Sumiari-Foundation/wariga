import { describe, it, expect } from "bun:test";
import { getDwiwara } from "./dwiwara";
import dataset from "../../../data/wewaran-dataset.json";
import { getSaptawara, getPancawara } from "./index";

describe("getDwiwara", () => {

    // --- Dataset validation ---
    // Source: balinese-date-js-lib v0.4.3 (github.com/peradnya/balinese-date-js-lib)
    // References: babadbali.com, kalenderbali.org, kalenderbali.info

    for (const entry of dataset.entries) {
        it(`${entry.date} is ${entry.dwiwara}`, () => {
            const date = new Date(entry.date);
            const uripSum = getSaptawara(date).urip + getPancawara(date).urip;
            expect(getDwiwara(uripSum).name).toBe(entry.dwiwara);
        });
    }

    // --- Edge cases ---
    // getDwiwara takes uripSum, not a date
    // even → menga, odd → pepet

    it("even uripSum 14 → menga", () => {
        expect(getDwiwara(14).name).toBe("menga");
    });

    it("odd uripSum 13 → pepet", () => {
        expect(getDwiwara(13).name).toBe("pepet");
    });

    it("negative uripSum -1 → pepet (positive modulo)", () => {
        expect(getDwiwara(-1).name).toBe("pepet");
    });

    it("negative uripSum -2 → menga (positive modulo)", () => {
        expect(getDwiwara(-2).name).toBe("menga");
    });
});

import { describe, it, expect } from "bun:test";
import { getSaptawara } from "./saptawara";
import dataset from "../../../data/wewaran-dataset.json";

describe("getSaptawara", () => {

    // --- Dataset validation ---
    // Source: balinese-date-js-lib v0.4.3 (github.com/peradnya/balinese-date-js-lib)
    // References: babadbali.com, kalenderbali.org, kalenderbali.info

    for (const entry of dataset.entries) {
        it(`${entry.date} is ${entry.saptawara}`, () => {
            expect(getSaptawara(new Date(entry.date)).name).toBe(entry.saptawara);
        });
    }

    // --- Edge cases ---

    it("completes a full 7-day cycle starting from anchor", () => {
        const expected = ["redite", "soma", "anggara", "buda", "wraspati", "sukra", "saniscara"];
        for (let i = 0; i < 7; i++) {
            const date = new Date("2025-02-09");
            date.setDate(date.getDate() + i);
            expect(getSaptawara(date).name).toBe(expected[i]);
        }
    });

    it("day 209 (2025-09-06) is saniscara — last day of the 210-day cycle", () => {
        expect(getSaptawara(new Date("2025-09-06")).name).toBe("saniscara");
    });

    it("day 210 (2025-09-07) wraps back to redite", () => {
        expect(getSaptawara(new Date("2025-09-07")).name).toBe("redite");
    });

    it("1 day before anchor (2025-02-08) is saniscara — effective day 209", () => {
        expect(getSaptawara(new Date("2025-02-08")).name).toBe("saniscara");
    });

    it("accepts string input", () => {
        expect(getSaptawara("2025-02-09").name).toBe("redite");
    });

    it("accepts number (timestamp) input", () => {
        expect(getSaptawara(new Date("2025-02-09").getTime()).name).toBe("redite");
    });

    it("throws on invalid date", () => {
        expect(() => getSaptawara("invalid-date")).toThrow("Invalid date");
    });
});

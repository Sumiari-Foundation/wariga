import { describe, it, expect } from "bun:test";
import { getSaptawara } from "./saptawara";
import dataset from "../../../data/wewaran-dataset.json";

describe("getSaptawara", () => {

    // --- Dataset validation (source: kalenderbali.com, kalenderbali.info) ---

    for (const entry of dataset.entries) {
        it(`${entry.date} is ${entry.saptawara}`, () => {
            expect(getSaptawara(new Date(entry.date)).name).toBe(entry.saptawara);
        });
    }

    // --- Anchor date ---

    it("anchor date 2025-02-09 is redite (index 0)", () => {
        expect(getSaptawara(new Date("2025-02-09")).name).toBe("redite");
    });

    // --- Input types ---

    it("accepts a string input", () => {
        expect(getSaptawara("2025-02-09").name).toBe("redite");
    });

    it("accepts a number (timestamp) input", () => {
        expect(getSaptawara(new Date("2025-02-09").getTime()).name).toBe("redite");
    });

    it("throws on invalid date string", () => {
        expect(() => getSaptawara("invalid-date")).toThrow("Invalid date");
    });

    // --- Full 7-day cycle ---

    it("completes a full 7-day cycle starting from anchor", () => {
        const expected = ["redite", "soma", "anggara", "buda", "wraspati", "sukra", "saniscara"];
        for (let i = 0; i < 7; i++) {
            const date = new Date("2025-02-09");
            date.setDate(date.getDate() + i);
            expect(getSaptawara(date).name).toBe(expected[i]);
        }
    });

    // --- 210-day cycle boundary ---

    it("day 209 (2025-09-06) is saniscara — last day of the 210-day cycle", () => {
        expect(getSaptawara(new Date("2025-09-06")).name).toBe("saniscara");
    });

    it("day 210 (2025-09-07) wraps back to redite", () => {
        expect(getSaptawara(new Date("2025-09-07")).name).toBe("redite");
    });

    it("day 211 (2025-09-08) is soma after wrap", () => {
        expect(getSaptawara(new Date("2025-09-08")).name).toBe("soma");
    });

    // --- Dates before anchor ---
    // getDaysSince wraps negative deltas back into the 210-day cycle

    it("1 day before anchor (2025-02-08) is saniscara — effective day 209", () => {
        expect(getSaptawara(new Date("2025-02-08")).name).toBe("saniscara");
    });

    it("historical date 2020-01-01 does not throw", () => {
        expect(() => getSaptawara(new Date("2020-01-01"))).not.toThrow();
    });
});

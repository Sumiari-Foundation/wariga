import { describe, it, expect } from "bun:test";
import { getSadwara } from "./sadwara";
import dataset from "../../../data/wewaran-dataset.json";

describe("getSadwara", () => {

    // --- Dataset validation (source: kalenderbali.com, kalenderbali.info) ---

    for (const entry of dataset.entries) {
        it(`${entry.date} is ${entry.sadwara}`, () => {
            expect(getSadwara(new Date(entry.date)).name).toBe(entry.sadwara);
        });
    }

    // --- Anchor date ---

    it("anchor date 2025-02-09 is tungleh (index 0)", () => {
        expect(getSadwara(new Date("2025-02-09")).name).toBe("tungleh");
    });

    // --- Full 6-day cycle ---

    it("completes a full 6-day cycle starting from anchor", () => {
        const expected = ["tungleh", "aryang", "urukung", "paniron", "was", "maulu"];
        for (let i = 0; i < 6; i++) {
            const date = new Date("2025-02-09");
            date.setDate(date.getDate() + i);
            expect(getSadwara(date).name).toBe(expected[i]);
        }
    });

    // --- Urip values ---

    it("was has urip 9", () => {
        expect(getSadwara(new Date("2025-02-13")).urip).toBe(9);
    });

    // --- 210-day cycle boundary ---
    // 210 / 6 = 35 complete cycles, so wrap is always clean

    it("day 209 (2025-09-06) is maulu", () => {
        expect(getSadwara(new Date("2025-09-06")).name).toBe("maulu");
    });

    it("day 210 (2025-09-07) wraps back to tungleh", () => {
        expect(getSadwara(new Date("2025-09-07")).name).toBe("tungleh");
    });

    // --- Dates before anchor ---

    it("1 day before anchor (2025-02-08) is maulu — effective day 209", () => {
        expect(getSadwara(new Date("2025-02-08")).name).toBe("maulu");
    });

    // --- Input types ---

    it("throws on invalid date string", () => {
        expect(() => getSadwara("invalid-date")).toThrow("Invalid date");
    });
});

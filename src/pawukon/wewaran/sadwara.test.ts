import { describe, it, expect } from "bun:test";
import { getSadwara } from "./sadwara";
import dataset from "../../../data/wewaran-dataset.json";
import negativeDataset from "../../../data/wewaran-dataset-negative.json";

describe("getSadwara", () => {

    // --- Positive dataset validation ---
    // Source: kalenderbali.com (I Wayan Nuarsa, Universitas Udayana)

    for (const entry of dataset.entries) {
        it(`${entry.date} is ${entry.sadwara}`, () => {
            expect(getSadwara(new Date(entry.date)).name).toBe(entry.sadwara);
        });
    }

    // --- Negative dataset validation ---

    for (const entry of negativeDataset.entries) {
        it(`${entry.date} is NOT ${entry.sadwara}`, () => {
            expect(getSadwara(new Date(entry.date)).name).not.toBe(entry.sadwara);
        });
    }

    // --- Edge cases ---

    it("completes a full 6-day cycle starting from anchor", () => {
        const expected = ["tungleh", "aryang", "urukung", "paniron", "was", "maulu"];
        for (let i = 0; i < 6; i++) {
            const date = new Date("2025-02-09");
            date.setDate(date.getDate() + i);
            expect(getSadwara(date).name).toBe(expected[i]);
        }
    });

    it("day 209 (2025-09-06) is maulu — last day of the 210-day cycle", () => {
        expect(getSadwara(new Date("2025-09-06")).name).toBe("maulu");
    });

    it("day 210 (2025-09-07) wraps back to tungleh", () => {
        expect(getSadwara(new Date("2025-09-07")).name).toBe("tungleh");
    });

    it("1 day before anchor (2025-02-08) is maulu — effective day 209", () => {
        expect(getSadwara(new Date("2025-02-08")).name).toBe("maulu");
    });

    it("throws on invalid date", () => {
        expect(() => getSadwara("invalid-date")).toThrow("Invalid date");
    });
});

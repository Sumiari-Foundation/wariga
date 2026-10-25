import { describe, it, expect } from "bun:test";
import { getPancawara } from "./pancawara";
import dataset from "../../../data/wewaran-dataset.json";
import negativeDataset from "../../../data/wewaran-dataset-negative.json";

describe("getPancawara", () => {

    // --- Positive dataset validation ---
    // Source: kalenderbali.com (I Wayan Nuarsa, Universitas Udayana)

    for (const entry of dataset.entries) {
        it(`${entry.date} is ${entry.pancawara}`, () => {
            expect(getPancawara(new Date(entry.date)).name).toBe(entry.pancawara);
        });
    }

    // --- Negative dataset validation ---

    for (const entry of negativeDataset.entries) {
        it(`${entry.date} is NOT ${entry.pancawara}`, () => {
            expect(getPancawara(new Date(entry.date)).name).not.toBe(entry.pancawara);
        });
    }

    // --- Edge cases ---

    it("completes a full 5-day cycle starting from anchor", () => {
        const expected = ["paing", "pon", "wage", "kliwon", "umanis"];
        for (let i = 0; i < 5; i++) {
            const date = new Date("2025-02-09");
            date.setDate(date.getDate() + i);
            expect(getPancawara(date).name).toBe(expected[i]);
        }
    });

    it("day 209 (2025-09-06) is umanis — last day of the 210-day cycle", () => {
        expect(getPancawara(new Date("2025-09-06")).name).toBe("umanis");
    });

    it("day 210 (2025-09-07) wraps back to paing", () => {
        expect(getPancawara(new Date("2025-09-07")).name).toBe("paing");
    });

    it("1 day before anchor (2025-02-08) is umanis — effective day 209", () => {
        expect(getPancawara(new Date("2025-02-08")).name).toBe("umanis");
    });

    it("kliwon has urip 8 — used downstream by dwiwara, ekawara, dasawara", () => {
        expect(getPancawara(new Date("2025-02-12")).urip).toBe(8);
    });

    it("throws on invalid date", () => {
        expect(() => getPancawara("invalid-date")).toThrow("Invalid date");
    });
});

import { describe, it, expect } from "bun:test";
import { getPancawara } from "./pancawara";
import dataset from "../../../data/wewaran-dataset.json";

describe("getPancawara", () => {

    // --- Dataset validation (source: kalenderbali.com, kalenderbali.info) ---

    for (const entry of dataset.entries) {
        it(`${entry.date} is ${entry.pancawara}`, () => {
            expect(getPancawara(new Date(entry.date)).name).toBe(entry.pancawara);
        });
    }

    // --- Anchor date ---

    it("anchor date 2025-02-09 is paing (index 0)", () => {
        expect(getPancawara(new Date("2025-02-09")).name).toBe("paing");
    });

    // --- Full 5-day cycle ---

    it("completes a full 5-day cycle starting from anchor", () => {
        const expected = ["paing", "pon", "wage", "kliwon", "umanis"];
        for (let i = 0; i < 5; i++) {
            const date = new Date("2025-02-09");
            date.setDate(date.getDate() + i);
            expect(getPancawara(date).name).toBe(expected[i]);
        }
    });

    // --- Urip values — used downstream by dwiwara, ekawara, dasawara ---

    it("kliwon has urip 8", () => {
        expect(getPancawara(new Date("2025-02-12")).urip).toBe(8);
    });

    it("paing has urip 9", () => {
        expect(getPancawara(new Date("2025-02-09")).urip).toBe(9);
    });

    // --- Input types ---

    it("throws on invalid date string", () => {
        expect(() => getPancawara("invalid-date")).toThrow("Invalid date");
    });

    // --- 210-day cycle boundary ---
    // 210 / 5 = 42 complete cycles, so wrap is always clean

    it("day 209 (2025-09-06) is umanis", () => {
        expect(getPancawara(new Date("2025-09-06")).name).toBe("umanis");
    });

    it("day 210 (2025-09-07) wraps back to paing", () => {
        expect(getPancawara(new Date("2025-09-07")).name).toBe("paing");
    });

    // --- Dates before anchor ---

    it("1 day before anchor (2025-02-08) is umanis — effective day 209", () => {
        expect(getPancawara(new Date("2025-02-08")).name).toBe("umanis");
    });

    it("historical date 2020-01-01 does not throw", () => {
        expect(() => getPancawara(new Date("2020-01-01"))).not.toThrow();
    });
});

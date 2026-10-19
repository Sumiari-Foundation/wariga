import { describe, it, expect } from "bun:test";
import { getTriwara } from "./triwara";
import dataset from "../../../data/wewaran-dataset.json";

describe("getTriwara", () => {

    // --- Dataset validation (source: kalenderbali.com, kalenderbali.info) ---

    for (const entry of dataset.entries) {
        it(`${entry.date} is ${entry.triwara}`, () => {
            expect(getTriwara(new Date(entry.date)).name).toBe(entry.triwara);
        });
    }

    // --- Anchor date ---

    it("anchor date 2025-02-09 is pasah (index 0)", () => {
        expect(getTriwara(new Date("2025-02-09")).name).toBe("pasah");
    });

    // --- Full 3-day cycle ---

    it("completes a full 3-day cycle starting from anchor", () => {
        const expected = ["pasah", "beteng", "kajeng"];
        for (let i = 0; i < 3; i++) {
            const date = new Date("2025-02-09");
            date.setDate(date.getDate() + i);
            expect(getTriwara(date).name).toBe(expected[i]);
        }
    });

    // --- Urip values ---

    it("kajeng has urip 7", () => {
        expect(getTriwara(new Date("2025-02-11")).urip).toBe(7);
    });

    // --- 210-day cycle boundary ---
    // 210 / 3 = 70 complete cycles, so wrap is always clean

    it("day 209 (2025-09-06) is kajeng", () => {
        expect(getTriwara(new Date("2025-09-06")).name).toBe("kajeng");
    });

    it("day 210 (2025-09-07) wraps back to pasah", () => {
        expect(getTriwara(new Date("2025-09-07")).name).toBe("pasah");
    });

    // --- Dates before anchor ---

    it("1 day before anchor (2025-02-08) is kajeng — effective day 209", () => {
        expect(getTriwara(new Date("2025-02-08")).name).toBe("kajeng");
    });

    // --- Input types ---

    it("throws on invalid date string", () => {
        expect(() => getTriwara("invalid-date")).toThrow("Invalid date");
    });
});

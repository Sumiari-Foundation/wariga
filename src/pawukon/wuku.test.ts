import { describe, it, expect } from "bun:test";
import { getWuku } from "./wuku";
import dataset from "../../data/wewaran-dataset.json";
import negativeDataset from "../../data/wewaran-dataset-negative.json";

describe("getWuku", () => {

    // --- Positive dataset validation ---
    // Source: kalenderbali.com (I Wayan Nuarsa, Universitas Udayana)

    for (const entry of dataset.entries) {
        it(`${entry.date} is ${entry.wuku}`, () => {
            expect(getWuku(new Date(entry.date)).name).toBe(entry.wuku);
        });
    }

    // --- Negative dataset validation ---

    for (const entry of negativeDataset.entries) {
        it(`${entry.date} is NOT ${entry.wuku}`, () => {
            expect(getWuku(new Date(entry.date)).name).not.toBe(entry.wuku);
        });
    }

    // --- Edge cases ---

    // Wuku changes every 7 days
    it("day 6 (2025-02-15) is still sinta — last day of first wuku", () => {
        expect(getWuku(new Date("2025-02-15")).name).toBe("sinta");
    });

    it("day 7 (2025-02-16) changes to landep — first day of second wuku", () => {
        expect(getWuku(new Date("2025-02-16")).name).toBe("landep");
    });

    // 210-day cycle boundary: 30 wuku × 7 days = 210 days
    it("day 203 (2025-08-31) is watugunung — start of last wuku", () => {
        expect(getWuku(new Date("2025-08-31")).name).toBe("watugunung");
    });

    it("day 209 (2025-09-06) is still watugunung — last day of the cycle", () => {
        expect(getWuku(new Date("2025-09-06")).name).toBe("watugunung");
    });

    it("day 210 (2025-09-07) wraps back to sinta", () => {
        expect(getWuku(new Date("2025-09-07")).name).toBe("sinta");
    });

    it("1 day before anchor (2025-02-08) is watugunung — effective day 209", () => {
        expect(getWuku(new Date("2025-02-08")).name).toBe("watugunung");
    });

    it("accepts string input", () => {
        expect(getWuku("2025-02-09").name).toBe("sinta");
    });

    it("throws on invalid date", () => {
        expect(() => getWuku("invalid-date")).toThrow("Invalid date");
    });
});

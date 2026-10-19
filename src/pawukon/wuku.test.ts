import { describe, it, expect } from "bun:test";
import { getWuku } from "./wuku";
import dataset from "../../data/wewaran-dataset.json";

describe("getWuku", () => {

    // --- Dataset validation (source: kalenderbali.com, kalenderbali.info) ---

    for (const entry of dataset.entries) {
        it(`${entry.date} is ${entry.wuku}`, () => {
            expect(getWuku(new Date(entry.date)).name).toBe(entry.wuku);
        });
    }

    // --- Anchor date ---

    it("anchor date 2025-02-09 is sinta (index 0)", () => {
        expect(getWuku(new Date("2025-02-09")).name).toBe("sinta");
    });

    // --- Wuku changes every 7 days ---

    it("day 6 (2025-02-15) is still sinta — last day of first wuku", () => {
        expect(getWuku(new Date("2025-02-15")).name).toBe("sinta");
    });

    it("day 7 (2025-02-16) changes to landep — first day of second wuku", () => {
        expect(getWuku(new Date("2025-02-16")).name).toBe("landep");
    });

    it("day 13 (2025-02-22) is still landep", () => {
        expect(getWuku(new Date("2025-02-22")).name).toBe("landep");
    });

    it("day 14 (2025-02-23) changes to ukir", () => {
        expect(getWuku(new Date("2025-02-23")).name).toBe("ukir");
    });

    // --- 210-day cycle boundary (30 wuku × 7 days = 210 days) ---

    it("day 203 (2025-08-31) is watugunung — start of last wuku", () => {
        expect(getWuku(new Date("2025-08-31")).name).toBe("watugunung");
    });

    it("day 209 (2025-09-06) is still watugunung — last day of the cycle", () => {
        expect(getWuku(new Date("2025-09-06")).name).toBe("watugunung");
    });

    it("day 210 (2025-09-07) wraps back to sinta", () => {
        expect(getWuku(new Date("2025-09-07")).name).toBe("sinta");
    });

    // --- Dates before anchor ---
    // getDaysSince wraps negative deltas back into the 210-day cycle

    it("1 day before anchor (2025-02-08) is watugunung — effective day 209", () => {
        expect(getWuku(new Date("2025-02-08")).name).toBe("watugunung");
    });

    it("historical date 2020-01-01 does not throw", () => {
        expect(() => getWuku(new Date("2020-01-01"))).not.toThrow();
    });

    // --- Input types ---

    it("accepts a string input", () => {
        expect(getWuku("2025-02-09").name).toBe("sinta");
    });

    it("throws on invalid date string", () => {
        expect(() => getWuku("invalid-date")).toThrow("Invalid date");
    });
});

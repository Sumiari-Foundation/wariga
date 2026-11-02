import { describe, it, expect } from "bun:test";
import { getIngkel } from "./ingkel";

describe("getIngkel", () => {

    // --- Anchor date ---
    // 2025-02-09 = day 0 = Mina (index 2 in [Wong, Paksi, Mina, Taru, Sato, Patra])
    // Verified from kalenderbali.com

    it("anchor date 2025-02-09 is mina", () => {
        expect(getIngkel(new Date("2025-02-09")).name).toBe("mina");
    });

    // --- Full 6-day cycle starting from anchor ---

    it("completes a full 6-day cycle starting from anchor", () => {
        const expected = ["mina", "taru", "sato", "patra", "wong", "paksi"];
        for (let i = 0; i < 6; i++) {
            const date = new Date("2025-02-09");
            date.setDate(date.getDate() + i);
            expect(getIngkel(date).name).toBe(expected[i]);
        }
    });

    // --- Day 6 wraps back to mina ---

    it("day 6 wraps back to mina (full cycle)", () => {
        const date = new Date("2025-02-09");
        date.setDate(date.getDate() + 6);
        expect(getIngkel(date).name).toBe("mina");
    });

    // --- Verified dates from kalenderbali.com ---

    it("2025-02-01 is wong", () => {
        expect(getIngkel(new Date("2025-02-01")).name).toBe("wong");
    });

    it("2025-02-02 is paksi", () => {
        expect(getIngkel(new Date("2025-02-02")).name).toBe("paksi");
    });

    it("2025-03-03 is wong", () => {
        expect(getIngkel(new Date("2025-03-03")).name).toBe("wong");
    });

    it("2025-03-07 is sato", () => {
        expect(getIngkel(new Date("2025-03-07")).name).toBe("sato");
    });

    // --- 210-day cycle boundary ---

    it("day 209 does not throw", () => {
        const date = new Date("2025-09-06");
        expect(() => getIngkel(date)).not.toThrow();
    });

    it("day 210 wraps correctly", () => {
        // 210 / 6 = 35 complete cycles, so day 210 = same as day 0 = mina
        expect(getIngkel(new Date("2025-09-07")).name).toBe("mina");
    });

    // --- Dates before anchor ---

    it("date before anchor does not throw", () => {
        expect(() => getIngkel(new Date("2024-01-01"))).not.toThrow();
    });

    // --- Input types ---

    it("accepts a string input", () => {
        expect(() => getIngkel("2025-02-09")).not.toThrow();
    });

    it("throws on invalid date", () => {
        expect(() => getIngkel("invalid-date")).toThrow("Invalid date");
    });
});

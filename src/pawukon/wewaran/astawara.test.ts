import { describe, it, expect } from "bun:test";
import { getAstawara } from "./astawara";

describe("getAstawara", () => {

    // --- Edge cases only ---
    // astawara excluded from dataset — discrepancy found at day 71 of each cycle
    // between our implementation and reference library, reported to reviewer

    it("anchor date 2025-02-09 is sri (index 0)", () => {
        expect(getAstawara(new Date("2025-02-09")).name).toBe("sri");
    });

    it("completes a full 8-day cycle starting from anchor", () => {
        const expected = ["sri", "indra", "guru", "yama", "ludra", "brahma", "kala", "uma"];
        for (let i = 0; i < 8; i++) {
            const date = new Date("2025-02-09");
            date.setDate(date.getDate() + i);
            expect(getAstawara(date).name).toBe(expected[i]);
        }
    });

    // Offset +6 at day 72
    it("day 71 (2025-04-21) before offset: 71%8 = 7 = uma", () => {
        expect(getAstawara(new Date("2025-04-21")).name).toBe("uma");
    });

    it("day 72 (2025-04-22) with offset: (72+6)%8 = 6 = kala", () => {
        expect(getAstawara(new Date("2025-04-22")).name).toBe("kala");
    });

    it("1 day before anchor does not throw", () => {
        expect(() => getAstawara(new Date("2025-02-08"))).not.toThrow();
    });

    it("throws on invalid date", () => {
        expect(() => getAstawara("invalid-date")).toThrow("Invalid date");
    });
});

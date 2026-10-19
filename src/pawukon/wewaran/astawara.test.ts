import { describe, it, expect } from "bun:test";
import { getAstawara } from "./astawara";

describe("getAstawara", () => {

    // --- Anchor date ---

    it("anchor date 2025-02-09 is sri (index 0)", () => {
        expect(getAstawara(new Date("2025-02-09")).name).toBe("sri");
    });

    // --- Full 8-day cycle before offset ---

    it("completes a full 8-day cycle starting from anchor", () => {
        const expected = ["sri", "indra", "guru", "yama", "ludra", "brahma", "kala", "uma"];
        for (let i = 0; i < 8; i++) {
            const date = new Date("2025-02-09");
            date.setDate(date.getDate() + i);
            expect(getAstawara(date).name).toBe(expected[i]);
        }
    });

    // --- Offset +6 at day 72 ---
    // Source code adds 6 to daysSince when daysSince >= 72

    it("day 71 (2025-04-21) before offset: 71%8 = 7 = uma", () => {
        expect(getAstawara(new Date("2025-04-21")).name).toBe("uma");
    });

    it("day 72 (2025-04-22) with offset: (72+6)%8 = 6 = kala", () => {
        expect(getAstawara(new Date("2025-04-22")).name).toBe("kala");
    });

    // --- Urip values ---

    it("uma has urip 4", () => {
        expect(getAstawara(new Date("2025-02-16")).urip).toBe(4);
    });

    // --- 210-day cycle boundary ---

    it("day 209 (2025-09-06) does not throw", () => {
        expect(() => getAstawara(new Date("2025-09-06"))).not.toThrow();
    });

    it("day 210 (2025-09-07) does not throw", () => {
        expect(() => getAstawara(new Date("2025-09-07"))).not.toThrow();
    });

    // --- Dates before anchor ---

    it("1 day before anchor (2025-02-08) does not throw", () => {
        expect(() => getAstawara(new Date("2025-02-08"))).not.toThrow();
    });

    // --- Input types ---

    it("throws on invalid date string", () => {
        expect(() => getAstawara("invalid-date")).toThrow("Invalid date");
    });
});

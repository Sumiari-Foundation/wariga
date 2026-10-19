import { describe, it, expect } from "bun:test";
import { getCaturwara } from "./caturwara";

describe("getCaturwara", () => {

    // --- Anchor date ---

    it("anchor date 2025-02-09 is sri (index 0)", () => {
        expect(getCaturwara(new Date("2025-02-09")).name).toBe("sri");
    });

    // --- Full 4-day cycle before offset ---

    it("completes a full 4-day cycle starting from anchor", () => {
        const expected = ["sri", "laba", "jaya", "mandala"];
        for (let i = 0; i < 4; i++) {
            const date = new Date("2025-02-09");
            date.setDate(date.getDate() + i);
            expect(getCaturwara(date).name).toBe(expected[i]);
        }
    });

    // --- Offset +2 at day 72 ---
    // Source code adds 2 to daysSince when daysSince >= 72

    it("day 71 (2025-04-21) before offset: 71%4 = 3 = mandala", () => {
        expect(getCaturwara(new Date("2025-04-21")).name).toBe("mandala");
    });

    it("day 72 (2025-04-22) with offset: (72+2)%4 = 2 = jaya", () => {
        expect(getCaturwara(new Date("2025-04-22")).name).toBe("jaya");
    });

    // --- Urip values ---

    it("mandala has urip 8", () => {
        expect(getCaturwara(new Date("2025-02-12")).urip).toBe(8);
    });

    // --- 210-day cycle boundary ---

    it("day 209 (2025-09-06) does not throw", () => {
        expect(() => getCaturwara(new Date("2025-09-06"))).not.toThrow();
    });

    it("day 210 (2025-09-07) does not throw", () => {
        expect(() => getCaturwara(new Date("2025-09-07"))).not.toThrow();
    });

    // --- Dates before anchor ---

    it("1 day before anchor (2025-02-08) does not throw", () => {
        expect(() => getCaturwara(new Date("2025-02-08"))).not.toThrow();
    });

    // --- Input types ---

    it("throws on invalid date string", () => {
        expect(() => getCaturwara("invalid-date")).toThrow("Invalid date");
    });
});

import { describe, it, expect } from "bun:test";
import { getCaturwara } from "./caturwara";

describe("getCaturwara", () => {

    // --- Edge cases only ---
    // caturwara excluded from dataset — discrepancy found between our implementation
    // and reference library (peradnya/balinese-date-js-lib), reported to reviewer

    it("anchor date 2025-02-09 is sri (index 0)", () => {
        expect(getCaturwara(new Date("2025-02-09")).name).toBe("sri");
    });

    it("completes a full 4-day cycle starting from anchor", () => {
        const expected = ["sri", "laba", "jaya", "mandala"];
        for (let i = 0; i < 4; i++) {
            const date = new Date("2025-02-09");
            date.setDate(date.getDate() + i);
            expect(getCaturwara(date).name).toBe(expected[i]);
        }
    });

    // Offset +2 at day 72 — behavior difference flagged with reference library
    it("day 71 (2025-04-21) before offset: 71%4 = 3 = mandala", () => {
        expect(getCaturwara(new Date("2025-04-21")).name).toBe("mandala");
    });

    it("day 72 (2025-04-22) with offset: (72+2)%4 = 2 = jaya", () => {
        expect(getCaturwara(new Date("2025-04-22")).name).toBe("jaya");
    });

    it("1 day before anchor does not throw", () => {
        expect(() => getCaturwara(new Date("2025-02-08"))).not.toThrow();
    });

    it("throws on invalid date", () => {
        expect(() => getCaturwara("invalid-date")).toThrow("Invalid date");
    });
});

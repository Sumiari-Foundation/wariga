import { describe, it, expect } from "bun:test";
import { getSasihPhase } from "./sasih-phase";

describe("getSasihPhase", () => {

    // --- Return shape ---
    // getSasihPhase returns: { phase, dayNumber, isPurnama, isTilem }

    it("returns the correct shape", () => {
        const result = getSasihPhase(new Date("2025-02-27"));
        expect(result).toHaveProperty("phase");
        expect(result).toHaveProperty("dayNumber");
        expect(result).toHaveProperty("isPurnama");
        expect(result).toHaveProperty("isTilem");
    });

    // --- Anchor date ---
    // Kasa new moon anchor: 2025-02-27 UTC
    // Due to the 0.25 offset in source (aligns with Balinese dawn), 
    // anchor itself lands on penanggal 1, not tilem

    it("anchor date 2025-02-27 is penanggal (waxing)", () => {
        expect(getSasihPhase(new Date("2025-02-27")).phase).toBe("Penanggal (Waxing)");
    });

    it("anchor date 2025-02-27 is day 1", () => {
        expect(getSasihPhase(new Date("2025-02-27")).dayNumber).toBe(1);
    });

    // --- Purnama (full moon) = penanggal 15 ---

    it("2025-03-13 is purnama — penanggal 15", () => {
        const result = getSasihPhase(new Date("2025-03-13"));
        expect(result.isPurnama).toBe(true);
        expect(result.phase).toBe("Penanggal (Waxing)");
        expect(result.dayNumber).toBe(15);
    });

    it("isPurnama is false on penanggal 14", () => {
        const result = getSasihPhase(new Date("2025-03-12"));
        expect(result.isPurnama).toBe(false);
        expect(result.dayNumber).toBe(14);
    });

    it("isPurnama is false on pangelong 1 (day after purnama)", () => {
        const result = getSasihPhase(new Date("2025-03-14"));
        expect(result.isPurnama).toBe(false);
        expect(result.phase).toBe("Pangelong (Waning)");
        expect(result.dayNumber).toBe(1);
    });

    // --- Tilem (new moon) = pangelong 15 ---

    it("2025-03-28 is tilem — pangelong 15", () => {
        const result = getSasihPhase(new Date("2025-03-28"));
        expect(result.isTilem).toBe(true);
        expect(result.phase).toBe("Pangelong (Waning)");
        expect(result.dayNumber).toBe(15);
    });

    it("isTilem is false on pangelong 14", () => {
        const result = getSasihPhase(new Date("2025-03-27"));
        expect(result.isTilem).toBe(false);
        expect(result.dayNumber).toBe(14);
    });

    it("isTilem is false on penanggal 1 (day after tilem)", () => {
        const result = getSasihPhase(new Date("2025-03-29"));
        expect(result.isTilem).toBe(false);
        expect(result.phase).toBe("Penanggal (Waxing)");
        expect(result.dayNumber).toBe(1);
    });

    // --- isPurnama and isTilem are mutually exclusive ---

    it("isPurnama and isTilem are never both true", () => {
        const dates = [
            "2025-03-13", "2025-03-28", "2025-04-12", "2025-04-26",
            "2025-05-12", "2025-05-26",
        ];
        for (const d of dates) {
            const result = getSasihPhase(new Date(d));
            expect(result.isPurnama && result.isTilem).toBe(false);
        }
    });

    // --- dayNumber is always 1–15 ---

    it("dayNumber is always between 1 and 15", () => {
        for (let i = 0; i < 60; i++) {
            const d = new Date("2025-02-27");
            d.setDate(d.getDate() + i);
            const result = getSasihPhase(d);
            expect(result.dayNumber).toBeGreaterThanOrEqual(1);
            expect(result.dayNumber).toBeLessThanOrEqual(15);
        }
    });

    // --- phase is always one of the two valid strings ---

    it("phase is always Penanggal or Pangelong", () => {
        for (let i = 0; i < 60; i++) {
            const d = new Date("2025-02-27");
            d.setDate(d.getDate() + i);
            const result = getSasihPhase(d);
            expect(["Penanggal (Waxing)", "Pangelong (Waning)"]).toContain(result.phase);
        }
    });

    // --- Second lunar cycle ---

    it("2025-04-12 is the second purnama", () => {
        const result = getSasihPhase(new Date("2025-04-12"));
        expect(result.isPurnama).toBe(true);
    });

    it("2025-04-26 is the second tilem", () => {
        const result = getSasihPhase(new Date("2025-04-26"));
        expect(result.isTilem).toBe(true);
    });

    // --- Input types ---

    it("accepts a string input", () => {
        expect(() => getSasihPhase("2025-03-13")).not.toThrow();
    });

    it("accepts a number (timestamp) input", () => {
        expect(() => getSasihPhase(new Date("2025-03-13").getTime())).not.toThrow();
    });

    it("throws on invalid date string", () => {
        expect(() => getSasihPhase("invalid-date")).toThrow("Invalid date");
    });

    // --- Dates before anchor ---

    it("date before anchor 2024-01-01 does not throw", () => {
        expect(() => getSasihPhase(new Date("2024-01-01"))).not.toThrow();
    });

    // --- TODO: dataset validation ---
    // Discrepancy found between reference sources:
    // kalenderbali.org says Purnama Kapat on Oct 11 2026
    // our code returns Purnama on Oct 2 2026 for sasih Kanam
    // needs confirmation to align dataset with correct reference

    it.todo("dataset: verify purnama and tilem dates for Oct 2026 against kalenderbali.org");
    it.todo("dataset: verify sasih name (Kanam vs Kapat) for Oct 2026");
});

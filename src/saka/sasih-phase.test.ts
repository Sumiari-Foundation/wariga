import { describe, it, expect } from "bun:test";
import { getSasihPhase } from "./sasih-phase";
import dataset from "../../data/saka-dataset.json";

describe("getSasihPhase", () => {

    // --- Dataset validation ---
    // Source: kalenderbali.com (I Wayan Nuarsa, Universitas Udayana)

    for (const entry of dataset.entries) {
        it(`${entry.date} is ${entry.phase} ${entry.dayNumber}`, () => {
            const result = getSasihPhase(new Date(entry.date));
            expect(result.phase).toBe(entry.phase);
            expect(result.dayNumber).toBe(entry.dayNumber);
        });
    }

    for (const entry of dataset.entries.filter((e: any) => e.isPurnama)) {
        it(`${entry.date} is purnama`, () => {
            expect(getSasihPhase(new Date(entry.date)).isPurnama).toBe(true);
        });
    }

    for (const entry of dataset.entries.filter((e: any) => e.isTilem)) {
        it(`${entry.date} is tilem`, () => {
            expect(getSasihPhase(new Date(entry.date)).isTilem).toBe(true);
        });
    }

    // --- Unique edge cases ---

    // Return shape
    it("returns the correct shape", () => {
        const result = getSasihPhase(new Date("2025-02-27"));
        expect(result).toHaveProperty("phase");
        expect(result).toHaveProperty("dayNumber");
        expect(result).toHaveProperty("isPurnama");
        expect(result).toHaveProperty("isTilem");
    });

    // isPurnama and isTilem are mutually exclusive
    it("isPurnama and isTilem are never both true", () => {
        for (let i = 0; i < 60; i++) {
            const d = new Date("2025-02-27");
            d.setDate(d.getDate() + i);
            const result = getSasihPhase(d);
            expect(result.isPurnama && result.isTilem).toBe(false);
        }
    });

    // dayNumber always 1–15
    it("dayNumber is always between 1 and 15", () => {
        for (let i = 0; i < 60; i++) {
            const d = new Date("2025-02-27");
            d.setDate(d.getDate() + i);
            const result = getSasihPhase(d);
            expect(result.dayNumber).toBeGreaterThanOrEqual(1);
            expect(result.dayNumber).toBeLessThanOrEqual(15);
        }
    });

    // phase is always one of two valid strings
    it("phase is always Penanggal or Pangelong", () => {
        for (let i = 0; i < 60; i++) {
            const d = new Date("2025-02-27");
            d.setDate(d.getDate() + i);
            const result = getSasihPhase(d);
            expect(["Penanggal (Waxing)", "Pangelong (Waning)"]).toContain(result.phase);
        }
    });

    // Input types
    it("accepts a string input", () => {
        expect(() => getSasihPhase("2025-02-27")).not.toThrow();
    });

    it("throws on invalid date string", () => {
        expect(() => getSasihPhase("invalid-date")).toThrow("Invalid date");
    });

    it("date before anchor 2024-01-01 does not throw", () => {
        expect(() => getSasihPhase(new Date("2024-01-01"))).not.toThrow();
    });
});

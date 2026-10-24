import { describe, it, expect } from "bun:test";
import { getSasihPhase } from "./sasih-phase";
import dataset from "../../data/saka-dataset.json";
import negativeDataset from "../../data/saka-dataset-negative.json";

describe("getSasihPhase", () => {

    // --- Positive dataset validation ---
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

    // --- Negative dataset validation ---

    for (const entry of negativeDataset.entries) {
        it(`${entry.date} is NOT ${entry.phase} ${entry.dayNumber}`, () => {
            const result = getSasihPhase(new Date(entry.date));
            const bothWrong = result.phase === entry.phase && result.dayNumber === entry.dayNumber;
            expect(bothWrong).toBe(false);
        });
    }

    // --- Unique edge cases ---

    it("returns the correct shape", () => {
        const result = getSasihPhase(new Date("2025-02-27"));
        expect(result).toHaveProperty("phase");
        expect(result).toHaveProperty("dayNumber");
        expect(result).toHaveProperty("isPurnama");
        expect(result).toHaveProperty("isTilem");
    });

    it("isPurnama and isTilem are never both true", () => {
        for (let i = 0; i < 60; i++) {
            const d = new Date("2025-02-27");
            d.setDate(d.getDate() + i);
            const result = getSasihPhase(d);
            expect(result.isPurnama && result.isTilem).toBe(false);
        }
    });

    it("dayNumber is always between 1 and 15", () => {
        for (let i = 0; i < 60; i++) {
            const d = new Date("2025-02-27");
            d.setDate(d.getDate() + i);
            const result = getSasihPhase(d);
            expect(result.dayNumber).toBeGreaterThanOrEqual(1);
            expect(result.dayNumber).toBeLessThanOrEqual(15);
        }
    });

    it("phase is always Penanggal or Pangelong", () => {
        for (let i = 0; i < 60; i++) {
            const d = new Date("2025-02-27");
            d.setDate(d.getDate() + i);
            const result = getSasihPhase(d);
            expect(["Penanggal (Waxing)", "Pangelong (Waning)"]).toContain(result.phase);
        }
    });

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

import { describe, it, expect } from "bun:test";
import { getSasihName } from "./sasih-name";
import dataset from "../../data/saka-dataset.json";

describe("getSasihName", () => {

    // --- Dataset validation ---
    // Source: kalenderbali.com (I Wayan Nuarsa, Universitas Udayana)

    for (const entry of dataset.entries) {
        it(`${entry.date} is ${entry.sasih}`, () => {
            expect(getSasihName(new Date(entry.date)).sasihName.toLowerCase()).toBe(entry.sasih);
        });
    }

    // --- Unique edge cases ---

    // Return shape
    it("returns the correct shape", () => {
        const result = getSasihName(new Date("2025-02-27"));
        expect(result).toHaveProperty("monthNumber");
        expect(result).toHaveProperty("sasihName");
        expect(result).toHaveProperty("isLeapMonth");
    });

    // Leap month prefix
    it("sasihName is prefixed with 'Mala' when isLeapMonth is true", () => {
        for (let i = 0; i < 365 * 3; i++) {
            const d = new Date("2025-02-27");
            d.setDate(d.getDate() + i);
            const result = getSasihName(d);
            if (result.isLeapMonth) {
                expect(result.sasihName.startsWith("Mala ")).toBe(true);
                return;
            }
        }
    });

    it("sasihName does not start with 'Mala' when isLeapMonth is false", () => {
        for (let i = 0; i < 60; i++) {
            const d = new Date("2025-04-01");
            d.setDate(d.getDate() + i);
            const result = getSasihName(d);
            if (!result.isLeapMonth) {
                expect(result.sasihName.startsWith("Mala ")).toBe(false);
            }
        }
    });

    // monthNumber always 1–12
    it("monthNumber is always between 1 and 12", () => {
        for (let i = 0; i < 365; i++) {
            const d = new Date("2025-02-27");
            d.setDate(d.getDate() + i);
            const result = getSasihName(d);
            expect(result.monthNumber).toBeGreaterThanOrEqual(1);
            expect(result.monthNumber).toBeLessThanOrEqual(12);
        }
    });

    // Input types
    it("accepts a string input", () => {
        expect(() => getSasihName("2025-02-27")).not.toThrow();
    });

    it("throws on invalid date string", () => {
        expect(() => getSasihName("invalid-date")).toThrow("Invalid date");
    });

    it("date before anchor 2024-01-01 does not throw", () => {
        expect(() => getSasihName(new Date("2024-01-01"))).not.toThrow();
    });
});

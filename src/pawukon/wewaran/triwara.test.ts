import { describe, it, expect } from "bun:test";
import { getTriwara } from "./triwara";
import dataset from "../../../data/wewaran-dataset.json";

describe("getTriwara", () => {

    // --- Dataset validation ---
    // Source: balinese-date-js-lib v0.4.3 (github.com/peradnya/balinese-date-js-lib)
    // References: babadbali.com, kalenderbali.org, kalenderbali.info

    for (const entry of dataset.entries) {
        it(`${entry.date} is ${entry.triwara}`, () => {
            expect(getTriwara(new Date(entry.date)).name).toBe(entry.triwara);
        });
    }

    // --- Edge cases ---

    it("completes a full 3-day cycle starting from anchor", () => {
        const expected = ["pasah", "beteng", "kajeng"];
        for (let i = 0; i < 3; i++) {
            const date = new Date("2025-02-09");
            date.setDate(date.getDate() + i);
            expect(getTriwara(date).name).toBe(expected[i]);
        }
    });

    it("day 209 (2025-09-06) is kajeng — last day of the 210-day cycle", () => {
        expect(getTriwara(new Date("2025-09-06")).name).toBe("kajeng");
    });

    it("day 210 (2025-09-07) wraps back to pasah", () => {
        expect(getTriwara(new Date("2025-09-07")).name).toBe("pasah");
    });

    it("1 day before anchor (2025-02-08) is kajeng — effective day 209", () => {
        expect(getTriwara(new Date("2025-02-08")).name).toBe("kajeng");
    });

    it("throws on invalid date", () => {
        expect(() => getTriwara("invalid-date")).toThrow("Invalid date");
    });
});

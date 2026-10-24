import { describe, it, expect } from "bun:test";
import { getSangawara } from "./sangawara";
import dataset from "../../../data/wewaran-dataset.json";
import negativeDataset from "../../../data/wewaran-dataset-negative.json";

describe("getSangawara", () => {

    // --- Dataset validation ---
    // Source: balinese-date-js-lib v0.4.3 (github.com/peradnya/balinese-date-js-lib)
    // References: babadbali.com, kalenderbali.org, kalenderbali.info

    for (const entry of dataset.entries) {
        it(`${entry.date} is ${entry.sangawara}`, () => {
            expect(getSangawara(new Date(entry.date)).name).toBe(entry.sangawara);
        });
    }

    for (const entry of negativeDataset.entries) {
        it(`${entry.date} is NOT ${entry.sangawara}`, () => {
            expect(getSangawara(new Date(entry.date)).name).not.toBe(entry.sangawara);
        });
    }

    // --- Edge cases ---
    // Days 0–3 are locked to dangu (index 0) — special rule in source code

    it("days 0–3 from anchor are always dangu", () => {
        for (let i = 0; i <= 3; i++) {
            const date = new Date("2025-02-09");
            date.setDate(date.getDate() + i);
            expect(getSangawara(date).name).toBe("dangu");
        }
    });

    it("day 4 (2025-02-13) starts normal 9-day cycle: jangur", () => {
        expect(getSangawara(new Date("2025-02-13")).name).toBe("jangur");
    });

    it("day 12 (2025-02-21) wraps back to dangu — (12-3)%9 = 0", () => {
        expect(getSangawara(new Date("2025-02-21")).name).toBe("dangu");
    });

    it("1 day before anchor (2025-02-08) does not throw", () => {
        expect(() => getSangawara(new Date("2025-02-08"))).not.toThrow();
    });

    it("throws on invalid date", () => {
        expect(() => getSangawara("invalid-date")).toThrow("Invalid date");
    });
});

import { describe, it, expect } from "bun:test";
import { getSangawara } from "./sangawara";

describe("getSangawara", () => {

    // --- Anchor date ---

    it("anchor date 2025-02-09 (day 0) is dangu", () => {
        expect(getSangawara(new Date("2025-02-09")).name).toBe("dangu");
    });

    // --- Special case: days 0–3 are always dangu ---
    // Source code locks index to 0 for the first 3 days

    it("day 1 (2025-02-10) is still dangu", () => {
        expect(getSangawara(new Date("2025-02-10")).name).toBe("dangu");
    });

    it("day 3 (2025-02-12) is still dangu", () => {
        expect(getSangawara(new Date("2025-02-12")).name).toBe("dangu");
    });

    // --- Normal 9-day cycle starts at day 4 ---

    it("day 4 (2025-02-13) starts normal cycle: jangur (index (4-3)%9 = 1)", () => {
        expect(getSangawara(new Date("2025-02-13")).name).toBe("jangur");
    });

    it("day 5 (2025-02-14) is gigis (index 2)", () => {
        expect(getSangawara(new Date("2025-02-14")).name).toBe("gigis");
    });

    it("day 12 (2025-02-21) wraps back to dangu — (12-3)%9 = 0", () => {
        expect(getSangawara(new Date("2025-02-21")).name).toBe("dangu");
    });

    // --- Urip values ---

    it("jangur has urip 8", () => {
        expect(getSangawara(new Date("2025-02-13")).urip).toBe(8);
    });

    // --- 210-day cycle boundary ---

    it("day 209 (2025-09-06) does not throw", () => {
        expect(() => getSangawara(new Date("2025-09-06"))).not.toThrow();
    });

    it("day 210 (2025-09-07) does not throw", () => {
        expect(() => getSangawara(new Date("2025-09-07"))).not.toThrow();
    });

    // --- Dates before anchor ---

    it("1 day before anchor (2025-02-08) does not throw", () => {
        expect(() => getSangawara(new Date("2025-02-08"))).not.toThrow();
    });

    // --- Input types ---

    it("throws on invalid date string", () => {
        expect(() => getSangawara("invalid-date")).toThrow("Invalid date");
    });
});

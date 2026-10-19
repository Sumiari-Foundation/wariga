import { describe, it, expect } from "bun:test";
import { getEkawara } from "./ekawara";

describe("getEkawara", () => {

    // getEkawara takes uripSum, not a date
    // EKAWARA has only 1 element at index 0 (luang)
    // even uripSum (% 2 = 0) → luang, odd (% 2 = 1) → undefined (no ekawara)

    // --- Basic cases ---

    it("even uripSum 14 → luang", () => {
        expect(getEkawara(14)?.name).toBe("luang");
    });

    it("odd uripSum 13 → undefined (no ekawara on this day)", () => {
        expect(getEkawara(13)).toBeUndefined();
    });

    it("uripSum 0 → luang", () => {
        expect(getEkawara(0)?.name).toBe("luang");
    });

    it("uripSum 1 → undefined", () => {
        expect(getEkawara(1)).toBeUndefined();
    });

    // --- Urip values ---

    it("luang has urip 1", () => {
        expect(getEkawara(0)?.urip).toBe(1);
    });

    // --- Real-world example: anchor date redite (urip 5) + paing (urip 9) = 14 ---

    it("anchor date: redite (5) + paing (9) = 14 → even → luang", () => {
        expect(getEkawara(14)?.name).toBe("luang");
    });

    // --- Negative input ---
    // In JS, -1 % 2 = -1 (not 1). Must be handled with positive modulo.

    it("negative uripSum -2 → even → luang", () => {
        expect(getEkawara(-2)?.name).toBe("luang");
    });

    it("negative uripSum -1 → odd → undefined", () => {
        expect(getEkawara(-1)).toBeUndefined();
    });
});

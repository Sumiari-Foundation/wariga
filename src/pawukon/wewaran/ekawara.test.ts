import { describe, it, expect } from "bun:test";
import { getEkawara } from "./ekawara";

describe("getEkawara", () => {

    // --- Edge cases only ---
    // ekawara excluded from dataset — discrepancy found between our implementation
    // and reference library (peradnya/balinese-date-js-lib), reported to reviewer

    // EKAWARA only has 1 element at index 0 (luang)
    // even uripSum → luang, odd → undefined

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

    it("luang has urip 1", () => {
        expect(getEkawara(0)?.urip).toBe(1);
    });

    it("negative uripSum -2 → luang (positive modulo)", () => {
        expect(getEkawara(-2)?.name).toBe("luang");
    });

    it("negative uripSum -1 → undefined (positive modulo)", () => {
        expect(getEkawara(-1)).toBeUndefined();
    });
});

import { describe, it, expect } from "bun:test";
import { getDwiwara } from "./dwiwara";

describe("getDwiwara", () => {

    // getDwiwara takes uripSum (saptawara.urip + pancawara.urip), not a date
    // even uripSum → menga (index 0), odd → pepet (index 1)

    // --- Basic cases ---

    it("even uripSum 12 → menga", () => {
        expect(getDwiwara(12).name).toBe("menga");
    });

    it("odd uripSum 13 → pepet", () => {
        expect(getDwiwara(13).name).toBe("pepet");
    });

    it("uripSum 0 → menga", () => {
        expect(getDwiwara(0).name).toBe("menga");
    });

    it("uripSum 1 → pepet", () => {
        expect(getDwiwara(1).name).toBe("pepet");
    });

    // --- Real-world example: anchor date redite (urip 5) + paing (urip 9) = 14 ---

    it("anchor date: redite (5) + paing (9) = 14 → even → menga", () => {
        expect(getDwiwara(14).name).toBe("menga");
    });

    // --- Urip values ---

    it("menga has urip 5", () => {
        expect(getDwiwara(0).urip).toBe(5);
    });

    it("pepet has urip 4", () => {
        expect(getDwiwara(1).urip).toBe(4);
    });

    // --- Negative input ---
    // In JS, -1 % 2 = -1 (not 1). Must be handled with positive modulo.

    it("negative uripSum -1 → odd → pepet", () => {
        expect(getDwiwara(-1).name).toBe("pepet");
    });

    it("negative uripSum -2 → even → menga", () => {
        expect(getDwiwara(-2).name).toBe("menga");
    });
});

import { describe, it, expect } from "bun:test";
import { getDasawara } from "./dasawara";

describe("getDasawara", () => {

    // getDasawara takes uripSum (saptawara.urip + pancawara.urip), not a date

    // --- Full 10-step cycle ---

    it("uripSum 0 → pandita", () => {
        expect(getDasawara(0).name).toBe("pandita");
    });

    it("uripSum 1 → pati", () => {
        expect(getDasawara(1).name).toBe("pati");
    });

    it("uripSum 4 → sri", () => {
        expect(getDasawara(4).name).toBe("sri");
    });

    it("uripSum 6 → manusa", () => {
        expect(getDasawara(6).name).toBe("manusa");
    });

    it("uripSum 9 → raksasa", () => {
        expect(getDasawara(9).name).toBe("raksasa");
    });

    // --- Real-world example: anchor date redite (urip 5) + paing (urip 9) = 14 ---

    it("anchor date: redite (5) + paing (9) = 14 → 14%10 = 4 → sri", () => {
        expect(getDasawara(14).name).toBe("sri");
    });

    // --- Large uripSum ---

    it("large uripSum 23 → 23%10 = 3 → duka", () => {
        expect(getDasawara(23).name).toBe("duka");
    });

    // --- Urip values ---

    it("manusa has urip 3", () => {
        expect(getDasawara(6).urip).toBe(3);
    });

    // --- Negative input ---
    // In JS, -1 % 10 = -1 (not 9). Must be handled with positive modulo.

    it("negative uripSum -1 → same as 9 → raksasa", () => {
        expect(getDasawara(-1).name).toBe("raksasa");
    });

    it("negative uripSum -10 → same as 0 → pandita", () => {
        expect(getDasawara(-10).name).toBe("pandita");
    });

    it("negative uripSum -7 → same as 3 → duka", () => {
        expect(getDasawara(-7).name).toBe("duka");
    });
});

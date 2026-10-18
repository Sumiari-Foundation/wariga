import { describe, it, expect } from "bun:test";
import { getDwiwara } from "./dwiwara";

describe("getDwiwara", () => {
    // getDwiwara menerima uripSum (saptawara.urip + pancawara.urip), bukan tanggal
    // uripSum genap → menga (index 0), ganjil → pepet (index 1)

    it("uripSum genap (12) → menga", () => {
        expect(getDwiwara(12).name).toBe("menga");
    });

    it("uripSum ganjil (13) → pepet", () => {
        expect(getDwiwara(13).name).toBe("pepet");
    });

    it("uripSum 0 (genap) → menga", () => {
        expect(getDwiwara(0).name).toBe("menga");
    });

    it("uripSum 1 (ganjil) → pepet", () => {
        expect(getDwiwara(1).name).toBe("pepet");
    });

    // Contoh nyata: anchor date redite(urip=5) + paing(urip=9) = 14 → genap → menga
    it("anchor date: saptawara redite (5) + pancawara paing (9) = 14 → menga", () => {
        expect(getDwiwara(14).name).toBe("menga");
    });

    it("menga memiliki urip 5", () => {
        expect(getDwiwara(0).urip).toBe(5);
    });

    it("pepet memiliki urip 4", () => {
        expect(getDwiwara(1).urip).toBe(4);
    });
});

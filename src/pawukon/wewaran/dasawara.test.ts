import { describe, it, expect } from "bun:test";
import { getDasawara } from "./dasawara";

describe("getDasawara", () => {
    // getDasawara menerima uripSum (saptawara.urip + pancawara.urip), bukan tanggal
    // uripSum % 10 → index 0-9

    it("uripSum % 10 = 0 → pandita", () => {
        expect(getDasawara(0).name).toBe("pandita");
    });

    it("uripSum % 10 = 1 → pati", () => {
        expect(getDasawara(1).name).toBe("pati");
    });

    it("uripSum % 10 = 4 → sri", () => {
        expect(getDasawara(4).name).toBe("sri");
    });

    it("uripSum % 10 = 6 → manusa", () => {
        expect(getDasawara(6).name).toBe("manusa");
    });

    it("uripSum % 10 = 9 → raksasa", () => {
        expect(getDasawara(9).name).toBe("raksasa");
    });

    // Contoh nyata: anchor date redite(urip=5) + paing(urip=9) = 14 → 14%10 = 4 → sri
    it("anchor date: redite (5) + paing (9) = 14 → 14%10 = 4 → sri", () => {
        expect(getDasawara(14).name).toBe("sri");
    });

    it("uripSum besar: 23 → 23%10 = 3 → duka", () => {
        expect(getDasawara(23).name).toBe("duka");
    });

    it("mengembalikan urip yang benar untuk manusa (3)", () => {
        expect(getDasawara(6).urip).toBe(3);
    });

    it("melempar error untuk index di luar jangkauan tidak terjadi (array punya 10 elemen)", () => {
        // Modulo 10 selalu menghasilkan 0-9, jadi ini aman
        expect(() => getDasawara(100)).not.toThrow();
    });
});

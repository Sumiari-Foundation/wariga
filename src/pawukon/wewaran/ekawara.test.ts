import { describe, it, expect } from "bun:test";
import { getEkawara } from "./ekawara";

describe("getEkawara", () => {
    // getEkawara menerima uripSum, bukan tanggal
    // EKAWARA hanya punya 1 elemen di index 0 (luang)
    // uripSum genap (% 2 = 0) → luang, uripSum ganjil (% 2 = 1) → undefined

    it("uripSum genap (14) → luang", () => {
        expect(getEkawara(14)?.name).toBe("luang");
    });

    it("uripSum ganjil (13) → undefined (tidak ada ekawara)", () => {
        expect(getEkawara(13)).toBeUndefined();
    });

    it("uripSum 0 → luang", () => {
        expect(getEkawara(0)?.name).toBe("luang");
    });

    it("uripSum 1 → undefined", () => {
        expect(getEkawara(1)).toBeUndefined();
    });

    it("luang memiliki urip 1", () => {
        expect(getEkawara(0)?.urip).toBe(1);
    });

    // Contoh nyata: anchor date redite(urip=5) + paing(urip=9) = 14 (genap) → luang
    it("anchor date: redite (5) + paing (9) = 14 → luang", () => {
        expect(getEkawara(14)?.name).toBe("luang");
    });
});

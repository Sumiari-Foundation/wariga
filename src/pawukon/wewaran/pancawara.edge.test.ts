import { describe, it, expect } from "bun:test";
import { getPancawara } from "./pancawara";

describe("getPancawara — edge cases", () => {

    // --- LEAP YEAR ---

    it("leap day setelah anchor: 2028-02-29 (effective days 65) → 65%5=0 → paing", () => {
        expect(getPancawara(new Date("2028-02-29")).name).toBe("paing");
    });

    it("sehari setelah leap day 2028 tetap konsisten: 2028-03-01 → 66%5=1 → pon", () => {
        expect(getPancawara(new Date("2028-03-01")).name).toBe("pon");
    });

    it("leap day sebelum anchor: 2024-02-29 (effective days 74) → 74%5=4 → umanis", () => {
        expect(getPancawara(new Date("2024-02-29")).name).toBe("umanis");
    });

    // --- TANGGAL SEBELUM ANCHOR ---

    it("1 hari sebelum anchor (2025-02-08) → effective days 209 → 209%5=4 → umanis", () => {
        expect(getPancawara(new Date("2025-02-08")).name).toBe("umanis");
    });

    it("jauh sebelum anchor: 2020-01-01 tidak melempar error", () => {
        expect(() => getPancawara(new Date("2020-01-01"))).not.toThrow();
    });

    // --- BOUNDARY 210 HARI ---
    // Siklus pawukon 210 hari = tepat 42 siklus pancawara (210/5=42), jadi wrap selalu bersih.

    it("hari ke-209 (2025-09-06) → 209%5=4 → umanis", () => {
        expect(getPancawara(new Date("2025-09-06")).name).toBe("umanis");
    });

    it("hari ke-210 (2025-09-07, wrap) → 210%5=0 → paing (kembali ke awal)", () => {
        expect(getPancawara(new Date("2025-09-07")).name).toBe("paing");
    });

    // --- URIP SUM (dipakai dwiwara, ekawara, dasawara) ---
    // Pastikan urip yang dikembalikan konsisten — ini yang dipakai kalkulasi turunan.

    it("kliwon memiliki urip 8 — dipakai untuk kalkulasi dwiwara/ekawara/dasawara", () => {
        // Hari ke-3 dari anchor = kliwon
        expect(getPancawara(new Date("2025-02-12")).urip).toBe(8);
    });

    it("paing memiliki urip 9", () => {
        expect(getPancawara(new Date("2025-02-09")).urip).toBe(9);
    });

    // --- TIMEZONE ---

    it("midnight WITA pada anchor date (2025-02-09T00:00:00+08:00) → jatuh ke hari -1 → umanis", () => {
        const midnightWITA = new Date("2025-02-09T00:00:00+08:00");
        expect(getPancawara(midnightWITA).name).toBe("umanis");
    });

    it("siang WITA pada anchor date (2025-02-09T12:00:00+08:00) → hari ke-0 → paing", () => {
        const noonWITA = new Date("2025-02-09T12:00:00+08:00");
        expect(getPancawara(noonWITA).name).toBe("paing");
    });
});

import { describe, it, expect } from "bun:test";
import { getSaptawara } from "./saptawara";

describe("getSaptawara — edge cases", () => {

    // --- LEAP YEAR ---
    // 29 Feb hanya ada setiap 4 tahun. Kalkulasi harus tetap benar.

    it("leap day setelah anchor: 2028-02-29 (hari ke-1115 dari anchor) → index 1115%7=2 → anggara", () => {
        // 1115 % 7 = 2 → anggara
        expect(getSaptawara(new Date("2028-02-29")).name).toBe("anggara");
    });

    it("30 Jan setelah leap day 2028 tetap konsisten: 2028-03-01", () => {
        // 1115 (29 Feb) + 1 = 1116 → 1116%7 = 3 → buda
        expect(getSaptawara(new Date("2028-03-01")).name).toBe("buda");
    });

    it("leap day sebelum anchor: 2024-02-29 (effective days 74) → 74%7=4 → wraspati", () => {
        // Tanggal sebelum anchor diwrap balik: effective = 210 + (negative % 210)
        // effective = 74 → 74%7 = 4 → wraspati
        expect(getSaptawara(new Date("2024-02-29")).name).toBe("wraspati");
    });

    // --- TANGGAL SEBELUM ANCHOR ---
    // Library harus tetap bekerja untuk tanggal historis, tidak boleh error.

    it("1 hari sebelum anchor (2025-02-08) → effective days 209 → 209%7=6 → saniscara", () => {
        expect(getSaptawara(new Date("2025-02-08")).name).toBe("saniscara");
    });

    it("jauh sebelum anchor: 2020-01-01 tidak melempar error", () => {
        expect(() => getSaptawara(new Date("2020-01-01"))).not.toThrow();
    });

    // --- BOUNDARY 210 HARI (satu siklus pawukon penuh) ---
    // Hari ke-209 adalah hari terakhir siklus, hari ke-210 harus wrap kembali ke 0.

    it("hari ke-209 (2025-09-06, tepat sebelum wrap) → 209%7=6 → saniscara", () => {
        expect(getSaptawara(new Date("2025-09-06")).name).toBe("saniscara");
    });

    it("hari ke-210 (2025-09-07, wrap ke siklus baru) → 210%7=0 → redite", () => {
        expect(getSaptawara(new Date("2025-09-07")).name).toBe("redite");
    });

    it("hari ke-211 tetap konsisten setelah wrap → 211%7=1 → soma", () => {
        expect(getSaptawara(new Date("2025-09-08")).name).toBe("soma");
    });

    // --- TIMEZONE ---
    // Input Date dibuat dari string ISO dengan timezone eksplisit.
    // Bali ada di WITA (UTC+8). Tengah malam WITA = 16:00 UTC hari sebelumnya.
    // Library pakai getTime() (epoch ms) jadi timezone input mempengaruhi hasil.

    it("midnight WITA (UTC+8) pada anchor date tetap dihitung sebagai hari yang sama", () => {
        // 2025-02-09T00:00:00+08:00 = 2025-02-08T16:00:00Z
        // Selisih dari anchor (2025-02-09T00:00:00Z) = -8 jam = masih hari -1
        // Artinya jatuh ke effective day 209 → saniscara
        const midnightWITA = new Date("2025-02-09T00:00:00+08:00");
        expect(getSaptawara(midnightWITA).name).toBe("saniscara");
    });

    it("siang hari WITA (12:00+08:00) pada anchor date = UTC 04:00 → hari yang benar → redite", () => {
        // 2025-02-09T12:00:00+08:00 = 2025-02-09T04:00:00Z → masih hari ke-0
        const noonWITA = new Date("2025-02-09T12:00:00+08:00");
        expect(getSaptawara(noonWITA).name).toBe("redite");
    });
});

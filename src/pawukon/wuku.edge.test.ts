import { describe, it, expect } from "bun:test";
import { getWuku } from "./wuku";

describe("getWuku — edge cases", () => {

    // --- LEAP YEAR ---
    // Wuku berganti tiap 7 hari: floor(daysSince / 7) % 30
    // Leap day menambah 1 hari ke hitungan, tapi tidak mengubah pola
    // selama integer division-nya konsisten.

    it("leap day setelah anchor: 2028-02-29 (effective days 65) → floor(65/7)%30=9 → sungsang", () => {
        expect(getWuku(new Date("2028-02-29")).name).toBe("sungsang");
    });

    it("sehari setelah leap day 2028 (2028-03-01, hari ke-66) → floor(66/7)%30=9 → sungsang (wuku belum ganti)", () => {
        expect(getWuku(new Date("2028-03-01")).name).toBe("sungsang");
    });

    it("leap day sebelum anchor: 2024-02-29 (effective days 74) → floor(74/7)%30=10 → dungulan", () => {
        expect(getWuku(new Date("2024-02-29")).name).toBe("dungulan");
    });

    // --- TANGGAL SEBELUM ANCHOR ---

    it("1 hari sebelum anchor (2025-02-08) → effective days 209 → floor(209/7)%30=29 → watugunung", () => {
        expect(getWuku(new Date("2025-02-08")).name).toBe("watugunung");
    });

    it("jauh sebelum anchor: 2020-01-01 tidak melempar error", () => {
        expect(() => getWuku(new Date("2020-01-01"))).not.toThrow();
    });

    // --- BOUNDARY 210 HARI ---
    // 30 wuku × 7 hari = 210 hari tepat. Hari ke-210 harus kembali ke wuku sinta.

    it("hari ke-203 (2025-08-31) → floor(203/7)%30=29 → watugunung (wuku terakhir)", () => {
        expect(getWuku(new Date("2025-08-31")).name).toBe("watugunung");
    });

    it("hari ke-206 (2025-09-03) masih watugunung (belum 7 hari penuh)", () => {
        // floor(206/7) = 29 → watugunung
        expect(getWuku(new Date("2025-09-03")).name).toBe("watugunung");
    });

    it("hari ke-209 (2025-09-06) masih watugunung", () => {
        // floor(209/7) = 29 → watugunung
        expect(getWuku(new Date("2025-09-06")).name).toBe("watugunung");
    });

    it("hari ke-210 (2025-09-07) wrap kembali ke sinta", () => {
        // effective days → 0 → floor(0/7)%30 = 0 → sinta
        expect(getWuku(new Date("2025-09-07")).name).toBe("sinta");
    });

    // --- HARI PERTAMA DAN TERAKHIR TIAP WUKU ---
    // Wuku ganti tepat di hari ke-7, ke-14, dst. Tes batas hari pertama/terakhir.

    it("hari terakhir wuku sinta (hari ke-6, 2025-02-15) masih sinta", () => {
        expect(getWuku(new Date("2025-02-15")).name).toBe("sinta");
    });

    it("hari pertama wuku landep (hari ke-7, 2025-02-16) sudah landep", () => {
        expect(getWuku(new Date("2025-02-16")).name).toBe("landep");
    });

    it("hari terakhir wuku watugunung (hari ke-209) masih watugunung", () => {
        expect(getWuku(new Date("2025-09-06")).name).toBe("watugunung");
    });

    it("hari pertama wuku sinta berikutnya (hari ke-210) sudah sinta", () => {
        expect(getWuku(new Date("2025-09-07")).name).toBe("sinta");
    });
});

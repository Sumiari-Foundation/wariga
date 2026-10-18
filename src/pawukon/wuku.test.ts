import { describe, it, expect } from "bun:test";
import { getWuku } from "./wuku";

describe("getWuku", () => {
    // Anchor date = 2025-02-09 = hari 0 = wuku sinta (index 0)
    // Wuku berganti setiap 7 hari: floor(daysSince / 7) % 30

    it("anchor date 2025-02-09 adalah sinta", () => {
        expect(getWuku(new Date("2025-02-09")).name).toBe("sinta");
    });

    it("hari ke-6 masih sinta (belum ganti wuku)", () => {
        expect(getWuku(new Date("2025-02-15")).name).toBe("sinta");
    });

    it("hari ke-7 (2025-02-16) ganti ke landep", () => {
        expect(getWuku(new Date("2025-02-16")).name).toBe("landep");
    });

    it("hari ke-13 masih landep", () => {
        expect(getWuku(new Date("2025-02-22")).name).toBe("landep");
    });

    it("hari ke-14 (2025-02-23) ganti ke ukir", () => {
        expect(getWuku(new Date("2025-02-23")).name).toBe("ukir");
    });

    it("hari ke-182 (2025-08-10) adalah wayang (wuku ke-26)", () => {
        expect(getWuku(new Date("2025-08-10")).name).toBe("wayang");
    });

    it("hari ke-189 (2025-08-17) adalah klawu (wuku ke-27)", () => {
        expect(getWuku(new Date("2025-08-17")).name).toBe("klawu");
    });

    it("hari ke-210 kembali ke sinta (satu putaran penuh 30 wuku × 7 hari)", () => {
        expect(getWuku(new Date("2025-09-07")).name).toBe("sinta");
    });

    it("menerima input string", () => {
        expect(getWuku("2025-02-09").name).toBe("sinta");
    });

    it("melempar error untuk tanggal tidak valid", () => {
        expect(() => getWuku("invalid-date")).toThrow("Invalid date");
    });
});

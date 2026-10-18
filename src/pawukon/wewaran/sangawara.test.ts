import { describe, it, expect } from "bun:test";
import { getSangawara } from "./sangawara";

describe("getSangawara", () => {
    // 3 hari pertama (hari 0,1,2,3) selalu dangu (index 0) — logika khusus di source
    it("anchor date 2025-02-09 (hari 0) adalah dangu", () => {
        expect(getSangawara(new Date("2025-02-09")).name).toBe("dangu");
    });

    it("hari ke-1 (2025-02-10) masih dangu (dalam zona 3 hari pertama)", () => {
        expect(getSangawara(new Date("2025-02-10")).name).toBe("dangu");
    });

    it("hari ke-3 (2025-02-12) masih dangu", () => {
        expect(getSangawara(new Date("2025-02-12")).name).toBe("dangu");
    });

    it("hari ke-4 (2025-02-13) mulai siklus normal: jangur (index (4-3)%9 = 1)", () => {
        expect(getSangawara(new Date("2025-02-13")).name).toBe("jangur");
    });

    it("hari ke-5 (2025-02-14) adalah gigis (index 2)", () => {
        expect(getSangawara(new Date("2025-02-14")).name).toBe("gigis");
    });

    it("hari ke-12 (2025-02-21) kembali ke jangur setelah satu putaran (index (12-3)%9 = 0 → dangu)", () => {
        // (12-3) % 9 = 9 % 9 = 0 → dangu
        expect(getSangawara(new Date("2025-02-21")).name).toBe("dangu");
    });

    it("mengembalikan urip yang benar untuk jangur (8)", () => {
        expect(getSangawara(new Date("2025-02-13")).urip).toBe(8);
    });

    it("melempar error untuk tanggal tidak valid", () => {
        expect(() => getSangawara("invalid-date")).toThrow("Invalid date");
    });
});

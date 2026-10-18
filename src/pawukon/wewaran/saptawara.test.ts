import { describe, it, expect } from "bun:test";
import { getSaptawara } from "./saptawara";

describe("getSaptawara", () => {
    // Anchor date = hari 0 = redite (index 0)
    it("anchor date 2025-02-09 adalah redite", () => {
        expect(getSaptawara(new Date("2025-02-09")).name).toBe("redite");
    });

    it("hari ke-1 dari anchor (2025-02-10) adalah soma", () => {
        expect(getSaptawara(new Date("2025-02-10")).name).toBe("soma");
    });

    it("hari ke-6 dari anchor (2025-02-15) adalah saniscara", () => {
        expect(getSaptawara(new Date("2025-02-15")).name).toBe("saniscara");
    });

    it("hari ke-7 kembali ke redite (satu putaran penuh)", () => {
        expect(getSaptawara(new Date("2025-02-16")).name).toBe("redite");
    });

    it("mengembalikan urip yang benar untuk redite", () => {
        expect(getSaptawara(new Date("2025-02-09")).urip).toBe(5);
    });

    it("menerima input string", () => {
        expect(getSaptawara("2025-02-09").name).toBe("redite");
    });

    it("menerima input number (timestamp)", () => {
        expect(getSaptawara(new Date("2025-02-09").getTime()).name).toBe("redite");
    });

    it("melempar error untuk tanggal tidak valid", () => {
        expect(() => getSaptawara("invalid-date")).toThrow("Invalid date");
    });
});

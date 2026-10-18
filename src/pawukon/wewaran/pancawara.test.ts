import { describe, it, expect } from "bun:test";
import { getPancawara } from "./pancawara";

describe("getPancawara", () => {
    // Anchor date = hari 0 = paing (index 0)
    it("anchor date 2025-02-09 adalah paing", () => {
        expect(getPancawara(new Date("2025-02-09")).name).toBe("paing");
    });

    it("hari ke-1 (2025-02-10) adalah pon", () => {
        expect(getPancawara(new Date("2025-02-10")).name).toBe("pon");
    });

    it("hari ke-2 (2025-02-11) adalah wage", () => {
        expect(getPancawara(new Date("2025-02-11")).name).toBe("wage");
    });

    it("hari ke-3 (2025-02-12) adalah kliwon", () => {
        expect(getPancawara(new Date("2025-02-12")).name).toBe("kliwon");
    });

    it("hari ke-4 (2025-02-13) adalah umanis", () => {
        expect(getPancawara(new Date("2025-02-13")).name).toBe("umanis");
    });

    it("hari ke-5 kembali ke paing (satu putaran penuh)", () => {
        expect(getPancawara(new Date("2025-02-14")).name).toBe("paing");
    });

    it("mengembalikan urip yang benar untuk kliwon (8)", () => {
        expect(getPancawara(new Date("2025-02-12")).urip).toBe(8);
    });

    it("melempar error untuk tanggal tidak valid", () => {
        expect(() => getPancawara("invalid-date")).toThrow("Invalid date");
    });
});

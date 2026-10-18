import { describe, it, expect } from "bun:test";
import { getAstawara } from "./astawara";

describe("getAstawara", () => {
    // Anchor date = hari 0 = sri (index 0)
    it("anchor date 2025-02-09 adalah sri", () => {
        expect(getAstawara(new Date("2025-02-09")).name).toBe("sri");
    });

    it("hari ke-1 (2025-02-10) adalah indra", () => {
        expect(getAstawara(new Date("2025-02-10")).name).toBe("indra");
    });

    it("hari ke-7 (2025-02-16) adalah uma (index 7, siklus 0-7)", () => {
        expect(getAstawara(new Date("2025-02-16")).name).toBe("uma");
    });

    it("hari ke-8 kembali ke sri (satu putaran penuh sebelum offset)", () => {
        expect(getAstawara(new Date("2025-02-17")).name).toBe("sri");
    });

    // Offset +6 berlaku mulai hari ke-72 dari anchor date
    // Hari ke-72 = 2025-02-09 + 72 hari = 2025-04-22
    it("hari ke-72 (2025-04-22) mendapat offset +6: (72+6)%8 = 6 = kala", () => {
        expect(getAstawara(new Date("2025-04-22")).name).toBe("kala");
    });

    it("hari ke-71 (sebelum offset, 2025-04-21): 71%8 = 7 = uma", () => {
        expect(getAstawara(new Date("2025-04-21")).name).toBe("uma");
    });

    it("mengembalikan urip yang benar untuk uma (4)", () => {
        expect(getAstawara(new Date("2025-02-16")).urip).toBe(4);
    });

    it("melempar error untuk tanggal tidak valid", () => {
        expect(() => getAstawara("invalid-date")).toThrow("Invalid date");
    });
});

import { describe, it, expect } from "bun:test";
import { getSadwara } from "./sadwara";

describe("getSadwara", () => {
    // Anchor date = hari 0 = tungleh (index 0)
    it("anchor date 2025-02-09 adalah tungleh", () => {
        expect(getSadwara(new Date("2025-02-09")).name).toBe("tungleh");
    });

    it("hari ke-1 (2025-02-10) adalah aryang", () => {
        expect(getSadwara(new Date("2025-02-10")).name).toBe("aryang");
    });

    it("hari ke-5 (2025-02-14) adalah maulu", () => {
        expect(getSadwara(new Date("2025-02-14")).name).toBe("maulu");
    });

    it("hari ke-6 kembali ke tungleh (satu putaran penuh)", () => {
        expect(getSadwara(new Date("2025-02-15")).name).toBe("tungleh");
    });

    it("mengembalikan urip yang benar untuk was (9)", () => {
        expect(getSadwara(new Date("2025-02-13")).urip).toBe(9);
    });

    it("melempar error untuk tanggal tidak valid", () => {
        expect(() => getSadwara("invalid-date")).toThrow("Invalid date");
    });
});

import { describe, it, expect } from "bun:test";
import { getTriwara } from "./triwara";

describe("getTriwara", () => {
    // Anchor date = hari 0 = pasah (index 0)
    it("anchor date 2025-02-09 adalah pasah", () => {
        expect(getTriwara(new Date("2025-02-09")).name).toBe("pasah");
    });

    it("hari ke-1 (2025-02-10) adalah beteng", () => {
        expect(getTriwara(new Date("2025-02-10")).name).toBe("beteng");
    });

    it("hari ke-2 (2025-02-11) adalah kajeng", () => {
        expect(getTriwara(new Date("2025-02-11")).name).toBe("kajeng");
    });

    it("hari ke-3 kembali ke pasah (satu putaran penuh)", () => {
        expect(getTriwara(new Date("2025-02-12")).name).toBe("pasah");
    });

    it("mengembalikan urip yang benar untuk kajeng (7)", () => {
        expect(getTriwara(new Date("2025-02-11")).urip).toBe(7);
    });

    it("melempar error untuk tanggal tidak valid", () => {
        expect(() => getTriwara("invalid-date")).toThrow("Invalid date");
    });
});

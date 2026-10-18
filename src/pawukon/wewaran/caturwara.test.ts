import { describe, it, expect } from "bun:test";
import { getCaturwara } from "./caturwara";

describe("getCaturwara", () => {
    // Anchor date = hari 0 = sri (index 0)
    it("anchor date 2025-02-09 adalah sri", () => {
        expect(getCaturwara(new Date("2025-02-09")).name).toBe("sri");
    });

    it("hari ke-1 (2025-02-10) adalah laba", () => {
        expect(getCaturwara(new Date("2025-02-10")).name).toBe("laba");
    });

    it("hari ke-3 (2025-02-12) adalah mandala", () => {
        expect(getCaturwara(new Date("2025-02-12")).name).toBe("mandala");
    });

    it("hari ke-4 kembali ke sri (satu putaran penuh sebelum offset)", () => {
        expect(getCaturwara(new Date("2025-02-13")).name).toBe("sri");
    });

    // Offset +2 berlaku mulai hari ke-72 dari anchor date
    // Hari ke-72 = 2025-02-09 + 72 hari = 2025-04-22
    it("hari ke-72 (2025-04-22) mendapat offset +2: (72+2)%4 = 2 = jaya", () => {
        expect(getCaturwara(new Date("2025-04-22")).name).toBe("jaya");
    });

    it("hari ke-71 (sebelum offset, 2025-04-21): 71%4 = 3 = mandala", () => {
        expect(getCaturwara(new Date("2025-04-21")).name).toBe("mandala");
    });

    it("mengembalikan urip yang benar untuk mandala (8)", () => {
        expect(getCaturwara(new Date("2025-02-12")).urip).toBe(8);
    });

    it("melempar error untuk tanggal tidak valid", () => {
        expect(() => getCaturwara("invalid-date")).toThrow("Invalid date");
    });
});

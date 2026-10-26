import { describe, expect, it } from "bun:test";
import { assignPhases, normalizeSasih, parseDayLabel } from "./scrape-saka-dataset.ts";

const PENANGGAL = "Penanggal (Waxing)";
const PANGELONG = "Pangelong (Waning)";

describe("parseDayLabel", () => {
    it("keeps a plain tithi", () => {
        expect(parseDayLabel(15)).toEqual({ tithi: [15], dayLabel: "15" });
    });

    it("keeps both tithi when the site joins them with a slash", () => {
        expect(parseDayLabel("9/10")).toEqual({ tithi: [9, 10], dayLabel: "9/10" });
        expect(parseDayLabel("14/15")).toEqual({ tithi: [14, 15], dayLabel: "14/15" });
    });

    it("reads 151 as tilem together with the next sasih's penanggal 1", () => {
        expect(parseDayLabel("151")).toEqual({ tithi: [15, 1], dayLabel: "151" });
    });

    it("rejects a tithi outside 1–15", () => {
        expect(() => parseDayLabel(16)).toThrow("Invalid day label");
        expect(() => parseDayLabel("15/16")).toThrow("Invalid day label");
        expect(() => parseDayLabel("9/11")).toThrow("Invalid day label");
    });
});

describe("normalizeSasih", () => {
    it("maps the site's modern spelling onto the names used in code", () => {
        expect(normalizeSasih("Kewulu")).toBe("kaulu");
        expect(normalizeSasih("Ketiga")).toBe("katiga");
        expect(normalizeSasih("Mala Jiyestha")).toBe("mala jyestha");
        expect(normalizeSasih("Mala Sadha")).toBe("mala sadha");
    });

    it("rejects an unknown sasih", () => {
        expect(() => normalizeSasih("Kadasa")).toThrow("Unknown sasih");
    });
});

describe("assignPhases", () => {
    it("labels the waning half before tilem, including a joined tithi", () => {
        const entries = assignPhases([
            { date: "2026-06-08", sasih: "sadha", rawPhase: 8, isPurnama: false, isTilem: false },
            { date: "2026-06-09", sasih: "sadha", rawPhase: "9/10", isPurnama: false, isTilem: false },
            { date: "2026-06-10", sasih: "sadha", rawPhase: 11, isPurnama: false, isTilem: false },
            { date: "2026-06-11", sasih: "sadha", rawPhase: 12, isPurnama: false, isTilem: false },
            { date: "2026-06-12", sasih: "sadha", rawPhase: 13, isPurnama: false, isTilem: false },
            { date: "2026-06-13", sasih: "sadha", rawPhase: 14, isPurnama: false, isTilem: false },
            { date: "2026-06-14", sasih: "sadha", rawPhase: 15, isPurnama: false, isTilem: true },
            { date: "2026-06-15", sasih: "kasa", rawPhase: 1, isPurnama: false, isTilem: false },
            { date: "2026-06-16", sasih: "kasa", rawPhase: 2, isPurnama: false, isTilem: false },
        ]);

        expect(entries.find(entry => entry.date === "2026-06-09")).toMatchObject({
            phase: PANGELONG,
            dayNumber: 9,
            dayLabel: "9/10",
            tithi: [9, 10],
            isPurnama: false,
            isTilem: false,
        });
        expect(entries.find(entry => entry.date === "2026-06-14")).toMatchObject({
            phase: PANGELONG,
            dayNumber: 15,
            isTilem: true,
        });
        expect(entries.find(entry => entry.date === "2026-06-15")).toMatchObject({
            sasih: "kasa",
            phase: PENANGGAL,
            dayNumber: 1,
        });
    });

    it("starts pangelong the day after purnama", () => {
        const entries = assignPhases([
            { date: "2025-02-11", sasih: "kaulu", rawPhase: 14, isPurnama: false, isTilem: false },
            { date: "2025-02-12", sasih: "kaulu", rawPhase: 15, isPurnama: true, isTilem: false },
            { date: "2025-02-13", sasih: "kaulu", rawPhase: 1, isPurnama: false, isTilem: false },
            { date: "2025-02-14", sasih: "kaulu", rawPhase: 2, isPurnama: false, isTilem: false },
        ]);

        expect(entries.map(entry => entry.phase)).toEqual([
            PENANGGAL,
            PENANGGAL,
            PANGELONG,
            PANGELONG,
        ]);
        expect(entries[1]).toMatchObject({ isPurnama: true, isTilem: false });
        expect(entries[2]).toMatchObject({ isPurnama: false, dayNumber: 1 });
    });

    it("treats purnama on 14 as penanggal and the next day as pangelong 1", () => {
        const entries = assignPhases([
            { date: "2024-09-16", sasih: "katiga", rawPhase: 13, isPurnama: false, isTilem: false },
            { date: "2024-09-17", sasih: "katiga", rawPhase: 14, isPurnama: true, isTilem: false },
            { date: "2024-09-18", sasih: "katiga", rawPhase: 1, isPurnama: false, isTilem: false },
            { date: "2024-09-19", sasih: "katiga", rawPhase: 2, isPurnama: false, isTilem: false },
        ]);

        expect(entries[1]).toMatchObject({
            phase: PENANGGAL,
            dayNumber: 14,
            dayLabel: "14",
            isPurnama: true,
        });
        expect(entries[2]).toMatchObject({ phase: PANGELONG, dayNumber: 1 });
    });

    it("keeps a 14/15 purnama in penanggal", () => {
        const entries = assignPhases([
            { date: "2027-04-19", sasih: "jyestha", rawPhase: 13, isPurnama: false, isTilem: false },
            { date: "2027-04-20", sasih: "jyestha", rawPhase: "14/15", isPurnama: true, isTilem: false },
            { date: "2027-04-21", sasih: "jyestha", rawPhase: 1, isPurnama: false, isTilem: false },
        ]);

        expect(entries[1]).toMatchObject({
            phase: PENANGGAL,
            dayNumber: 14,
            dayLabel: "14/15",
            tithi: [14, 15],
            isPurnama: true,
        });
        expect(entries[2]).toMatchObject({ phase: PANGELONG, dayNumber: 1 });
    });

    it("keeps 151 as tilem and starts the next sasih on day 2", () => {
        const entries = assignPhases([
            { date: "2025-05-26", sasih: "jyestha", rawPhase: 14, isPurnama: false, isTilem: false },
            { date: "2025-05-27", sasih: "jyestha", rawPhase: "151", isPurnama: false, isTilem: true },
            { date: "2025-05-28", sasih: "sadha", rawPhase: 2, isPurnama: false, isTilem: false },
        ]);

        expect(entries[1]).toMatchObject({
            phase: PANGELONG,
            dayNumber: 15,
            dayLabel: "151",
            tithi: [15, 1],
            isTilem: true,
        });
        expect(entries[2]).toMatchObject({
            sasih: "sadha",
            phase: PENANGGAL,
            dayNumber: 2,
        });
    });

    it("rejects a tithi jump the site did not encode", () => {
        expect(() => assignPhases([
            { date: "2026-06-08", sasih: "sadha", rawPhase: 8, isPurnama: false, isTilem: false },
            { date: "2026-06-09", sasih: "sadha", rawPhase: 11, isPurnama: false, isTilem: false },
            { date: "2026-06-10", sasih: "sadha", rawPhase: 12, isPurnama: false, isTilem: false },
            { date: "2026-06-11", sasih: "sadha", rawPhase: 13, isPurnama: false, isTilem: false },
            { date: "2026-06-12", sasih: "sadha", rawPhase: 14, isPurnama: false, isTilem: false },
            { date: "2026-06-13", sasih: "sadha", rawPhase: 15, isPurnama: false, isTilem: true },
        ])).toThrow("2026-06-09");
    });
});

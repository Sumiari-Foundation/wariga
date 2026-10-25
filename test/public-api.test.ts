import { expect, test } from "bun:test";
import { getWariga } from "../src/index.js";

const date = "2026-03-19";

test("getWariga returns pawukon and saka for a known date", () => {
    const wariga = getWariga(date);

    expect(wariga.pawukon.sangawara.name).toBe("jangur");
    expect(wariga.pawukon.caturwara.name).toBe("mandala");
    expect(wariga.pawukon.astawara.name).toBe("uma");
    expect(wariga.pawukon.dasawara.name).toBe("manusa");
    expect(wariga.pawukon.ekawara?.name).toBe("luang");
    expect(wariga.pawukon.dwiwara.name).toBe("menga");
    expect(wariga.pawukon.triwara.name).toBe("beteng");
    expect(wariga.pawukon.pancawara.name).toBe("kliwon");
    expect(wariga.pawukon.sadwara.name).toBe("aryang");
    expect(wariga.pawukon.saptawara.name).toBe("wraspati");
    expect(wariga.pawukon.wuku?.name).toBe("klawu");
    expect(wariga.pawukon.uripSum).toBe(wariga.pawukon.saptawara.urip + wariga.pawukon.pancawara.urip);
    expect(wariga.saka.sasih).toEqual({
        monthNumber: 6,
        sasihName: "Kanam",
        isLeapMonth: false,
    });
    expect(wariga.saka.phase).toEqual({
        phase: "Pangelong (Waning)",
        dayNumber: 14,
        isPurnama: false,
        isTilem: false,
    });
});

test("getWariga rejects an invalid date", () => {
    expect(() => getWariga("not-a-date")).toThrow("Invalid date");
});

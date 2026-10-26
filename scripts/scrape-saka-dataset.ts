/**
 * Scraper for the saka dataset (sasih name and phase).
 * Source: https://kalenderbali.com (I Wayan Nuarsa, Universitas Udayana)
 *
 * The site's Penanggal/Pangelong value is the tithi inside the current half,
 * always 1–15. It does not say which half. Purnama and tilem are named in
 * Rerainan. Some civil days carry two tithi ("9/10", "14/15"). "151" is tilem
 * together with the next sasih's penanggal 1.
 *
 * Usage: bun run scripts/scrape-saka-dataset.ts
 * Output: data/saka-dataset.json
 * Span: 2024-01-01 through 2027-12-31
 */

import * as cheerio from "cheerio";

const BASE_URL = "https://kalenderbali.com";
const SPAN_START_YEAR = 2024;
const SPAN_END_YEAR = 2027;
const OUTPUT_PATH = new URL("../data/saka-dataset.json", import.meta.url);

const PENANGGAL = "Penanggal (Waxing)";
const PANGELONG = "Pangelong (Waning)";
const MS_PER_DAY = 86_400_000;

const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
] as const;

const MONTH_MAP: Record<string, number> = Object.fromEntries(
    MONTH_NAMES.map((name, index) => [name, index + 1]),
);

const SASIH_BASES = [
    "kasa", "karo", "katiga", "kapat", "kalima", "kanam",
    "kapitu", "kaulu", "kasanga", "kedasa", "jyestha", "sadha",
] as const;

// Site uses modern spelling; the dataset uses the spelling in src/saka.
const SASIH_NORMALIZE: Record<string, string> = {
    "kelima": "kalima",
    "kenam": "kanam",
    "kepitu": "kapitu",
    "kewulu": "kaulu",
    "kesanga": "kasanga",
    "ketiga": "katiga",
    "jiyestha": "jyestha",
    "mala kelima": "mala kalima",
    "mala kenam": "mala kanam",
    "mala kepitu": "mala kapitu",
    "mala kewulu": "mala kaulu",
    "mala kesanga": "mala kasanga",
    "mala jiyestha": "mala jyestha",
};

export type Phase = typeof PENANGGAL | typeof PANGELONG;

export type ScrapedDay = {
    date: string;
    sasih: string;
    rawPhase: number | string;
    isPurnama: boolean;
    isTilem: boolean;
};

export type SakaEntry = {
    date: string;
    sasih: string;
    phase: Phase;
    dayNumber: number;
    dayLabel: string;
    tithi: number[];
    isPurnama: boolean;
    isTilem: boolean;
};

export function parseDayLabel(raw: unknown): { tithi: number[]; dayLabel: string } {
    if (typeof raw === "number" && Number.isInteger(raw) && raw >= 1 && raw <= 15) {
        return { tithi: [raw], dayLabel: String(raw) };
    }

    if (raw === "151") {
        return { tithi: [15, 1], dayLabel: "151" };
    }

    if (typeof raw === "string") {
        const match = /^(\d{1,2})\/(\d{1,2})$/.exec(raw);
        if (match) {
            const start = Number(match[1]);
            const end = Number(match[2]);
            if (end === start + 1 && start >= 1 && end <= 15) {
                return { tithi: [start, end], dayLabel: raw };
            }
        }
    }

    throw new Error(`Invalid day label: ${JSON.stringify(raw)}`);
}

export function normalizeSasih(name: string): string {
    const lower = name.trim().toLowerCase();
    const normalized = SASIH_NORMALIZE[lower] ?? lower;
    const base = normalized.startsWith("mala ") ? normalized.slice("mala ".length) : normalized;
    if (!(SASIH_BASES as readonly string[]).includes(base)) {
        throw new Error(`Unknown sasih: ${name}`);
    }
    return normalized;
}

function lastTithi(tithi: number[], date: string): number {
    const last = tithi[tithi.length - 1];
    if (last === undefined) throw new Error(`${date} has no tithi`);
    return last;
}

function assertSakaSequence(entries: SakaEntry[]): void {
    for (const entry of entries) {
        if (entry.isPurnama && entry.isTilem) {
            throw new Error(`${entry.date} is both purnama and tilem`);
        }
        if (entry.isPurnama && entry.phase !== PENANGGAL) {
            throw new Error(`${entry.date} purnama is ${entry.phase}`);
        }
        if (entry.isTilem && entry.phase !== PANGELONG) {
            throw new Error(`${entry.date} tilem is ${entry.phase}`);
        }

        const has15 = entry.tithi.includes(15);
        if (entry.phase === PANGELONG && has15 && !entry.isTilem) {
            throw new Error(`${entry.date} is pangelong 15 without tilem`);
        }
        if (entry.phase === PENANGGAL && has15 && !entry.isPurnama) {
            throw new Error(`${entry.date} is penanggal 15 without purnama`);
        }
        if (entry.isPurnama && !has15 && !(entry.tithi.length === 1 && entry.tithi[0] === 14)) {
            throw new Error(`${entry.date} purnama has tithi ${entry.dayLabel}`);
        }
        if (entry.isTilem && !has15) {
            throw new Error(`${entry.date} tilem has tithi ${entry.dayLabel}`);
        }
    }

    for (let i = 1; i < entries.length; i++) {
        const prev = entries[i - 1];
        const cur = entries[i];
        if (!prev || !cur) throw new Error("Missing sequence entry");

        const prevMs = Date.parse(`${prev.date}T00:00:00Z`);
        const curMs = Date.parse(`${cur.date}T00:00:00Z`);
        if (curMs - prevMs !== MS_PER_DAY) {
            throw new Error(`Missing day between ${prev.date} and ${cur.date}`);
        }

        const prevLast = lastTithi(prev.tithi, prev.date);
        const expected = prevLast === 15 ? 1 : prevLast + 1;
        const purnamaSkips15 = prev.isPurnama
            && prev.tithi.length === 1
            && prev.tithi[0] === 14
            && cur.tithi[0] === 1
            && cur.sasih === prev.sasih;

        if (!purnamaSkips15 && cur.tithi[0] !== expected) {
            throw new Error(`${cur.date}: expected tithi ${expected} after ${prev.date} (${prev.dayLabel}), found ${cur.dayLabel}`);
        }

        if (cur.sasih !== prev.sasih) {
            if (prev.phase !== PANGELONG) throw new Error(`${prev.date} ends ${prev.sasih} in ${prev.phase}`);
            if (cur.phase !== PENANGGAL) throw new Error(`${cur.date} starts ${cur.sasih} in ${cur.phase}`);
        }
    }
}

export function assignPhases(days: ScrapedDay[]): SakaEntry[] {
    if (days.length === 0) throw new Error("No days to assign");

    const ordered = [...days].sort((a, b) => a.date.localeCompare(b.date));
    for (let i = 1; i < ordered.length; i++) {
        if (ordered[i]?.date === ordered[i - 1]?.date) {
            throw new Error(`Duplicate date ${ordered[i]?.date}`);
        }
    }

    const parsed = ordered.map(day => {
        let label;
        try {
            label = parseDayLabel(day.rawPhase);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            throw new Error(`${day.date}: ${message}`);
        }
        return { ...day, ...label };
    });

    const anchor = parsed.findIndex(day => day.isPurnama || day.isTilem);
    if (anchor < 0) throw new Error("No purnama or tilem to anchor phase");

    const phases = new Array<Phase | undefined>(parsed.length);
    const phaseOfMarker = (day: (typeof parsed)[number]): Phase => day.isPurnama ? PENANGGAL : PANGELONG;
    phases[anchor] = phaseOfMarker(parsed[anchor]!);

    for (let i = anchor + 1; i < parsed.length; i++) {
        const prev = parsed[i - 1];
        const cur = parsed[i];
        const prevPhase = phases[i - 1];
        if (!prev || !cur || !prevPhase) throw new Error(`Phase missing before ${cur?.date}`);

        if (cur.isPurnama || cur.isTilem) {
            phases[i] = phaseOfMarker(cur);
            continue;
        }
        if (cur.sasih !== prev.sasih) {
            phases[i] = PENANGGAL;
            continue;
        }
        const prevLast = lastTithi(prev.tithi, prev.date);
        phases[i] = cur.tithi[0]! < prevLast
            ? (prevPhase === PENANGGAL ? PANGELONG : PENANGGAL)
            : prevPhase;
    }

    for (let i = anchor - 1; i >= 0; i--) {
        const cur = parsed[i];
        const next = parsed[i + 1];
        const nextPhase = phases[i + 1];
        if (!cur || !next || !nextPhase) throw new Error(`Phase missing after ${cur?.date}`);

        if (cur.isPurnama || cur.isTilem) {
            phases[i] = phaseOfMarker(cur);
            continue;
        }
        if (cur.sasih !== next.sasih) {
            phases[i] = PANGELONG;
            continue;
        }
        const curLast = lastTithi(cur.tithi, cur.date);
        phases[i] = next.tithi[0]! < curLast ? PENANGGAL : nextPhase;
    }

    const entries = parsed.map((day, index) => {
        const phase = phases[index];
        const dayNumber = day.tithi[0];
        if (!phase || dayNumber === undefined) throw new Error(`Phase missing for ${day.date}`);
        return {
            date: day.date,
            sasih: day.sasih,
            phase,
            dayNumber,
            dayLabel: day.dayLabel,
            tithi: day.tithi,
            isPurnama: day.isPurnama,
            isTilem: day.isTilem,
        };
    });

    assertSakaSequence(entries);
    return entries;
}

function daysInMonth(year: number, month: number): number {
    return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function isRealUtcDate(year: number, month: number, day: number): boolean {
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year
        && date.getUTCMonth() === month - 1
        && date.getUTCDate() === day;
}

function moonMarker(date: string, rerainan: string): { isPurnama: boolean; isTilem: boolean } {
    const isPurnama = /^Purnama\b/i.test(rerainan);
    const isTilem = /^Tilem\b/i.test(rerainan);
    if (isPurnama && isTilem) {
        throw new Error(`${date} rerainan is both purnama and tilem: ${rerainan}`);
    }
    return { isPurnama, isTilem };
}

async function scrapeMonth(year: number, month: number): Promise<ScrapedDay[]> {
    const url = `${BASE_URL}/?bl=${month}&th=${year}`;
    const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; wariga-scraper/1.0)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);

    const html = await res.text();
    const $ = cheerio.load(html);
    const entries: ScrapedDay[] = [];

    for (const el of $("a.kbd-day[data-detail]").toArray()) {
        const tgl = $(el).attr("data-tgl");
        const detailStr = $(el).attr("data-detail");
        if (!tgl || !detailStr) throw new Error(`Day cell is missing tgl or detail on ${url}`);

        const parts = tgl.split(" ");
        if (parts.length !== 3) throw new Error(`Unexpected data-tgl: ${tgl}`);

        const day = Number(parts[0]);
        const tglMonth = MONTH_MAP[parts[1] ?? ""];
        const tglYear = Number(parts[2]);
        if (!tglMonth || !Number.isInteger(day) || !Number.isInteger(tglYear)) {
            throw new Error(`Unexpected data-tgl: ${tgl}`);
        }
        if (tglMonth !== month || tglYear !== year) continue;
        if (!isRealUtcDate(year, month, day)) throw new Error(`Invalid date: ${tgl}`);

        let detail: Record<string, unknown>;
        try {
            detail = JSON.parse(detailStr) as Record<string, unknown>;
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            throw new Error(`${tgl}: ${message}`);
        }

        const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const rawPhase = detail["Penanggal/Pangelong"] ?? detail["Penanggal\\/Pangelong"];
        if (typeof rawPhase !== "number" && typeof rawPhase !== "string") {
            throw new Error(`${date} has no penanggal/pangelong`);
        }
        if (typeof detail["Sasih"] !== "string" || detail["Sasih"].length === 0) {
            throw new Error(`${date} has no sasih`);
        }

        const rerainan = typeof detail["Rerainan"] === "string" ? detail["Rerainan"] : "";
        entries.push({
            date,
            sasih: normalizeSasih(detail["Sasih"]),
            rawPhase,
            ...moonMarker(date, rerainan),
        });
    }

    entries.sort((a, b) => a.date.localeCompare(b.date));
    const expected = daysInMonth(year, month);
    if (entries.length !== expected) {
        const label = `${year}-${String(month).padStart(2, "0")}`;
        throw new Error(`${label}: expected ${expected} days, scraped ${entries.length}`);
    }
    return entries;
}

function monthsToScrape(): { year: number; month: number }[] {
    const months: { year: number; month: number }[] = [];
    for (let year = SPAN_START_YEAR; year <= SPAN_END_YEAR; year++) {
        for (let month = 1; month <= 12; month++) months.push({ year, month });
    }
    return months;
}

async function main() {
    console.log(`Scraping saka dataset from kalenderbali.com (${SPAN_START_YEAR}-01 through ${SPAN_END_YEAR}-12)...\n`);

    const scraped: ScrapedDay[] = [];
    for (const { year, month } of monthsToScrape()) {
        const label = `${year}-${String(month).padStart(2, "0")}`;
        process.stdout.write(`  ${label}... `);
        const entries = await scrapeMonth(year, month);
        scraped.push(...entries);
        console.log(`${entries.length} days`);
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    const entries = assignPhases(scraped);
    const output = {
        source: "https://kalenderbali.com",
        reference: "I Wayan Nuarsa, Universitas Udayana",
        note: "Every civil day from 2024-01-01 through 2027-12-31. Penanggal/Pangelong on the site is the tithi inside the current half (1–15). Purnama and tilem come from Rerainan. A slash label such as \"9/10\" lists two tithi on one civil day. \"151\" is tilem together with the next sasih's penanggal 1, so the next civil day is penanggal 2. dayNumber is the first tithi; dayLabel is the site's token.",
        scrapedAt: new Date().toISOString(),
        totalEntries: entries.length,
        entries,
    };

    await Bun.write(OUTPUT_PATH, JSON.stringify(output, null, 2));

    const penanggal = entries.filter(entry => entry.phase === PENANGGAL).length;
    const pangelong = entries.filter(entry => entry.phase === PANGELONG).length;
    const purnama = entries.filter(entry => entry.isPurnama).length;
    const tilem = entries.filter(entry => entry.isTilem).length;
    const compound = entries.filter(entry => entry.tithi.length > 1).length;
    console.log(`\nDone. ${entries.length} entries saved to data/saka-dataset.json`);
    console.log(`Penanggal ${penanggal}, Pangelong ${pangelong}, Purnama ${purnama}, Tilem ${tilem}, compound tithi ${compound}`);
}

if (import.meta.main) {
    await main();
}

/**
 * Scraper for saka dataset (sasih name and phase).
 * Source: https://kalenderbali.com (I Wayan Nuarsa, Universitas Udayana)
 *
 * Uses fetch + cheerio to extract saka data from data-detail JSON
 * attribute on each day cell.
 *
 * URL format: https://kalenderbali.com/?bl={month}&th={year}
 *
 * Usage: bun run scripts/scrape-saka-dataset.ts
 * Output: data/saka-dataset.json
 */

import * as cheerio from "cheerio";

const BASE_URL = "https://kalenderbali.com";

// Months to scrape — spread across 2025–2027
const MONTHS_TO_SCRAPE = [
    { year: 2025, month: 2 },
    { year: 2025, month: 4 },
    { year: 2025, month: 7 },
    { year: 2025, month: 10 },
    { year: 2026, month: 1 },
    { year: 2026, month: 3 },
    { year: 2026, month: 6 },
    { year: 2026, month: 9 },
    { year: 2026, month: 12 },
    { year: 2027, month: 2 },
    { year: 2027, month: 5 },
    { year: 2027, month: 8 },
];

// Normalize site spelling to match our implementation (ejaan lama)
// Site uses modern spelling, code uses original spelling — normalize dataset to match code
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

function normalizeSasih(name: string | null): string | null {
    if (!name) return null;
    return SASIH_NORMALIZE[name] ?? name;
}

// Purnama = penanggal 15, Tilem = pangelong 15
// In data-detail: positive Penanggal/Pangelong = penanggal, negative = pangelong
// Actually the site stores as a number (1-30):
// 1-15 = penanggal (waxing), 16-30 = pangelong (waning) as 16→1, 17→2, etc.
function parsePhase(raw: number) {
    if (raw <= 15) {
        return {
            phase: "Penanggal (Waxing)",
            dayNumber: raw,
            isPurnama: raw === 15,
            isTilem: false,
        };
    } else {
        const dayNumber = raw - 15;
        return {
            phase: "Pangelong (Waning)",
            dayNumber,
            isPurnama: false,
            isTilem: dayNumber === 15,
        };
    }
}

async function scrapeMonth(year: number, month: number) {
    const url = `${BASE_URL}/?bl=${month}&th=${year}`;

    const res = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (compatible; wariga-scraper/1.0)",
        },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);

    const html = await res.text();
    const $ = cheerio.load(html);
    const entries: any[] = [];

    $("a.kbd-day[data-detail]").each((_, el) => {
        const tgl = $(el).attr("data-tgl");
        const detailStr = $(el).attr("data-detail");
        if (!tgl || !detailStr) return;

        try {
            const detail = JSON.parse(detailStr);
            const parts = tgl.split(" ");
            const day = parseInt(parts[0]);
            if (isNaN(day)) return;

            // Parse month/year from data-tgl to avoid misassigning adjacent month dates
            const MONTH_MAP: Record<string, number> = {
                "Januari": 1, "Februari": 2, "Maret": 3, "April": 4,
                "Mei": 5, "Juni": 6, "Juli": 7, "Agustus": 8,
                "September": 9, "Oktober": 10, "November": 11, "Desember": 12
            };
            const tglMonth = MONTH_MAP[parts[1]];
            const tglYear = parseInt(parts[2]);
            if (!tglMonth || isNaN(tglYear) || tglMonth !== month || tglYear !== year) return;

            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dateCheck = new Date(dateStr);
            if (dateCheck.getDate() !== day) return;

            const rawPhase = detail["Penanggal/Pangelong"] ?? detail["Penanggal\\/Pangelong"];
            if (rawPhase === undefined || rawPhase === null) return;

            const phaseNum = parseInt(String(rawPhase));
            if (isNaN(phaseNum)) return;

            const phase = parsePhase(phaseNum);
            const sasihRaw = detail["Sasih"]?.toLowerCase() || null;

            entries.push({
                date: dateStr,
                sasih: normalizeSasih(sasihRaw),
                phase: phase.phase,
                dayNumber: phase.dayNumber,
                isPurnama: phase.isPurnama,
                isTilem: phase.isTilem,
            });
        } catch {
            // skip malformed entries
        }
    });

    return entries;
}

async function main() {
    console.log("Scraping saka dataset from kalenderbali.com...\n");

    const allEntries: any[] = [];

    for (const { year, month } of MONTHS_TO_SCRAPE) {
        const label = `${year}-${String(month).padStart(2, "0")}`;
        process.stdout.write(`  ${label}... `);
        try {
            const entries = await scrapeMonth(year, month);
            allEntries.push(...entries);
            console.log(`${entries.length} entries`);
        } catch (err) {
            console.log(`failed: ${err}`);
        }
        await new Promise(r => setTimeout(r, 500));
    }

    // Deduplicate by date
    const seen = new Set<string>();
    const unique = allEntries.filter(e => {
        if (seen.has(e.date)) return false;
        seen.add(e.date);
        return true;
    });

    unique.sort((a, b) => a.date.localeCompare(b.date));

    const output = {
        source: "https://kalenderbali.com",
        reference: "I Wayan Nuarsa, Universitas Udayana",
        note: "Saka dataset scraped from kalenderbali.com. Contains sasih name, phase (penanggal/pangelong), day number, purnama and tilem flags.",
        scrapedAt: new Date().toISOString(),
        totalEntries: unique.length,
        entries: unique,
    };

    await Bun.write("data/saka-dataset.json", JSON.stringify(output, null, 2));
    console.log(`\nDone. ${unique.length} entries saved to data/saka-dataset.json`);

    // Sample
    console.log("\nSample (first 5):");
    unique.slice(0, 5).forEach(e => {
        const flag = e.isPurnama ? " ← PURNAMA" : e.isTilem ? " ← TILEM" : "";
        console.log(`  ${e.date}: ${e.sasih} ${e.phase} ${e.dayNumber}${flag}`);
    });
}

main();

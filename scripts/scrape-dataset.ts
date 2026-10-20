/**
 * Scraper for wewaran dataset.
 * Source: https://kalenderbali.com (I Wayan Nuarsa, Universitas Udayana)
 *
 * Uses fetch + cheerio to extract wewaran data from data-detail JSON
 * attribute on each day cell.
 *
 * URL format: https://kalenderbali.com/?bl={month}&th={year}
 *
 * Usage: bun run scripts/scrape-dataset.ts
 * Output: data/wewaran-dataset.json
 */

import * as cheerio from "cheerio";

const BASE_URL = "https://kalenderbali.com";

// Months to scrape — spread across 2025–2027 for variety
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
    // Edge case months
    { year: 2024, month: 2 }, // leap day before anchor
    { year: 2025, month: 9 }, // 210-day cycle boundary
    { year: 2028, month: 2 }, // leap day after anchor
];

// Known typos on the source site
const WUKU_TYPOS: Record<string, string> = {
    "dunggulan": "dungulan",
};

function normalizeWuku(name: string | null): string | null {
    if (!name) return null;
    return WUKU_TYPOS[name] ?? name;
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

    // Each day cell is an anchor with class kbd-day and data-detail attribute
    $("a.kbd-day[data-detail]").each((_, el) => {
        const tgl = $(el).attr("data-tgl"); // e.g. "9 Februari 2025"
        const detailStr = $(el).attr("data-detail");
        if (!tgl || !detailStr) return;

        try {
            const detail = JSON.parse(detailStr);
            const day = parseInt(tgl.split(" ")[0]);
            if (isNaN(day)) return;

            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            // Validate date is real
            const dateCheck = new Date(dateStr);
            if (dateCheck.getDate() !== day) return;

            // Get wuku: find the wukured div in the outer td column header
            // Structure: outer td > div.wukured (header) + table#tabelkosong > ... > a.kbd-day
            const outerTd = $(el).closest("table#tabelkosong").closest("td");
            const outerRow = outerTd.parent(); // TR in tabelkalender
            const colIndex = outerRow.children().index(outerTd);
            const headerRow = outerTd.closest("table#tabelkalender").find("> tbody > tr").first();
            const wukuText = headerRow.children().eq(colIndex).find("div.wukured").first().text().trim();
            const wukuMatch = wukuText.match(/\d+\.\s+([A-Z]+)/);
            const wuku = wukuMatch ? normalizeWuku(wukuMatch[1].toLowerCase()) : null;

            // Normalize ekawara: "-" or empty → null
            const ekaRaw = detail["Eka Wara"]?.toLowerCase().trim();
            const ekawara = (!ekaRaw || ekaRaw === "-") ? null : ekaRaw;

            entries.push({
                date: dateStr,
                saptawara: detail["Sapta Wara"]?.toLowerCase() || null,
                pancawara: detail["Panca Wara"]?.toLowerCase() || null,
                triwara: detail["Tri Wara"]?.toLowerCase() || null,
                sadwara: detail["Sad Wara"]?.toLowerCase() || null,
                ekawara,
                dwiwara: detail["Dwi Wara"]?.toLowerCase() || null,
                caturwara: detail["Catur Wara"]?.toLowerCase() || null,
                astawara: detail["Asta Wara"]?.toLowerCase() || null,
                sangawara: detail["Sanga Wara"]?.toLowerCase() || null,
                dasawara: detail["Dasa Wara"]?.toLowerCase() || null,
                wuku,
            });
        } catch {
            // skip malformed entries
        }
    });

    return entries;
}

async function main() {
    console.log("Scraping wewaran dataset from kalenderbali.com...\n");

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
        // Small delay to be respectful to the server
        await new Promise(r => setTimeout(r, 500));
    }

    // Deduplicate by date
    const seen = new Set<string>();
    const unique = allEntries.filter(e => {
        if (seen.has(e.date)) return false;
        seen.add(e.date);
        return true;
    });

    // Sort by date
    unique.sort((a, b) => a.date.localeCompare(b.date));

    const output = {
        source: "https://kalenderbali.com",
        reference: "I Wayan Nuarsa, Universitas Udayana",
        note: "Dataset scraped from kalenderbali.com using fetch + cheerio. Dates spread across 2025–2027 with edge case dates included.",
        scrapedAt: new Date().toISOString(),
        totalEntries: unique.length,
        entries: unique,
    };

    await Bun.write("data/wewaran-dataset.json", JSON.stringify(output, null, 2));
    console.log(`\nDone. ${unique.length} entries saved to data/wewaran-dataset.json`);

    // Quick sample
    console.log("\nSample (first 3 entries):");
    unique.slice(0, 3).forEach(e => {
        console.log(`  ${e.date}: ${e.saptawara} ${e.pancawara} wuku:${e.wuku}`);
    });
}

main();

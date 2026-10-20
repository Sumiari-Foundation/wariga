/**
 * Scraper for wewaran dataset.
 * Source: https://kalenderbali.com (I Wayan Nuarsa, Universitas Udayana)
 *
 * Uses Puppeteer to navigate the calendar and extract wewaran data
 * from the data-detail JSON attribute on each day cell.
 *
 * Usage: bun run scripts/scrape-dataset.ts
 * Output: data/wewaran-dataset.json
 */

import puppeteer from "puppeteer-core";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// Months to scrape — spread across 2025–2027 for variety
// Avoiding sequential months to get better random coverage
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

const MONTH_NAMES: Record<number, string> = {
    1: "Januari", 2: "Februari", 3: "Maret", 4: "April",
    5: "Mei", 6: "Juni", 7: "Juli", 8: "Agustus",
    9: "September", 10: "Oktober", 11: "November", 12: "Desember",
};

// Also scrape specific edge case dates separately
const EDGE_DATES = [
    { year: 2025, month: 9, day: 6  }, // day 209 — last day of 210-day cycle
    { year: 2025, month: 9, day: 7  }, // day 210 — wrap back to start
    { year: 2025, month: 4, day: 21 }, // day 71 — just before astawara/caturwara offset
    { year: 2025, month: 4, day: 22 }, // day 72 — astawara/caturwara offset kicks in
    { year: 2024, month: 2, day: 29 }, // leap day before anchor
    { year: 2028, month: 2, day: 29 }, // leap day after anchor
];

async function scrapeMonth(page: any, year: number, month: number) {
    // Navigate to month — set values via JS to bypass input quirks
    await page.evaluate((m: number, y: number) => {
        const blSelect = document.querySelector("#bl") as HTMLSelectElement;
        const thInput = document.querySelector("#th") as HTMLInputElement;
        if (blSelect) blSelect.value = String(m);
        if (thInput) thInput.value = String(y);
    }, month, year);
    await page.click("input[name=tampilkan]");
    await new Promise(r => setTimeout(r, 2000));

    // Verify correct month loaded
    const title = await page.title();
    const expectedMonth = MONTH_NAMES[month];
    if (!title.includes(expectedMonth) || !title.includes(String(year))) {
        console.warn(`  ⚠ Expected ${expectedMonth} ${year}, got: ${title}`);
    }

    // Extract all day cells with their data-detail JSON
    const entries = await page.evaluate((year: number, month: number) => {
        const dayCells = document.querySelectorAll("a.kbd-day[data-detail]");
        const results: any[] = [];

        dayCells.forEach((el: Element) => {
            const tgl = el.getAttribute("data-tgl");
            const detailStr = el.getAttribute("data-detail");
            if (!tgl || !detailStr) return;

            try {
                const detail = JSON.parse(detailStr);
                const parts = tgl.split(" ");
                const day = parseInt(parts[0]);
                if (isNaN(day)) return;

                const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                // Get wuku: find column index in tabelkalender, then look at header row (row 0)
                const outerTd = el.closest("table#tabelkosong")?.closest("td");
                let wuku: string | null = null;

                if (outerTd) {
                    const outerRow = outerTd.parentElement; // TR in tabelkalender
                    const colIndex = Array.from(outerRow?.children || []).indexOf(outerTd);
                    // Header row is the first TR in tabelkalender
                    const tabelKalender = outerTd.closest("table#tabelkalender");
                    const headerRow = tabelKalender?.querySelector(":scope > tbody > tr");
                    if (headerRow && colIndex >= 0) {
                        const headerCell = headerRow.children[colIndex];
                        const wukuDiv = headerCell?.querySelector("div.wukured");
                        if (wukuDiv) {
                            const text = wukuDiv.textContent?.trim() || "";
                            const m = text.match(/\d+\.\s+([A-Z]+)/);
                            wuku = m ? m[1].toLowerCase() : null;
                        }
                    }
                }

                // Normalize ekawara: "-" or empty → null
                const ekaRaw = detail["Eka Wara"]?.toLowerCase().trim();
                const ekawara = (!ekaRaw || ekaRaw === "-") ? null : ekaRaw;

                // Normalize known typos from the source site
                const normalizeWuku = (w: string | null) => {
                    if (!w) return null;
                    const typos: Record<string, string> = {
                        "dunggulan": "dungulan",
                        "kulantier": "kulantir",
                        "julungwagi": "julungwangi",
                    };
                    return typos[w] ?? w;
                };

                results.push({
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
                    wuku: normalizeWuku(wuku),
                });
            } catch (e) {
                // skip malformed entries
            }
        });

        return results;
    }, year, month);

    return entries;
}

async function main() {
    console.log("Starting scraper — kalenderbali.com\n");

    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto("https://kalenderbali.com", {
        waitUntil: "networkidle2",
        timeout: 30000,
    });

    const allEntries: any[] = [];

    // Scrape each month
    for (const { year, month } of MONTHS_TO_SCRAPE) {
        const label = `${year}-${String(month).padStart(2, "0")}`;
        process.stdout.write(`  Scraping ${label}... `);
        const entries = await scrapeMonth(page, year, month);
        allEntries.push(...entries);
        console.log(`${entries.length} entries`);
    }

    // Scrape edge case months if not already covered
    const edgeMonths = new Set(
        EDGE_DATES.map(d => `${d.year}-${d.month}`)
    );
    for (const em of edgeMonths) {
        const [y, m] = em.split("-").map(Number);
        const alreadyScraped = MONTHS_TO_SCRAPE.some(
            s => s.year === y && s.month === m
        );
        if (!alreadyScraped) {
            const label = `${y}-${String(m).padStart(2, "0")} (edge)`;
            process.stdout.write(`  Scraping ${label}... `);
            const entries = await scrapeMonth(page, y, m);
            allEntries.push(...entries);
            console.log(`${entries.length} entries`);
        }
    }

    await browser.close();

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
        note: "Dataset scraped from kalenderbali.com. Dates spread across 2025–2027 with edge case dates included. All wewaran fields extracted from data-detail JSON attribute.",
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

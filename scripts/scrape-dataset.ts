/**
 * Scraper for wewaran dataset
 * Source: https://www.babadbali.com/pewarigaan/kalebali.php
 * Author: I Gede Semadi Sentanu (babadbali.com)
 *
 * Usage: bun run scripts/scrape-dataset.ts
 * Output: data/wewaran-dataset.json
 *
 * The kalebali.php endpoint returns a full month calendar with all wewaran
 * in compact format. Each day block looks like:
 *   [date]
 *   1[ekawara]2[dwiwara]3[triwara]4[caturwara]5[pancawara]
 *   6[sadwara]7[saptawara]8[astawara]9[sangawara]0[dasawara]
 *
 * Wuku is listed per 7-day column header at the top of the page.
 * Saptawara is the day-of-week column (Minggu=Redite, Senin=Soma, etc.)
 */

const BASE_URL = "https://www.babadbali.com/pewarigaan/kalebali.php";

const SAPTAWARA_MAP: Record<string, string> = {
    minggu: "redite",
    senin: "soma",
    selasa: "anggara",
    rabu: "buda",
    kamis: "wraspati",
    jumat: "sukra",
    sabtu: "saniscara",
};

// Months to scrape — spread across 2025–2027 for variety
const MONTHS_TO_SCRAPE = [
    { year: 2025, month: 2 },
    { year: 2025, month: 5 },
    { year: 2025, month: 8 },
    { year: 2025, month: 11 },
    { year: 2026, month: 1 },
    { year: 2026, month: 4 },
    { year: 2026, month: 7 },
    { year: 2026, month: 10 },
    { year: 2027, month: 2 },
    { year: 2027, month: 6 },
];

function parseMonth(html: string, year: number, month: number) {
    const entries: any[] = [];

    // Strip HTML tags for easier parsing
    const text = html.replace(/<[^>]+>/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);

    // Determine wuku sequence from the WUKU header
    // Format: "WUKU\n[wuku1]\n[wuku2]..."
    const wukuStart = lines.findIndex(l => l.toUpperCase() === "WUKU");
    const wukuNames: string[] = [];
    if (wukuStart !== -1) {
        for (let i = wukuStart + 1; i < lines.length && wukuNames.length < 6; i++) {
            const w = lines[i].trim().toLowerCase();
            if (w && /^[a-z]+$/.test(w) && w !== "wuku") {
                wukuNames.push(w);
            }
        }
    }

    // Each date block: find number, then read the compact wewaran line
    // Format per day:
    //   [date_number]
    //   N:[neptu]
    //   1[ekawara]2[dwiwara]3[triwara]4[caturwara]5[pancawara]6[sadwara]
    //   7[saptawara]8[astawara]9[sangawara]0[dasawara]
    // Saptawara column header tells us the day of week

    // Track current saptawara column as we parse
    let currentSaptawara = "";
    let currentWukuIdx = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Detect saptawara column header
        const saptaKey = Object.keys(SAPTAWARA_MAP).find(k => line.toLowerCase() === k);
        if (saptaKey) {
            currentSaptawara = SAPTAWARA_MAP[saptaKey];
            continue;
        }

        // Detect wuku change (wuku changes every 7 days)
        // Wuku names appear as standalone words in the flow
        const isWukuName = wukuNames.includes(line.toLowerCase());
        if (isWukuName) {
            currentWukuIdx = wukuNames.indexOf(line.toLowerCase());
            continue;
        }

        // Detect a date number (1–31) — just a number on its own
        const dateNum = parseInt(line);
        if (!isNaN(dateNum) && dateNum >= 1 && dateNum <= 31 && line === String(dateNum)) {
            // Next meaningful line should be N:[neptu] then the compact wewaran line
            let compactLine = "";
            for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
                const l = lines[j];
                // Compact wewaran line starts with 1 or blank + a number
                if (/^1[A-Za-z]/.test(l) || /^2[A-Za-z]/.test(l)) {
                    compactLine = l;
                    break;
                }
            }

            if (!compactLine) continue;

            // Parse compact format: 1[eka]2[dwi]3[tri]4[catur]5[panca]6[sad]
            const extract = (num: string): string | null => {
                const pattern = new RegExp(`${num}([A-Za-z]+?)(?=[0-9]|$)`);
                const m = compactLine.match(pattern);
                return m ? m[1].trim().toLowerCase() : null;
            };

            // Sometimes compact data spans two lines — check next line too
            let compactLine2 = "";
            for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
                const l = lines[j];
                if (/^7[A-Za-z]/.test(l) || /^8[A-Za-z]/.test(l)) {
                    compactLine2 = l;
                    break;
                }
            }
            const fullCompact = compactLine + compactLine2;

            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(dateNum).padStart(2, "0")}`;

            // Validate date exists
            if (new Date(dateStr).getDate() !== dateNum) continue;

            const ekawara = extract("1") || null;
            const dwiwara = fullCompact.match(/2([A-Za-z]+?)(?=[0-9L])/)?.[1]?.toLowerCase() || null;
            const triwara = fullCompact.match(/3([A-Za-z]+?)(?=[0-9])/)?.[1]?.toLowerCase() || null;
            const caturwara = fullCompact.match(/4([A-Za-z]+?)(?=[0-9])/)?.[1]?.toLowerCase() || null;
            const pancawara = fullCompact.match(/5([A-Za-z]+?)(?=[0-9])/)?.[1]?.toLowerCase() || null;
            const sadwara = fullCompact.match(/6([A-Za-z]+?)(?=[0-9])/)?.[1]?.toLowerCase() || null;
            const saptawara = currentSaptawara || null;
            const astawara = fullCompact.match(/8([A-Za-z]+?)(?=[0-9])/)?.[1]?.toLowerCase() || null;
            const sangawara = fullCompact.match(/9([A-Za-z]+?)(?=[0-9])/)?.[1]?.toLowerCase() || null;
            const dasawara = fullCompact.match(/0([A-Za-z]+?)(?=[A-Z0-9L]|$)/)?.[1]?.toLowerCase() || null;

            entries.push({
                date: dateStr,
                saptawara,
                pancawara,
                triwara,
                sadwara,
                ekawara,
                dwiwara,
                caturwara,
                astawara,
                sangawara,
                dasawara,
                wuku: wukuNames[currentWukuIdx] || null,
            });
        }
    }

    return entries;
}

async function scrapeMonth(year: number, month: number) {
    const url = `${BASE_URL}?tgl=1&bln=${month}&thn=${year}`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        return parseMonth(html, year, month);
    } catch (err) {
        console.error(`Failed ${year}-${month}:`, err);
        return [];
    }
}

async function main() {
    console.log("Scraping wewaran dataset from babadbali.com...\n");

    const allEntries: any[] = [];

    for (const { year, month } of MONTHS_TO_SCRAPE) {
        const label = `${year}-${String(month).padStart(2, "0")}`;
        process.stdout.write(`  ${label}... `);
        const entries = await scrapeMonth(year, month);
        allEntries.push(...entries);
        console.log(`${entries.length} entries`);
        await new Promise(r => setTimeout(r, 500));
    }

    // Sort by date
    allEntries.sort((a, b) => a.date.localeCompare(b.date));

    const output = {
        source: "https://www.babadbali.com/pewarigaan/kalebali.php",
        reference: "I Gede Semadi Sentanu, babadbali.com",
        note: "Dataset scraped from babadbali.com. Dates spread across 2025–2027 covering all 10 wewaran functions.",
        scrapedAt: new Date().toISOString(),
        totalEntries: allEntries.length,
        entries: allEntries,
    };

    await Bun.write("data/wewaran-dataset.json", JSON.stringify(output, null, 2));
    console.log(`\nDone. ${allEntries.length} entries saved to data/wewaran-dataset.json`);
}

main();

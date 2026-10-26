# wariga

Balinese Wariga calendar calculations for Pawukon and Saka dates.

The package is ESM-only and ships JavaScript with TypeScript declarations. It has no runtime dependencies.

## Install

```bash
bun add wariga
```

```bash
npm install wariga
```

## Usage

```ts
import { getWariga } from "wariga";

const wariga = getWariga("2026-03-19");

wariga.pawukon.wuku;       // { name: "klawu", urip, direction, deity }
wariga.pawukon.pancawara;  // kliwon
wariga.saka.sasih;         // { monthNumber: 10, sasihName: "Kedasa", isLeapMonth: false }
wariga.saka.phase;         // { phase: "Penanggal (Waxing)", dayNumber: 1, ... }
```

`getWariga` accepts a `Date`, an ISO date string, or a timestamp. A date-only string such as `"2026-03-19"` is parsed as UTC midnight. Invalid dates throw.

Dwiwara, dasawara, and ekawara come from the sum of saptawara urip and pancawara urip. Ekawara is Luang when that sum is even, and absent when it is odd.

Each cycle is also available on its own:

```ts
import { getPancawara, getSaptawara, getDwiwara, getSasihName } from "wariga";

const date = "2026-03-19";
const pancawara = getPancawara(date);
const saptawara = getSaptawara(date);
const dwiwara = getDwiwara(pancawara.urip + saptawara.urip);
const sasih = getSasihName(date);
```

### Pawukon

| Function | Input | Cycle |
| --- | --- | --- |
| `getEkawara` | urip sum | 1 |
| `getDwiwara` | urip sum | 2 |
| `getTriwara` | date | 3 |
| `getCaturwara` | date | 4 |
| `getPancawara` | date | 5 |
| `getSadwara` | date | 6 |
| `getSaptawara` | date | 7 |
| `getAstawara` | date | 8 |
| `getSangawara` | date | 9 |
| `getDasawara` | urip sum | 10 |
| `getWuku` | date | 30 weeks |

The matching name tables (`EKAWARA`, `DWIWARA`, `TRIWARA`, `CATURWARA`, `PANCAWARA`, `SADWARA`, `SAPTAWARA`, `ASTAWARA`, `SANGAWARA`, `DASAWARA`, `WUKU`) are exported as well. Each entry has `name`, `urip`, `direction`, and `deity`.

### Saka

| Function | Returns |
| --- | --- |
| `getSasihName` | month number, sasih name, and whether the month is a leap month |
| `getSasihPhase` | penanggal or pangelong, day number, purnama, and tilem |

## Development

```bash
bun install
bun test
bun run typecheck
bun run build
bun run example
```

`bun run build` writes `dist/` with JavaScript, declarations, and source maps. `prepublishOnly` runs that build before publish.

## Publish

The package name `wariga` is unscoped. From a machine logged in to npm:

```bash
bun publish
```

GitHub Releases publish the package when the `NPM_TOKEN` repository secret is set. Create an npm access token and add it to the repository secrets, then publish a GitHub Release.

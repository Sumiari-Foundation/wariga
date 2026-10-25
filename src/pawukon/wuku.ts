import { getDaysSincePawukonAnchorDate } from "../utilities/date.js";
import type { PawukonItemDetails } from "./types.js";

const WUKU_MODULO = 30;

export const WUKU: readonly PawukonItemDetails[] = [
    { name: "sinta", urip: 7, direction: "Barat - Pascima", deity: "Sang Hyang Yamadipati" },
    { name: "landep", urip: 1, direction: "Barat Laut - Wayabya", deity: "Sang Hyang Mahadewa" },
    { name: "ukir", urip: 4, direction: "Utara - Utara", deity: "Sang Hyang Mahayekti" },
    { name: "kulantir", urip: 6, direction: "Timur Laut - Airsanya", deity: "Sang Hyang Langsur" },
    { name: "tolu", urip: 5, direction: "Timur - Purwa", deity: "Sang Hyang Bayu" },
    { name: "gumbreg", urip: 8, direction: "Tenggara - Gneyan", deity: "Sang Hyang Candra" },
    { name: "wariga", urip: 9, direction: "Selatan - Daksina", deity: "Sang Hyang Semara" },
    { name: "warigadean", urip: 3, direction: "Barat Daya - Nairiti", deity: "Sang Hyang Mahareshi" },
    { name: "julungwangi", urip: 7, direction: "Barat - Pascima", deity: "Sang Hyang Sambhu" },
    { name: "sungsang", urip: 1, direction: "Barat Laut - Wayabya", deity: "Sang Hyang Gana" },
    { name: "dungulan", urip: 4, direction: "Utara - Utara", deity: "Sang Hyang Kamajaya" },
    { name: "kuningan", urip: 6, direction: "Timur Laut - Airsanya", deity: "Sang Hyang Indra" },
    { name: "langkir", urip: 5, direction: "Timur - Purwa", deity: "Sang Hyang Kala" },
    { name: "medangsia", urip: 8, direction: "Tenggara - Gneyan", deity: "Sang Hyang Brahma" },
    { name: "pujut", urip: 9, direction: "Selatan - Daksina", deity: "Sang Hyang Guritna" },
    { name: "pahang", urip: 3, direction: "Barat Daya - Nairiti", deity: "Sang Hyang Tantra" },
    { name: "krulut", urip: 7, direction: "Barat - Pascima", deity: "Sang Hyang Wisnu" },
    { name: "merakih", urip: 1, direction: "Barat Laut - Wayabya", deity: "Sang Hyang Surangghana" },
    { name: "tambir", urip: 4, direction: "Utara - Utara", deity: "Sang Hyang Shiwa" },
    { name: "medangkungan", urip: 6, direction: "Timur Laut - Airsanya", deity: "Sang Hyang Basuki" },
    { name: "matal", urip: 5, direction: "Timur - Purwa", deity: "Bhagawan Sakri" },
    { name: "uye", urip: 8, direction: "Tenggara - Gneyan", deity: "Sang Hyang Kwera" },
    { name: "menail", urip: 9, direction: "Selatan - Daksina", deity: "Sang Hyang Citragotra" },
    { name: "prangbakat", urip: 3, direction: "Barat Daya - Nairiti", deity: "Bhagawan Bisma" },
    { name: "bala", urip: 7, direction: "Barat - Pascima", deity: "Sang Hyang Durga" },
    { name: "ugu", urip: 1, direction: "Barat Laut - Wayabya", deity: "Sang Hyang Singajalma" },
    { name: "wayang", urip: 4, direction: "Utara - Utara", deity: "Dewi Sri" },
    { name: "klawu", urip: 6, direction: "Timur Laut - Airsanya", deity: "Sang Hyang Sedana" },
    { name: "dukut", urip: 5, direction: "Timur - Purwa", deity: "Sang Hyang Baruna" },
    { name: "watugunung", urip: 8, direction: "Tenggara - Gneyan", deity: "Sang Hyang Anantabhoga" }
] as const;

export const getWuku = (date: Date | string | number) => {
    const daysSinceAnchorDate = getDaysSincePawukonAnchorDate(date);
    const wukuIndex = Math.floor(daysSinceAnchorDate / 7) % WUKU_MODULO;
    const wuku = WUKU[wukuIndex];

    return wuku;
}
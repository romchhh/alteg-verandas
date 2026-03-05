import type { Product, ProductCategory } from "../lib/types/product";
import { saveProducts } from "../lib/data/products";

/**
 * Raw product coming from alu-ams.de.
 * Prices are in EUR per meter or per kit, lengths are in centimeters.
 */
interface AluAmsSourceProduct {
  artNr: string;
  nameDe: string;
  nameEn: string;
  baseEuroPerMeter: number;
  lengthsCm: number[];
  category: ProductCategory | string;
  applicationsEn: string[];
  material?: string;
  finish?: string;
  color?: string;
  descriptionEn?: string;
}

interface AluAmsKitProduct {
  artNr: string;
  nameDe: string;
  nameEn: string;
  baseEuroKit: number;
  category: ProductCategory | string;
  applicationsEn: string[];
  material?: string;
  finish?: string;
  color?: string;
  descriptionEn?: string;
  dimensions?: string;
}

/**
 * Business rule:
 * - Take the euro price from alu-ams.de
 * - Use the same numeric value in GBP
 * - Add +50% margin
 * - Round to nearest 5 for kit prices
 *
 * Example:
 *   7.50 € → 7.50 £ + 50% = 11.25 £
 *   1985.23 € → 1985.23 £ + 50% = 2977.85 → rounded to £2,980
 */
function euroToUkPricePerMeter(eurPerMeter: number): number {
  const withMargin = eurPerMeter * 1.5;
  return Math.round(withMargin * 100) / 100;
}

function euroToUkPriceKit(eurKit: number): number {
  const withMargin = eurKit * 1.5;
  // Round to nearest 5 for clean kit prices
  return Math.round(withMargin / 5) * 5;
}

function cmToMeters(lengthsCm: number[]): number[] {
  return lengthsCm.map((cm) => Number((cm / 100).toFixed(2)));
}

function buildProductFromSource(source: AluAmsSourceProduct): Product {
  const pricePerMeter = euroToUkPricePerMeter(source.baseEuroPerMeter);

  const dimensions =
    source.lengthsCm.length === 1
      ? `${source.lengthsCm[0]}cm`
      : source.lengthsCm.map((cm) => `${cm}cm`).join(", ");

  const standardLengths = cmToMeters(source.lengthsCm);

  const descriptionEn =
    source.descriptionEn ??
    `${source.nameEn} in anthracite structure finish. Supplied in standard lengths and ready for cutting on site.`;

  return {
    id: source.artNr,
    category: source.category,
    name: source.nameDe,
    nameEn: source.nameEn,
    dimensions,
    pricePerMeter,
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths,
    inStock: true,
    hidden: false,
    material: source.material ?? "Aluminium",
    finish: source.finish ?? (source.color ? `Powder coated, ${source.color}` : "Powder coated"),
    image: undefined,
    description: undefined,
    descriptionEn,
    applications: ["Profile Systems"],
  };
}

function buildKitProductFromSource(source: AluAmsKitProduct): Product {
  const kitPrice = euroToUkPriceKit(source.baseEuroKit);

  const descriptionEn =
    source.descriptionEn ??
    `${source.nameEn} in anthracite structure finish (RAL 7016). Complete aluminium kit ready for assembly.`;

  return {
    id: source.artNr,
    category: source.category,
    name: source.nameDe,
    nameEn: source.nameEn,
    dimensions: source.dimensions ?? "",
    pricePerMeter: undefined,
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: source.material ?? "Aluminium",
    finish: source.finish ?? (source.color ? `Powder coated, ${source.color}` : "Powder coated"),
    image: undefined,
    description: undefined,
    descriptionEn,
    applications: ["Profile Systems"],
  };
}

// ---------------------------------------------------------------------------
// All linear / per-metre products
// ---------------------------------------------------------------------------
const SOURCE_PRODUCTS: AluAmsSourceProduct[] = [
  // ── Fence & Channel Profiles ──────────────────────────────────────────────
  {
    artNr: "A045",
    nameDe: "U Profil | Alu U Profil | U-Profil aus Aluminium",
    nameEn: "Aluminium U Profile 6000mm",
    baseEuroPerMeter: 7.5,
    lengthsCm: [600],
    category: "channel",
    applicationsEn: ["Aluminium profiles", "Fence profiles", "Privacy screens"],
    material: "Aluminium",
    finish: "Anthracite textured (RAL 7016)",
    color: "Anthracite structure",
    descriptionEn:
      "Aluminium U profile for privacy fences and framing. High stability, corrosion resistant, supplied in 6m length in anthracite structure finish.",
  },
  {
    artNr: "A046",
    nameDe: "Aluminium Abschlussprofil für Sichtschutzzäune",
    nameEn: "Aluminium Finishing Profile for Privacy Fence 6000mm",
    baseEuroPerMeter: 4.5,
    lengthsCm: [600],
    category: "plate",
    applicationsEn: ["Aluminium profiles", "Fence profiles", "Finishing trims"],
    material: "Aluminium",
    finish: "Anthracite textured (RAL 7016)",
    color: "Anthracite structure",
    descriptionEn:
      "Aluminium finishing profile for privacy fences in anthracite structure finish. Ideal as top or bottom trim on aluminium fence infill.",
  },
  {
    artNr: "A044",
    nameDe: "Alu Sichtschutzzaun Einzelprofil",
    nameEn: "Aluminium Privacy Fence Slat 6000mm",
    baseEuroPerMeter: 13.65,
    lengthsCm: [600],
    category: "tube_rectangular",
    applicationsEn: ["Aluminium fencing", "Privacy screens"],
    material: "Aluminium",
    finish: "Anthracite textured (RAL 7016)",
    color: "Anthracite structure",
    descriptionEn:
      "Single aluminium fence profile for creating modern privacy fences. Supplied in 6m length, anthracite structure finish, compatible with Alteg aluminium posts.",
  },

  // ── Veranda / Canopy System Profiles ─────────────────────────────────────
  {
    artNr: "12011",
    nameDe: "Regenrinne mit Doppelboden (verstärkt)",
    nameEn: "Reinforced Aluminium Gutter with Double Bottom",
    baseEuroPerMeter: 69.9,
    lengthsCm: [500, 600, 700],
    category: "custom_profile",
    applicationsEn: ["Veranda & canopy systems", "Aluminium profiles"],
    material: "Aluminium",
    finish: "Anthracite textured (RAL 7016)",
    color: "Anthracite structure",
    descriptionEn:
      "Reinforced aluminium gutter with double bottom for veranda and terrace roofing systems. Available in 5m, 6m and 7m lengths in anthracite structure.",
  },
  {
    artNr: "12009",
    nameDe: "Oberprofil Aluminium",
    nameEn: "Aluminium Top Profile (Oberprofil)",
    baseEuroPerMeter: 8.5,
    lengthsCm: [400, 500, 700],
    category: "custom_profile",
    applicationsEn: [
      "Veranda & canopy systems",
      "Construction profiles",
      "Industrial applications",
      "Aluminium profiles",
    ],
    material: "Aluminium",
    finish: "Anthracite textured (RAL 7016)",
    color: "Anthracite structure",
    descriptionEn:
      "Aluminium top profile (Oberprofil) for veranda, facade and structural applications. Lightweight, corrosion-resistant and available in 4m, 5m and 7m lengths.",
  },
  {
    artNr: "12007",
    nameDe: "Dachseitenprofil Rinnenblende aus Aluminium",
    nameEn: "Aluminium Roof Side Profile / Gutter Fascia",
    baseEuroPerMeter: 8.9,
    lengthsCm: [400, 500, 700],
    category: "custom_profile",
    applicationsEn: ["Veranda & canopy systems", "Aluminium profiles"],
    material: "Aluminium",
    finish: "Anthracite textured (RAL 7016)",
    color: "Anthracite structure",
    descriptionEn:
      "Aluminium roof side profile and gutter fascia (Rinnenblende) for terrace and veranda roofing systems. Available in 4m, 5m and 7m lengths in anthracite structure.",
  },
  {
    artNr: "12006",
    nameDe: "Wandprofilblende, Abschlussprofil Wand",
    nameEn: "Aluminium Wall Finishing Profile",
    baseEuroPerMeter: 9.35,
    lengthsCm: [700],
    category: "custom_profile",
    applicationsEn: [
      "Veranda & canopy systems",
      "Construction profiles",
      "Wall finishing",
      "Aluminium profiles",
    ],
    material: "Aluminium",
    finish: "Anthracite textured (RAL 7016)",
    color: "Anthracite structure",
    descriptionEn:
      "Aluminium wall finishing profile for neat wall connections on veranda and canopy structures. Supplied in 7m length, anthracite structure finish.",
  },
  {
    artNr: "12010",
    nameDe: "Alu sparren für terrassenüberdachung",
    nameEn: "Aluminium Rafter for Veranda / Terrace Roof",
    baseEuroPerMeter: 25.95,
    lengthsCm: [400, 500, 700],
    category: "custom_profile",
    applicationsEn: ["Veranda & canopy systems", "Aluminium profiles"],
    material: "Aluminium",
    finish: "Anthracite textured (RAL 7016)",
    color: "Anthracite structure",
    descriptionEn:
      "Aluminium rafter (Sparren) for veranda and terrace roofing systems. Features internal cross-reinforcement for high structural stability. Available in 4m, 5m and 7m lengths.",
  },
  {
    artNr: "12008",
    nameDe: "Aluminium Wandprofil",
    nameEn: "Aluminium Wall Profile",
    baseEuroPerMeter: 17.85,
    lengthsCm: [500, 600, 700],
    category: "custom_profile",
    applicationsEn: [
      "Veranda & canopy systems",
      "Construction profiles",
      "Window & door frames",
      "Aluminium profiles",
    ],
    material: "Aluminium",
    finish: "Anthracite textured (RAL 7016)",
    color: "Anthracite structure",
    descriptionEn:
      "Aluminium wall profile for use in veranda, window and door frame construction. Easy to handle and suitable for both residential and commercial projects. Available in 5m, 6m and 7m lengths.",
  },
  {
    artNr: "12001",
    nameDe: "Aluminium pfosten | Alu pfosten anthrazit 110x110mm",
    nameEn: "Aluminium Post 110×110mm",
    baseEuroPerMeter: 25.95,
    lengthsCm: [500, 600],
    category: "tube_square",
    applicationsEn: [
      "Veranda & canopy systems",
      "Fence profiles",
      "Construction profiles",
      "Aluminium profiles",
    ],
    material: "Aluminium",
    finish: "Anthracite textured (RAL 7016)",
    color: "Anthracite structure",
    descriptionEn:
      "Square aluminium post 110×110mm in anthracite structure finish. Used as structural upright for verandas, canopies and aluminium fencing. Available in 5m and 6m lengths.",
  },
  {
    artNr: "12005",
    nameDe: "Aluminium Statikträger",
    nameEn: "Aluminium Structural Beam",
    baseEuroPerMeter: 60.45,
    lengthsCm: [600, 700],
    category: "custom_profile",
    applicationsEn: [
      "Veranda & canopy systems",
      "Construction profiles",
      "Structural elements",
      "Aluminium profiles",
    ],
    material: "Aluminium",
    finish: "Anthracite textured (RAL 7016)",
    color: "Anthracite structure",
    descriptionEn:
      "Heavy-duty aluminium structural beam for veranda and canopy load-bearing applications. Available in 6m and 7m lengths in anthracite structure finish.",
  },
  {
    artNr: "12003",
    nameDe: "Rinnenprofil Regenrinne",
    nameEn: "Aluminium Gutter Profile",
    baseEuroPerMeter: 58.9,
    lengthsCm: [500, 600, 700],
    category: "custom_profile",
    applicationsEn: ["Veranda & canopy systems", "Aluminium profiles"],
    material: "Aluminium",
    finish: "Anthracite textured (RAL 7016)",
    color: "Anthracite structure",
    descriptionEn:
      "Aluminium gutter profile (Rinnenprofil) for veranda and terrace roofing drainage systems. Available in 5m, 6m and 7m lengths in anthracite structure finish.",
  },
];

// ---------------------------------------------------------------------------
// Kit / complete-set products (priced per kit, not per metre)
// ---------------------------------------------------------------------------
const KIT_PRODUCTS: AluAmsKitProduct[] = [
  {
    artNr: "TU003",
    nameDe: "Terrasseüberdachung 400×300 für Polycarbonat",
    nameEn: "Veranda Kit 4000×3000mm (Polycarbonate)",
    baseEuroKit: 1298.3,
    dimensions: "4000×3000mm",
    category: "custom_profile",
    applicationsEn: [
      "Veranda & canopy systems",
      "Polycarbonate roofing",
      "Terrace covers",
    ],
    material: "Aluminium",
    finish: "Anthracite textured (RAL 7016)",
    color: "Anthracite RAL 7016",
    descriptionEn:
      "Complete veranda kit 4000×3000mm for polycarbonate glazing. Includes all aluminium profiles, seals and fixings in anthracite RAL 7016. Polycarbonate panels not included.",
  },
];

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------
async function run() {
  const linearProducts = SOURCE_PRODUCTS.map(buildProductFromSource);
  const kitProducts = KIT_PRODUCTS.map(buildKitProductFromSource);
  const allProducts: Product[] = [...linearProducts, ...kitProducts];

  console.log(`Replacing products table with ${allProducts.length} alu-ams items...`);
  await saveProducts(allProducts);
  console.log("Import finished.");
}

run().catch((error) => {
  console.error("Import failed:", error);
  process.exit(1);
});
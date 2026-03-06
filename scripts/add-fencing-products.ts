import type { Product } from "../lib/types/product";
import { addProduct } from "../lib/data/products";

/**
 * Add aluminium fencing products (kits) to SQLite.
 *
 * Run:
 *   npx tsx scripts/add-fencing-products.ts
 */

const BASE_EUR_PER_M2 = 146.55;

function euroPerM2ToUkPricePerMeter(eurPerM2: number): number {
  // Business rule: take same numeric value in GBP and add +50% margin
  const withMargin = eurPerM2 * 1.5;
  return Math.round(withMargin * 100) / 100;
}

async function run() {
  const products: Product[] = [];

  const fenceSet190x200: Product = {
    id: "FENCE-SET-190x200-7016",
    category: "custom_profile",
    name: "ALU ZAUN 190cm x 200cm Anthrazit RAL 7016",
    nameEn: "Aluminium fence kit 190cm x 200cm, anthracite RAL 7016",
    dimensions: "Fence kit 190cm height × 200cm width",
    pricePerMeter: euroPerM2ToUkPricePerMeter(BASE_EUR_PER_M2),
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium",
    finish: "Anthracite textured (RAL 7016)",
    image: undefined,
    description:
      "ALU ZAUN 190cm x 200cm Anthrazit RAL 7016 Zaunbausatz.\n\n" +
      "Lieferumfang:\n" +
      "- 2x Alu-Pfosten zum Einbetonieren (110x110x3000mm)\n" +
      "- 13x Alu-Zaun Lamellen (150x25x2000mm)\n" +
      "- 3x U-Profil (rechts, links, unten) L=2000mm\n" +
      "- 1x U-Profil (Abschlussprofil oben) L=2000mm\n" +
      "- 2x schwarze Abdeckkappen für Pfosten 110x110mm\n\n" +
      "SET (190cm x 200cm) – 556,90 € netto (146,55 €/m² netto, 174,39 €/m² inkl. MwSt.). " +
      "10% Rabatt auf ALU ZAUN ab 10m².\n\n" +
      "Transformieren Sie Ihren Außenbereich mit unserem hochwertigen ALU ZAUN Zaunbausatz. " +
      "Die anthrazitfarbene RAL 7016 Oberfläche sorgt für einen modernen, eleganten Look, " +
      "die robuste Aluminiumkonstruktion ist widerstandsfähig gegen Rost, Korrosion und Witterungseinflüsse. " +
      "Der Komplettbausatz enthält alle notwendigen Komponenten für eine einfache Montage, bietet Privatsphäre " +
      "und Sicherheit und vereint Funktionalität mit ansprechendem Design.",
    descriptionEn:
      "High‑quality aluminium fence kit 190cm x 200cm in anthracite RAL 7016.\n\n" +
      "Included components:\n" +
      "- 2× aluminium posts for concreting in (110×110×3000mm)\n" +
      "- 13× aluminium fence slats (150×25×2000mm)\n" +
      "- 3× U‑profiles (right, left and bottom), length 2000mm\n" +
      "- 1× U‑profile as top finishing profile, length 2000mm\n" +
      "- 2× black post caps for 110×110mm posts\n\n" +
      "Guide supplier price: set (190cm × 200cm) 556.90 € net, equivalent to 146.55 €/m² net (174.39 €/m² incl. VAT) with 10% discount " +
      "available from 10m² of fencing.\n\n" +
      "This complete aluminium fence kit is designed for modern, long‑lasting privacy fencing. " +
      "The anthracite RAL 7016 finish gives a contemporary, premium look, while the robust aluminium construction is resistant to rust, " +
      "corrosion and weathering. The kit includes all main components needed for straightforward installation and provides both privacy " +
      "and security without compromising on style.",
    applications: ["Aluminium Fencing"],
  };

  products.push(fenceSet190x200);

  for (const product of products) {
    try {
      // eslint-disable-next-line no-console
      console.log(`Adding fencing product ${product.id} (${product.nameEn})...`);
      await addProduct(product);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Failed to add product ${product.id}:`, err);
      process.exitCode = 1;
    }
  }

  if (process.exitCode && process.exitCode !== 0) {
    process.exit(process.exitCode);
  } else {
    // eslint-disable-next-line no-console
    console.log(`Successfully added ${products.length} fencing product(s).`);
  }
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("add-fencing-products script failed:", err);
  process.exit(1);
});


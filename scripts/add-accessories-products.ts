import type { Product } from "../lib/types/product";
import { addProduct } from "../lib/data/products";

/**
 * Add accessory products (seals / gaskets, LED sets) to SQLite.
 *
 * Run:
 *   npx tsx scripts/add-accessories-products.ts
 */

function euroPerMeterToUkPricePerMeter(eurPerMeter: number): number {
  // Business rule: take same numeric value in GBP and add +50% margin
  const withMargin = eurPerMeter * 1.5;
  return Math.round(withMargin * 100) / 100;
}

async function run() {
  const products: Product[] = [];

  const gasketWall: Product = {
    id: "GD01",
    category: "custom_profile",
    name: "Dichtung – Wandanschluß | Flachdichtung | Wandanschlussprofil",
    nameEn: "Wall connection seal / flat gasket",
    dimensions: "Seal for wall connection, supplied per metre (min. 25m)",
    pricePerMeter: euroPerMeterToUkPricePerMeter(3.0),
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "EPDM rubber",
    finish: "Black",
    image: undefined,
    description:
      "Dichtung – Wandanschluß / Flachdichtung / Wandanschlussprofil.\n\n" +
      "Art.Nr. GD01, auf Lager, 3,00 € je laufendem Meter, exkl. MwSt.\n" +
      "⚠ Mindestbestellmenge 25m.\n\n" +
      "Geeignet als Wandanschlussdichtung für Veranda- und Terrassenüberdachungen sowie andere Aluminiumkonstruktionen.",
    descriptionEn:
      "Wall connection seal / flat gasket (Art. GD01), supplied per running metre. " +
      "Stock item, base supplier price 3.00 €/m excl. VAT with a minimum order quantity of 25m. " +
      "Used as a wall connection seal for veranda roofs, terrace covers and other aluminium structures.",
    applications: ["Accessories & Guttering"],
  };

  const gasketGlassCover: Product = {
    id: "GD02",
    category: "custom_profile",
    name: "Glasabdeckleistendichtung | Dichtung | Weichgummi Lippendichtung",
    nameEn: "Glazing bar cover seal / soft rubber lip gasket",
    dimensions: "Soft rubber lip seal for glazing bars, supplied per metre (min. 50m)",
    pricePerMeter: euroPerMeterToUkPricePerMeter(0.8),
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "EPDM rubber",
    finish: "Black",
    image: undefined,
    description:
      "Glasabdeckleistendichtung / Dichtung / Weichgummi Lippendichtung.\n\n" +
      "Art.Nr. GD02, auf Lager, 0,80 € je laufendem Meter, exkl. MwSt.\n" +
      "⚠ Mindestbestellmenge 50m.\n\n" +
      "Lippendichtung aus Weichgummi für Glasabdeckleisten und Verglasungsprofile.",
    descriptionEn:
      "Glazing bar cover seal / soft rubber lip gasket (Art. GD02), supplied per running metre. " +
      "Stock item, base supplier price 0.80 €/m excl. VAT with a minimum order quantity of 50m. " +
      "Soft rubber lip seal for glazing bars and veranda glazing profiles.",
    applications: ["Accessories & Guttering"],
  };

  const gasketRafter: Product = {
    id: "GD03",
    category: "custom_profile",
    name: "Dichtung – Sparren | Gummidichtung",
    nameEn: "Rafter seal / rubber gasket",
    dimensions: "Rubber seal for rafters, supplied per metre (min. 50m)",
    pricePerMeter: euroPerMeterToUkPricePerMeter(0.8),
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "EPDM rubber",
    finish: "Black",
    image: undefined,
    description:
      "Dichtung – Sparren / Gummidichtung.\n\n" +
      "Art.Nr. GD03, auf Lager, 0,80 € je laufendem Meter, exkl. MwSt.\n" +
      "⚠ Mindestbestellmenge 50m.\n\n" +
      "Gummidichtung für Sparrenprofile und Aluminiumkonstruktionen im Außenbereich.",
    descriptionEn:
      "Rafter seal / rubber gasket (Art. GD03), supplied per running metre. " +
      "Stock item, base supplier price 0.80 €/m excl. VAT with a minimum order quantity of 50m. " +
      "Rubber seal for rafters and other aluminium profiles in veranda and canopy systems.",
    applications: ["Accessories & Guttering"],
  };

  products.push(gasketWall, gasketGlassCover, gasketRafter);

  // LED spot sets – priced per set (not per metre)
  function euroKitToUkPriceKit(eurKit: number): number {
    const withMargin = eurKit * 1.5;
    return Math.round(withMargin / 5) * 5;
  }

  const ledSet6: Product = {
    id: "LED-SET-6x3W",
    category: "custom_profile",
    name: "6er Set 3 Watt LED-Einbaustrahler",
    nameEn: "6× 3W LED recessed spot set",
    dimensions: "Set of 6 veranda recessed spots, 3W each, 3000K warm white",
    pricePerMeter: euroKitToUkPriceKit(80), // treat as price per set
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Metal",
    finish: "Warm white light 3000K",
    image: undefined,
    description:
      "6er Set 3 Watt LED-Einbaustrahler für Terrassenüberdachung.\n\n" +
      "Kompletter Satz mit 6 Veranda-Einbaustrahlern, Lichtfarbe warmweiß 3000K.\n\n" +
      "Technische Daten:\n" +
      "- Stromverbrauch: 3 Watt pro LED Strahler\n" +
      "- Ausgangsspannung: 12 Volt\n" +
      "- Abmessungen: 28 x 36 x 36 mm\n" +
      "- Lichtstrom: 220 Lumen\n" +
      "- Farbtemperatur: 3000K (warmweiß)\n" +
      "- Schutzart Strahler: IP65\n" +
      "- Prüfsiegel: CE, RoHs\n" +
      "- CRI: >80\n" +
      "- Material: Metall\n" +
      "- Lichtfarbe: Warmweiß\n\n" +
      "Basislieferantenpreis: 80,00 € pro 6er Set, exkl. MwSt.",
    descriptionEn:
      "6-piece set of 3W LED recessed spots for veranda and terrace roofing. Warm white 3000K light colour.\n\n" +
      "Technical data:\n" +
      "- Power consumption: 3W per LED spot\n" +
      "- Output voltage: 12V\n" +
      "- Dimensions: 28 × 36 × 36 mm\n" +
      "- Luminous flux: 220 lm\n" +
      "- Colour temperature: 3000K (warm white)\n" +
      "- Protection rating: IP65\n" +
      "- Certificates: CE, RoHS\n" +
      "- CRI: >80\n" +
      "- Material: Metal\n" +
      "- Light colour: Warm white\n\n" +
      "Base supplier price 80.00 € per 6-piece set, excl. VAT.",
    applications: ["Accessories & Guttering"],
  };

  const ledSet12: Product = {
    id: "LED-SET-12x3W",
    category: "custom_profile",
    name: "12er Set 3 Watt LED-Einbaustrahler",
    nameEn: "12× 3W LED recessed spot set",
    dimensions: "Set of 12 veranda recessed spots, 3W each, 3000K warm white",
    pricePerMeter: euroKitToUkPriceKit(150), // treat as price per set
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Metal",
    finish: "Warm white light 3000K",
    image: undefined,
    description:
      "12er Set 3 Watt LED-Einbaustrahler für Terrassenüberdachung.\n\n" +
      "Kompletter Satz mit 12 Veranda-Einbaustrahlern, Lichtfarbe warmweiß 3000K.\n\n" +
      "Technische Daten:\n" +
      "- Stromverbrauch: 3 Watt pro LED Strahler\n" +
      "- Ausgangsspannung: 12 Volt\n" +
      "- Abmessungen: 28 x 36 x 36 mm\n" +
      "- Lichtstrom: 220 Lumen\n" +
      "- Farbtemperatur: 3000K (warmweiß)\n" +
      "- Schutzart Strahler: IP65\n" +
      "- Prüfsiegel: CE, RoHs\n" +
      "- CRI: >80\n" +
      "- Material: Metall\n" +
      "- Lichtfarbe: Warmweiß\n\n" +
      "Basislieferantenpreis: 150,00 € pro 12er Set, exkl. MwSt.",
    descriptionEn:
      "12-piece set of 3W LED recessed spots for veranda and terrace roofing. Warm white 3000K light colour.\n\n" +
      "Technical data:\n" +
      "- Power consumption: 3W per LED spot\n" +
      "- Output voltage: 12V\n" +
      "- Dimensions: 28 × 36 × 36 mm\n" +
      "- Luminous flux: 220 lm\n" +
      "- Colour temperature: 3000K (3000K warm white)\n" +
      "- Protection rating: IP65\n" +
      "- Certificates: CE, RoHS\n" +
      "- CRI: >80\n" +
      "- Material: Metal\n" +
      "- Light colour: Warm white\n\n" +
      "Base supplier price 150.00 € per 12-piece set, excl. VAT.",
    applications: ["Accessories & Guttering"],
  };

  products.push(ledSet6, ledSet12);

  // Small accessory pieces – priced per item (Stück)
  function euroEachToUkPriceEach(eurEach: number): number {
    const withMargin = eurEach * 1.5;
    return Math.round(withMargin * 100) / 100;
  }

  const stopperGutterSideCap: Product = {
    id: "ST00",
    category: "custom_profile",
    name: "Stopper Seitenkappe Rinne Seitenblende Endkappe",
    nameEn: "Gutter side cover stopper / end cap",
    dimensions: "Accessory piece, supplied per item",
    pricePerMeter: euroEachToUkPriceEach(7.0),
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium / accessory",
    finish: "Anthracite / matching gutter system",
    image: undefined,
    description:
      "Stopper Seitenkappe Rinne Seitenblende Endkappe.\n\n" +
      "Art.Nr. ST00, auf Lager, 7,00 € pro Stück, exkl. MwSt.\n\n" +
      "Zubehörteil als Endkappe bzw. Seitenkappe für Rinnen- und Seitenblendenprofile.",
    descriptionEn:
      "Gutter side cover stopper / end cap (Art. ST00), supplied per piece. " +
      "Accessory component used as an end cap / side cover for gutter and side fascia profiles.",
    applications: ["Accessories & Guttering"],
    priceUnit: "per item",
  };

  const sideCapWallProfile: Product = {
    id: "ST01",
    category: "custom_profile",
    name: "Seitenkappe Wandprofil Endkappe",
    nameEn: "Wall profile side cap / end cap",
    dimensions: "Accessory piece, supplied per item",
    pricePerMeter: euroEachToUkPriceEach(7.0),
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium / accessory",
    finish: "Anthracite / matching wall profile",
    image: undefined,
    description:
      "Seitenkappe Wandprofil Endkappe.\n\n" +
      "Art.Nr. ST01, auf Lager, 7,00 € pro Stück, exkl. MwSt.\n\n" +
      "Endkappe / Seitenkappe für Wandprofile in Veranda- und Terrassenüberdachungssystemen.",
    descriptionEn:
      "Wall profile side cap / end cap (Art. ST01), supplied per piece. " +
      "Accessory end cap for wall profiles in veranda and terrace roofing systems.",
    applications: ["Accessories & Guttering"],
    priceUnit: "per item",
  };

  const stopPlateRoofSheet: Product = {
    id: "ST02",
    category: "custom_profile",
    name: "Stopplatte | Stopper für Dachscheibenprofil",
    nameEn: "Stop plate / stopper for roof sheet profile",
    dimensions: "Accessory piece, supplied per item",
    pricePerMeter: euroEachToUkPriceEach(2.5),
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium / accessory",
    finish: "Matching roof sheet profile",
    image: undefined,
    description:
      "Stopplatte | Stopper für Dachscheibenprofil.\n\n" +
      "Art.Nr. ST02, auf Lager, 2,50 € pro Stück, exkl. MwSt.\n\n" +
      "Stopper zur Fixierung von Dachscheiben in Aluminiumprofilen.",
    descriptionEn:
      "Stop plate / stopper for roof sheet profile (Art. ST02), supplied per piece. " +
      "Accessory stopper used to locate and secure roof sheets in aluminium profiles.",
    applications: ["Accessories & Guttering"],
    priceUnit: "per item",
  };

  const endCapBeamStopper: Product = {
    id: "ST03",
    category: "custom_profile",
    name: "Endkappe | Kappe für Statikträger | Stopper",
    nameEn: "End cap / cap for structural beam / stopper",
    dimensions: "Accessory piece, supplied per item",
    pricePerMeter: euroEachToUkPriceEach(7.0),
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium / accessory",
    finish: "Matching structural beam profile",
    image: undefined,
    description:
      "Endkappe | Kappe für Statikträger | Stopper.\n\n" +
      "Art.Nr. ST03, auf Lager, 7,00 € pro Stück, exkl. MwSt.\n\n" +
      "Endkappe bzw. Stopper für Statikträgerprofile in Veranda- und Terrassenkonstruktionen.",
    descriptionEn:
      "End cap / stopper for structural beam profiles (Art. ST03), supplied per piece. " +
      "Accessory end cap used on structural beams in veranda and terrace constructions.",
    applications: ["Accessories & Guttering"],
    priceUnit: "per item",
  };

  products.push(stopperGutterSideCap, sideCapWallProfile, stopPlateRoofSheet, endCapBeamStopper);

  for (const product of products) {
    try {
      // eslint-disable-next-line no-console
      console.log(`Adding accessories product ${product.id} (${product.nameEn})...`);
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
    console.log(`Successfully added ${products.length} accessories product(s).`);
  }
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("add-accessories-products script failed:", err);
  process.exit(1);
});


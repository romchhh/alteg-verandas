import type { Product } from "../lib/types/product";
import { addProduct } from "../lib/data/products";

/**
 * Add terrace roof kit products (Polycarbonate & VSG) to SQLite.
 *
 * Run:
 *   npx tsx scripts/add-terrace-products.ts
 */

function euroKitToUkPriceKit(eurKit: number): number {
  // Business rule: take same numeric value in GBP and add +50% margin,
  // then round to the nearest 5 GBP for clean kit prices.
  const withMargin = eurKit * 1.5;
  return Math.round(withMargin / 5) * 5;
}

async function run() {
  const products: Product[] = [];

  // Polycarbonate terrace roof kits
  const terrace400x300Poly: Product = {
    id: "TU003",
    category: "custom_profile",
    name: "Terrasseüberdachung 400×300 für Polycarbonat Bausatz",
    nameEn: "Terrace roof kit 400×300 for polycarbonate",
    dimensions: "400cm projection × 300cm width, designed for polycarbonate roof panels",
    pricePerMeter: euroKitToUkPriceKit(1298.3), // per kit
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium construction with polycarbonate roof",
    finish: "Anthracite RAL 7016",
    image:
      "https://alu-ams.de/wp-content/uploads/2022/07/Terrasseueberdachung-mit-Polycarbonat03.jpg",
    description:
      "Terrasseüberdachung 400×300 für Polycarbonat – kompletter Bausatz aus Alu‑Profilen, " +
      "Dichtungen und Zubehör.\n\n" +
      "Art.Nr. TU003, auf Lager, ab 1.298,30 € exkl. MwSt.\n\n" +
      "Eigenschaften:\n" +
      "- Hochwertige Aluminiumkonstruktion in Anthrazit RAL 7016\n" +
      "- Ausgelegt für Polycarbonat-Dacheindeckung\n" +
      "- Inklusive aller benötigten Profile, Dichtungen und Standardbefestigungsteile\n\n" +
      "Ideal als Terrassenüberdachung bzw. Verandadach für den privaten und gewerblichen Einsatz.",
    descriptionEn:
      "Terrace roof kit 400×300 for polycarbonate – complete set made from aluminium profiles, " +
      "gaskets and accessories.\n\n" +
      "Art. TU003, in stock, base supplier price from 1,298.30 € excl. VAT.\n\n" +
      "Features:\n" +
      "- High‑quality aluminium construction in anthracite RAL 7016\n" +
      "- Designed for polycarbonate roofing sheets\n" +
      "- Includes all necessary profiles, seals and standard fixing components\n\n" +
      "Ideal as a terrace or veranda roof for residential and light commercial applications.",
    applications: ["Terrace roofing kits – polycarbonate"],
    priceUnit: "per set",
  };

  const terrace500x350Poly: Product = {
    id: "TU009",
    category: "custom_profile",
    name: "Terrasseüberdachung 500×350 für Polycarbonat Bausatz",
    nameEn: "Terrace roof kit 500×350 for polycarbonate",
    dimensions: "500cm projection × 350cm width, designed for polycarbonate roof panels",
    pricePerMeter: euroKitToUkPriceKit(1571.22), // per kit
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium construction with polycarbonate roof",
    finish: "Anthracite RAL 7016",
    image:
      "https://alu-ams.de/wp-content/uploads/2022/09/Terrasseueberdachung-mit-Polycarbonat08.jpg",
    description:
      "Terrasseüberdachung Bausatz 500×350 für Polycarbonat.\n\n" +
      "Kompletter Bausatz aus Alu‑Profilen, Dichtungen und Zubehör in Anthrazit RAL 7016, " +
      "hochwertiges Aluminium.\n\n" +
      "Art.Nr. TU009, auf Lager, ab 1.571,22 € exkl. MwSt.\n\n" +
      "Kategorien: Überdachungen, Alle Produkte, Polycarbonat, Terrassenüberdachung Bausatz.\n" +
      "Tags: Sichtschutz Terrasse, Terrassenüberdachung Alu, Überdachung Terrasse.",
    descriptionEn:
      "Terrace roof kit 500×350 for polycarbonate.\n\n" +
      "Complete kit made from aluminium profiles, gaskets and accessories in anthracite RAL 7016 " +
      "with high‑quality aluminium construction.\n\n" +
      "Art. TU009, in stock, base supplier price from 1,571.22 € excl. VAT.\n\n" +
      "Categories: Canopies, All products, Polycarbonate, terrace roof kits.\n" +
      "Tags: terrace privacy, aluminium terrace roof, terrace canopy.",
    applications: ["Terrace roofing kits – polycarbonate"],
    priceUnit: "per set",
  };

  const terrace600x350Poly: Product = {
    id: "TU010",
    category: "custom_profile",
    name: "Terrasseüberdachung 600×350 für Polycarbonat Bausatz",
    nameEn: "Terrace roof kit 600×350 for polycarbonate",
    dimensions: "600cm projection × 350cm width, designed for polycarbonate roof panels",
    pricePerMeter: euroKitToUkPriceKit(1865.35), // per kit
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium construction with polycarbonate roof",
    finish: "Anthracite RAL 7016",
    image:
      "https://alu-ams.de/wp-content/uploads/2022/09/Terrasseueberdachung-mit-Polycarbonat10.jpg",
    description:
      "Terrasseüberdachung Bausatz 600×350 für Polycarbonat.\n\n" +
      "Kompletter Bausatz aus Alu‑Profilen, Dichtungen und Zubehör in Anthrazit RAL 7016, " +
      "hochwertiges Aluminium.\n\n" +
      "Art.Nr. TU010, auf Lager, ab 1.865,35 € exkl. MwSt.\n\n" +
      "Kategorien: Überdachungen, Alle Produkte, Polycarbonat, Terrassenüberdachung Bausatz.\n" +
      "Tags: Sichtschutz Terrasse, Terrassenüberdachung Alu, Überdachung Terrasse.",
    descriptionEn:
      "Terrace roof kit 600×350 for polycarbonate.\n\n" +
      "Complete kit made from aluminium profiles, gaskets and accessories in anthracite RAL 7016 " +
      "with high‑quality aluminium.\n\n" +
      "Art. TU010, in stock, base supplier price from 1,865.35 € excl. VAT.\n\n" +
      "Categories: Canopies, All products, Polycarbonate, terrace roof kits.\n" +
      "Tags: terrace privacy, aluminium terrace roof, terrace canopy.",
    applications: ["Terrace roofing kits – polycarbonate"],
    priceUnit: "per set",
  };

  const terrace700x350Poly: Product = {
    id: "TU011",
    category: "custom_profile",
    name: "Terrasseüberdachung 700×350 für Polycarbonat Bausatz",
    nameEn: "Terrace roof kit 700×350 for polycarbonate",
    dimensions: "700cm projection × 350cm width, designed for polycarbonate roof panels",
    pricePerMeter: euroKitToUkPriceKit(2151.18), // per kit
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium construction with polycarbonate roof",
    finish: "Anthracite RAL 7016",
    image:
      "https://alu-ams.de/wp-content/uploads/2022/09/Terrasseueberdachung-mit-Polycarbonat12.jpg",
    description:
      "Terrasseüberdachung Bausatz 700×350 für Polycarbonat.\n\n" +
      "Kompletter Bausatz aus Alu‑Profilen, Dichtungen und Zubehör in Anthrazit RAL 7016, " +
      "hochwertiges Aluminium.\n\n" +
      "Art.Nr. TU011, auf Lager, ab 2.151,18 € exkl. MwSt.\n\n" +
      "Kategorien: Überdachungen, Alle Produkte, Polycarbonat, Terrassenüberdachung Bausatz.\n" +
      "Tags: Sichtschutz Terrasse, Terrassenüberdachung Alu, Überdachung Terrasse.",
    descriptionEn:
      "Terrace roof kit 700×350 for polycarbonate.\n\n" +
      "Complete kit made from aluminium profiles, gaskets and accessories in anthracite RAL 7016 " +
      "with high‑quality aluminium.\n\n" +
      "Art. TU011, in stock, base supplier price from 2,151.18 € excl. VAT.\n\n" +
      "Categories: Canopies, All products, Polycarbonate, terrace roof kits.\n" +
      "Tags: terrace privacy, aluminium terrace roof, terrace canopy.",
    applications: ["Terrace roofing kits – polycarbonate"],
    priceUnit: "per set",
  };

  const terrace500x400Poly: Product = {
    id: "TU004",
    category: "custom_profile",
    name: "Terrasseüberdachung 500×400 für Polycarbonat Bausatz",
    nameEn: "Terrace roof kit 500×400 for polycarbonate",
    dimensions: "500cm projection × 400cm width, designed for polycarbonate roof panels",
    pricePerMeter: euroKitToUkPriceKit(1739.07), // per kit
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium construction with polycarbonate roof",
    finish: "Anthracite RAL 7016",
    image:
      "https://alu-ams.de/wp-content/uploads/2022/08/Terrasseueberdachung-mit-Polycarbonat04.jpg",
    description:
      "Terrasseüberdachung Bausatz 500×400 für Polycarbonat.\n\n" +
      "Kompletter Bausatz aus Alu‑Profilen, Dichtungen und Zubehör in Anthrazit RAL 7016, " +
      "hochwertiges Aluminium.\n\n" +
      "Art.Nr. TU004, auf Lager, ab 1.739,07 € exkl. MwSt.\n\n" +
      "Kategorien: Überdachungen, Alle Produkte, Polycarbonat, Terrassenüberdachung Bausatz.\n" +
      "Tags: Sichtschutz Terrasse, Terrassenüberdachung Alu, Überdachung Terrasse.",
    descriptionEn:
      "Terrace roof kit 500×400 for polycarbonate.\n\n" +
      "Complete kit made from aluminium profiles, gaskets and accessories in anthracite RAL 7016 " +
      "with high‑quality aluminium construction.\n\n" +
      "Art. TU004, in stock, base supplier price from 1,739.07 € excl. VAT.\n\n" +
      "Categories: canopies, all products, polycarbonate, terrace roof kits.\n" +
      "Tags: terrace privacy, aluminium terrace roof, terrace canopy.",
    applications: ["Terrace roofing kits – polycarbonate"],
    priceUnit: "per set",
  };

  const terrace600x400Poly: Product = {
    id: "TU002",
    category: "custom_profile",
    name: "Terrasseüberdachung 600×400 für Polycarbonat Bausatz",
    nameEn: "Terrace roof kit 600×400 for polycarbonate",
    dimensions: "600cm projection × 400cm width, designed for polycarbonate roof panels",
    pricePerMeter: euroKitToUkPriceKit(1985.23), // per kit
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium construction with polycarbonate roof",
    finish: "Anthracite RAL 7016",
    image:
      "https://alu-ams.de/wp-content/uploads/2022/07/Terrasseueberdachung-mit-Polycarbonat05.jpg",
    description:
      "Terrasseüberdachung Bausatz 600×400 für Polycarbonat.\n\n" +
      "Kompletter Bausatz aus Alu‑Profilen, Dichtungen und Zubehör in Anthrazit RAL 7016, " +
      "hochwertiges Aluminium.\n\n" +
      "Art.Nr. TU002, auf Lager, ab 1.985,23 € exkl. MwSt.\n\n" +
      "Kategorien: Überdachungen, Alle Produkte, Polycarbonat, Terrassenüberdachung Bausatz.\n" +
      "Tags: Sichtschutz Terrasse, Terrassenüberdachung Alu, Überdachung Terrasse.",
    descriptionEn:
      "Terrace roof kit 600×400 for polycarbonate.\n\n" +
      "Complete kit made from aluminium profiles, gaskets and accessories in anthracite RAL 7016 " +
      "with high‑quality aluminium.\n\n" +
      "Art. TU002, in stock, base supplier price from 1,985.23 € excl. VAT.\n\n" +
      "Categories: canopies, all products, polycarbonate, terrace roof kits.\n" +
      "Tags: terrace privacy, aluminium terrace roof, terrace canopy.",
    applications: ["Terrace roofing kits – polycarbonate"],
    priceUnit: "per set",
  };

  const terrace700x400Poly: Product = {
    id: "TU001",
    category: "custom_profile",
    name: "Terrasseüberdachung 700×400 für Polycarbonat Bausatz",
    nameEn: "Terrace roof kit 700×400 for polycarbonate",
    dimensions: "700cm projection × 400cm width, designed for polycarbonate roof panels",
    pricePerMeter: euroKitToUkPriceKit(2266.38), // per kit
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium construction with polycarbonate roof",
    finish: "Anthracite RAL 7016",
    image:
      "https://alu-ams.de/wp-content/uploads/2022/07/Terrasseueberdachung-mit-Polycarbonat06.jpg",
    description:
      "Terrasseüberdachung Bausatz 700×400 für Polycarbonat.\n\n" +
      "Kompletter Bausatz aus Alu‑Profilen, Dichtungen und Zubehör in Anthrazit RAL 7016, " +
      "hochwertiges Aluminium.\n\n" +
      "Art.Nr. TU001, auf Lager, ab 2.266,38 € exkl. MwSt.\n\n" +
      "Kategorien: Überdachungen, Alle Produkte, Polycarbonat, Terrassenüberdachung Bausatz.\n" +
      "Tags: Sichtschutz Terrasse, Terrassenüberdachung Alu, Überdachung Terrasse.",
    descriptionEn:
      "Terrace roof kit 700×400 for polycarbonate.\n\n" +
      "Complete kit made from aluminium profiles, gaskets and accessories in anthracite RAL 7016 " +
      "with high‑quality aluminium.\n\n" +
      "Art. TU001, in stock, base supplier price from 2,266.38 € excl. VAT.\n\n" +
      "Categories: canopies, all products, polycarbonate, terrace roof kits.\n" +
      "Tags: terrace privacy, aluminium terrace roof, terrace canopy.",
    applications: ["Terrace roofing kits – polycarbonate"],
    priceUnit: "per set",
  };

  const terrace500x450Poly: Product = {
    id: "TERR-POLY-500x450",
    category: "custom_profile",
    name: "Terrasseüberdachung 500×450 für Polycarbonat Bausatz",
    nameEn: "Terrace roof kit 500×450 for polycarbonate",
    dimensions: "500cm projection × 450cm width, designed for polycarbonate roof panels",
    pricePerMeter: euroKitToUkPriceKit(1932.31), // per kit
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium construction with polycarbonate roof",
    finish: "Anthracite RAL 7016",
    image:
      "https://alu-ams.de/wp-content/uploads/2023/02/Terrasseueberdachung-mit-Polycarbonat-02.jpg",
    description:
      "Terrasseüberdachung Bausatz 500×450 für Polycarbonat.\n\n" +
      "Kompletter Bausatz aus Alu‑Profilen, Dichtungen und Zubehör in Anthrazit RAL 7016, " +
      "hochwertiges Aluminium.\n\n" +
      "Auf Lager, ab 1.932,31 € exkl. MwSt.\n\n" +
      "Kategorien: Alle Produkte, Polycarbonat, Überdachungen.\n" +
      "Tags: Terrassenüberdachung Alu, Überdachung Terrasse.",
    descriptionEn:
      "Terrace roof kit 500×450 for polycarbonate.\n\n" +
      "Complete kit made from aluminium profiles, gaskets and accessories in anthracite RAL 7016 " +
      "with high‑quality aluminium.\n\n" +
      "In stock, base supplier price from 1,932.31 € excl. VAT.\n\n" +
      "Categories: all products, polycarbonate, canopies.\n" +
      "Tags: aluminium terrace roof, terrace canopy.",
    applications: ["Terrace roofing kits – polycarbonate"],
    priceUnit: "per set",
  };

  const terrace600x450Poly: Product = {
    id: "TERR-POLY-600x450",
    category: "custom_profile",
    name: "Terrasseüberdachung 600×450 für Polycarbonat Bausatz",
    nameEn: "Terrace roof kit 600×450 for polycarbonate",
    dimensions: "600cm projection × 450cm width, designed for polycarbonate roof panels",
    pricePerMeter: euroKitToUkPriceKit(2176.72), // per kit
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium construction with polycarbonate roof",
    finish: "Anthracite RAL 7016",
    image:
      "https://alu-ams.de/wp-content/uploads/2023/02/Terrasseueberdachung-mit-Polycarbonat-03.jpg",
    description:
      "Terrasseüberdachung Bausatz 600×450 für Polycarbonat.\n\n" +
      "Kompletter Bausatz aus Alu‑Profilen, Dichtungen und Zubehör in Anthrazit RAL 7016, " +
      "hochwertiges Aluminium.\n\n" +
      "Auf Lager, ab 2.176,72 € exkl. MwSt.\n\n" +
      "Kategorien: Alle Produkte, Polycarbonat, Überdachungen.\n" +
      "Tags: Terrassenüberdachung Alu, Überdachung Terrasse.",
    descriptionEn:
      "Terrace roof kit 600×450 for polycarbonate.\n\n" +
      "Complete kit made from aluminium profiles, gaskets and accessories in anthracite RAL 7016 " +
      "with high‑quality aluminium.\n\n" +
      "In stock, base supplier price from 2,176.72 € excl. VAT.\n\n" +
      "Categories: all products, polycarbonate, canopies.\n" +
      "Tags: aluminium terrace roof, terrace canopy.",
    applications: ["Terrace roofing kits – polycarbonate"],
    priceUnit: "per set",
  };

  const terrace700x450Poly: Product = {
    id: "TERR-POLY-700x450",
    category: "custom_profile",
    name: "Terrasseüberdachung 700×450 für Polycarbonat Bausatz",
    nameEn: "Terrace roof kit 700×450 for polycarbonate",
    dimensions: "700cm projection × 450cm width, designed for polycarbonate roof panels",
    pricePerMeter: euroKitToUkPriceKit(2544.47), // per kit
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium construction with polycarbonate roof",
    finish: "Anthracite RAL 7016",
    image:
      "https://alu-ams.de/wp-content/uploads/2023/02/Terrasseueberdachung-mit-Polycarbonat-01.jpg",
    description:
      "Terrasseüberdachung Bausatz 700×450 für Polycarbonat.\n\n" +
      "Kompletter Bausatz aus Alu‑Profilen, Dichtungen und Zubehör in Anthrazit RAL 7016, " +
      "hochwertiges Aluminium.\n\n" +
      "Auf Lager, ab 2.544,47 € exkl. MwSt.\n\n" +
      "Kategorien: Alle Produkte, Polycarbonat, Überdachungen.\n" +
      "Tags: Terrassenüberdachung Alu, Überdachung Terrasse.",
    descriptionEn:
      "Terrace roof kit 700×450 for polycarbonate.\n\n" +
      "Complete kit made from aluminium profiles, gaskets and accessories in anthracite RAL 7016 " +
      "with high‑quality aluminium.\n\n" +
      "In stock, base supplier price from 2,544.47 € excl. VAT.\n\n" +
      "Categories: all products, polycarbonate, canopies.\n" +
      "Tags: aluminium terrace roof, terrace canopy.",
    applications: ["Terrace roofing kits – polycarbonate"],
    priceUnit: "per set",
  };

  // VSG glass terrace roof kits
  const terrace500x350Vsg: Product = {
    id: "TU017",
    category: "custom_profile",
    name: "Terrasseüberdachung 500×350 für VSG Bausatz",
    nameEn: "Terrace roof kit 500×350 for VSG glass",
    dimensions: "500cm projection × 350cm width, designed for VSG glass roof panels",
    pricePerMeter: euroKitToUkPriceKit(1760.41), // per kit
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium construction with VSG glass",
    finish: "Anthracite RAL 7016",
    image:
      "https://alu-ams.de/wp-content/uploads/2022/09/Terrasseueberdachung-VSG-Glas10.jpg",
    description:
      "Terrasseüberdachung Bausatz 500×350 für VSG.\n\n" +
      "Kompletter Bausatz aus Alu‑Profilen, Dichtungen und Zubehör in Anthrazit RAL 7016, " +
      "hochwertiges Aluminium.\n\n" +
      "Art.Nr. TU017, auf Lager, ab 1.760,41 € exkl. MwSt.\n\n" +
      "Kategorien: Überdachungen, Terrassenüberdachung Bausatz, VSG.\n" +
      "Tags: Sichtschutz Terrasse, Terrassendach Alu Bausatz, Überdachung Terrasse.",
    descriptionEn:
      "Terrace roof kit 500×350 for VSG laminated safety glass.\n\n" +
      "Complete kit made from aluminium profiles, gaskets and accessories in anthracite RAL 7016 " +
      "with high‑quality aluminium.\n\n" +
      "Art. TU017, in stock, base supplier price from 1,760.41 € excl. VAT.\n\n" +
      "Categories: Canopies, terrace roof kits, VSG.\n" +
      "Tags: terrace privacy, aluminium terrace roof kit, terrace canopy.",
    applications: ["Terrace roofing kits – VSG glass"],
    priceUnit: "per set",
  };

  const terrace500x400Vsg: Product = {
    id: "TU018",
    category: "custom_profile",
    name: "Terrasseüberdachung 500×400 für VSG Bausatz",
    nameEn: "Terrace roof kit 500×400 for VSG glass",
    dimensions: "500cm projection × 400cm width, designed for VSG glass roof panels",
    pricePerMeter: euroKitToUkPriceKit(1878.52), // per kit
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium construction with VSG glass",
    finish: "Anthracite RAL 7016",
    image:
      "https://alu-ams.de/wp-content/uploads/2022/09/Terrasseueberdachung-VSG-Glas01.jpg",
    description:
      "Terrasseüberdachung Bausatz 500×400 für VSG.\n\n" +
      "Kompletter Bausatz aus Alu‑Profilen, Dichtungen und Zubehör in Anthrazit RAL 7016, " +
      "hochwertiges Aluminium.\n\n" +
      "Art.Nr. TU018, auf Lager, ab 1.878,52 € exkl. MwSt.\n\n" +
      "Kategorien: Überdachungen, Terrassenüberdachung Bausatz, VSG.\n" +
      "Tags: Sichtschutz Terrasse, Terrassendach Alu Bausatz, Überdachung Terrasse.",
    descriptionEn:
      "Terrace roof kit 500×400 for VSG laminated safety glass.\n\n" +
      "Complete kit made from aluminium profiles, gaskets and accessories in anthracite RAL 7016 " +
      "with high‑quality aluminium.\n\n" +
      "Art. TU018, in stock, base supplier price from 1,878.52 € excl. VAT.\n\n" +
      "Categories: Canopies, terrace roof kits, VSG.\n" +
      "Tags: terrace privacy, aluminium terrace roof kit, terrace canopy.",
    applications: ["Terrace roofing kits – VSG glass"],
    priceUnit: "per set",
  };

  const terrace600x350Vsg: Product = {
    id: "TU020",
    category: "custom_profile",
    name: "Terrasseüberdachung 600×350 für VSG Bausatz",
    nameEn: "Terrace roof kit 600×350 for VSG glass",
    dimensions: "600cm projection × 350cm width, designed for VSG glass roof panels",
    pricePerMeter: euroKitToUkPriceKit(2166.65), // per kit
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium construction with VSG glass",
    finish: "Anthracite RAL 7016",
    image:
      "https://alu-ams.de/wp-content/uploads/2022/09/Terrasseueberdachung-VSG-Glas11.jpg",
    description:
      "Terrasseüberdachung Bausatz 600×350 für VSG.\n\n" +
      "Kompletter Bausatz aus Alu‑Profilen, Dichtungen und Zubehör in Anthrazit RAL 7016, " +
      "hochwertiges Aluminium.\n\n" +
      "Art.Nr. TU020, auf Lager, ab 2.166,65 € exkl. MwSt.\n\n" +
      "Kategorien: Überdachungen, Terrassenüberdachung Bausatz, VSG.\n" +
      "Tags: Sichtschutz Terrasse, Terrassendach Alu Bausatz, Überdachung Terrasse.",
    descriptionEn:
      "Terrace roof kit 600×350 for VSG laminated safety glass.\n\n" +
      "Complete kit made from aluminium profiles, gaskets and accessories in anthracite RAL 7016 " +
      "with high‑quality aluminium.\n\n" +
      "Art. TU020, in stock, base supplier price from 2,166.65 € excl. VAT.\n\n" +
      "Categories: Canopies, terrace roof kits, VSG.\n" +
      "Tags: terrace privacy, aluminium terrace roof kit, terrace canopy.",
    applications: ["Terrace roofing kits – VSG glass"],
    priceUnit: "per set",
  };

  const terrace600x400Vsg: Product = {
    id: "TU021",
    category: "custom_profile",
    name: "Terrasseüberdachung 600×400 für VSG Bausatz",
    nameEn: "Terrace roof kit 600×400 for VSG glass",
    dimensions: "600cm projection × 400cm width, designed for VSG glass roof panels",
    pricePerMeter: euroKitToUkPriceKit(2319.22), // per kit
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium construction with VSG glass",
    finish: "Anthracite RAL 7016",
    image:
      "https://alu-ams.de/wp-content/uploads/2022/09/Terrasseueberdachung-VSG-Glas02.jpg",
    description:
      "Terrasseüberdachung Bausatz 600×400 für VSG.\n\n" +
      "Kompletter Bausatz aus Alu‑Profilen, Dichtungen und Zubehör in Anthrazit RAL 7016, " +
      "hochwertiges Aluminium.\n\n" +
      "Art.Nr. TU021, auf Lager, ab 2.319,22 € exkl. MwSt.\n\n" +
      "Kategorien: Überdachungen, Terrassenüberdachung Bausatz, VSG.\n" +
      "Tags: Sichtschutz Terrasse, Terrassendach Alu Bausatz, Überdachung Terrasse.",
    descriptionEn:
      "Terrace roof kit 600×400 for VSG laminated safety glass.\n\n" +
      "Complete kit made from aluminium profiles, gaskets and accessories in anthracite RAL 7016 " +
      "with high‑quality aluminium.\n\n" +
      "Art. TU021, in stock, base supplier price from 2,319.22 € excl. VAT.\n\n" +
      "Categories: Canopies, terrace roof kits, VSG.\n" +
      "Tags: terrace privacy, aluminium terrace roof kit, terrace canopy.",
    applications: ["Terrace roofing kits – VSG glass"],
    priceUnit: "per set",
  };

  const terrace700x350Vsg: Product = {
    id: "TU023",
    category: "custom_profile",
    name: "Terrasseüberdachung 700×350 für VSG Bausatz",
    nameEn: "Terrace roof kit 700×350 for VSG glass",
    dimensions: "700cm projection × 350cm width, designed for VSG glass roof panels",
    pricePerMeter: euroKitToUkPriceKit(2395.92), // per kit
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium construction with VSG glass",
    finish: "Anthracite RAL 7016",
    image:
      "https://alu-ams.de/wp-content/uploads/2022/09/Terrasseueberdachung-VSG-Glas061.jpg",
    description:
      "Terrasseüberdachung Bausatz 700×350 für VSG.\n\n" +
      "Kompletter Bausatz aus Alu‑Profilen, Dichtungen und Zubehör in Anthrazit RAL 7016, " +
      "hochwertiges Aluminium.\n\n" +
      "Art.Nr. TU023, auf Lager, ab 2.395,92 € exkl. MwSt.\n\n" +
      "Kategorien: Überdachungen, Terrassenüberdachung Bausatz, VSG.\n" +
      "Tags: Sichtschutz Terrasse, Terrassendach Alu Bausatz, Überdachung Terrasse.",
    descriptionEn:
      "Terrace roof kit 700×350 for VSG laminated safety glass.\n\n" +
      "Complete kit made from aluminium profiles, gaskets and accessories in anthracite RAL 7016 " +
      "with high‑quality aluminium.\n\n" +
      "Art. TU023, in stock, base supplier price from 2,395.92 € excl. VAT.\n\n" +
      "Categories: canopies, terrace roof kits, VSG.\n" +
      "Tags: terrace privacy, aluminium terrace roof kit, terrace canopy.",
    applications: ["Terrace roofing kits – VSG glass"],
    priceUnit: "per set",
  };

  const terrace700x400Vsg: Product = {
    id: "TU024",
    category: "custom_profile",
    name: "Terrasseüberdachung 700×400 für VSG Bausatz",
    nameEn: "Terrace roof kit 700×400 for VSG glass",
    dimensions: "700cm projection × 400cm width, designed for VSG glass roof panels",
    pricePerMeter: euroKitToUkPriceKit(2565.3), // per kit
    pricePerKg: undefined,
    weightPerMeter: 1,
    standardLengths: [],
    inStock: true,
    hidden: false,
    material: "Aluminium construction with VSG glass",
    finish: "Anthracite RAL 7016",
    image:
      "https://alu-ams.de/wp-content/uploads/2022/09/Terrasseueberdachung-VSG-Glas05-1.jpg",
    description:
      "Terrasseüberdachung Bausatz 700×400 für VSG.\n\n" +
      "Kompletter Bausatz aus Alu‑Profilen, Dichtungen und Zubehör in Anthrazit RAL 7016, " +
      "hochwertiges Aluminium.\n\n" +
      "Art.Nr. TU024, auf Lager, ab 2.565,30 € exkl. MwSt.\n\n" +
      "Kategorien: Überdachungen, Terrassenüberdachung Bausatz, VSG.\n" +
      "Tags: Sichtschutz Terrasse, Terrassendach Alu Bausatz, Überdachung Terrasse.",
    descriptionEn:
      "Terrace roof kit 700×400 for VSG laminated safety glass.\n\n" +
      "Complete kit made from aluminium profiles, gaskets and accessories in anthracite RAL 7016 " +
      "with high‑quality aluminium.\n\n" +
      "Art. TU024, in stock, base supplier price from 2,565.30 € excl. VAT.\n\n" +
      "Categories: canopies, terrace roof kits, VSG.\n" +
      "Tags: terrace privacy, aluminium terrace roof kit, terrace canopy.",
    applications: ["Terrace roofing kits – VSG glass"],
    priceUnit: "per set",
  };

  products.push(
    terrace400x300Poly,
    terrace500x350Poly,
    terrace600x350Poly,
    terrace700x350Poly,
    terrace500x400Poly,
    terrace600x400Poly,
    terrace700x400Poly,
    terrace500x450Poly,
    terrace600x450Poly,
    terrace700x450Poly,
    terrace500x350Vsg,
    terrace500x400Vsg,
    terrace600x350Vsg,
    terrace600x400Vsg,
    terrace700x350Vsg,
    terrace700x400Vsg,
  );

  for (const product of products) {
    try {
      // eslint-disable-next-line no-console
      console.log(`Adding terrace product ${product.id} (${product.nameEn})...`);
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
    console.log(`Successfully added ${products.length} terrace product(s).`);
  }
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("add-terrace-products script failed:", err);
  process.exit(1);
});


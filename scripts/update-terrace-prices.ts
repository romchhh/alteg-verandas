import { getProducts, updateProduct } from "../lib/data/products";

/**
 * Bulk‑update terrace-related product prices based on material:
 *
 * - Polycarbonate terrace kits: * 1.1
 * - VSG glass terrace kits:     * 2
 * - Fencing / Profiles / Accessories marketing categories: * 1.5
 *
 * Run:
 *   npx tsx scripts/update-terrace-prices.ts
 */

async function run() {
  const products = await getProducts();

  let updatedCount = 0;

  for (const product of products) {
    const applications = product.applications ?? [];
    const nameEn = product.nameEn ?? "";

    // Match veranda kits the same way as in the VerandasCategorySection:
    const hasPolyTerrace =
      applications.includes("Terrace roofing kits – polycarbonate") || /poly/i.test(nameEn);
    const hasVsgTerrace =
      applications.includes("Terrace roofing kits – VSG glass") || /vsg|glass/i.test(nameEn);
    const isFencing = applications.includes("Aluminium Fencing");
    const isProfiles = applications.includes("Profile Systems");
    const isAccessoriesMarketing = applications.includes("Accessories & Guttering");

    let multiplier: number | null = null;

    if (hasPolyTerrace) {
      // Тераси полікарбонат * 1.1
      multiplier = 1.1;
    } else if (hasVsgTerrace) {
      // Тераси з VSG * 2
      multiplier = 2;
    } else if (isFencing || isProfiles || isAccessoriesMarketing) {
      // Fencing / Profile Systems / Accessories * 1.5
      multiplier = 1.5;
    }

    if (!multiplier || product.pricePerMeter == null) continue;

    const oldPrice = product.pricePerMeter;
    const newPrice = Math.round(oldPrice * multiplier * 100) / 100;

    if (newPrice === oldPrice) continue;

    // eslint-disable-next-line no-console
    console.log(
      `Updating ${product.id} (${product.nameEn}) from ${oldPrice} to ${newPrice} (x${multiplier})`,
    );

    await updateProduct(product.id, {
      pricePerMeter: newPrice,
    });

    updatedCount += 1;
  }

  // eslint-disable-next-line no-console
  console.log(`Updated prices for ${updatedCount} product(s).`);
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("update-terrace-prices script failed:", err);
  process.exit(1);
});


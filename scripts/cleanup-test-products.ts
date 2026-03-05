import { getProducts, deleteProduct } from "../lib/data/products";

// Keep only these real products (imported from alu-ams script)
const ALLOWED_IDS = [
  "A045",
  "A046",
  "A044",
  "12011",
  "12009",
  "12007",
  "12006",
  "12010",
  "12008",
  "12001",
  "12005",
  "12003",
  "TU003",
];

async function run() {
  const products = await getProducts();
  const toDelete = products.filter((p) => !ALLOWED_IDS.includes(p.id));

  for (const p of toDelete) {
    try {
      await deleteProduct(p.id);
      // eslint-disable-next-line no-console
      console.log(`Deleted test product ${p.id} (${p.nameEn ?? p.name})`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Failed to delete ${p.id}:`, err);
    }
  }

  // eslint-disable-next-line no-console
  console.log(`Cleanup finished. Kept ${ALLOWED_IDS.length} real products, deleted ${toDelete.length}.`);
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Cleanup failed:", err);
  process.exit(1);
});


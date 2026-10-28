import ImportTool from "@/components/admin/ImportTool";
import { getBrands, getCategories, getProducts } from "@/lib/store";

export default async function ImportPage() {
  const products = await getProducts();
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Import spreadsheet</h1>
      <p className="mt-1 max-w-2xl text-steel-500">
        Upload the product spreadsheet as CSV. Every row is checked before anything is saved — missing model numbers, unknown
        categories or brands, duplicates, and missing photos or brochures are flagged for follow-up.
      </p>
      <ImportTool categories={getCategories()} brands={getBrands()} existingModels={products.map((p) => p.model)} />
    </div>
  );
}

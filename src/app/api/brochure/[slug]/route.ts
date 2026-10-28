import { promises as fs } from "fs";
import path from "path";
import { buildSpecSheet } from "@/lib/pdf";
import { getBrands, getCategories, getProduct, UPLOAD_DIR } from "@/lib/store";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const product = await getProduct((await params).slug);
  if (!product) return new Response("Not found", { status: 404 });

  const filename = `${product.model}-brochure.pdf`;
  let data: Uint8Array<ArrayBuffer>;
  if (product.brochure) {
    data = new Uint8Array(await fs.readFile(path.join(UPLOAD_DIR, path.basename(product.brochure))));
  } else {
    const brand = getBrands().find((b) => b.slug === product.brand);
    const category = getCategories().find((c) => c.slug === product.category);
    data = new Uint8Array(buildSpecSheet(product, brand, category));
  }
  return new Response(data, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  });
}

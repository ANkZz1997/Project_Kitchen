import Footer from "@/components/Footer";
import Header from "@/components/Header";
import EnquiryDrawer from "@/components/enquiry/EnquiryDrawer";
import { getProducts } from "@/lib/store";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const index = (await getProducts()).map(({ slug, name, model, summary, art, images, category }) => ({
    slug,
    name,
    model,
    summary,
    art,
    images,
    category,
  }));
  return (
    <>
      <Header index={index} />
      <main>{children}</main>
      <Footer />
      <EnquiryDrawer />
    </>
  );
}

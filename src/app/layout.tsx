import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { ArtDefs } from "@/components/EquipmentArt";
import { EnquiryProvider } from "@/components/enquiry/EnquiryProvider";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const display = Inter_Tight({ subsets: ["latin"], variable: "--font-heading", weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description:
    "Browse commercial kitchen equipment — cooking, refrigeration, food prep, dishwashing, coffee and bakery — and request one consolidated quotation.",
};

export const viewport: Viewport = { themeColor: "#0f1114" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-dvh font-sans">
        <ArtDefs />
        <EnquiryProvider>{children}</EnquiryProvider>
      </body>
    </html>
  );
}

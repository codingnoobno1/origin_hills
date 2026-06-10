import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Origin Hills | Calm Luxury Estate Teas",
  description: "Experience the quiet luxury of Origin Hills. Meticulously hand-plucked and single-estate sourced teas from Darjeeling, Uji, Wuyi and the high Nepalese terroirs.",
  keywords: ["premium tea", "luxury tea", "loro piana of tea", "darjeeling", "matcha", "single estate", "calm luxury"],
  authors: [{ name: "Origin Hills" }],
  openGraph: {
    title: "Origin Hills | Calm Luxury Estate Teas",
    description: "Experience the quiet luxury of Origin Hills. Meticulously hand-plucked and single-estate sourced teas.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-forest selection:bg-forest selection:text-ivory">
        {children}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}

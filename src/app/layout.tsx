import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { LangProvider } from "@/lib/astrology/language-context";
import { NavBar } from "./nav-bar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "वेंकटेश ज्योतिष — Venkatesh Astrology",
  description: "अचूक कुंडली, राशीफल, गुण मिलान आणि पंचांग. वैदिक ज्योतिष सेवा.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <LangProvider>
          <div className="flex flex-col min-h-screen bg-[#FAFAF8]">
            <NavBar />

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="text-white/60" style={{ background: "#1a0505", marginTop: "-2px", paddingTop: "2px" }}>
              <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                  <div>
                    <span className="font-bold text-base" style={{ color: "#d4a843" }}>Venkatesh Astrology</span>
                    <p className="text-sm leading-relaxed mt-2 text-white/50">
                      Accurate Vedic astrology calculations for kundli, matching, panchang and rashifal.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-sm" style={{ color: "#d4a843" }}>Services</h4>
                    <div className="space-y-2 text-sm">
                      <Link href="/" className="block text-white/50 hover:text-[#d4a843] transition">Home</Link>
                      <Link href="/kundli" className="block text-white/50 hover:text-[#d4a843] transition">Kundli</Link>
                      <Link href="/matching" className="block text-white/50 hover:text-[#d4a843] transition">Guna Matching</Link>
                      <Link href="/panchang" className="block text-white/50 hover:text-[#d4a843] transition">Panchang</Link>
                      <Link href="/rashifal" className="block text-white/50 hover:text-[#d4a843] transition">Rashifal</Link>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-sm" style={{ color: "#d4a843" }}>More</h4>
                    <div className="space-y-2 text-sm">
                      <Link href="/calendar" className="block text-white/50 hover:text-[#d4a843] transition">Calendar</Link>
                      <Link href="/muhurat" className="block text-white/50 hover:text-[#d4a843] transition">Muhurat</Link>
                      <Link href="/graha-sthiti" className="block text-white/50 hover:text-[#d4a843] transition">Graha Sthiti</Link>
                      <Link href="/consultation" className="block text-white/50 hover:text-[#d4a843] transition">Consultation</Link>
                      <Link href="/contact" className="block text-white/50 hover:text-[#d4a843] transition">Contact Us</Link>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-sm" style={{ color: "#d4a843" }}>Legal</h4>
                    <div className="space-y-2 text-sm">
                      <Link href="/privacy" className="block text-white/50 hover:text-[#d4a843] transition">Privacy Policy</Link>
                      <Link href="/disclaimer" className="block text-white/50 hover:text-[#d4a843] transition">Disclaimer</Link>
                      <Link href="/terms" className="block text-white/50 hover:text-[#d4a843] transition">Terms & Conditions</Link>
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-6 text-center">
                  <p className="text-xs text-white/30">
                    &copy; {new Date().getFullYear()} Venkatesh Astrology. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </LangProvider>
      </body>
    </html>
  );
}

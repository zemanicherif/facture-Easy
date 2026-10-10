import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Facture'Easy — Le SaaS de facturation moderne pour entrepreneurs africains",
  description:
    "Générez des factures professionnelles en FCFA en 2 clics avec calcul automatique de la TVA 18%, suivi des paiements en temps réel et gestion client intégrée.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${jakarta.variable} scroll-smooth`}>
      <body className="font-sans min-h-screen bg-[#F6F8FA] dark:bg-[#0B1120] text-slate-800 dark:text-slate-100 selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

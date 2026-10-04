import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FamilyProvider } from "@/lib/FamilyContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Family Memory - Votre arbre généalogique interactif",
  description: "Créez et explorez votre arbre familial de manière interactive",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <FamilyProvider>{children}</FamilyProvider>
      </body>
    </html>
  );
}

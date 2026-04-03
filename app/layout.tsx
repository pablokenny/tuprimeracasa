import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const URL = "https://tuprimeracasa.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(URL),
  title: {
    default: "Tu Primera Casa | Comparador de Créditos UVA Argentina 2026",
    template: "%s | Tu Primera Casa",
  },
  description:
    "Calculadora y comparador de créditos hipotecarios UVA en Argentina. Compará tasas de Banco Nación, BBVA, Galicia, Santander y más. Calculá tu cuota y el ingreso requerido en segundos.",
  keywords: [
    "crédito UVA Argentina",
    "simulador hipotecario UVA",
    "calculadora crédito hipotecario Argentina",
    "tasas hipotecarias 2026",
    "comparador bancos UVA",
    "crédito hipotecario Banco Nación",
    "préstamo UVA cuota",
    "cuánto pago de cuota UVA",
    "ingreso mínimo crédito hipotecario",
  ],
  authors: [{ name: "Tu Primera Casa" }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: URL,
    siteName: "Tu Primera Casa",
    title: "Comparador de Créditos UVA Argentina 2026",
    description:
      "Compará tasas de todos los bancos argentinos en un solo lugar. Calculá cuánto pagás de cuota y qué ingreso necesitás.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tu Primera Casa - Comparador de créditos UVA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comparador de Créditos UVA Argentina 2026",
    description:
      "Compará tasas de todos los bancos argentinos. Calculá tu cuota en segundos.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

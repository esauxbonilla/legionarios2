import { Cinzel, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "LEGIONARIOS — Pasaporte Legionario",
  description:
    "Toma tu estado antes que nadie. 2,000 pasaportes numerados y acceso 24 h antes del drop.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${cinzel.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

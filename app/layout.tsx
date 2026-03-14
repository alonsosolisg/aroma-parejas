import type { Metadata } from "next";
import { Prata, Montserrat } from "next/font/google";
import "./globals.css";

const prata = Prata({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-prata",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Maritana — ¿Cuál es el aroma de su amor?",
  description: "Test de compatibilidad aromática para parejas",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Prata&family=Montserrat:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${prata.variable} ${montserrat.variable}`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

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
      <body>
        {children}
      </body>
    </html>
  );
}

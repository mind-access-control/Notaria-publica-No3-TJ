import type React from "react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { AIChatbot } from "@/components/ai-chatbot";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Notaría Pública No. 3 Tijuana | Servicios Notariales Profesionales",
  description:
    "Notaría Pública No. 3 de Tijuana. Servicios notariales profesionales con atención personalizada, tiempos rápidos y asesoría sin costo. Simulador de aranceles y citas en línea.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Suspense fallback={null}>{children}</Suspense>
        <AIChatbot />
        <Analytics />
      </body>
    </html>
  );
}

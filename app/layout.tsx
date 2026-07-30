import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import { TemaProvider, scriptAntiFlash } from "@/lib/tema";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dextro — Portal de Relatórios",
  description: "Portal de inteligência de dados da Dextro Consultoria.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptAntiFlash }} />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <TemaProvider>
          <StoreProvider>{children}</StoreProvider>
        </TemaProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://4swisstrade.pl"),
  title: { default: "4 Swiss Trade – ekspresy i serwis 4Swiss", template: "%s | 4 Swiss Trade" },
  description: "Ekspresy 4Swiss, dobór urządzeń oraz autoryzowany serwis. Sprzedaż w ncoffee.pl i profesjonalne zgłoszenia serwisowe w cafixo.pl.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}

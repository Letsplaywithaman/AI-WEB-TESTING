import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "You feel like home.",
  description: "A hidden place beyond the last road—music, rain, fire, and an endless night that feels like home.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

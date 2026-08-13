import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Raat — A café somewhere in Mussoorie",
  description: "A secret Mussoorie café that only opens after dark. Music, rain, river and endless night.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

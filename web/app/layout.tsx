import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import BootIntro from "../components/BootIntro";

export const metadata: Metadata = {
  title: "Swift Terminal",
  description: "Terminal-style trading dashboard on free public market data.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <BootIntro />
      </body>
    </html>
  );
}

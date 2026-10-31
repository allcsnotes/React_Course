import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:5196"),
  title: { default: "allcsvideos", template: "%s | allcsvideos" },
  description: "Learn to code with short, clear video courses.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

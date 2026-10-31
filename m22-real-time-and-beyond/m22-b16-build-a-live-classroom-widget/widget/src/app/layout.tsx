import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Live classroom",
  description: "A live classroom widget",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

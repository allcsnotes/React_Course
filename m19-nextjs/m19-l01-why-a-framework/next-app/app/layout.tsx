import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "allcsvideos",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <header className="top">
          <span className="logo">allcsvideos</span>
          <Link href="/">Courses</Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

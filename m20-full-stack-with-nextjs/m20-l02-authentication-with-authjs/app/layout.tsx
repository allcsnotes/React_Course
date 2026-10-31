import type { Metadata } from "next";
import Link from 'next/link'
import { auth, signOut } from '@/auth'
import "./globals.css";

export const metadata: Metadata = {
  title: "allcsvideos",
  description: "Courses for developers",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth()
  return (
    <html lang="en">
      <body>
        <div className="top">allcs<span>videos</span>
          <div className="nav">
            {session ? (
              <>
                <Link href="/">Courses</Link><Link href="/dashboard">My courses</Link>
                {session.user.role === 'admin' && <Link href="/admin">Admin</Link>}
                <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }) }}>
                  <button>Sign out</button>
                </form>
              </>
            ) : <Link href="/login">Sign in</Link>}
          </div>
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/db/schema'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const email = String(credentials.email)
        const password = String(credentials.password)
        const [user] = await db.select().from(users).where(eq(users.email, email))
        if (!user) return null
        const ok = await bcrypt.compare(password, user.passwordHash)
        if (!ok) return null
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
    Google,
  ],
  pages: { signIn: '/login' },
  callbacks: {
    authorized({ auth }) {
      return !!auth
    },
    jwt({ token, user }) {
      if (user) token.role = user.role ?? 'student'
      return token
    },
    session({ session, token }) {
      session.user.id = token.sub!
      session.user.role = token.role ?? 'student'
      return session
    },
  },
})

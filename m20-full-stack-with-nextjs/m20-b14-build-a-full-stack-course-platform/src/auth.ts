import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { db } from '@/db'
import { users } from '@/db/schema'

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      async authorize(raw) {
        const user = await db.query.users.findFirst({
          where: eq(users.email, String(raw.email)),
        })
        if (!user) return null
        const ok = await bcrypt.compare(String(raw.password), user.passwordHash)
        if (!ok) return null
        return { id: String(user.id), name: user.name, role: user.role }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      session.user.id = String(token.id)
      session.user.role = String(token.role)
      return session
    },
  },
})

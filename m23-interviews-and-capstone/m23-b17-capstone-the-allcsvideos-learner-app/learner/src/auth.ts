import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { USERS } from '@/lib/users'

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      async authorize(raw) {
        const user = USERS.find((u) => u.email === String(raw.email))
        if (!user) return null
        const ok = await bcrypt.compare(String(raw.password), user.hash)
        return ok ? { id: user.id, name: user.name } : null
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      session.user.id = String(token.id)
      return session
    },
  },
})

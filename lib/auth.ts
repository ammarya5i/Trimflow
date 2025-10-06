import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: { email?: string; password?: string } | undefined) {
        if (!credentials?.email) return null
        
        // Ahmet's admin account - simple password for now
        if (credentials.email === 'ahmet@salonahmetbarbers.com') {
          // For now, any password works for Ahmet (in production, use proper password hashing)
          if (credentials.password && credentials.password.length >= 6) {
            return {
              id: 'ahmet-owner-id',
              email: 'ahmet@salonahmetbarbers.com',
              name: 'Ahmet Usta',
              role: 'admin',
            }
          }
        }
        
        // For other users, create customer accounts (no password required)
        if (credentials.email && credentials.email !== 'ahmet@salonahmetbarbers.com') {
          return {
            id: `customer-${Date.now()}`,
            email: credentials.email,
            name: credentials.email.split('@')[0],
            role: 'customer',
          }
        }
        
        return null
      }
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
      }
      return session
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

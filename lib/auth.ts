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
        console.log('Auth attempt:', { email: credentials?.email, hasPassword: !!credentials?.password })
        
        if (!credentials?.email) {
          console.log('No email provided')
          return null
        }
        
        // Ahmet's admin account - simple password for now
        if (credentials.email === 'ahmet@salonahmetbarbers.com') {
          console.log('Admin login attempt for Ahmet')
          // For now, any password works for Ahmet (in production, use proper password hashing)
          if (credentials.password && credentials.password.length >= 6) {
            console.log('Admin login successful')
            return {
              id: 'ahmet-owner-id',
              email: 'ahmet@salonahmetbarbers.com',
              name: 'Ahmet Usta',
              role: 'admin',
            }
          } else {
            console.log('Admin password too short')
            return null
          }
        }
        
        // For other users, create customer accounts (no password required)
        if (credentials.email && credentials.email !== 'ahmet@salonahmetbarbers.com') {
          console.log('Customer login attempt')
          return {
            id: `customer-${Date.now()}`,
            email: credentials.email,
            name: credentials.email.split('@')[0],
            role: 'customer',
          }
        }
        
        console.log('No matching user found')
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
    async redirect({ url, baseUrl }: any) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
}

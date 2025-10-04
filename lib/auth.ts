import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null
        
        // For demo purposes, allow any email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        
        if (!user) {
          // Create user if doesn't exist
          return await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0],
            }
          })
        }
        
        return user
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        // Get user data from database
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            onboardingCompleted: true,
            subscriptionStatus: true,
            subscriptionPlan: true,
          },
        })
        
        if (dbUser) {
          session.user.onboardingCompleted = dbUser.onboardingCompleted
          session.user.subscriptionStatus = dbUser.subscriptionStatus
          session.user.subscriptionPlan = dbUser.subscriptionPlan
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
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
}

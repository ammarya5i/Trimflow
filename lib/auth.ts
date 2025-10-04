import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import EmailProvider from 'next-auth/providers/email'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // Get user data from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
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
    async signIn({ user, account, profile }) {
      // Check if user exists, if not create them
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name,
            image: user.image,
          },
        })
      }

      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'database',
  },
}

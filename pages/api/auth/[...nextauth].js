import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import connectDB from '../../../lib/db'
import User from '../../../models/User'
import { signOut } from 'next-auth/react'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
const mongoSanitize = require('express-mongo-sanitize')

connectDB()

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: 'a-very-long-secret',
  },
  secret: 'a-very-long-secret',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/',
    error: '/',
  },
  // SQL or MongoDB database (or leave empty)
  database: process.env.DATABASE_URL,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider === 'google') {
        const user22 = await User.findOne({ email: profile.email })

        if (!user22) {
          const user23 = await User.create({
            role: 'app',
            name: profile.name,
            email: profile.email,
            acceptLanguage: profile.locale,
            emailVerified: profile.email_verified,
            image: profile.picture,
            wins: profile?.wins,
            loses: profile?.loses,
          }).catch((e) => {
            throw new Error('Something has gone wrong ...')
          })

          if (!user23) {
            throw new Error('Something has gone wrong ...')
          }
        }
        return true
      }
    },
    async session({ session, token, user }) {
      const user22 = await User.findOne({ email: session.user.email })

      if (!user22) {
        throw new Error('Something has gone wrong ...')
      }

      if (user22.active === false) {
        throw new Error('Something has gone wrong ...')
      }
      // // CHECK EMAIL VERIFIED On idex page when getting props, then redirect
      if (user22.emailVerified === false) {
        throw new Error('Email not verified ...')
      }

      session.user23 = user22

      return session
      // return Promise.resolve(session)
    },
  },
})

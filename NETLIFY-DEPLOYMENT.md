# 🚀 Netlify Deployment Guide for TrimFlow

## 📋 What You Need to Deploy to Netlify

### 1. **Environment Variables to Set in Netlify Dashboard:**

```
DATABASE_URL=postgresql://neondb_owner:npg_r3kEXUeFTg1i@ep-polished-frog-adsqvccw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEXTAUTH_SECRET=trimflow-nextauth-secret-2024

NEXTAUTH_URL=https://your-app-name.netlify.app

NEXT_PUBLIC_APP_URL=https://your-app-name.netlify.app

EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=your_resend_api_key
EMAIL_FROM=noreply@your-app-name.netlify.app

STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

RESEND_API_KEY=your_resend_api_key
SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
```

### 2. **Deployment Steps:**

1. **Go to [netlify.com](https://netlify.com)**
2. **Click "New site from Git"**
3. **Connect GitHub and select your repo: `ammarya5i/Trimflow`**
4. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: `18`
5. **Add environment variables** (from list above)
6. **Deploy!**

### 3. **Post-Deployment:**

1. **Set up custom domain** (optional)
2. **Configure SSL** (automatic)
3. **Set up form handling** for contact forms
4. **Configure redirects** for barbershop booking pages

### 4. **Database Setup:**

After deployment, run these commands locally to set up your database:

```bash
npm run db:push
npm run db:seed
```

### 5. **Features Ready:**

✅ **Static landing page**
✅ **Authentication system**
✅ **Database integration**
✅ **Responsive design**
✅ **SEO optimized**
✅ **PWA ready**

### 6. **Next Steps After Deployment:**

1. **Test the app** at your Netlify URL
2. **Set up email service** (Resend)
3. **Configure Stripe** for payments
4. **Add analytics** (PostHog)
5. **Set up monitoring** (Sentry)

## 🎯 **Your App Will Be Live At:**
`https://your-app-name.netlify.app`

## 🔧 **Troubleshooting:**

- If build fails, check environment variables
- If database connection fails, verify DATABASE_URL
- If auth doesn't work, check NEXTAUTH_SECRET and NEXTAUTH_URL

# TrimFlow - Barber Appointment Management

A modern barber appointment management platform built with Next.js 14, Prisma, and Stripe.

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/ammarya5i/Trimflow.git
   cd Trimflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## ✨ Features

- **🎯 Smart Scheduling** - Calendar with real-time availability
- **👥 Staff Management** - Role-based permissions
- **📊 Analytics & Reports** - Revenue tracking
- **💳 Stripe Integration** - Secure payments
- **📧 Email Notifications** - Automated confirmations
- **🎨 Modern UI** - Built with Tailwind CSS and Radix UI

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Database**: Prisma with PostgreSQL
- **Payments**: Stripe
- **Email**: Resend
- **UI Components**: Radix UI
- **Deployment**: GitHub Actions → Vercel

## 🔧 Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL="your_database_url"

# Authentication
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🚀 Deployment

This project is configured for automatic deployment via GitHub Actions to Vercel.

1. Push your code to GitHub
2. Set up Vercel project
3. Add environment variables in Vercel dashboard
4. Every push to `main` branch will trigger automatic deployment

## 📁 Project Structure

```
trimflow/
├── app/                    # Next.js 14 app directory
├── components/            # React components
├── lib/                  # Utility functions
├── prisma/               # Database schema
├── scripts/              # Database scripts
└── types/                # TypeScript definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Push to your branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details.
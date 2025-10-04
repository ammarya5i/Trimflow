# TrimFlow - Barber Appointment Management SaaS

A modern, white-label barber appointment management platform built with Next.js 14, Supabase, and Stripe.

## 🚀 Quick Start

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/trimflow&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,STRIPE_SECRET_KEY,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,STRIPE_WEBHOOK_SECRET,RESEND_API_KEY,SENTRY_DSN,NEXT_PUBLIC_POSTHOG_KEY)

[![Connect to GitHub](https://github.com/images/modules/site/features/actions/actions-integration.svg)](https://github.com/new/import)

## ✨ Features

- **🎯 Smart Scheduling** - Drag-and-drop calendar with real-time availability
- **👥 Staff Management** - Role-based permissions and performance tracking
- **📊 Analytics & Reports** - Revenue tracking and business insights
- **📱 PWA Ready** - Works offline and installable on any device
- **🌍 Multi-language** - Support for Turkish, English, Arabic, and Russian
- **🔒 GDPR Compliant** - Built with privacy and security in mind
- **💳 Stripe Integration** - Secure payments and subscription management
- **📧 Email Notifications** - Automated booking confirmations and reminders
- **🎨 White-label** - Fully customizable branding

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Payments**: Stripe
- **Email**: Resend + React Email
- **Deployment**: Vercel
- **Monitoring**: Sentry, PostHog
- **UI Components**: shadcn/ui

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- A Stripe account
- A Resend account for email
- A Vercel account for deployment

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Resend
RESEND_API_KEY=your_resend_api_key

# Sentry
SENTRY_DSN=your_sentry_dsn

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# App
NEXT_PUBLIC_APP_URL=https://trimflow.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://trimflow.vercel.app
```

## 🗄 Database Setup

1. Create a new Supabase project
2. Run the database migrations (see `/supabase/migrations/`)
3. Set up Row Level Security (RLS) policies
4. Run the seed script: `npm run db:seed`

## 🚀 Deployment

### Vercel (Recommended)

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import the project
4. Add all environment variables
5. Deploy!

### Manual Deployment

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the production server
npm start
```

## 📱 Demo

- **Live Demo**: https://trimflow.vercel.app
- **Demo Barbershop**: https://trimflow.vercel.app/s/berber-ali
- **Admin Login**: demo@trimflow.com / demo123456

## 🎯 Usage

### For Barbershop Owners

1. **Sign Up**: Create your account with magic link authentication
2. **Onboarding**: Complete the 8-step setup wizard
3. **Customize**: Set your services, pricing, and working hours
4. **Share**: Give customers your booking URL
5. **Manage**: Use the dashboard to track appointments and revenue

### For Customers

1. **Visit**: Go to your barbershop's booking page
2. **Select**: Choose service, staff, date, and time
3. **Book**: Enter your details and confirm
4. **Receive**: Get confirmation email and reminders

## 📊 Pricing Plans

- **Free**: 50 appointments/month, basic features
- **Pro ($19/month)**: Unlimited appointments, advanced features
- **Premium ($49/month)**: Everything + priority support

## 🔧 Development

```bash
# Clone the repository
git clone https://github.com/your-username/trimflow.git

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Run linting
npm run lint

# Build for production
npm run build
```

## 📁 Project Structure

```
trimflow/
├── app/                    # Next.js 14 app directory
│   ├── auth/              # Authentication pages
│   ├── booking/           # Public booking pages
│   ├── dashboard/         # Dashboard pages
│   └── onboarding/        # Onboarding flow
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
├── scripts/              # Database scripts
└── supabase/             # Database migrations
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.trimflow.com](https://docs.trimflow.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/trimflow/issues)
- **Email**: support@trimflow.com

## 🎉 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Database by [Supabase](https://supabase.com/)
- Payments by [Stripe](https://stripe.com/)
- Deployed on [Vercel](https://vercel.com/)

---

**TrimFlow is live. Go sell it.** 🚀

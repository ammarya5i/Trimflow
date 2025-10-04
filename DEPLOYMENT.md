# TrimFlow Deployment Guide

This guide will help you deploy TrimFlow to production in one uninterrupted flow.

## 🚀 Quick Deployment

### Prerequisites

Before starting, ensure you have:

1. **GitHub Repository**: An empty, private GitHub repository
2. **Vercel Account**: With API access
3. **Supabase Project**: With database and auth configured
4. **Stripe Account**: With API keys
5. **Resend Account**: For email notifications
6. **Sentry Account**: For error monitoring
7. **PostHog Account**: For analytics

### Required Secrets

You'll need the following secrets (ask once, then never again):

- `GITHUB_REPO_URL`: Your empty GitHub repository URL
- `VERCEL_TOKEN`: Your Vercel API token
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `RESEND_API_KEY`: Your Resend API key
- `SENTRY_DSN`: Your Sentry DSN
- `NEXT_PUBLIC_POSTHOG_KEY`: Your PostHog project key

## 🎯 One-Command Deployment

### Windows (PowerShell)

```powershell
.\scripts\deploy.ps1 `
  -GitHubRepoUrl "https://github.com/your-username/trimflow.git" `
  -VercelToken "your_vercel_token" `
  -SupabaseUrl "your_supabase_url" `
  -SupabaseAnonKey "your_supabase_anon_key" `
  -SupabaseServiceKey "your_supabase_service_key" `
  -StripeSecretKey "your_stripe_secret_key" `
  -StripePublishableKey "your_stripe_publishable_key" `
  -StripeWebhookSecret "your_stripe_webhook_secret" `
  -ResendApiKey "your_resend_api_key" `
  -SentryDsn "your_sentry_dsn" `
  -PostHogKey "your_posthog_key"
```

### Linux/macOS (Bash)

```bash
export GITHUB_REPO_URL="https://github.com/your-username/trimflow.git"
export VERCEL_TOKEN="your_vercel_token"
export NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
export SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_key"
export STRIPE_SECRET_KEY="your_stripe_secret_key"
export NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
export STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
export RESEND_API_KEY="your_resend_api_key"
export SENTRY_DSN="your_sentry_dsn"
export NEXT_PUBLIC_POSTHOG_KEY="your_posthog_key"

./scripts/deploy.sh
```

## 📋 What the Deployment Script Does

1. **Git Setup**: Initializes repository and pushes to GitHub
2. **Vercel Deployment**: Links project and deploys to production
3. **Environment Variables**: Sets all required secrets
4. **Database Seeding**: Creates demo data and barbershop
5. **Demo Generation**: Creates demo URLs and QR codes

## 🎉 After Deployment

The script will output:

- **Live Demo URL**: https://trimflow.vercel.app
- **Demo Barbershop**: https://trimflow.vercel.app/s/berber-ali
- **Admin Login**: https://trimflow.vercel.app/auth/signin
- **QR Code**: For easy mobile access
- **Test Command**: For booking API testing

## 🔑 Demo Credentials

- **Email**: demo@trimflow.com
- **Password**: demo123456

## 🧪 Test Booking API

```bash
curl -X POST "https://trimflow.vercel.app/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Customer",
    "customerEmail": "test@example.com",
    "customerPhone": "+1234567890",
    "serviceId": "service-id",
    "staffId": "staff-id",
    "date": "2024-01-15",
    "time": "10:00",
    "notes": "Test booking"
  }'
```

## 🎯 Features Included

- ✅ **Magic Link Authentication**: Secure, passwordless login
- ✅ **8-Step Onboarding**: Complete barbershop setup wizard
- ✅ **Public Booking Page**: SEO-optimized customer booking
- ✅ **Real-time Calendar**: Live availability and scheduling
- ✅ **Stripe Integration**: Secure payments and subscriptions
- ✅ **Email Notifications**: Automated confirmations and reminders
- ✅ **Staff Management**: Role-based access control
- ✅ **Multi-language**: Turkish, English, Arabic, Russian
- ✅ **PWA Support**: Installable on any device
- ✅ **Dark Mode**: Automatic theme switching
- ✅ **GDPR Compliance**: Privacy-first design
- ✅ **Analytics**: PostHog integration
- ✅ **Error Monitoring**: Sentry integration
- ✅ **CI/CD**: GitHub Actions automation

## 🚀 Self-Hosting Options

### Coolify Deployment

```bash
# Copy the infra/coolify folder to your Coolify instance
# Update environment variables in docker-compose.yml
# Deploy with: docker-compose up -d
```

### AWS ECS with Terraform

```bash
cd infra/terraform
terraform init
terraform plan
terraform apply
```

## 📊 Monitoring & Analytics

- **Vercel Analytics**: Built-in performance monitoring
- **PostHog**: User behavior and feature flags
- **Sentry**: Error tracking and performance monitoring
- **Stripe Dashboard**: Payment and subscription analytics

## 🔧 Maintenance

- **Database**: Supabase handles backups and scaling
- **CDN**: Vercel Edge Network for global performance
- **SSL**: Automatic HTTPS with Let's Encrypt
- **Updates**: GitHub Actions handles CI/CD

## 🆘 Support

- **Documentation**: [README.md](README.md)
- **Issues**: GitHub Issues
- **Community**: Discord/Telegram (if available)

---

**TrimFlow is live. Go sell it.** 🚀

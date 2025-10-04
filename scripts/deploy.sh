#!/bin/bash

# TrimFlow Deployment Script
# This script handles the complete deployment process from GitHub to Vercel

set -e

echo "🚀 Starting TrimFlow deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_env_vars() {
    print_status "Checking environment variables..."
    
    required_vars=(
        "GITHUB_REPO_URL"
        "VERCEL_TOKEN"
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY"
        "STRIPE_SECRET_KEY"
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
        "STRIPE_WEBHOOK_SECRET"
        "RESEND_API_KEY"
        "SENTRY_DSN"
        "NEXT_PUBLIC_POSTHOG_KEY"
    )
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        exit 1
    fi
    
    print_success "All required environment variables are set"
}

# Initialize git repository and push to GitHub
setup_git() {
    print_status "Setting up Git repository..."
    
    if [ ! -d ".git" ]; then
        git init
        git add .
        git commit -m "feat: v0.1.0 – barber SaaS MVP"
        
        if [ -n "$GITHUB_REPO_URL" ]; then
            git remote add origin "$GITHUB_REPO_URL"
            git branch -M main
            git push -u origin main
            print_success "Code pushed to GitHub repository"
        else
            print_warning "No GitHub repository URL provided, skipping push"
        fi
    else
        print_status "Git repository already initialized"
        git add .
        git commit -m "feat: update deployment" || true
        git push origin main || true
    fi
}

# Install Vercel CLI and deploy
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Install Vercel CLI if not already installed
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel@latest
    fi
    
    # Login to Vercel
    print_status "Logging in to Vercel..."
    echo "$VERCEL_TOKEN" | vercel login --token
    
    # Link project to Vercel
    print_status "Linking project to Vercel..."
    vercel link --yes --token "$VERCEL_TOKEN"
    
    # Add environment variables to Vercel
    print_status "Adding environment variables to Vercel..."
    
    env_vars=(
        "NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY"
        "STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY"
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
        "STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET"
        "RESEND_API_KEY=$RESEND_API_KEY"
        "SENTRY_DSN=$SENTRY_DSN"
        "NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY"
        "NEXT_PUBLIC_APP_URL=https://trimflow.vercel.app"
        "NEXTAUTH_SECRET=$(openssl rand -base64 32)"
        "NEXTAUTH_URL=https://trimflow.vercel.app"
    )
    
    for env_var in "${env_vars[@]}"; do
        key=$(echo "$env_var" | cut -d'=' -f1)
        value=$(echo "$env_var" | cut -d'=' -f2-)
        vercel env add "$key" production "$value" --token "$VERCEL_TOKEN" --yes || true
    done
    
    # Deploy to production
    print_status "Deploying to production..."
    vercel deploy --prod --yes --token "$VERCEL_TOKEN"
    
    print_success "Deployment to Vercel completed"
}

# Run database seed
seed_database() {
    print_status "Seeding database..."
    
    # Set environment variables for the seed script
    export NEXT_PUBLIC_SUPABASE_URL
    export NEXT_PUBLIC_SUPABASE_ANON_KEY
    export SUPABASE_SERVICE_ROLE_KEY
    
    # Run the seed script
    npm run db:seed
    
    print_success "Database seeded successfully"
}

# Generate demo URLs and QR code
generate_demo_info() {
    print_status "Generating demo information..."
    
    DEMO_URL="https://trimflow.vercel.app"
    BARBER_URL="https://trimflow.vercel.app/s/berber-ali"
    ADMIN_URL="https://trimflow.vercel.app/auth/signin"
    
    # Generate QR code URL
    QR_CODE_URL="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=$(echo "$BARBER_URL" | sed 's/:/%3A/g' | sed 's/\//%2F/g')"
    
    # Create demo info file
    cat > demo-info.md << EOF
# TrimFlow Demo Information

## 🚀 Live URLs

- **Main App**: $DEMO_URL
- **Demo Barbershop**: $BARBER_URL
- **Admin Login**: $ADMIN_URL

## 📱 QR Code for Demo Barbershop

![QR Code]($QR_CODE_URL)

## 🔑 Demo Credentials

- **Email**: demo@trimflow.com
- **Password**: demo123456

## 📊 GitHub Repository

- **Repository**: $GITHUB_REPO_URL

## 🧪 Test Booking

\`\`\`bash
curl -X POST "$DEMO_URL/api/bookings" \\
  -H "Content-Type: application/json" \\
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
\`\`\`

## 🎯 Features Demonstrated

- ✅ Magic link authentication
- ✅ 8-step onboarding wizard
- ✅ Public booking page with SEO
- ✅ Real-time availability
- ✅ Stripe payment integration
- ✅ Email notifications
- ✅ Staff management
- ✅ Multi-language support
- ✅ PWA capabilities
- ✅ Dark mode
- ✅ GDPR compliance

---

**TrimFlow is live. Go sell it.** 🚀
EOF

    print_success "Demo information generated in demo-info.md"
    
    # Print summary
    echo ""
    echo "🎉 DEPLOYMENT COMPLETE!"
    echo "========================"
    echo ""
    echo "📱 Demo Barbershop: $BARBER_URL"
    echo "👤 Admin Login: $ADMIN_URL"
    echo "📊 GitHub Repo: $GITHUB_REPO_URL"
    echo ""
    echo "🔑 Demo Credentials:"
    echo "   Email: demo@trimflow.com"
    echo "   Password: demo123456"
    echo ""
    echo "🧪 Test Booking:"
    echo "curl -X POST \"$DEMO_URL/api/bookings\" \\"
    echo "  -H \"Content-Type: application/json\" \\"
    echo "  -d '{\"customerName\": \"Test Customer\", \"customerEmail\": \"test@example.com\", \"serviceId\": \"service-id\", \"staffId\": \"staff-id\", \"date\": \"2024-01-15\", \"time\": \"10:00\"}'"
    echo ""
    echo "📱 QR Code: $QR_CODE_URL"
    echo ""
    echo "TrimFlow is live. Go sell it. 🚀"
}

# Main execution
main() {
    print_status "Starting TrimFlow deployment..."
    
    check_env_vars
    setup_git
    deploy_to_vercel
    seed_database
    generate_demo_info
    
    print_success "Deployment completed successfully!"
}

# Run main function
main "$@"

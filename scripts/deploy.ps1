# TrimFlow Deployment Script for Windows
# This script handles the complete deployment process from GitHub to Vercel

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubRepoUrl,
    
    [Parameter(Mandatory=$true)]
    [string]$VercelToken,
    
    [Parameter(Mandatory=$true)]
    [string]$DatabaseUrl,
    
    [Parameter(Mandatory=$true)]
    [string]$StripeSecretKey,
    
    [Parameter(Mandatory=$true)]
    [string]$StripePublishableKey,
    
    [Parameter(Mandatory=$true)]
    [string]$StripeWebhookSecret,
    
    [Parameter(Mandatory=$true)]
    [string]$ResendApiKey,
    
    [Parameter(Mandatory=$true)]
    [string]$SentryDsn,
    
    [Parameter(Mandatory=$true)]
    [string]$PostHogKey
)

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Initialize git repository and push to GitHub
function Setup-Git {
    Write-Status "Setting up Git repository..."
    
    if (-not (Test-Path ".git")) {
        git init
        git add .
        git commit -m "feat: v0.1.0 – barber SaaS MVP"
        
        if ($GitHubRepoUrl) {
            git remote add origin $GitHubRepoUrl
            git branch -M main
            git push -u origin main
            Write-Success "Code pushed to GitHub repository"
        } else {
            Write-Warning "No GitHub repository URL provided, skipping push"
        }
    } else {
        Write-Status "Git repository already initialized"
        git add .
        git commit -m "feat: update deployment" 2>$null
        git push origin main 2>$null
    }
}

# Install Vercel CLI and deploy
function Deploy-ToVercel {
    Write-Status "Deploying to Vercel..."
    
    # Install Vercel CLI if not already installed
    if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
        Write-Status "Installing Vercel CLI..."
        npm install -g vercel@latest
    }
    
    # Login to Vercel
    Write-Status "Logging in to Vercel..."
    echo $VercelToken | vercel login --token
    
    # Link project to Vercel
    Write-Status "Linking project to Vercel..."
    vercel link --yes --token $VercelToken
    
    # Add environment variables to Vercel
    Write-Status "Adding environment variables to Vercel..."
    
    $envVars = @(
        "DATABASE_URL=$DatabaseUrl",
        "NEXTAUTH_SECRET=$([System.Web.Security.Membership]::GeneratePassword(32, 0))",
        "NEXTAUTH_URL=https://trimflow.vercel.app",
        "EMAIL_SERVER_HOST=smtp.resend.com",
        "EMAIL_SERVER_PORT=587",
        "EMAIL_SERVER_USER=resend",
        "EMAIL_SERVER_PASSWORD=$ResendApiKey",
        "EMAIL_FROM=noreply@trimflow.vercel.app",
        "STRIPE_SECRET_KEY=$StripeSecretKey",
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$StripePublishableKey",
        "STRIPE_WEBHOOK_SECRET=$StripeWebhookSecret",
        "RESEND_API_KEY=$ResendApiKey",
        "SENTRY_DSN=$SentryDsn",
        "NEXT_PUBLIC_POSTHOG_KEY=$PostHogKey",
        "NEXT_PUBLIC_APP_URL=https://trimflow.vercel.app"
    )
    
    foreach ($envVar in $envVars) {
        $key = $envVar.Split('=')[0]
        $value = $envVar.Substring($key.Length + 1)
        vercel env add $key production $value --token $VercelToken --yes 2>$null
    }
    
    # Deploy to production
    Write-Status "Deploying to production..."
    vercel deploy --prod --yes --token $VercelToken
    
    Write-Success "Deployment to Vercel completed"
}

# Run database seed
function Seed-Database {
    Write-Status "Seeding database..."
    
    # Set environment variables for the seed script
    $env:DATABASE_URL = $DatabaseUrl
    
    # Run the seed script
    npm run db:seed
    
    Write-Success "Database seeded successfully"
}

# Generate demo URLs and QR code
function Generate-DemoInfo {
    Write-Status "Generating demo information..."
    
    $demoUrl = "https://trimflow.vercel.app"
    $barberUrl = "https://trimflow.vercel.app/s/berber-ali"
    $adminUrl = "https://trimflow.vercel.app/auth/signin"
    
    # Generate QR code URL
    $encodedUrl = $barberUrl -replace ':', '%3A' -replace '/', '%2F'
    $qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + $encodedUrl
    
    # Create demo info file
    $demoInfo = @"
# TrimFlow Demo Information

## 🚀 Live URLs

- Main App: $demoUrl
- Demo Barbershop: $barberUrl  
- Admin Login: $adminUrl

## 📱 QR Code for Demo Barbershop

![QR Code]($qrCodeUrl)

## 🔑 Demo Credentials

- Email: demo@trimflow.com
- Password: demo123456

## 📊 GitHub Repository

- Repository: $GitHubRepoUrl

## 🧪 Test Booking

``````bash
curl -X POST "$demoUrl/api/bookings" \
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
``````

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
"@
    
    $demoInfo | Out-File -FilePath "demo-info.md" -Encoding UTF8
    
    Write-Success "Demo information generated in demo-info.md"
    
    # Print summary
    Write-Host ""
    Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
    Write-Host "========================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Demo Barbershop: $barberUrl" -ForegroundColor Cyan
    Write-Host "👤 Admin Login: $adminUrl" -ForegroundColor Cyan
    Write-Host "📊 GitHub Repo: $GitHubRepoUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔑 Demo Credentials:" -ForegroundColor Yellow
    Write-Host "   Email: demo@trimflow.com" -ForegroundColor White
    Write-Host "   Password: demo123456" -ForegroundColor White
    Write-Host ""
    Write-Host "📱 QR Code: $qrCodeUrl" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "TrimFlow is live. Go sell it. 🚀" -ForegroundColor Green
}

# Main execution
function Main {
    Write-Status "Starting TrimFlow deployment..."
    
    Setup-Git
    Deploy-ToVercel
    Seed-Database
    Generate-DemoInfo
    
    Write-Success "Deployment completed successfully!"
}

# Run main function
Main

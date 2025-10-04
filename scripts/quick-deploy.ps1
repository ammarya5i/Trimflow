# Quick Netlify Deployment Script
Write-Host "🚀 Quick Netlify Deployment for TrimFlow" -ForegroundColor Green

# Step 1: Clean install with minimal dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install --no-optional --production=false

# Step 2: Generate Prisma client
Write-Host "🗄️ Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Step 3: Build for static export
Write-Host "🔨 Building for static export..." -ForegroundColor Yellow
npm run build

# Step 4: Check if build succeeded
if (Test-Path "out") {
    Write-Host "✅ Build successful! Static files generated in 'out' directory" -ForegroundColor Green
    Write-Host "📁 Files ready for Netlify deployment" -ForegroundColor Green
    
    # Show deployment options
    Write-Host "`n🌐 Deployment Options:" -ForegroundColor Cyan
    Write-Host "1. Drag 'out' folder to Netlify dashboard" -ForegroundColor White
    Write-Host "2. Use Netlify CLI: npx netlify deploy --prod --dir=out" -ForegroundColor White
    Write-Host "3. Connect GitHub repo to Netlify for auto-deploy" -ForegroundColor White
    
} else {
    Write-Host "❌ Build failed! Check errors above." -ForegroundColor Red
    exit 1
}


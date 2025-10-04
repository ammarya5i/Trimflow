# Set Vercel Environment Variables
$token = "JWRSLI9KvtjVrINw0QTdy1Cj"

# Database
$databaseUrl = "postgresql://neondb_owner:npg_r3kEXUeFTg1i@ep-polished-frog-adsqvccw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

Write-Host "Setting environment variables for Vercel..."

# Set DATABASE_URL
Write-Host "Setting DATABASE_URL..."
vercel env add DATABASE_URL production --token $token --value $databaseUrl

# Set NEXTAUTH_SECRET
Write-Host "Setting NEXTAUTH_SECRET..."
vercel env add NEXTAUTH_SECRET production --token $token --value "trimflow-nextauth-secret-2024"

# Set NEXTAUTH_URL
Write-Host "Setting NEXTAUTH_URL..."
vercel env add NEXTAUTH_URL production --token $token --value "https://trimflow.vercel.app"

# Set NEXT_PUBLIC_APP_URL
Write-Host "Setting NEXT_PUBLIC_APP_URL..."
vercel env add NEXT_PUBLIC_APP_URL production --token $token --value "https://trimflow.vercel.app"

Write-Host "Environment variables set successfully!"
Write-Host "Now deploying..."
vercel --token $token --yes

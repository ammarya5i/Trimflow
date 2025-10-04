<#
  Usage: Set required env vars outside of this script, then run it.
  Required:
    - $env:VERCEL_TOKEN
    - $env:DATABASE_URL
    - $env:NEXTAUTH_SECRET
    - $env:NEXT_PUBLIC_APP_URL (defaults to https://trimflow.vercel.app)
#>

$token = $env:VERCEL_TOKEN
if (-not $token) { throw "VERCEL_TOKEN not set in environment" }

$databaseUrl = $env:DATABASE_URL
if (-not $databaseUrl) { throw "DATABASE_URL not set in environment" }

$nextAuthSecret = $env:NEXTAUTH_SECRET
if (-not $nextAuthSecret) { throw "NEXTAUTH_SECRET not set in environment" }

$appUrl = if ($env:NEXT_PUBLIC_APP_URL) { $env:NEXT_PUBLIC_APP_URL } else { "https://trimflow.vercel.app" }

Write-Host "Setting environment variables for Vercel..."

Write-Host "Setting DATABASE_URL..."
vercel env add DATABASE_URL production --token $token --value $databaseUrl

Write-Host "Setting NEXTAUTH_SECRET..."
vercel env add NEXTAUTH_SECRET production --token $token --value $nextAuthSecret

Write-Host "Setting NEXTAUTH_URL..."
vercel env add NEXTAUTH_URL production --token $token --value $appUrl

Write-Host "Setting NEXT_PUBLIC_APP_URL..."
vercel env add NEXT_PUBLIC_APP_URL production --token $token --value $appUrl

Write-Host "Done. (No deploy performed by this script)"

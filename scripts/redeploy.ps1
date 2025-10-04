param(
  [Parameter(Mandatory = $true)]
  [string]$Hook
)

Write-Host "Triggering Vercel deploy via hook..."
$response = Invoke-WebRequest -Uri $Hook -Method POST -ErrorAction Stop
Write-Host "StatusCode:" $response.StatusCode
Write-Host "Deploy hook triggered. Check Vercel dashboard for progress."


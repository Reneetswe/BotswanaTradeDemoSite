# Update Cloud Database Connection Script
# This script helps you update your .env file with a cloud database connection

Write-Host "=== Update Cloud Database Connection ===" -ForegroundColor Green
Write-Host ""

Write-Host "Please provide your Neon database connection string:" -ForegroundColor Yellow
Write-Host "It should look like: postgresql://username:password@ep-something.region.aws.neon.tech/database" -ForegroundColor Cyan
Write-Host ""

$connectionString = Read-Host "Enter your connection string"

if ($connectionString -and $connectionString.StartsWith("postgresql://")) {
    # Backup current .env file
    if (Test-Path ".env") {
        Copy-Item ".env" ".env.backup"
        Write-Host "✅ Backed up current .env file to .env.backup" -ForegroundColor Green
    }
    
    # Create new .env file with cloud database
    $envContent = @"
# Database Configuration (Cloud)
DATABASE_URL=$connectionString

# Session Secret (for authentication)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Environment
NODE_ENV=development
"@
    
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Updated .env file with cloud database connection" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== Next Steps ===" -ForegroundColor Green
    Write-Host "1. Run: npm run db:push" -ForegroundColor Yellow
    Write-Host "2. Run: npm run dev" -ForegroundColor Yellow
    Write-Host "3. Open your browser to: http://localhost:5000" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "❌ Invalid connection string format" -ForegroundColor Red
    Write-Host "Please make sure it starts with 'postgresql://'" -ForegroundColor Yellow
} 
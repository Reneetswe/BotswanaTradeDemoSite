# Botswana Trade Database Setup Script
# This script helps you set up PostgreSQL for your trading application

Write-Host "=== Botswana Trade Database Setup ===" -ForegroundColor Green
Write-Host ""

# Check if PostgreSQL is installed
Write-Host "Checking for PostgreSQL installation..." -ForegroundColor Yellow
try {
    $pgVersion = & psql --version 2>$null
    if ($pgVersion) {
        Write-Host "✅ PostgreSQL is already installed: $pgVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ PostgreSQL is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "To install PostgreSQL on Windows:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
    Write-Host "2. Run the installer and remember your password" -ForegroundColor Cyan
    Write-Host "3. Add PostgreSQL to your PATH environment variable" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Alternatively, you can use a cloud database:" -ForegroundColor Yellow
    Write-Host "- Neon (Free): https://neon.tech" -ForegroundColor Cyan
    Write-Host "- Supabase (Free): https://supabase.com" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

# Create database and user
Write-Host "Setting up database..." -ForegroundColor Yellow

$DB_NAME = "botswana_trade"
$DB_USER = "botswana_user"
$DB_PASSWORD = "botswana123"

Write-Host "Creating database: $DB_NAME" -ForegroundColor Cyan
Write-Host "Creating user: $DB_USER" -ForegroundColor Cyan

# Create .env file
$envContent = @"
# Database Configuration
DATABASE_URL=postgresql://$DB_USER`:$DB_PASSWORD@localhost:5432/$DB_NAME

# Session Secret (for authentication)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Environment
NODE_ENV=development
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8
Write-Host "✅ Created .env file with database configuration" -ForegroundColor Green

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Green
Write-Host "1. Install PostgreSQL if not already installed" -ForegroundColor Yellow
Write-Host "2. Create the database and user manually:" -ForegroundColor Yellow
Write-Host "   - Open pgAdmin or psql" -ForegroundColor Cyan
Write-Host "   - Create database: $DB_NAME" -ForegroundColor Cyan
Write-Host "   - Create user: $DB_USER with password: $DB_PASSWORD" -ForegroundColor Cyan
Write-Host "3. Run: npm run db:push" -ForegroundColor Yellow
Write-Host "4. Run: npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "=== Manual Database Commands ===" -ForegroundColor Green
Write-Host "Connect to PostgreSQL as superuser and run:" -ForegroundColor Yellow
Write-Host "CREATE DATABASE $DB_NAME;" -ForegroundColor Cyan
Write-Host "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" -ForegroundColor Cyan
Write-Host "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" -ForegroundColor Cyan
Write-Host "" 
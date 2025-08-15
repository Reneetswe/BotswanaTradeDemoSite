# Database Setup Guide for Botswana Trade

## Quick Setup Options

### Option 1: Cloud Database (Recommended - Easiest)

#### Using Neon (Free PostgreSQL):
1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project
4. Copy the connection string
5. Update your `.env` file with the connection string

#### Using Supabase (Free PostgreSQL):
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project
4. Go to Settings > Database
5. Copy the connection string
6. Update your `.env` file

### Option 2: Local PostgreSQL Installation

#### Step 1: Install PostgreSQL
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember your superuser password
4. Add PostgreSQL to your PATH environment variable

#### Step 2: Create Database and User
1. Open pgAdmin (comes with PostgreSQL)
2. Connect to your local server
3. Right-click on "Databases" → "Create" → "Database"
4. Name it: `botswana_trade`
5. Right-click on "Login/Group Roles" → "Create" → "Login/Group Role"
6. Name: `botswana_user`
7. Password: `botswana123`
8. Go to "Privileges" tab and enable "Can login?"
9. Right-click on the `botswana_trade` database → "Properties" → "Security"
10. Add the `botswana_user` with all privileges

#### Step 3: Run Database Migrations
```bash
npm run db:push
```

#### Step 4: Start the Application
```bash
npm run dev
```

## Environment Variables

Your `.env` file should contain:

```env
# Database Configuration
DATABASE_URL=postgresql://botswana_user:botswana123@localhost:5432/botswana_trade

# Session Secret (for authentication)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Environment
NODE_ENV=development
```

## Database Schema

The application includes the following tables:
- `users` - User accounts
- `sessions` - User sessions
- `stocks` - BSE stock listings
- `portfolios` - User portfolios
- `holdings` - Stock holdings in portfolios
- `orders` - Trading orders
- `price_history` - Stock price history
- `brokers` - Trading brokers

## Troubleshooting

### Common Issues:

1. **"DATABASE_URL must be set"**
   - Make sure your `.env` file exists and has the correct DATABASE_URL

2. **"Connection refused"**
   - PostgreSQL service is not running
   - Start PostgreSQL service in Windows Services

3. **"Authentication failed"**
   - Check username/password in DATABASE_URL
   - Verify user has proper permissions

4. **"Database does not exist"**
   - Create the database first
   - Run `npm run db:push` to create tables

## Next Steps

After setting up the database:
1. Run `npm run dev` to start the development server
2. Open your browser to `http://localhost:5000`
3. The application should now be running with full functionality 
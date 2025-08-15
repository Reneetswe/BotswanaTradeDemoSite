# Neon Cloud Database Setup Guide

## Step-by-Step Instructions

### 1. Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Click "Sign Up" (you can use GitHub, Google, or email)
3. Complete the registration process

### 2. Create New Project
1. Click "Create New Project"
2. Enter project name: `botswana-trade`
3. Select a region close to you (e.g., US East for North America)
4. Click "Create Project"

### 3. Get Connection String
1. Once your project is created, you'll see a dashboard
2. Look for the "Connection string" section
3. Copy the connection string that looks like:
   ```
   postgresql://username:password@ep-something.region.aws.neon.tech/database
   ```

### 4. Update Your Application
1. Run the update script:
   ```powershell
   .\update-cloud-db.ps1
   ```
2. Paste your connection string when prompted

### 5. Set Up Database Tables
1. Run the database migration:
   ```powershell
   npm run db:push
   ```

### 6. Start Your Application
1. Start the development server:
   ```powershell
   npm run dev
   ```
2. Open your browser to: http://localhost:5000

## What Neon Provides

✅ **Free Tier Includes:**
- 3 projects
- 10GB storage
- 100GB transfer per month
- Automatic backups
- No credit card required

✅ **Features:**
- Serverless PostgreSQL
- Automatic scaling
- Built-in connection pooling
- Web-based SQL editor
- Real-time metrics

## Troubleshooting

### Connection Issues
- Make sure your connection string is correct
- Check that you copied the entire string
- Verify your internet connection

### Database Migration Issues
- Run `npm run db:push` to create tables
- Check the console for any error messages
- Make sure your connection string has write permissions

### Application Won't Start
- Verify your `.env` file has the correct DATABASE_URL
- Check that all dependencies are installed: `npm install`
- Look for any error messages in the console

## Next Steps After Setup

1. **Test the application** - Make sure everything works
2. **Add sample data** - Your app will start with empty tables
3. **Customize settings** - Update session secrets and other configurations
4. **Deploy** - When ready, you can deploy to production

## Support

- **Neon Documentation**: https://neon.tech/docs
- **Neon Community**: https://community.neon.tech
- **Botswana Trade Issues**: Check the project repository 
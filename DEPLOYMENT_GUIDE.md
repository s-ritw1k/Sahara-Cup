# Vercel Deployment Guide for Sahara Cup Tournament App

## Prerequisites
1. GitHub account
2. Vercel account (free)
3. Git installed locally

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)
```bash
cd c:\JAVA-WS\cup
git init
git add .
git commit -m "Initial commit - Sahara Cup Tournament App"
```

### 1.2 Create GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `sahara-cup` or similar
3. Don't initialize with README (we already have code)

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/sahara-cup.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### 2.1 Sign up for Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account (it's free!)

### 2.2 Import Your Project
1. Click "New Project" in Vercel dashboard
2. Import your GitHub repository `sahara-cup`
3. Vercel will automatically detect it's a Node.js project

### 2.3 Configure Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete (usually 2-3 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

## Step 3: Configuration Details

### 3.1 Environment Variables (if needed)
In Vercel dashboard > Settings > Environment Variables, add:
- `NODE_ENV=production`

### 3.2 Domain Settings
- Vercel provides a free `.vercel.app` subdomain
- You can add a custom domain later if needed

## Step 4: API Endpoints

Your deployed app will have these endpoints:
- **Frontend**: `https://your-app.vercel.app`
- **API**: `https://your-app.vercel.app/api`
- **WebSocket**: `https://your-app.vercel.app/socket.io`

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Test the tournament pages:
   - `/` - Home page
   - `/groups` - Group standings
   - `/schedule` - Match schedule
   - `/knockout` - Knockout bracket
3. Test API endpoints:
   - `GET /api/tournament`
   - `GET /api/knockout`
   - `GET /api/standings`

## Step 6: Admin Access

Use these credentials to test admin features:
- **Username**: `admin`
- **Password**: `admin123`

API Example:
```bash
curl -X PUT https://your-app.vercel.app/api/admin/knockout/ko1 \
  -H "Content-Type: application/json" \
  -d '{
    "player1Score": 3,
    "player2Score": 1,
    "status": "completed",
    "username": "admin",
    "password": "admin123"
  }'
```

## Automatic Updates

Once deployed:
1. Push changes to your GitHub repository
2. Vercel automatically redeploys
3. Changes are live in ~2 minutes

## Troubleshooting

### Common Issues:
1. **Build fails**: Check package.json scripts
2. **API not working**: Verify vercel.json configuration
3. **Socket connection fails**: Check CORS settings

### Logs:
- View deployment logs in Vercel dashboard
- Check function logs for API debugging

## Features Included in Deployment:

✅ **Frontend (React + Vite)**
- Tournament dashboard
- Group standings 
- Match schedule
- Knockout bracket
- Real-time updates

✅ **Backend (Node.js + Express)**
- REST API for all tournament data
- Admin endpoints for match management
- Real-time WebSocket support
- Authentication system

✅ **Database** 
- In-memory storage (resets on redeploy)
- Consider upgrading to persistent DB for production

## Vercel Free Tier Limits:
- 100GB bandwidth/month
- 10,000 function invocations/month
- 100 deployments/day
- Perfect for tournament events!

## Cost: **$0/month** 🎉

Your tournament app will be live and accessible to all participants worldwide!

#!/bin/bash

echo "🏓 Sahara Cup - Vercel Deployment Setup"
echo "======================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Sahara Cup Tournament App"
else
    echo "✅ Git repository already initialized"
fi

# Check for GitHub remote
if ! git remote | grep -q origin; then
    echo ""
    echo "🔗 Please add your GitHub repository URL:"
    echo "   1. Create a new repository on GitHub"
    echo "   2. Copy the repository URL"
    echo "   3. Run: git remote add origin <YOUR_GITHUB_URL>"
    echo "   4. Run: git push -u origin main"
else
    echo "✅ GitHub remote already configured"
    echo "📤 Pushing latest changes..."
    git add .
    git commit -m "Updated for Vercel deployment - $(date)"
    git push
fi

echo ""
echo "🚀 Next Steps:"
echo "1. Go to https://vercel.com"
echo "2. Sign up/login with GitHub"
echo "3. Click 'New Project'"
echo "4. Import your GitHub repository"
echo "5. Deploy with default settings"
echo ""
echo "✨ Your tournament app will be live in minutes!"
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"

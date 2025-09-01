# GitHub Desktop Setup Script for Discord Multi-Account Manager
# Run this script after installing GitHub Desktop

Write-Host "🚀 Discord Multi-Account Manager - GitHub Setup" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

Write-Host "📋 Prerequisites Check:" -ForegroundColor Yellow
Write-Host "1. GitHub Desktop installed and signed in" -ForegroundColor White
Write-Host "2. GitHub account created" -ForegroundColor White
Write-Host "3. Vercel account created" -ForegroundColor White
Write-Host ""

Write-Host "🔧 Project Setup:" -ForegroundColor Yellow
Write-Host "1. Install dependencies: npm install" -ForegroundColor White
Write-Host "2. Test locally: npm run dev" -ForegroundColor White
Write-Host "3. Test build: npm run build" -ForegroundColor White
Write-Host ""

Write-Host "📁 GitHub Desktop Steps:" -ForegroundColor Yellow
Write-Host "1. Open GitHub Desktop" -ForegroundColor White
Write-Host "2. File → New Repository" -ForegroundColor White
Write-Host "3. Name: discord-multi-manager" -ForegroundColor White
Write-Host "4. Description: Multi-account Discord management website" -ForegroundColor White
Write-Host "5. Local path: Choose your project folder" -ForegroundColor White
Write-Host "6. Git Ignore: Select 'Node'" -ForegroundColor White
Write-Host "7. License: Choose 'MIT License'" -ForegroundColor White
Write-Host "8. Create Repository" -ForegroundColor White
Write-Host ""

Write-Host "📤 Push to GitHub:" -ForegroundColor Yellow
Write-Host "1. Copy all project files to repository folder" -ForegroundColor White
Write-Host "2. Add commit message: 'Initial commit: Discord Multi-Account Manager'" -ForegroundColor White
Write-Host "3. Commit to main" -ForegroundColor White
Write-Host "4. Push origin" -ForegroundColor White
Write-Host ""

Write-Host "🌐 Deploy to Vercel:" -ForegroundColor Yellow
Write-Host "1. Go to vercel.com and sign in with GitHub" -ForegroundColor White
Write-Host "2. New Project → Import discord-multi-manager" -ForegroundColor White
Write-Host "3. Deploy (auto-detects Next.js)" -ForegroundColor White
Write-Host ""

Write-Host "✅ Your website will be live in minutes!" -ForegroundColor Green
Write-Host ""

Write-Host "📚 For detailed instructions, see DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host "🔗 GitHub Desktop: https://desktop.github.com/" -ForegroundColor Cyan
Write-Host "🔗 Vercel: https://vercel.com" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to continue..."

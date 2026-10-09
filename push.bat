@echo off
echo ===================================================
echo PickFast - GitHub Push Script
echo ===================================================
git init
git config user.name "Konuyorum"
git config user.email "konuyorum@github.com"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/Konuyorum/pickfast.git
git add .
git commit -m "feat: PickFast AI shopping assistant with Claude 3.5 Haiku engine"
echo Pushing to GitHub...
git push -u origin main
echo Done!
pause

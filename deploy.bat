@echo off
echo Starting Frontend Deployment...
echo.

echo Installing dependencies...
call npm install

echo.
echo Building project...
call npm run build

echo.
echo Project built successfully!
echo Ready for Vercel deployment.
echo.
echo Next steps:
echo 1. Update .env.local with backend URL
echo 2. Run: vercel
echo 3. Follow the prompts
echo.
pause
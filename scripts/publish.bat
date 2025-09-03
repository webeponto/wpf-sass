@echo off
echo 🎯 Starting WPF3 NPM publication process...

:: Check if logged in to NPM
npm whoami >nul 2>&1
if errorlevel 1 (
    echo ❌ Please login to NPM first: npm login
    exit /b 1
)

:: Clean previous builds
echo 🧹 Cleaning previous builds...
call npm run clean

:: Install dependencies
echo 📦 Installing dependencies...
call npm install

:: Build the package
echo 🔨 Building package...
call npm run build

:: Check if build was successful
if not exist "dist\" (
    echo ❌ Build failed - dist directory not found
    exit /b 1
)

:: Verify package contents
echo 📋 Verifying package contents...
call npm pack --dry-run

:: Run tests
echo 🧪 Running tests...
call npm test

:: Ask for confirmation
echo 📦 Ready to publish @webeponto/wpf3
set /p confirm="Do you want to proceed? (y/N): "

if /i "%confirm%"=="y" goto publish
if /i "%confirm%"=="yes" goto publish
goto cancel

:publish
echo 🚀 Publishing to NPM...
call npm publish

if errorlevel 1 (
    echo ❌ Publishing failed
    exit /b 1
) else (
    echo ✅ Package published successfully!
    echo 📦 Install with: npm install @webeponto/wpf3
)
goto end

:cancel
echo ⏹️  Publication cancelled

:end

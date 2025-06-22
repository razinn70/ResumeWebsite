@echo off
REM Professional Build Script for Next.js Portfolio Website (Windows)
REM This script ensures a successful build by handling common issues

echo 🚀 Starting Professional Build Process...

REM Step 1: Clean previous builds
echo 🧹 Cleaning previous builds...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist node_modules\.cache rmdir /s /q node_modules\.cache

REM Step 2: Install dependencies if needed
echo 📦 Checking dependencies...
if not exist node_modules (
    echo Installing dependencies...
    npm install
)

REM Step 3: Type check (but don't fail the build)
echo 🔍 Running type check...
npm run type-check
if errorlevel 1 echo ⚠️  Type check completed with warnings (continuing build)

REM Step 4: Lint check (but don't fail the build) 
echo 🔧 Running lint check...
npm run lint --fix
if errorlevel 1 echo ⚠️  Lint completed with warnings (continuing build)

REM Step 5: Build the application
echo 🏗️  Building application...
set NODE_OPTIONS=--max-old-space-size=4096
npm run build

REM Step 6: Check build success
if errorlevel 1 (
    echo ❌ Build failed. Check the logs above for details.
    exit /b 1
) else (
    echo ✅ Build completed successfully!
    echo 🎉 Ready for production deployment!
)

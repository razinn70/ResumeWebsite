@echo off
REM Professional Dependency Resolution Script (Windows)
REM Handles React 19 compatibility and bundle optimization

echo 🔧 Professional Dependency Resolution Starting...

REM Step 1: Clean existing problematic packages
echo 🧹 Cleaning problematic packages...
npm uninstall react-flow-renderer reactflow leva 2>nul

REM Step 2: Clear caches
echo 🗑️ Clearing caches...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
npm cache clean --force

REM Step 3: Install React 19 compatible packages
echo 📦 Installing React 19 compatible packages...
npm install --save @xyflow/react@latest
npm install --save-dev @next/bundle-analyzer@latest
npm install --save-dev webpack-bundle-analyzer@latest

REM Step 4: Install with legacy peer deps for compatibility
echo 🔗 Installing dependencies with compatibility mode...
npm install --legacy-peer-deps

REM Step 5: Install additional performance packages
echo ⚡ Installing performance optimization packages...
npm install --save-dev @next/eslint-plugin-next@latest

echo ✅ Dependency resolution completed!
echo 🎯 Ready for optimized build!

REM Optional: Run build test
echo 🧪 Testing build...
npm run build

pause

#!/bin/bash

# Professional Dependency Resolution Script
# Handles React 19 compatibility and bundle optimization

echo "🔧 Professional Dependency Resolution Starting..."

# Step 1: Clean existing problematic packages
echo "🧹 Cleaning problematic packages..."
npm uninstall react-flow-renderer reactflow 2>/dev/null || true
npm uninstall leva 2>/dev/null || true

# Step 2: Clear caches
echo "🗑️ Clearing caches..."
rm -rf node_modules package-lock.json
npm cache clean --force

# Step 3: Install React 19 compatible packages
echo "📦 Installing React 19 compatible packages..."
npm install --save @xyflow/react@latest
npm install --save-dev @next/bundle-analyzer@latest
npm install --save-dev webpack-bundle-analyzer@latest

# Step 4: Install with legacy peer deps for compatibility
echo "🔗 Installing dependencies with compatibility mode..."
npm install --legacy-peer-deps

# Step 5: Install additional performance packages
echo "⚡ Installing performance optimization packages..."
npm install --save-dev @next/eslint-plugin-next@latest
npm install --save next-pwa@latest

echo "✅ Dependency resolution completed!"
echo "🎯 Ready for optimized build!"

# Optional: Run build test
echo "🧪 Testing build..."
npm run build

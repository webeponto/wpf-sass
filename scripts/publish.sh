#!/bin/bash

# 🚀 WPF3 NPM Publishing Script

echo "🎯 Starting WPF3 NPM publication process..."

# Check if logged in to NPM
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ Please login to NPM first: npm login"
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npm run clean

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the package
echo "🔨 Building package..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

# Verify package contents
echo "📋 Verifying package contents..."
npm pack --dry-run

# Run tests (when available)
echo "🧪 Running tests..."
npm test

# Ask for confirmation
echo "📦 Ready to publish @webeponto/wpf3"
read -p "Do you want to proceed? (y/N): " confirm

if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    echo "🚀 Publishing to NPM..."
    npm publish
    
    if [ $? -eq 0 ]; then
        echo "✅ Package published successfully!"
        echo "📦 Install with: npm install @webeponto/wpf3"
    else
        echo "❌ Publishing failed"
        exit 1
    fi
else
    echo "⏹️  Publication cancelled"
fi

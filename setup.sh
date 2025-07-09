#!/bin/bash

# GitHub Manager Setup Script
# This script helps you set up the project for local development

echo "🚀 Setting up GitHub Manager..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version $NODE_VERSION detected. Node.js 18+ is recommended."
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
if npm install; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cat > .env << EOF
# GitHub Personal Access Token
# Get yours from: https://github.com/settings/tokens
# Required scopes: public_repo, read:user
VITE_GITHUB_TOKEN=your_github_personal_access_token_here
EOF
    echo "✅ Created .env file"
    echo "📝 Please edit .env and add your GitHub Personal Access Token"
else
    echo "✅ .env file already exists"
fi

echo
echo "🎉 Setup complete!"
echo
echo "Next steps:"
echo "1. Get a GitHub Personal Access Token:"
echo "   → Go to https://github.com/settings/tokens"
echo "   → Generate new token (classic)"
echo "   → Select scopes: public_repo, read:user"
echo
echo "2. Edit .env file and add your token:"
echo "   → VITE_GITHUB_TOKEN=your_token_here"
echo
echo "3. Start the development server:"
echo "   → npm run dev"
echo
echo "4. Open your browser:"
echo "   → http://localhost:5173"
echo
echo "📚 For deployment instructions, see DEPLOYMENT.md"
echo 
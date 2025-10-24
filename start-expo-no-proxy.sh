#!/bin/bash
# Start Expo without proxy restrictions

echo "🔧 Removing proxy environment variables..."

# Unset all proxy variables
unset HTTP_PROXY
unset HTTPS_PROXY
unset http_proxy
unset https_proxy

# Set minimal NO_PROXY
export NO_PROXY="localhost,127.0.0.1"
export no_proxy="$NO_PROXY"

echo "✓ Proxy variables cleared"
echo "✓ Starting Expo development server..."
echo ""

# Start Expo
npx expo start


#!/bin/bash
# Fix Expo proxy restrictions

# Add Expo domains to NO_PROXY
export NO_PROXY="localhost,127.0.0.1,169.254.169.254,metadata.google.internal,*.svc.cluster.local,*.local,*.googleapis.com,*.google.com,*.expo.dev,*.expo.io,exp.host,*.helloao.org,bible.helloao.org"
export no_proxy="$NO_PROXY"

echo "✓ Updated NO_PROXY to include Expo domains"
echo "✓ Starting Expo with updated proxy settings..."

# Start Expo
npx expo start --tunnel

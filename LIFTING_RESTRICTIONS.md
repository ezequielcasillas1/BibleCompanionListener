# Lifting Network Restrictions for Expo

## Current Issue

Your environment has a proxy configuration that's blocking Expo from connecting to:
- `exp.host` - Expo's tunnel service
- `*.expo.dev` - Expo API services
- `bible.helloao.org` - Bible API

**Current Proxy Settings:**
```
HTTP_PROXY=http://21.0.0.13:15002
HTTPS_PROXY=http://21.0.0.13:15002
```

---

## Solution 1: Add Expo Domains to NO_PROXY (Easiest)

Run this script to update the proxy whitelist:

```bash
./fix-expo-proxy.sh
```

Or manually export these variables:

```bash
export NO_PROXY="localhost,127.0.0.1,*.expo.dev,*.expo.io,exp.host,*.helloao.org,bible.helloao.org,169.254.169.254,metadata.google.internal,*.svc.cluster.local,*.local,*.googleapis.com,*.google.com"
export no_proxy="$NO_PROXY"

npm start
```

---

## Solution 2: Temporarily Disable Proxy for Expo

```bash
# Unset proxy variables temporarily
unset HTTP_PROXY
unset HTTPS_PROXY
unset http_proxy
unset https_proxy

# Keep NO_PROXY
export NO_PROXY="localhost,127.0.0.1"
export no_proxy="$NO_PROXY"

# Start Expo
npm start
```

---

## Solution 3: Use Expo Tunnel with Proxy Support

First, ensure ngrok is installed globally:

```bash
npm install -g @expo/ngrok
```

Then add Expo domains to NO_PROXY and use tunnel mode:

```bash
export NO_PROXY="localhost,127.0.0.1,*.expo.dev,*.expo.io,exp.host,*.ngrok.io"
npx expo start --tunnel
```

---

## Solution 4: Configure Git Proxy for Clone/Push

If you also need to lift restrictions for git operations:

```bash
# Allow git through proxy
git config --global http.proxy http://21.0.0.13:15002
git config --global https.proxy http://21.0.0.13:15002

# Or bypass proxy for specific domains
git config --global http.https://github.com.proxy ""
git config --global http.https://expo.dev.proxy ""
```

---

## Solution 5: Run Without Tunnel (Current Working Method)

This is what's currently working - running in offline mode:

```bash
EXPO_OFFLINE=1 npx expo start --offline
```

**Pros:**
- Works without any proxy changes
- Metro bundler runs fine
- Can connect via manual URL entry

**Cons:**
- No QR code display
- No tunnel/public URL
- Must be on same network

---

## Recommended Approach

### Step 1: Update NO_PROXY

```bash
export NO_PROXY="localhost,127.0.0.1,169.254.169.254,metadata.google.internal,*.svc.cluster.local,*.local,*.googleapis.com,*.google.com,*.expo.dev,*.expo.io,exp.host,*.helloao.org,bible.helloao.org,*.ngrok.io"
export no_proxy="$NO_PROXY"
```

### Step 2: Start Expo Normally

```bash
npx expo start
```

### Step 3: If QR Code Still Doesn't Show

```bash
npx expo start --tunnel
```

This will:
✅ Connect to Expo services
✅ Display QR code
✅ Generate a public tunnel URL
✅ Allow connections from anywhere

---

## Testing the Fix

After applying any solution, verify connectivity:

```bash
# Test Bible API access
curl -I https://bible.helloao.org/api/ESV/John+3:16.json

# Test Expo API access (if proxy is lifted)
curl -I https://exp.host

# Check current proxy settings
env | grep -i proxy
```

---

## Permanent Fix

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
# Expo-friendly proxy configuration
export NO_PROXY="localhost,127.0.0.1,*.expo.dev,*.expo.io,exp.host,*.helloao.org,bible.helloao.org,*.ngrok.io,169.254.169.254,metadata.google.internal,*.svc.cluster.local,*.local,*.googleapis.com,*.google.com"
export no_proxy="$NO_PROXY"
```

Then reload:
```bash
source ~/.bashrc  # or source ~/.zshrc
```

---

## What Each Restriction Affects

| Restriction | Impact | Fix |
|-------------|--------|-----|
| exp.host blocked | No QR code, no tunnel | Add to NO_PROXY |
| bible.helloao.org blocked | Can't fetch Bible text | Add to NO_PROXY or use offline data |
| *.expo.dev blocked | Can't validate dependencies | Add to NO_PROXY or use --offline |
| *.ngrok.io blocked | Tunnel won't work | Add to NO_PROXY or use --lan |

---

## Current Workaround (Already Working)

Your app is working with:
- **Manual URL entry**: `exp://21.0.0.12:8081`
- **Offline mode**: Skips Expo API validation
- **Local network**: Works on same WiFi

To get QR code working, try **Solution 1** above!

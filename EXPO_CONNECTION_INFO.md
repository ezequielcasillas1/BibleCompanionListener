# Expo Go Connection Information

## Development Server Status
The Expo development server is running on: **http://localhost:8081**

## How to Connect with Expo Go

### Method 1: Direct URL Entry (Recommended in Offline Mode)

1. **Install Expo Go** on your mobile device:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Find your computer's IP address**:
   - On macOS: System Preferences → Network
   - On Windows: Run `ipconfig` in Command Prompt
   - On Linux: Run `hostname -I` or `ip addr`

3. **Enter the URL manually in Expo Go**:
   - Open Expo Go app
   - Tap "Enter URL manually" or type in the connection field
   - Enter: `exp://YOUR_COMPUTER_IP:8081`
   - Example: `exp://192.168.1.100:8081`

### Method 2: QR Code (If Available)

If you have access to a display showing the QR code:
1. Open Expo Go app
2. Scan the QR code
3. App will load automatically

### Method 3: Local Network Discovery

1. Make sure your phone and computer are on the same Wi-Fi network
2. Open Expo Go
3. Look for "BibleCompanionListener" in the list of available projects
4. Tap to connect

### Method 4: Web Browser (For Quick Testing)

You can also test in a web browser:
```bash
npm run web
```
Then open: http://localhost:8081

## Current Server Details

- **Project Name**: BibleCompanionListener
- **Metro Bundler**: Running on port 8081
- **Mode**: Offline (no Expo cloud services)
- **Platform**: React Native with Expo SDK ~54.0.20

## Troubleshooting

### Can't connect to the app?

1. **Firewall**: Ensure port 8081 is not blocked by firewall
2. **Same Network**: Phone and computer must be on the same Wi-Fi network
3. **VPN**: Disable VPN if active
4. **Restart**: Try restarting the Expo server:
   ```bash
   # Stop current server (Ctrl+C)
   # Then restart
   npm start
   ```

### "Couldn't connect to dev server" error?

1. Check that the development server is still running
2. Verify the IP address is correct
3. Try using the LAN option:
   ```bash
   npx expo start --lan
   ```

### Need a Public URL?

If you're not on the same network, try tunnel mode (requires internet):
```bash
npx expo start --tunnel
```

## Current Configuration

The app is configured to connect to:
- **Bible API**: https://bible.helloao.org/api
- **Supabase**: https://wdihmeqhrjlbfozmyjik.supabase.co
- **Versions**: ESV and NKJV

## Next Steps

Once connected, you'll see the Bible Companion Listener app with:
- Beautiful Bible reading interface
- Chapter navigation
- Version switching (ESV/NKJV)
- Audio player placeholder (ready for Eleven Labs integration)

---

**Note**: The server is currently running in offline mode to avoid network restrictions. Some cloud features may not be available.

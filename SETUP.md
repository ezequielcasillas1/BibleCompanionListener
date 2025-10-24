# Setup Guide

## Supabase Configuration

### Step 1: Get Your Supabase Anon Key

1. Go to your Supabase project: https://wdihmeqhrjlbfozmyjik.supabase.co
2. Click on "Settings" in the left sidebar
3. Navigate to "API" section
4. Copy the "anon public" key

### Step 2: Add the Key to the App

1. Open `src/constants/config.js`
2. Replace the empty string in `SUPABASE_ANON_KEY` with your copied key:

```javascript
export const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### Step 3: Create Database Tables

Run these SQL queries in your Supabase SQL Editor:

```sql
-- Create listening_progress table
CREATE TABLE listening_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_name TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorite_verses table
CREATE TABLE favorite_verses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_name TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_listening_progress_user ON listening_progress(user_id);
CREATE INDEX idx_favorite_verses_user ON favorite_verses(user_id);
```

## Running the App

### Option 1: Using Expo Go (Recommended for Testing)

1. Install Expo Go on your mobile device from:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Start the development server:
```bash
npm start
```

3. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app

### Option 2: iOS Simulator (macOS only)

```bash
npm run ios
```

### Option 3: Android Emulator

```bash
npm run android
```

### Option 4: Web Browser

```bash
npm run web
```

## Testing the Bible API

The app uses the Bible API from https://bible.helloao.org/

### Test Endpoints

You can test these URLs in your browser to verify API access:

- Single verse: https://bible.helloao.org/api/ESV/John+3:16.json
- Full chapter: https://bible.helloao.org/api/ESV/John+1.json
- Verse range: https://bible.helloao.org/api/ESV/Psalm+23:1-6.json

## Next Steps

After setup, you can:

1. Navigate through Bible chapters using the Previous/Next buttons
2. Switch between ESV and NKJV versions
3. Read beautifully formatted Bible text
4. Prepare for audio integration with Eleven Labs

## Eleven Labs Integration (Coming Soon)

To add text-to-speech functionality:

1. Get an API key from [Eleven Labs](https://elevenlabs.io/)
2. Install the Eleven Labs SDK
3. Implement audio playback controls
4. Add audio caching for offline playback

## Troubleshooting

### "Network request failed" error
- Check your internet connection
- Verify the Bible API is accessible
- Check if you're behind a firewall

### Expo Go not connecting
- Make sure your phone and computer are on the same WiFi network
- Try restarting the Expo development server
- Check firewall settings

### Supabase connection issues
- Verify your SUPABASE_ANON_KEY is correctly set
- Check Supabase project URL is correct
- Ensure tables are created in the database

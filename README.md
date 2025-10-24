# Bible Companion Listener

A beautiful mobile app built with React Native and Expo that allows users to read and listen to Bible chapters and verses.

## Features

- Read Bible verses and chapters in ESV and NKJV translations
- Beautiful, clean UI optimized for reading
- Chapter navigation (Previous/Next)
- Switch between Bible versions (ESV/NKJV)
- Audio playback functionality (Eleven Labs integration coming soon)
- Supabase integration for storing user progress and favorites

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development and build platform
- **Bible API** - https://bible.helloao.org/docs/reference/
- **Supabase** - Backend database and authentication
- **Axios** - HTTP client for API requests
- **Eleven Labs** (Coming soon) - Text-to-speech for audio playback

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (installed globally)
- Expo Go app on your mobile device

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BibleCompanionListener
```

2. Install dependencies:
```bash
npm install
```

3. Configure Supabase:
   - Open `src/constants/config.js`
   - Add your Supabase anon key to the `SUPABASE_ANON_KEY` constant

4. Start the development server:
```bash
npm start
```

5. Scan the QR code with the Expo Go app on your mobile device

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (macOS only)
- `npm run web` - Run in web browser

## Project Structure

```
BibleCompanionListener/
├── src/
│   ├── components/        # Reusable UI components
│   ├── constants/         # App configuration and constants
│   │   └── config.js     # Supabase and API configuration
│   ├── screens/          # Screen components
│   │   └── BibleReaderScreen.js  # Main Bible reader screen
│   └── services/         # API and service integrations
│       ├── bibleApi.js   # Bible API integration
│       └── supabase.js   # Supabase client and functions
├── App.js                # Root component
├── app.json             # Expo configuration
└── package.json         # Dependencies and scripts
```

## Bible API Usage

The app uses the Bible API from https://bible.helloao.org/docs/reference/

### API Endpoints

- Fetch a verse: `/api/{version}/{reference}.json`
  - Example: `/api/ESV/John+3:16.json`

- Fetch a chapter: `/api/{version}/{book}+{chapter}.json`
  - Example: `/api/ESV/John+3.json`

- Fetch verse range: `/api/{version}/{book}+{chapter}:{start}-{end}.json`
  - Example: `/api/ESV/John+3:16-17.json`

### Supported Versions

- ESV (English Standard Version)
- NKJV (New King James Version)

## Supabase Database Schema

### Tables to create in Supabase:

#### listening_progress
```sql
CREATE TABLE listening_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_name TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### favorite_verses
```sql
CREATE TABLE favorite_verses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_name TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Upcoming Features

- [ ] Eleven Labs audio integration for text-to-speech
- [ ] Audio playback controls (play, pause, speed control)
- [ ] User authentication with Supabase
- [ ] Save and sync reading progress across devices
- [ ] Bookmark favorite verses
- [ ] Reading plans
- [ ] Offline mode with cached chapters
- [ ] Dark mode
- [ ] Custom font sizes and reading preferences
- [ ] Search functionality
- [ ] Notes and highlights

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Acknowledgments

- Bible text provided by [Hello AO Bible API](https://bible.helloao.org)
- Built with [Expo](https://expo.dev)
- Backend powered by [Supabase](https://supabase.com)

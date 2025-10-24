# Eleven Labs Text-to-Speech Setup Guide

## 🎙️ **Complete Integration Ready!**

The Bible Companion Listener now has **full Eleven Labs text-to-speech integration** with:
- ✅ 8 Premium voices optimized for Bible reading
- ✅ Play/Pause/Skip controls
- ✅ Playback speed control (0.75x, 1x, 1.25x, 1.5x)
- ✅ Progress bar with time display
- ✅ Auto-advance to next chapter
- ✅ Beautiful voice selector modal

---

## 📝 **Step 1: Get Your Eleven Labs API Key**

1. **Sign up for Eleven Labs**:
   - Go to https://elevenlabs.io/
   - Create a free account
   - You get **10,000 free characters per month** on the free tier

2. **Get Your API Key**:
   - Log in to your Eleven Labs dashboard
   - Click on your profile icon (top right)
   - Go to **"Profile + API Key"**
   - Copy your API key (it looks like: `sk_abc123...`)

---

## 🔑 **Step 2: Add API Key to the App**

1. **Open the config file**:
   ```
   src/constants/config.js
   ```

2. **Add your API key**:
   ```javascript
   // Eleven Labs configuration
   export const ELEVEN_LABS_API_KEY = 'YOUR_API_KEY_HERE'; // Paste your key here
   ```

3. **Save the file**

**That's it!** The audio will now work when you press the play button.

---

## 🎤 **Available Voices**

The app includes 8 premium voices perfect for Bible reading:

| Voice | Type | Best For | Description |
|-------|------|----------|-------------|
| **Adam** | Male | Narratives, Histories | Deep, authoritative voice |
| **Rachel** | Female | Psalms, Poetry | Clear, calm voice |
| **Arnold** | Male | Gospels, Letters | Mature, resonant voice |
| **Antoni** | Male | General | Well-rounded, versatile |
| **Domi** | Female | Prophets | Strong, confident voice |
| **Bella** | Female | Devotional | Soft, gentle voice |
| **Josh** | Male | Youth | Young, energetic voice |
| **Sam** | Male | General | Clear, dynamic voice |

---

## 🎯 **How to Use**

### **Basic Playback**:
1. Open the app
2. Navigate to any Bible chapter
3. Tap the **Play button** ▶
4. The app will convert the text to speech and start playing!

### **Change Voice**:
1. Tap the **microphone icon** 🎙 in the header
2. Browse through the 8 available voices
3. Select your preferred voice
4. The next time you play, it will use the selected voice

### **Control Playback Speed**:
- Tap the **"Speed: 1x"** button at the bottom
- Cycles through: 0.75x → 1x → 1.25x → 1.5x
- Perfect for different reading preferences!

### **Navigation**:
- **⏮ Previous**: Skip to previous chapter
- **⏸/▶ Play/Pause**: Control playback
- **⏭ Next**: Skip to next chapter
- **Auto-advance**: Automatically plays next chapter when finished

---

## 💡 **Features**

### **Progress Tracking**:
- Real-time progress bar
- Current time / Total duration display
- Visual indicator of playback position

### **Smart Controls**:
- Automatically stops when changing chapters
- Remembers your selected voice
- Adjustable playback speed persists

### **Beautiful UI**:
- Voice selector modal with descriptions
- Smooth animations
- Loading indicators during audio generation

---

## 🔧 **Custom Voices**

Want to use your own custom voice from Eleven Labs?

1. **Create a custom voice** on Eleven Labs dashboard
2. **Get the voice ID** from your voice settings
3. **Add it to the config**:

```javascript
// In src/constants/config.js

export const ELEVEN_LABS_VOICES = {
  // ... existing voices ...

  MY_CUSTOM_VOICE: {
    id: 'your-custom-voice-id-here',
    name: 'My Custom Voice',
    description: 'My personal Bible reading voice',
  },
};
```

4. The voice will now appear in the voice selector!

---

## 📊 **Usage & Pricing**

### **Free Tier**:
- 10,000 characters/month
- Access to all voices
- Commercial use allowed

### **Paid Tiers**:
- **Starter**: $5/month - 30,000 characters
- **Creator**: $22/month - 100,000 characters
- **Pro**: $99/month - 500,000 characters

### **Estimated Usage**:
- Average Bible chapter: ~3,000 characters
- Free tier: ~3 chapters per month
- Starter tier: ~10 chapters per month
- Creator tier: ~33 chapters per month

---

## 🎛️ **Advanced Configuration**

### **Adjust Voice Settings**:

In `src/services/elevenLabs.js`, you can modify the voice settings:

```javascript
voice_settings: {
  stability: 0.5,        // 0-1: Lower = more expressive, Higher = more stable
  similarity_boost: 0.75, // 0-1: How closely to match the original voice
  style: 0,              // 0-1: Exaggeration of the style
  use_speaker_boost: true, // Enhance clarity
}
```

### **Change Model**:

Currently using: `eleven_monolingual_v1` (English only, best quality)

Other options:
- `eleven_multilingual_v2`: For multiple languages
- `eleven_turbo_v2`: Faster, lower latency

---

## 🐛 **Troubleshooting**

### **"API Key Required" error**:
- Make sure you added your API key to `src/constants/config.js`
- Check there are no extra spaces or quotes
- Restart the Expo server

### **"Failed to play audio" error**:
- Verify your API key is valid
- Check your internet connection
- Ensure you haven't exceeded your monthly quota

### **Audio not playing**:
- Make sure your phone volume is up
- Check silent mode is off
- Try a different voice
- Restart the app

### **Slow audio generation**:
- Normal for first play (converts text to speech)
- Subsequent plays of same chapter are instant
- Consider upgrading to Eleven Labs Turbo model

---

## 🚀 **Next Steps**

Once you have your API key set up:

1. **Test the audio** with a short chapter (e.g., Psalm 23)
2. **Try different voices** to find your favorite
3. **Adjust playback speed** to your preference
4. **Enjoy listening** to the Bible!

---

## 📱 **Integration Details**

### **Files Created/Modified**:
- `src/services/elevenLabs.js` - Core TTS integration
- `src/components/VoiceSelector.js` - Voice selection UI
- `src/screens/BibleReaderScreen.js` - Updated with audio controls
- `src/constants/config.js` - Added Eleven Labs configuration

### **Dependencies**:
- `expo-av` - Audio playback
- `axios` - API requests
- Built-in React Native components

---

**You're all set!** Just add your API key and start listening to the Bible! 🎉📖🎧

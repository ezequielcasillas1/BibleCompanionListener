# AI Custom Bible Plans Setup Guide

## 🤖 **Intelligent Bible Plan Generation**

The Bible Companion Listener now includes AI-powered custom Bible plan generation! Users can request personalized reading plans using natural language like:
- "Play only Jesus quotes from the Gospels"
- "Connect creation themes across Old and New Testament"
- "Psalms about comfort and peace"
- "Parables and their explanations"

The AI intelligently generates a structured playlist of Bible references tailored to the user's request.

---

## 📝 **Step 1: Deploy the Edge Function**

### **Option A: Via Supabase Dashboard (Easiest)**

1. **Go to your Supabase Dashboard**:
   - Navigate to https://supabase.com/dashboard
   - Select your project: `wdihmeqhrjlbfozmyjik`

2. **Create the Edge Function**:
   - Click on **"Edge Functions"** in the left sidebar
   - Click **"Create a new function"**
   - Name: `generate-bible-plan`
   - Copy the code from: `supabase/functions/generate-bible-plan/index.ts`
   - Paste it into the editor
   - Click **"Deploy"**

### **Option B: Via Supabase CLI** (if you have it installed)

```bash
cd BibleCompanionListener
supabase functions deploy generate-bible-plan
```

---

## 🔑 **Step 2: Add OpenAI API Key**

1. **Get Your OpenAI API Key**:
   - Go to https://platform.openai.com/api-keys
   - Create a new API key (or use existing one)
   - Copy the key (starts with `sk-...`)

2. **Add to Edge Function Secrets**:
   - In Supabase Dashboard, go to **Edge Functions**
   - Click on **Settings** or **Secrets**
   - Add a new secret:
     - **Name**: `OPENAI_API_KEY`
     - **Value**: Your OpenAI API key
   - Save

---

## 💰 **OpenAI Pricing & Usage**

### **Free Tier**:
- $5 free credits for new accounts (expires after 3 months)
- Good for testing!

### **Paid Tiers**:
- **Pay-as-you-go**: ~$0.0001 - $0.0002 per plan generation
- Using GPT-4o-mini model (most cost-effective)

### **Estimated Costs**:
- Average plan generation: ~500 tokens = $0.0001 (one cent per 100 plans!)
- Very affordable for typical usage

---

## 🎯 **How to Use**

### **Basic Usage**:
1. Open the Bible Companion Listener app
2. Tap the **🤖 AI button** in the top header (green background)
3. Enter your custom request or choose from 8 examples
4. Wait a few seconds for AI to generate your plan
5. The plan automatically loads and displays with progress indicator

### **Example Plans Included**:
1. **Jesus' Teachings** ✝️ - Only Jesus quotes from the Gospels
2. **Comfort & Peace** 🕊️ - Psalms and verses about comfort
3. **Creation Story** 🌟 - Creation themes across Old/New Testament
4. **Wisdom Literature** 📖 - Proverbs, Ecclesiastes, Job insights
5. **Love & Compassion** ❤️ - Verses about God's love
6. **Prophetic Promises** 🔮 - Messianic prophecies and fulfillment
7. **Morning Devotion** 🌅 - Encouraging verses to start the day
8. **Psalms of David** 🎵 - David's psalms only

### **Custom Requests**:
You can ask for anything! Examples:
- "All mentions of the Holy Spirit"
- "Miracles of Jesus in chronological order"
- "Verses about prayer and fasting"
- "Women of faith in the Bible"
- "End times prophecies from Daniel and Revelation"

---

## 🎨 **Features**

### **Active Plan Display**:
- Horizontal scrolling progress bar
- Shows current position (e.g., "3 of 8")
- Completed items marked with ✓
- Active item highlighted in purple
- Tap any item to jump to that passage

### **Auto-Advance**:
- When audio finishes, automatically moves to next plan item
- Seamless listening experience

### **Save Plans**:
- Plans automatically saved to your device
- Access previously generated plans
- Delete plans you no longer need

### **Smart Navigation**:
- ⏮ Previous: Go to previous plan item
- ⏭ Next: Skip to next plan item
- ✕ Close: Exit plan and return to normal browsing

---

## 🔧 **Technical Details**

### **How It Works**:

1. **User Request** → App sends to Edge Function
2. **Edge Function** → Calls OpenAI GPT-4o-mini with Bible context
3. **AI Generation** → Returns structured JSON plan
4. **Validation** → Ensures all Bible references are valid
5. **Display** → Shows plan with progress indicator
6. **Audio** → Uses existing Eleven Labs integration

### **Plan Structure**:
```json
{
  "plan": [
    {
      "book": "Matthew",
      "chapter": 5,
      "startVerse": 1,
      "endVerse": 12
    },
    {
      "book": "John",
      "chapter": 3,
      "startVerse": 16,
      "endVerse": 21
    }
  ],
  "planName": "Jesus' Teachings on the Kingdom",
  "version": "ESV",
  "totalItems": 2
}
```

### **Files Created**:
- `supabase/functions/generate-bible-plan/index.ts` - Edge Function
- `src/services/aiPlanService.js` - Client service
- `src/components/CustomPlanModal.js` - Request UI
- `src/components/ActivePlanDisplay.js` - Progress display
- `src/screens/BibleReaderScreen_withAI.js` - Main integration

---

## 🐛 **Troubleshooting**

### **"Failed to generate plan" error**:
- Verify OpenAI API key is set in Edge Function secrets
- Check you have OpenAI credits available
- Ensure Edge Function is deployed
- Check internet connection

### **Edge Function not found**:
- Confirm function name is exactly: `generate-bible-plan`
- Verify it's deployed in Supabase Dashboard
- Try redeploying the function

### **Invalid Bible references**:
- The AI has been trained on all 66 Bible books
- If it generates invalid references, try rephrasing your request
- Be specific (e.g., "Matthew chapters 5-7" instead of "Sermon on Mount")

### **Slow generation**:
- Normal: AI takes 2-5 seconds to generate plans
- Complex requests may take longer
- Subsequent uses of same plan are instant (cached locally)

---

## 📱 **Integration Status**

### **✅ Completed**:
- Edge Function created with OpenAI integration
- Client service with plan generation and storage
- Beautiful modal UI with examples
- Active plan display with progress tracking
- Auto-advance through plan items
- Save/load plans from device storage
- Full integration with existing audio playback

### **🔧 Requires Setup**:
- Deploy `generate-bible-plan` Edge Function
- Add `OPENAI_API_KEY` to Edge Function secrets

---

## 🚀 **Next Steps**

1. **Deploy the Edge Function** (see Step 1 above)
2. **Add your OpenAI API key** (see Step 2 above)
3. **Test the feature**:
   - Open the app
   - Tap the 🤖 AI button
   - Try one of the example plans
   - Enjoy personalized Bible listening!

---

## 💡 **Pro Tips**

### **Better Prompts**:
- Be specific about topics or themes
- Mention specific books if you want focus (e.g., "from Gospels only")
- Specify length (e.g., "short 5-verse plan" vs "comprehensive study")

### **Example Successful Prompts**:
- "Jesus healing miracles with context"
- "Paul's teaching on grace from Romans and Galatians"
- "Old Testament prophecies about the Messiah"
- "Verses about anxiety and worry for difficult times"
- "Faith journey from Abraham to Paul"

### **Combining with Audio**:
- Select your favorite Eleven Labs voice
- Adjust playback speed for your preference
- Let the plan auto-advance for uninterrupted listening

---

## 🎓 **Educational Use**

Perfect for:
- Bible study groups
- Sermon preparation
- Topical studies
- Personal devotions
- Teaching specific themes
- Scripture memorization plans

---

**You're all set!** Deploy the Edge Function, add your OpenAI key, and start creating intelligent Bible listening plans! 🤖📖🎧

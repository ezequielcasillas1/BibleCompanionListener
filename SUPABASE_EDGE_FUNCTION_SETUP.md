# Supabase Edge Function Setup for Secure Text-to-Speech

## 🔐 **Why Use Edge Functions?**

Using Supabase Edge Functions to handle Eleven Labs API calls is **much more secure** because:
- ✅ API key stays server-side (never exposed in the app)
- ✅ Can't be extracted from the mobile app
- ✅ Better control over usage and rate limiting
- ✅ Centralized error handling and logging
- ✅ Easy to update without redeploying the app

---

## 📋 **Prerequisites**

1. **Supabase Project**: https://wdihmeqhrjlbfozmyjik.supabase.co
2. **Supabase CLI**: Install from https://supabase.com/docs/guides/cli
3. **Eleven Labs Account**: Get API key from https://elevenlabs.io

---

## 🚀 **Deployment Steps**

### **Step 1: Install Supabase CLI**

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows (with Scoop)
scoop install supabase

# Or use NPM
npm install -g supabase
```

Verify installation:
```bash
supabase --version
```

---

### **Step 2: Login to Supabase**

```bash
supabase login
```

This will open a browser for authentication.

---

### **Step 3: Link Your Project**

```bash
cd /path/to/BibleCompanionListener
supabase link --project-ref wdihmeqhrjlbfozmyjik
```

Enter your database password when prompted.

---

### **Step 4: Set the Eleven Labs API Key Secret**

✅ **You already did this!** You mentioned you submitted the API key secret in Supabase Edge Functions.

To verify or update it:

```bash
supabase secrets set ELEVEN_LABS_API_KEY=your-eleven-labs-api-key-here
```

Or do it via the Supabase Dashboard:
1. Go to https://supabase.com/dashboard/project/wdihmeqhrjlbfozmyjik/settings/functions
2. Click "Edge Function Secrets"
3. Add secret: `ELEVEN_LABS_API_KEY` = `your-key-here`

---

### **Step 5: Deploy the Edge Function**

```bash
supabase functions deploy text-to-speech
```

You should see output like:
```
Deploying Function (project-ref: wdihmeqhrjlbfozmyjik)
Uploading text-to-speech (1.2 KB)
Deployed Function text-to-speech in 2.1s
Function URL: https://wdihmeqhrjlbfozmyjik.supabase.co/functions/v1/text-to-speech
```

---

### **Step 6: Test the Edge Function**

Test with curl:

```bash
curl -i --location --request POST \
  'https://wdihmeqhrjlbfozmyjik.supabase.co/functions/v1/text-to-speech' \
  --header 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "text": "In the beginning God created the heavens and the earth.",
    "voiceId": "pNInz6obpgDQGcFmaJgB"
  }'
```

Replace `YOUR_SUPABASE_ANON_KEY` with your actual anon key.

Expected response:
```json
{
  "audio": "data:audio/mpeg;base64,//uQx...",
  "voiceId": "pNInz6obpgDQGcFmaJgB"
}
```

---

### **Step 7: Add Supabase Anon Key to App**

1. Get your Supabase anon key from:
   - https://supabase.com/dashboard/project/wdihmeqhrjlbfozmyjik/settings/api

2. Open `src/constants/config.js`

3. Add the anon key:
   ```javascript
   export const SUPABASE_ANON_KEY = 'your-anon-key-here';
   ```

4. Save the file

---

## ✅ **Verification**

The app should now work! When you press play:

1. App calls Supabase Edge Function
2. Edge Function calls Eleven Labs API (with secure key)
3. Edge Function returns audio to app
4. App plays the audio

---

## 🔧 **Updating the Edge Function**

If you need to modify the Edge Function:

1. Edit `supabase/functions/text-to-speech/index.ts`

2. Deploy the updated function:
   ```bash
   supabase functions deploy text-to-speech
   ```

3. Changes are live immediately (no app redeployment needed!)

---

## 📊 **Monitoring**

View Edge Function logs:

```bash
supabase functions logs text-to-speech
```

Or in the Supabase Dashboard:
https://supabase.com/dashboard/project/wdihmeqhrjlbfozmyjik/logs/edge-functions

---

## 🐛 **Troubleshooting**

### **"Failed to generate speech" error**

Check:
- ✅ Eleven Labs API key is set correctly in secrets
- ✅ You have enough credits in your Eleven Labs account
- ✅ The voice ID is valid

View logs:
```bash
supabase functions logs text-to-speech
```

### **"Authorization header required" error**

- Make sure `SUPABASE_ANON_KEY` is set in `src/constants/config.js`
- Check the key is correct in Supabase Dashboard

### **Edge Function not found**

Redeploy:
```bash
supabase functions deploy text-to-speech
```

### **CORS errors**

The Edge Function already includes CORS headers. If you still see errors:
- Check the function URL is correct
- Verify the anon key is valid
- Try redeploying the function

---

## 💰 **Cost Considerations**

### **Supabase Edge Functions**
- **Free tier**: 500,000 invocations/month
- **Pro tier**: 2 million invocations/month + $2 per million after
- Each Bible chapter = 1 invocation

### **Eleven Labs**
- **Free**: 10,000 characters/month (~3 chapters)
- **Starter ($5/month)**: 30,000 characters (~10 chapters)
- **Creator ($22/month)**: 100,000 characters (~33 chapters)

---

## 🔐 **Security Benefits**

### **Before (Client-side API key)**:
```javascript
// ❌ API key exposed in client code
const response = await fetch('https://api.elevenlabs.io/...', {
  headers: {
    'xi-api-key': 'sk_exposed_key_123' // Anyone can see this!
  }
})
```

### **After (Edge Function)**:
```javascript
// ✅ API key hidden on server
const response = await fetch('https://supabase.co/functions/v1/text-to-speech', {
  headers: {
    'Authorization': 'Bearer anon_key' // Public key, safe to expose
  }
})
```

The Eleven Labs API key is **never** sent to the client!

---

## 📁 **File Structure**

```
BibleCompanionListener/
├── supabase/
│   └── functions/
│       └── text-to-speech/
│           └── index.ts          # Edge Function code
├── src/
│   ├── services/
│   │   └── elevenLabs.js         # Updated to use Edge Function
│   └── constants/
│       └── config.js              # Add SUPABASE_ANON_KEY here
└── SUPABASE_EDGE_FUNCTION_SETUP.md  # This file
```

---

## 🎯 **Next Steps**

1. ✅ Verify Edge Function is deployed
2. ✅ Test with curl command above
3. ✅ Add Supabase anon key to config
4. ✅ Test in the mobile app!

---

## 📞 **Quick Reference**

**Edge Function URL:**
```
https://wdihmeqhrjlbfozmyjik.supabase.co/functions/v1/text-to-speech
```

**Deploy command:**
```bash
supabase functions deploy text-to-speech
```

**View logs:**
```bash
supabase functions logs text-to-speech
```

**Set secrets:**
```bash
supabase secrets set ELEVEN_LABS_API_KEY=your-key
```

---

**Your API key is now secure and the app is ready to use!** 🎉🔐

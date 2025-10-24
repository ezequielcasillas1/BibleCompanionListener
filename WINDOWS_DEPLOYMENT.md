# Windows Deployment Guide - Supabase Edge Function

## 🪟 **Installing Supabase CLI on Windows**

### **Option 1: Using Scoop (Recommended)**

1. **Install Scoop** (if you don't have it):
   ```powershell
   # Run in PowerShell (Admin)
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   irm get.scoop.sh | iex
   ```

2. **Install Supabase CLI**:
   ```powershell
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   ```

3. **Verify installation**:
   ```powershell
   supabase --version
   ```

---

### **Option 2: Direct Download**

1. **Download the Windows binary**:
   - Go to https://github.com/supabase/cli/releases
   - Download the latest `supabase_windows_amd64.zip`

2. **Extract and add to PATH**:
   - Extract the zip file
   - Move `supabase.exe` to `C:\Program Files\Supabase\`
   - Add `C:\Program Files\Supabase\` to your PATH:
     - Search "Environment Variables" in Windows
     - Edit "Path" variable
     - Add new entry: `C:\Program Files\Supabase\`
     - Click OK

3. **Restart PowerShell** and verify:
   ```powershell
   supabase --version
   ```

---

### **Option 3: Use Supabase Dashboard (Easiest)**

You can deploy the Edge Function directly from the Supabase Dashboard without installing the CLI!

**Steps:**

1. **Go to your Supabase project**:
   https://supabase.com/dashboard/project/wdihmeqhrjlbfozmyjik/functions

2. **Click "Create Function"**

3. **Enter function details**:
   - Name: `text-to-speech`
   - Runtime: Deno

4. **Copy the Edge Function code** from `supabase/functions/text-to-speech/index.ts`

5. **Paste it into the editor**

6. **Click "Deploy Function"**

**Done!** Your Edge Function is live!

---

## 🚀 **Quick Deployment (Dashboard Method)**

### **Step 1: Copy the Edge Function Code**

The code is in your repo at:
```
supabase/functions/text-to-speech/index.ts
```

<details>
<summary>Click to see the full code (copy this)</summary>

```typescript
// Supabase Edge Function for Eleven Labs Text-to-Speech
// This keeps your API key secure on the server side

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const ELEVEN_LABS_API_URL = 'https://api.elevenlabs.io/v1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the Eleven Labs API key from Edge Function secrets
    const ELEVEN_LABS_API_KEY = Deno.env.get('ELEVEN_LABS_API_KEY')

    if (!ELEVEN_LABS_API_KEY) {
      throw new Error('ELEVEN_LABS_API_KEY is not set in Edge Function secrets')
    }

    // Parse request body
    const { text, voiceId } = await req.json()

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Default to Adam voice if not specified
    const selectedVoiceId = voiceId || 'pNInz6obpgDQGcFmaJgB'

    console.log(`Converting text to speech with voice ${selectedVoiceId}`)

    // Call Eleven Labs API
    const response = await fetch(
      `${ELEVEN_LABS_API_URL}/text-to-speech/${selectedVoiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_LABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0,
            use_speaker_boost: true,
          },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Eleven Labs API error:', error)
      throw new Error(`Eleven Labs API error: ${response.status} - ${error}`)
    }

    // Get audio data
    const audioData = await response.arrayBuffer()

    // Convert to base64
    const base64Audio = btoa(
      new Uint8Array(audioData).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    )

    // Return base64 encoded audio
    return new Response(
      JSON.stringify({
        audio: `data:audio/mpeg;base64,${base64Audio}`,
        voiceId: selectedVoiceId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
```

</details>

---

### **Step 2: Deploy via Dashboard**

1. **Go to**: https://supabase.com/dashboard/project/wdihmeqhrjlbfozmyjik/functions

2. **Click "Create a new function"** or **"Deploy new function"**

3. **Fill in**:
   - Function name: `text-to-speech`
   - Select runtime: `Deno`

4. **Paste the code** from above

5. **Click "Deploy"**

---

### **Step 3: Verify the Secret is Set**

✅ **You already did this!** You mentioned you added the API key secret.

To verify:
1. Go to: https://supabase.com/dashboard/project/wdihmeqhrjlbfozmyjik/settings/functions
2. Click "Manage secrets"
3. Verify `ELEVEN_LABS_API_KEY` is listed

---

### **Step 4: Test the Function**

Once deployed, test it:

**Option A: Using PowerShell**
```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_SUPABASE_ANON_KEY"
    "Content-Type" = "application/json"
}

$body = @{
    text = "In the beginning God created the heavens and the earth"
    voiceId = "pNInz6obpgDQGcFmaJgB"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://wdihmeqhrjlbfozmyjik.supabase.co/functions/v1/text-to-speech" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

**Option B: Using the Supabase Dashboard**
1. Go to your function page
2. Click "Invoke function"
3. Enter test payload:
   ```json
   {
     "text": "Test audio",
     "voiceId": "pNInz6obpgDQGcFmaJgB"
   }
   ```
4. Click "Send request"

---

## 📝 **Final Steps**

### **Get Your Supabase Anon Key**

1. Go to: https://supabase.com/dashboard/project/wdihmeqhrjlbfozmyjik/settings/api

2. Copy the **"anon public"** key

3. Clone your repo (if not already):
   ```powershell
   git clone https://github.com/ezequielcasillas1/BibleCompanionListener.git
   cd BibleCompanionListener
   ```

4. Open `src/constants/config.js`

5. Add the anon key:
   ```javascript
   export const SUPABASE_ANON_KEY = 'your-anon-key-here';
   ```

6. Save the file

---

## ✅ **That's It!**

Your Edge Function is deployed and the app is ready to use!

**Function URL:**
```
https://wdihmeqhrjlbfozmyjik.supabase.co/functions/v1/text-to-speech
```

**Test the app:**
1. Run `npm start` in the project directory
2. Connect via Expo Go
3. Tap the Play button
4. Enjoy Bible audio!

---

## 🔧 **Troubleshooting**

### **Function not found**
- Make sure the function name is exactly: `text-to-speech`
- Check it's deployed in the Functions tab

### **"API key not set" error**
- Verify the secret `ELEVEN_LABS_API_KEY` is set
- Redeploy the function

### **"Authorization required" error**
- Make sure you added `SUPABASE_ANON_KEY` to config.js
- Verify the anon key is correct

---

## 🎉 **You're Done!**

The easiest path for Windows:
1. ✅ Deploy via Supabase Dashboard (no CLI needed!)
2. ✅ Add anon key to config.js
3. ✅ Test and enjoy!

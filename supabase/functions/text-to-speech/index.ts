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

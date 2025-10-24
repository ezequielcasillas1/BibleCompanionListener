// Supabase Edge Function for AI-Powered Custom Bible Plans
// Uses OpenAI to intelligently generate Bible reading plans

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Bible structure knowledge for AI context
const BIBLE_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes',
  'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
  'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
  'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in Edge Function secrets')
    }

    const { userRequest, version = 'ESV' } = await req.json()

    if (!userRequest) {
      return new Response(
        JSON.stringify({ error: 'User request is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Generating Bible plan for request: "${userRequest}"`)

    // Call OpenAI API to generate custom Bible plan
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a Bible scholar assistant helping create custom Bible reading plans.

Your task is to generate a JSON array of Bible verse references based on the user's request.

IMPORTANT FORMAT RULES:
- Return ONLY a valid JSON array, nothing else
- Each item must have: book, chapter, startVerse, endVerse
- Use exact book names from this list: ${BIBLE_BOOKS.join(', ')}
- Keep verse ranges reasonable (max 20 verses per item)
- Order references logically

EXAMPLES:

Request: "Play only Jesus quotes from the Gospels"
Response: [
  {"book": "Matthew", "chapter": 5, "startVerse": 1, "endVerse": 12},
  {"book": "Matthew", "chapter": 6, "startVerse": 9, "endVerse": 13},
  {"book": "John", "chapter": 14, "startVerse": 1, "endVerse": 6}
]

Request: "Psalms about comfort"
Response: [
  {"book": "Psalms", "chapter": 23, "startVerse": 1, "endVerse": 6},
  {"book": "Psalms", "chapter": 46, "startVerse": 1, "endVerse": 11},
  {"book": "Psalms", "chapter": 121, "startVerse": 1, "endVerse": 8}
]

Request: "Connect creation themes old and new testament"
Response: [
  {"book": "Genesis", "chapter": 1, "startVerse": 1, "endVerse": 31},
  {"book": "Psalms", "chapter": 104, "startVerse": 1, "endVerse": 24},
  {"book": "John", "chapter": 1, "startVerse": 1, "endVerse": 14},
  {"book": "Revelation", "chapter": 21, "startVerse": 1, "endVerse": 5}
]

Now generate a plan based on the user's request.`
          },
          {
            role: 'user',
            content: userRequest
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const planText = data.choices[0].message.content.trim()

    console.log('AI Response:', planText)

    // Parse the JSON response
    let plan
    try {
      // Remove markdown code blocks if present
      const jsonText = planText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      plan = JSON.parse(jsonText)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      throw new Error('Failed to parse AI-generated plan. Please try rephrasing your request.')
    }

    // Validate the plan structure
    if (!Array.isArray(plan) || plan.length === 0) {
      throw new Error('Invalid plan format. Please try again.')
    }

    // Validate each item in the plan
    for (const item of plan) {
      if (!item.book || !item.chapter || !item.startVerse || !item.endVerse) {
        throw new Error('Invalid plan item format')
      }
      if (!BIBLE_BOOKS.includes(item.book)) {
        throw new Error(`Invalid book name: ${item.book}`)
      }
    }

    return new Response(
      JSON.stringify({
        plan,
        planName: userRequest,
        version,
        totalItems: plan.length
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

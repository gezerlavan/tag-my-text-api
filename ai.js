// ai.js
import { GoogleGenAI } from '@google/genai'
import { config } from './config/index.js'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// You can also rely on GOOGLE_API_KEY env var, but since you're already
// using GEMINI_API_KEY, we keep it explicit and simple.
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

export async function generateTags(text) {
  const prompt = `
    You are a tagging engine.

    Given the following user text, respond with 3-6 short, lowercase tags.
    Rules:
    - Output ONLY a JSON array of strings, like: ["tag1", "tag2"]
    - No extra text, no explanations, no keys, no formatting.

    Text:
    ${JSON.stringify(text)}
  `

  const response = await ai.models.generateContent({
    model: config.model, // fast, cheap, great for this use case :contentReference[oaicite:3]{index=3}
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'array',
        items: { type: 'string' },
      },
    },
  })

  // With @google/genai, the text is on `response.text`
  const raw = response.text

  let tags
  try {
    tags = JSON.parse(raw)

    // Basic sanity check
    if (!Array.isArray(tags)) {
      throw new Error('Model did not return an array')
    }

    // Normalize to array of strings
    tags = tags.map(t => String(t).trim()).filter(t => t.length > 0)
  } catch (e) {
    console.error('Failed to parse tags from model:', e, 'raw:', raw)
    // Fallback so your API doesn't completely break
    tags = []
  }

  return tags
}

export async function analyzeTone(text) {
  const response = await ai.models.generateContent({
    model: config.model,
    contents: `
      Analyze the tone of this text and return ONLY valid JSON:
      {
        "tone": "friendly/angry/neutral/etc",
        "confidence": 0-1,
        "suggestion": "rewrite suggestion here"
      }

      Text:
      ${JSON.stringify(text)}
    `,
    config: {
      responseMimeType: 'application/json',
    },
  })

  try {
    return JSON.parse(response.text)
  } catch (e) {
    console.error('Tone JSON parse error:', e)
    return {
      tone: 'unknown',
      confidence: 0,
      suggestion: 'Unable to analyze',
    }
  }
}

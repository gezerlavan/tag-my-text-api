// ai.js
import { GoogleGenAI } from '@google/genai'
import { config } from './config/index.js'
import { logger } from './utils/logger.js'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is required')
}

// You can also rely on GOOGLE_API_KEY env var, but since you're already
// using GEMINI_API_KEY, we keep it explicit and simple.
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

export async function generateTags(text) {
  const prompt = `
    You are a tagging engine.

    Given user text, return 3-6 short lowercase tags.

    Output format:
    ["tag1", "tag2", "tag3"]

    Examples:
    Input: "I need to prepare for my backend interview"
    Output: ["interview", "backend", "prep"]

    Input: "Cooking pasta with basil and tomatoes"
    Output: ["cooking", "pasta", "food"]

    Now analyze this text and return ONLY JSON:
    ${JSON.stringify(text)}
  `

  const response = await ai.models.generateContent({
    model: config.model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'array',
        items: { type: 'string' },
      },
    },
  })

  const raw = typeof response.text === 'function' ? response.text() : response.text

  let tags
  try {
    tags = JSON.parse(raw)

    // Basic sanity check
    if (!Array.isArray(tags)) {
      throw new Error('Model did not return an array')
    }

    // Normalize to array of strings
    tags = tags.map(t => String(t).trim()).filter(t => t.length > 0)
  } catch (err) {
    logger('error', 'Failed to parse tags from model:', err, 'raw:', raw)
    // Fallback so your API doesn't completely break
    tags = []
  }

  return tags
}

export async function analyzeTone(text) {
  const prompt = `
    Analyze the tone of the text.
    Only return JSON in this format:
    {
      "tone": "string",
      "confidence": number,
      "suggestion": "string"
    }

    Examples:
    Text: "Why haven't you answered me?"
    Output: {
      "tone": "frustrated",
      "confidence": 0.82,
      "suggestion": "Try expressing curiosity instead of blame."
    }

    Text: "Thanks so much for helping me today!"
    Output: {
      "tone": "grateful",
      "confidence": 0.91,
      "suggestion": "No change needed."
    }

    Now analyze:
    ${JSON.stringify(text)}
  `

  const response = await ai.models.generateContent({
    model: config.model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          tone: { type: 'string' },
          confidence: { type: 'number' },
          suggestion: { type: 'string' },
        },
        required: ['tone', 'confidence', 'suggestion'],
      },
    },
  })

  const raw = typeof response.text === 'function' ? response.text() : response.text

  try {
    return JSON.parse(raw)
  } catch (err) {
    logger('error', 'Tone JSON parse error:', err, 'raw:', raw)
    return {
      tone: 'unknown',
      confidence: 0,
      suggestion: 'Unable to analyze',
    }
  }
}

# Tag My Text API

A simple yet powerful Express.js API that generates relevant tags and analyzes tone for any given text using Google's Gemini AI model.

## Overview

This API provides two endpoints for AI-powered text analysis:
- **Tag Generation**: Returns 3–6 relevant tags for input text
- **Tone Analysis**: Analyzes the tone and provides rewrite suggestions

Powered by Google's Gemini 2.5 Flash model for fast and cost-effective results.

## Features

- **AI-Powered Tagging**: Uses Google Gemini 2.5 Flash for intelligent tag generation
- **Simple REST API**: Single POST endpoint for easy integration
- **Error Handling**: Graceful fallbacks and meaningful error messages
- **Environment Configuration**: Secure API key management via environment variables

## Prerequisites

- Node.js (v16 or higher)
- A Google API key with Gemini access
- npm or yarn package manager

## Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_google_api_key_here
PORT=3000
```

## Usage

Start the server:

```bash
node server.js
```

The API will be available at `http://localhost:3000`

### API Endpoints

#### POST `/tag`

Generates relevant tags for the provided text.

**Request Body**

```json
{
  "text": "Your text content here"
}
```

**Response**

```json
{
  "tags": ["tag1", "tag2", "tag3"]
}
```

**Example**

```bash
curl -X POST http://localhost:3000/tag \
  -H "Content-Type: application/json" \
  -d '{"text": "I had a wonderful day at the beach with my friends"}'
```

Response:
```json
{
  "tags": ["beach", "friends", "fun", "vacation"]
}
```

#### POST `/tone`

Analyzes the tone of the provided text and offers suggestions.

**Request Body**

```json
{
  "text": "Your text content here"
}
```

**Response**

```json
{
  "tone": "friendly",
  "confidence": 0.95,
  "suggestion": "Your text already sounds friendly and approachable!"
}
```

**Example**

```bash
curl -X POST http://localhost:3000/tone \
  -H "Content-Type: application/json" \
  -d '{"text": "I demand you fix this immediately!"}'
```

Response:
```json
{
  "tone": "aggressive",
  "confidence": 0.92,
  "suggestion": "Consider rephrasing to: 'Could you please help me resolve this issue when possible?'"
}
```

## Error Handling

- **400 Bad Request**: Missing or invalid `text` field in request body
- **500 Internal Server Error**: AI processing failed

## Project Structure

```
tag-my-text-api/
├── server.js          # Express server setup
├── ai.js              # Google Gemini AI integration
├── config/
│   └── index.js       # Configuration management
├── routes/
│   ├── tag.js         # Tag generation endpoint
│   └── tone.js        # Tone analysis endpoint
├── utils/
│   └── logger.js      # Logging utility
└── package.json       # Dependencies and scripts
```

## Dependencies

- **express**: Web server framework
- **@google/genai**: Google Generative AI client library
- **dotenv**: Environment variable management

## Notes

- The API uses Gemini 2.5 Flash model for optimal speed and cost efficiency
- Tags are automatically normalized to lowercase
- Empty or invalid responses are handled gracefully with fallback to empty array
- The model is instructed to return JSON array format for reliable parsing

## License

ISC

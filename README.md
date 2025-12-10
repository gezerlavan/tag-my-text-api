# Tag My Text API

Express API for generating tags and analyzing tone using Google Gemini.

## Quickstart

1) Install deps

```bash
npm install
```

2) Configure environment (create `.env`)

```env
GEMINI_API_KEY=your_google_api_key
GEMINI_MODEL=gemini-2.5-flash    # optional, defaults to gemini-2.5-flash
PORT=3000                        # optional, defaults to 3000
LOG_LEVEL=info                   # optional
```

3) Run the server

```bash
npm run dev   # nodemon
# or
node server.js
```

API lives at http://localhost:3000

## Endpoints

- POST /tag — generate 3–6 tags for text
- POST /tone — analyze tone and suggest edits
- GET /history — last 20 requests/responses (no auth; disable or protect in production)

### POST /tag

Request

```json
{ "text": "I had a wonderful day at the beach with my friends" }
```

Response

```json
{ "tags": ["beach", "friends", "fun", "vacation"] }
```

### POST /tone

Request

```json
{ "text": "I demand you fix this immediately!" }
```

Response

```json
{
  "tone": "aggressive",
  "confidence": 0.92,
  "suggestion": "Consider rephrasing to: 'Could you please help me resolve this issue when possible?'"
}
```

### GET /history

Returns the latest 20 rows stored in SQLite (`data.db`). Contains endpoint, input, output, and timestamp. Treat as sensitive; add auth before exposing.

## Behavior & Operations

- Model: defaults to Gemini 2.5 Flash; override with `GEMINI_MODEL`.
- Rate limiting: in-memory, 15 requests per minute per route by IP. Behind proxies, configure Express `trust proxy` and consider a shared store.
- Validation: `text` must be 1–5000 chars (Zod).
- Storage: writes request/response pairs to `data.db` via `better-sqlite3`. If the DB is unavailable, writes can fail; wrap in your own retry/queue if needed.
- Logging: timestamped console logging; level set by `LOG_LEVEL` (currently informational only).

## Error Handling

- 400 for validation errors
- 429 when rate limit exceeded
- 500 when the AI call or parsing fails (tags fallback to empty array; tone falls back to `unknown`).

## Project Structure

```
tag-my-text-api/
├── server.js          # Express server setup
├── ai.js              # Google Gemini integration
├── config/            # Environment-driven config
├── routes/            # Tag, tone, history endpoints
├── middleware/        # Rate limiter
├── utils/             # Logger and SQLite logging helper
├── validation/        # Zod schemas
└── data.db            # SQLite store (created at runtime)
```

## Notes

- Do not expose `/history` publicly without auth; it contains user text and model outputs.
- Consider adding tests for `/tag` and `/tone` and swapping the rate limiter to a shared store for multi-instance deployments.

## License

ISC

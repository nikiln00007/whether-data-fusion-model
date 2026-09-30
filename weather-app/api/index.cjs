/**
 * server/index.js — Express proxy for the AI chatbot & Voice TTS
 *
 * Keeps API keys securely on the backend.
 * Uses Groq for lightning-fast LLM responses and ElevenLabs for realistic voice output.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';

/* ── CORS ─────────────────────────────────────────── */
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || origin === ALLOWED_ORIGIN || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return cb(null, true);
    }
    cb(null, true); // Dev friendly
  },
  methods: ['GET', 'POST'],
}));

/* ── Body parser ──────────────────────────────────── */
app.use(express.json({ limit: '64kb' }));

/* ── Rate limiting ────────────────────────────────── */
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment.' },
});
app.use('/api/', limiter);

const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';

/* ── Build system prompt ──────────────────────────── */
function buildSystemPrompt(weather, language) {
  const weatherSummary = weather
    ? JSON.stringify(weather, null, 2).slice(0, 3000)
    : 'No weather data available. Ask the user to search for a city first.';

  return `You are a friendly, knowledgeable weather assistant embedded in a weather app.

RULES:
1. Answer ONLY using the weather data provided below. Never invent or assume values.
2. Reply in the user's language. Their language code is: "${language}".
3. Keep answers concise — under 80 words unless the user explicitly asks for detail.
4. Use plain text only. No markdown, no bullet points, no asterisks — text will be read aloud by speech synthesis.
5. If no weather data is loaded, politely ask the user to search for a city first.
6. Be warm, helpful and conversational.

CURRENT WEATHER DATA:
${weatherSummary}`;
}

/* ── POST /api/chat ───────────────────────────────── */
app.post('/api/chat', async (req, res) => {
  const { messages, weather, language } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required.' });
  }
  if (messages.length > 30) {
    return res.status(400).json({ error: 'Too many messages in context.' });
  }
  for (const m of messages) {
    if (!m.role || !m.content || typeof m.content !== 'string') {
      return res.status(400).json({ error: 'Invalid message format.' });
    }
  }

  const systemPrompt = buildSystemPrompt(weather, language || 'en');

  try {
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not configured in server/.env' });
    }

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 300,
        temperature: 0.6,
      }),
    });

    const data = await groqRes.json();
    if (!groqRes.ok) {
      console.error('[Groq error]', data);
      return res.status(groqRes.status).json({ error: data?.error?.message || 'Chat provider error' });
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not generate a response.';
    return res.json({ reply });
  } catch (err) {
    console.error('[Chat proxy error]', err.message);
    return res.status(502).json({ error: 'AI assistant temporarily unavailable.' });
  }
});

/* ── POST /api/tts (ElevenLabs Speech Synthesis) ─── */
app.post('/api/tts', async (req, res) => {
  const { text, voiceId } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text is required.' });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'ElevenLabs API key is not configured.' });
  }

  const selectedVoice = voiceId || ELEVENLABS_VOICE_ID;

  try {
    const cleanText = text.replace(/[*#_~`>]/g, '').trim().slice(0, 1000);

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      console.error('[ElevenLabs TTS error]', response.status, errJson);
      return res.status(response.status).json({ error: errJson?.detail?.message || 'TTS generation failed' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    const arrayBuffer = await response.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('[TTS proxy error]', err.message);
    return res.status(500).json({ error: 'TTS service failed.' });
  }
});

/* ── GET /api/voices ──────────────────────────────── */
app.get('/api/voices', async (_, res) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return res.json({ voices: [] });

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': apiKey },
    });
    const data = await response.json();
    return res.json({ voices: data.voices || [] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve voices.' });
  }
});

/* ── Health check ─────────────────────────────────── */
app.get(['/health', '/api/health'], (_, res) => {
  res.json({
    status: 'ok',
    groqConfigured: Boolean(process.env.GROQ_API_KEY),
    model: GROQ_MODEL,
    elevenLabsConfigured: Boolean(process.env.ELEVENLABS_API_KEY),
    voiceId: ELEVENLABS_VOICE_ID,
  });
});

/* ── Start ────────────────────────────────────────── */
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Weather Backend running on http://localhost:${PORT}`);
    console.log(`   Chat Model: ${GROQ_MODEL}`);
    console.log(`   Voice: ElevenLabs (${ELEVENLABS_VOICE_ID})`);
  });
}
module.exports = app;

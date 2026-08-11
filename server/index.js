import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
// pdf-parse is a CommonJS module — interop via require works reliably in ESM
const pdf = require('pdf-parse');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8787;

// Only allow same-origin (the Vite dev server proxies /api to us) and localhost dev
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  undefined, // same-origin requests have no Origin header
];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '10mb' })); // allow base64 image payloads

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = process.env.GROQ_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct';
const VISION_MODEL = process.env.GROQ_VISION_MODEL || 'llama-3.2-11b-vision-preview';

function requireGroqKey() {
  if (!process.env.GROQ_API_KEY) {
    const err = new Error('GROQ_API_KEY is not set. Create a .env file in leftover-chef-ai/ with GROQ_API_KEY=sk-...');
    err.status = 500;
    return err;
  }
  return null;
}

async function groqChat(messages) {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`Groq API error ${res.status}: ${text.slice(0, 300)}`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

/**
 * POST /api/chat
 * Body: { messages: [{ role: 'user'|'assistant', content }], system?: string }
 * Returns: { reply: string }
 */
app.post('/api/chat', async (req, res) => {
  const keyErr = requireGroqKey();
  if (keyErr) return res.status(keyErr.status).json({ error: keyErr.message });

  const { messages, system } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  try {
    const fullMessages = system
      ? [{ role: 'system', content: system }, ...messages]
      : messages;
    const reply = await groqChat(fullMessages);
    res.json({ reply });
  } catch (err) {
    console.error('[chat] Groq error:', err.message);
    // Return a sanitized message to the client, never raw API error text
    const status = err.status || 500;
    const message = status < 500
      ? 'The AI service returned an error. Please try again later.'
      : 'The AI service is temporarily unavailable. Please try again later.';
    res.status(status).json({ error: message });
  }
});

/**
 * POST /api/scan
 * Body: { image: 'data:image/jpeg;base64,...' | raw base64, prompt?: string }
 * Returns: { ingredients: string[] }
 */
app.post('/api/scan', async (req, res) => {
  const keyErr = requireGroqKey();
  if (keyErr) return res.status(keyErr.status).json({ error: keyErr.message });

  const { image, prompt } = req.body || {};
  if (!image || typeof image !== 'string') {
    return res.status(400).json({ error: 'image (base64) is required' });
  }

  const defaultPrompt =
    'You are a food ingredient detector. Look at this photo of food ingredients and ' +
    'list the individual ingredients you can identify. Respond with ONLY a JSON array of ' +
    'lowercase ingredient names, e.g. ["chicken","tomato","onion"]. No other text.';

  try {
    const res2 = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt || defaultPrompt },
              { type: 'image_url', image_url: { url: image } },
            ],
          },
        ],
        temperature: 0.2,
        max_tokens: 300,
      }),
    });

    if (!res2.ok) {
      const text = await res2.text().catch(() => '');
      const err = new Error(`Groq vision error ${res2.status}: ${text.slice(0, 300)}`);
      err.status = res2.status;
      throw err;
    }
    const data = await res2.json();
    const content = data.choices?.[0]?.message?.content ?? '';

    // Parse the model's JSON array (handle stray backticks/text around it)
    const match = content.match(/\[[\s\S]*?\]/);
    let ingredients = [];
    if (match) {
      try {
        ingredients = JSON.parse(match[0]);
      } catch {
        ingredients = [];
      }
    }
    ingredients = ingredients
      .map((i) => String(i).trim().toLowerCase())
      .filter((i) => i.length > 0 && i.length <= 40);
    res.json({ ingredients });
  } catch (err) {
    console.error('[scan] Groq vision error:', err.message);
    const status = err.status || 500;
    const message = status < 500
      ? 'The vision service returned an error. Please try again later.'
      : 'The vision service is temporarily unavailable. Please try again later.';
    res.status(status).json({ error: message });
  }
});

// ─── File Upload / Text Extraction ─────────────────────────────────────────────
// Accepts a single file: PDFs and text files (.txt, .md, .csv, .json).
// Returns the extracted text so the chat can reference the uploaded content.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB cap
});

async function extractText(buffer, mimeType, filename = '') {
  const ext = (filename.split('.').pop() || '').toLowerCase();

  // PDF → parse text out of it
  if (mimeType === 'application/pdf' || ext === 'pdf') {
    const data = await pdf(buffer);
    return (data.text || '').trim();
  }

  // Plain text-ish files → read as UTF-8
  if (
    mimeType.startsWith('text/') ||
    ['txt', 'md', 'csv', 'json', 'log', 'tsv'].includes(ext)
  ) {
    return buffer.toString('utf8').trim();
  }

  return null; // unsupported
}

/**
 * POST /api/extract-text
 * Multipart field: "file"
 * Returns: { text: string } (empty string if nothing extractable)
 */
app.post('/api/extract-text', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'A file is required (field name "file")' });
    }
    const text = await extractText(req.file.buffer, req.file.mimetype, req.file.originalname);
    if (text === null) {
      return res.status(415).json({
        error: 'Unsupported file type. Please upload a PDF or a text file (.txt, .md, .csv, .json).',
      });
    }
    res.json({ text: text.slice(0, 100000) });
  } catch (err) {
    console.error('[extract-text] error:', err.message);
    res.status(500).json({ error: 'Could not read the file. Please try a different file.' });
  }
});

// In production, serve the built frontend from dist/ (single-command deploy)
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`LeftOver Chef API proxy listening on http://localhost:${PORT}`);
});

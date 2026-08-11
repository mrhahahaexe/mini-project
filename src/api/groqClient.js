/**
 * Thin client for the local Groq proxy (server/index.js).
 * All requests go to /api/* which Vite proxies to http://localhost:8787 in dev,
 * or is served by Express itself in production.
 */

async function postJSON(url, body) {
  // Abort if the backend proxy doesn't respond within 8s, so the UI can
  // fall back to the local knowledge base instead of hanging or erroring.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    // Network-level failure (backend down, offline, timeout) — let the caller fall back
    throw new Error('Network error: ' + (err?.message || 'unreachable'));
  }
  clearTimeout(timeout);

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

/**
 * Ask the Groq LLM a question.
 * @param {string} text - the user's message
 * @param {Array<{role:string,content:string}>} history - prior messages
 * @returns {Promise<string>} the assistant reply
 */
export async function askChefAI(text, history = []) {
  const system =
    'You are the LeftOver Chef AI cooking assistant. Help users with recipe ideas ' +
    'from ingredients they have, ingredient substitutions, food safety and storage, ' +
    'cooking techniques, and nutrition. Be warm, concise, and practical. ' +
    'Format answers with short sections and bullet points.';
  const messages = [
    ...history,
    { role: 'user', content: text },
  ];
  const data = await postJSON('/api/chat', { messages, system });
  return data.reply;
}

/**
 * Detect ingredients from a photo via Groq vision.
 * @param {string} dataUrl - a data:image/...;base64,... string
 * @returns {Promise<string[]>} lowercased ingredient names
 */
export async function scanIngredientsFromPhoto(dataUrl) {
  const data = await postJSON('/api/scan', { image: dataUrl });
  return data.ingredients || [];
}

/**
 * Upload a PDF or text file and get its extracted text.
 * @param {File} file
 * @returns {Promise<string>} the extracted text
 */
export async function extractTextFromFile(file) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  const form = new FormData();
  form.append('file', file);

  let res;
  try {
    res = await fetch('/api/extract-text', {
      method: 'POST',
      body: form,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    throw new Error('Network error: ' + (err?.message || 'unreachable'));
  }
  clearTimeout(timeout);

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Upload failed (${res.status})`);
  }
  return data.text || '';
}

export const config = { runtime: 'edge' };

import { DOCUMENT_TEXT } from './document.js';

const SYSTEM_PROMPT = `You are an educational assistant specialized in the AILit Framework document: "Empowering Learners for the Age of AI: An AI Literacy Framework for Primary and Secondary Education" (Review Draft, May 2025), published jointly by the OECD and the European Commission.

## Core rules
1. Answer ONLY based on the document text provided below. Do not use outside knowledge.
2. When citing content, always mention the page number: e.g., "(p. 12)" or "(עמוד 12)".
3. Reply in the same language the user writes in — Hebrew if asked in Hebrew, English if asked in English.
4. Be thorough and precise. Quote directly from the document when useful.
5. If a question cannot be answered from this document, say so clearly and suggest what the document does cover.

## Document
The following is the full text of the document, organized by page:

${DOCUMENT_TEXT}
`;

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let messages;
  try {
    const body = await req.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid messages' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const orResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ai-literacy.vercel.app',
        'X-Title': 'AI Literacy Framework Chat',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
        max_tokens: 2048,
        temperature: 0.3,
      }),
    });

    if (!orResponse.ok) {
      const errorText = await orResponse.text();
      console.error('OpenRouter error:', errorText);
      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Forward the SSE stream directly from OpenRouter
    return new Response(orResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

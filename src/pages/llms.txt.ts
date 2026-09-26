import type { APIRoute } from 'astro';
import { buildLlmsText } from '../data/llms';

export const prerender = true;
export const GET: APIRoute = () => new Response(buildLlmsText(), {
  headers: { 'Content-Type': 'text/plain; charset=utf-8' },
});

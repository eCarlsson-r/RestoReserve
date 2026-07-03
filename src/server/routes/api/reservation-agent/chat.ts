import { defineEventHandler, getHeader, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization');
  const body = await readBody(event);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': getHeader(event, 'origin') || 'http://localhost:5173',
  };

  // Logged-in customers hit the authenticated endpoint; guests use the
  // public, IP-throttled one.
  const path = token ? 'reservation-agent/chat' : 'public/reservation-agent/chat';
  if (token) {
    headers['authorization'] = `Bearer ${token}`;
  }

  const response = await $fetch(
    `${process.env['VITE_API_URL']}/${path}`,
    {
      headers,
      method: 'POST',
      body,
    }
  );

  return response;
});

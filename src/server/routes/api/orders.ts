import { defineEventHandler, getHeader, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization');
  const body = await readBody(event);

  const response = await $fetch(
    `${process.env['VITE_API_URL']}/orders`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': getHeader(event, 'origin') || 'http://localhost:5173',
        authorization: `Bearer ${token}`
      },
      method: 'POST',
      body
    }
  );

  return response;
});
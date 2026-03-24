import { defineEventHandler, getHeader } from 'h3';
import { ApiResponse, Sale } from 'src/types';

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization');

  const response: ApiResponse<Sale[]> = await $fetch(
      `${process.env['VITE_API_URL']}/user/history`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': getHeader(event, 'origin') || 'http://localhost:5173',
          authorization: `Bearer ${token}`
        },
        method: 'GET'
      }
    );

    if ('data' in response) return response.data;
    else return response;
});
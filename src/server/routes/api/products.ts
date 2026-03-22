import { createError, defineEventHandler, getHeader } from 'h3';
import { ApiResponse, Product } from './types';

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization');

  try {
    const report: ApiResponse<Product[]> = await $fetch(
      `${process.env['VITE_API_URL']}/public/products`,
      {
        headers: {
          authorization: `Bearer ${token}`
        },
        method: 'GET',
        params: {
          category: event.context.params?.['slug']
        }
      }
    );

    if ('data' in report) return report.data;
    else return report;
  } catch (error: any) {
    // Check if the error from the API is a 401
    if (error.response?.status === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }
    // Re-throw other errors
    throw error;
  }
});
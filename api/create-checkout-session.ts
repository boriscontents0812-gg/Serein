import { handleCreateCheckoutSession } from '../server/api';

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
    return;
  }

  try {
    const origin = req.headers.origin || (req.headers.host ? `https://${req.headers.host}` : 'http://localhost:5173');
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const result = await handleCreateCheckoutSession(body, origin);
    res.status(result.status).json(result.body);
  } catch (error: any) {
    console.error('[API ERROR create-checkout-session]:', error);
    res.status(500).json({ error: error.message || 'Internal server error', code: 'INTERNAL_ERROR' });
  }
}

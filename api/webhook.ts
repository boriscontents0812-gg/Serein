import { handleWebhookEvent } from '../server/api';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const chunks: any[] = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const rawBody = Buffer.concat(chunks);
    const sig = req.headers['stripe-signature'];
    const result = await handleWebhookEvent(rawBody, sig);
    res.status(result.status).json(result.body);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Webhook handler error' });
  }
}

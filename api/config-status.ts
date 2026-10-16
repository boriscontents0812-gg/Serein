import { handleGetConfigStatus } from '../server/api';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const result = handleGetConfigStatus();
    res.status(result.status).json(result.body);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

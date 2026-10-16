import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import {
  handleCreateCheckoutSession,
  handleWebhookEvent,
  handleGetOrderStatus,
  handleGetConfigStatus
} from './server/api';

dotenv.config();

function stripeCheckoutApiPlugin(): Plugin {
  const handler = (req: any, res: any, next: any) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost:5173'}`);
    const pathname = url.pathname;

    if (pathname === '/api/create-checkout-session' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk: any) => { body += chunk; });
      req.on('end', async () => {
        try {
          const parsed = JSON.parse(body || '{}');
          const origin = req.headers.origin || `http://${req.headers.host || 'localhost:5173'}`;
          const result = await handleCreateCheckoutSession(parsed, origin);
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = result.status;
          res.end(JSON.stringify(result.body));
        } catch (err: any) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Invalid JSON request payload', code: 'BAD_JSON' }));
        }
      });
      return;
    }

    if (pathname === '/api/webhook' && req.method === 'POST') {
      const chunks: any[] = [];
      req.on('data', (chunk: any) => { chunks.push(chunk); });
      req.on('end', async () => {
        const rawBody = Buffer.concat(chunks);
        const sig = req.headers['stripe-signature'];
        const result = await handleWebhookEvent(rawBody, sig);
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = result.status;
        res.end(JSON.stringify(result.body));
      });
      return;
    }

    if (pathname === '/api/order-status' && req.method === 'GET') {
      const sessionId = url.searchParams.get('session_id') || '';
      handleGetOrderStatus(sessionId).then((result) => {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = result.status;
        res.end(JSON.stringify(result.body));
      }).catch((err) => {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message }));
      });
      return;
    }

    if (pathname === '/api/config-status' && req.method === 'GET') {
      const result = handleGetConfigStatus();
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = result.status;
      res.end(JSON.stringify(result.body));
      return;
    }

    next();
  };

  return {
    name: 'stripe-checkout-api-plugin',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
}

export default defineConfig({
  plugins: [react(), stripeCheckoutApiPlugin()],
  server: {
    port: 5173,
    host: true
  }
});

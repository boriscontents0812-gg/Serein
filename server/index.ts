import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import {
  handleCreateCheckoutSession,
  handleWebhookEvent,
  handleGetOrderStatus,
  handleGetConfigStatus
} from './api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS setup
app.use(cors());

// Webhook endpoint requires raw buffer for signature verification
app.post(
  '/api/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'] as string | undefined;
    const result = await handleWebhookEvent(req.body, sig);
    res.status(result.status).json(result.body);
  }
);

// Standard JSON parser for other endpoints
app.use(express.json());

// API: Create Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  const origin = req.headers.origin || `${req.protocol}://${req.get('host')}`;
  const result = await handleCreateCheckoutSession(req.body, origin);
  res.status(result.status).json(result.body);
});

// API: Check Order Status
app.get('/api/order-status', async (req, res) => {
  const sessionId = req.query.session_id as string;
  const result = await handleGetOrderStatus(sessionId);
  res.status(result.status).json(result.body);
});

// API: Configuration Status
app.get('/api/config-status', (req, res) => {
  const result = handleGetConfigStatus();
  res.status(result.status).json(result.body);
});

// Serve frontend static files if built
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`[SEREIN SERVER] Server running at http://localhost:${PORT}`);
  console.log(`[PAYMENT STATUS] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[CONFIG] Retail price: $${process.env.STORE_RETAIL_PRICE || '48.00'} USD`);
});

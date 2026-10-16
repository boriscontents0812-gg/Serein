import fs from 'fs';
import path from 'path';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  image?: string;
}

export interface CustomerDetails {
  email?: string;
  name?: string;
  phone?: string;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}

export interface Order {
  id: string;
  stripeSessionId: string;
  paymentIntentId?: string;
  status: 'pending_payment' | 'paid' | 'cancelled' | 'failed';
  items: OrderItem[];
  currency: string;
  subtotal: number;
  shippingTotal: number;
  taxTotal: number;
  total: number;
  customer?: CustomerDetails;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  processedWebhookEventIds: string[];
}

interface DatabaseSchema {
  orders: Record<string, Order>; // Keyed by order ID
}

let inMemoryDb: DatabaseSchema = { orders: {} };

const DB_FILE_PATH = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
  ? path.resolve('/tmp', 'orders.json')
  : path.resolve(process.cwd(), 'server/data/orders.json');

// Ensure storage directory and file exist
function getDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      try {
        fs.mkdirSync(path.dirname(DB_FILE_PATH), { recursive: true });
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(inMemoryDb, null, 2), 'utf-8');
      } catch {
        // Fallback to in-memory if filesystem is read-only
      }
      return inMemoryDb;
    }
    const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    inMemoryDb = { orders: { ...inMemoryDb.orders, ...parsed.orders } };
    return inMemoryDb;
  } catch (err) {
    console.warn('[DB WARNING] Operating with in-memory DB fallback:', err);
    return inMemoryDb;
  }
}

function saveDb(data: DatabaseSchema): void {
  inMemoryDb = data;
  try {
    fs.mkdirSync(path.dirname(DB_FILE_PATH), { recursive: true });
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[DB WARNING] Failed writing to disk, preserved in memory:', err);
  }
}

export const OrderRepository = {
  createPendingOrder(params: {
    orderId: string;
    stripeSessionId: string;
    items: OrderItem[];
    currency: string;
    subtotal: number;
    shippingTotal: number;
    taxTotal: number;
    total: number;
  }): Order {
    const db = getDb();
    const now = new Date().toISOString();

    const order: Order = {
      id: params.orderId,
      stripeSessionId: params.stripeSessionId,
      status: 'pending_payment',
      items: params.items,
      currency: params.currency.toLowerCase(),
      subtotal: params.subtotal,
      shippingTotal: params.shippingTotal,
      taxTotal: params.taxTotal,
      total: params.total,
      createdAt: now,
      updatedAt: now,
      processedWebhookEventIds: []
    };

    db.orders[params.orderId] = order;
    saveDb(db);
    return order;
  },

  getOrderBySessionId(sessionId: string): Order | undefined {
    const db = getDb();
    return Object.values(db.orders).find(o => o.stripeSessionId === sessionId);
  },

  getOrderByOrderId(orderId: string): Order | undefined {
    const db = getDb();
    return db.orders[orderId];
  },

  markOrderAsPaid(params: {
    sessionId: string;
    paymentIntentId?: string;
    customer?: CustomerDetails;
    webhookEventId?: string;
    totalPaid?: number;
    currency?: string;
  }): { order?: Order; isDuplicate: boolean } {
    const db = getDb();
    const order = Object.values(db.orders).find(o => o.stripeSessionId === params.sessionId);

    if (!order) {
      console.warn(`[ORDER REPO] Order not found for session ${params.sessionId}`);
      return { isDuplicate: false };
    }

    // Idempotency check: if this event was already processed, ignore safely
    if (params.webhookEventId && order.processedWebhookEventIds.includes(params.webhookEventId)) {
      console.info(`[ORDER REPO] Webhook event ${params.webhookEventId} already processed for order ${order.id}`);
      return { order, isDuplicate: true };
    }

    const now = new Date().toISOString();
    order.status = 'paid';
    order.paymentIntentId = params.paymentIntentId || order.paymentIntentId;
    order.paidAt = order.paidAt || now;
    order.updatedAt = now;

    if (params.customer) {
      order.customer = {
        ...order.customer,
        ...params.customer
      };
    }

    if (params.totalPaid !== undefined) {
      order.total = params.totalPaid;
    }
    if (params.currency) {
      order.currency = params.currency.toLowerCase();
    }

    if (params.webhookEventId) {
      order.processedWebhookEventIds.push(params.webhookEventId);
    }

    db.orders[order.id] = order;
    saveDb(db);
    return { order, isDuplicate: false };
  },

  markOrderAsCancelled(sessionId: string): Order | undefined {
    const db = getDb();
    const order = Object.values(db.orders).find(o => o.stripeSessionId === sessionId);
    if (!order) return undefined;

    if (order.status === 'pending_payment') {
      order.status = 'cancelled';
      order.updatedAt = new Date().toISOString();
      db.orders[order.id] = order;
      saveDb(db);
    }
    return order;
  },

  listOrders(): Order[] {
    const db = getDb();
    return Object.values(db.orders);
  }
};

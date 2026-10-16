# Serein Beauty — The Serein Heatless Curl Set

A luxury single-product ecommerce website and complete Stripe Checkout flow for **Serein Beauty**, celebrating **The Serein Heatless Curl Set** (60-inch extra-long teal velvet curling rod and accessories).

Designed with inspiration from [Deadly Ponies](https://deadlyponies.com/) and [Kree8 Studio](https://www.kree8.studio/): featuring tactile soft-clay pill components, modern typography, floating card frames, and an instant Light (default white) / Dark theme switcher.

---

## Features

- **Luxury Product Presentation**: High-resolution studio photography gallery with zoom modal, touch swipe navigation, and tactile thumbnail selectors.
- **Dual Theme System**:
  - **White / Light Theme (Default)**: Modern off-white canvas (`#F5F6F8`), pure white floating clay cards, and deep slate typography.
  - **Dark Luxury Theme**: Deep charcoal canvas (`#0A0D0F`), dark slate cards (`#141A1E`), and glowing teal accents.
  - **Tactile Header Pill Toggle**: Instant switching with `localStorage` persistence.
- **Interactive E-Commerce Rituals**:
  - Slide-out Cart Drawer with item quantity management, subtotal calculation, and complimentary shipping note.
  - Sticky Add-to-Bag conversion pill on scroll.
  - Expandable FAQ accordions.
  - What's Included accessories breakdown with editable notes.
- **Production-Grade Stripe Checkout Flow**:
  - **Zero Trust Pricing**: Client-sent prices are strictly ignored. Only trusted server-side catalog data (`$48.00 USD`) is used.
  - **Secure Session Generation**: `POST /api/create-checkout-session` creates authenticated Stripe sessions with server env secret keys.
  - **Cancellation Handling**: Returning customers (`/?canceled=true`) have cart items safely preserved with an in-drawer notice.
  - **Cryptographic Webhook Verification**: `POST /api/webhook` verifies Stripe HMAC signatures and idempotently marks orders as paid.
  - **Verified Order Confirmation**: `/?success=true&session_id=...` verifies order status against the database before displaying the order receipt modal.

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Express / Vite Middleware API, Stripe Node SDK
- **Database**: File-backed JSON repository (`server/data/orders.json`) with idempotency ledger
- **Styling**: Tailwind CSS with custom clay shadow tokens, Didone serif typography, and bespoke `DLYP` geometric sans

---

## Getting Started

### 1. Installation
```bash
git clone https://github.com/boriscontents0812-gg/Serein.git
cd Serein
npm install
```

### 2. Environment Configuration
Copy the template and configure your test credentials:
```bash
cp .env.example .env
```
Fill in your Stripe test keys in `.env`:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STORE_RETAIL_PRICE=48.00
STORE_CURRENCY=usd
```

### 3. Development Server
```bash
npm run dev
```

### 4. Production Build & Preview
```bash
npm run build
npm run preview
```

### 5. Local Webhook Forwarding (Stripe CLI)
```bash
stripe listen --forward-to localhost:4173/api/webhook
```

---

## License

MIT License. Designed with quiet intention for Serein Beauty.

# SpiceLane — Food Ordering Platform

A full-stack food ordering web application with Stripe Checkout payment integration, admin dashboard, and category-based menu.

---

## Project Structure

```
SPICELANE/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   │   ├── stripe.js
│   │   │   ├── database.js
│   │   │   ├── prisma.js
│   │   │   └── logger.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── dish.controller.js
│   │   │   ├── order.controller.js
│   │   │   └── payment.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── validate.js
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── dish.routes.js
│   │   │   ├── order.routes.js
│   │   │   ├── payment.routes.js
│   │   │   └── admin.routes.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── cart/
    │   │   └── layout/
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Orders.jsx
    │   │   ├── OrderSuccess.jsx
    │   │   ├── Admin.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── .env.example
    └── package.json
```

---

## Database Architecture

```
Users ─────┬──< Orders >──< OrderItems >──< Dishes
           └──< CartItems >──────────────< Dishes
```

**Relationships:**
- User → Orders (1:N)
- User → CartItems (1:N)
- Order → OrderItems (1:N)
- Dish → CartItems & OrderItems (1:N)
- Unique constraint on `[userId, dishId]`

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:pass@host:5432/spicelan"
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

---

## Setup Guide

### Prerequisites
- Node.js 18+
- PostgreSQL (Local / Neon / Supabase)
- Stripe account

### Step 1: Install Dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### Step 2: Setup Database

**Option A — Neon (Free, Recommended)**
1. Create account at neon.tech
2. Create a new project
3. Copy the connection string into `DATABASE_URL`

**Option B — Supabase**
1. Create a project at supabase.com
2. Copy the DB URI into `DATABASE_URL`

**Option C — Local PostgreSQL**
```bash
createdb spicelan_db
```

### Step 3: Initialize Database

```bash
cd backend
cp .env.example .env
# Fill in your credentials

npm run db:generate
npm run db:push
npm run db:seed
```

Seeds include:
- 15 Indian dishes with categories and images
- 1 Admin account
- 1 Test user

### Step 4: Configure Stripe

1. Create an account at stripe.com
2. Copy your **Secret Key** → `STRIPE_SECRET_KEY`
3. Copy your **Publishable Key** → `VITE_STRIPE_PUBLISHABLE_KEY`
4. For local webhook testing, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:5000/api/payment/webhook
```

5. Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`

### Step 5: Run the App

**Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
npm run dev
# Runs on http://localhost:5173
```

---

## Test Accounts

| Role  | Email             | Password |
|-------|-------------------|----------|
| Admin | admin@foodapp.com | admin123 |
| User  | user@foodapp.com  | user123  |

---

## Payment Flow (Stripe Checkout)

1. User clicks **Proceed to Pay** on the Cart page
2. Frontend calls `POST /api/payment/checkout-session`
3. Backend creates a Stripe Checkout Session with all line items (dishes, delivery, platform fee, GST)
4. User is redirected to Stripe's hosted checkout page
5. On successful payment, Stripe fires a `checkout.session.completed` webhook
6. Backend creates the order in the database and clears the cart
7. User is redirected to `/order-success?session_id=...`
8. Frontend calls `GET /api/payment/verify/:sessionId` to display order details

**Stripe webhook raw body** is parsed before `express.json()` to ensure signature verification works correctly.

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/profile` | Get current user profile |

### Dishes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dishes` | List dishes (supports `search`, `category`, `isVeg`, `page`, `limit`) |
| GET | `/api/dishes/:id` | Get single dish |
| GET | `/api/dishes/categories` | List distinct categories |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get current user's cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/:dishId` | Update item quantity |
| DELETE | `/api/cart/:dishId` | Remove item from cart |
| DELETE | `/api/cart/clear` | Clear entire cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get current user's orders |
| GET | `/api/orders/:id` | Get single order |

### Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payment/checkout-session` | User | Create Stripe Checkout Session |
| GET | `/api/payment/verify/:sessionId` | User | Verify payment & retrieve order |
| POST | `/api/payment/webhook` | Stripe | Handle `checkout.session.completed` event |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/dishes` | Create a dish |
| PUT | `/api/admin/dishes/:id` | Update a dish |
| DELETE | `/api/admin/dishes/:id` | Delete a dish |
| GET | `/api/admin/orders` | List all orders |

---

## Pricing Logic

| Component    | Value                        |
|--------------|------------------------------|
| Delivery     | ₹40 (FREE on orders > ₹500) |
| Platform Fee | ₹5                           |
| GST          | 5% of subtotal               |
| Grand Total  | Subtotal + Delivery + Platform Fee + GST |

---

## UI Features

- Zomato/Swiggy-inspired warm orange theme
- Slide-in cart sidebar
- Skeleton loading states
- Category chips and Veg / Non-veg filters
- Fully responsive (mobile-first)
- Hover animations and smooth transitions
- Persistent login via `localStorage` (survives page refresh)

**Admin Panel (`/admin`):**
- Add, edit, and delete dishes (with image URL and category)
- View and manage all order statuses
- Protected via `isAdmin` role check on both frontend and backend

---

## Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React 18 + Vite               |
| Routing    | React Router v6               |
| State      | Context API                   |
| HTTP       | Axios (with interceptors)     |
| Backend    | Node.js + Express             |
| Database   | PostgreSQL                    |
| ORM        | Prisma                        |
| Auth       | JWT + bcrypt                  |
| Security   | Helmet, CORS, Rate Limiting   |
| Payments   | Stripe Checkout + Webhooks    |
| Logging    | Winston                       |

---

## Security Features

- JWT authentication with auto-logout on 401
- bcrypt password hashing
- Helmet security headers
- CORS (restricted to `FRONTEND_URL`)
- Rate limiting: 100 req/15min globally, 10 req/15min on `/api/auth`
- express-validator input validation
- Prisma ORM (SQL injection safe)
- Admin role guard (`requireAdmin` middleware)
- Stripe webhook signature verification (`stripe.webhooks.constructEvent`)

---

## Future Improvements

- UPI and wallet support via Stripe dashboard settings
- Real-time order tracking
- Cloudinary image upload for dish management
- Redis caching for menu and categories
- Full production deployment

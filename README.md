# 🍛 FoodApp — Production-Ready Food Ordering Platform

A full-stack food ordering web application inspired by Zomato/Swiggy, built with React + Node.js + PostgreSQL + Stripe.

---

## 📁 Complete Project Structure

```
foodapp/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema & relationships
│   │   └── seed.js                # Sample Indian food data (15 dishes)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js        # Prisma client singleton
│   │   │   └── stripe.js          # Stripe client config
│   │   ├── controllers/
│   │   │   ├── authController.js  # Register, login, profile
│   │   │   ├── dishController.js  # CRUD for menu items
│   │   │   ├── cartController.js  # Cart with pricing logic
│   │   │   ├── orderController.js # Order history & admin
│   │   │   └── paymentController.js # Stripe checkout & webhooks
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT authenticate + admin guard
│   │   │   ├── errorHandler.js    # Global error + 404 handler
│   │   │   └── validate.js        # express-validator runner
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── dishRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   └── orderRoutes.js
│   │   ├── validators/
│   │   │   ├── authValidators.js  # Register/login validation rules
│   │   │   └── dishValidators.js  # Dish creation validation rules
│   │   └── server.js              # Express app entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx          # Sticky navbar with cart badge
    │   │   ├── CartSidebar.jsx     # Slide-in cart with bill summary
    │   │   ├── FoodCard.jsx        # Zomato-style dish card
    │   │   ├── Footer.jsx          # Site footer
    │   │   └── ProtectedRoute.jsx  # Auth guards (user + admin)
    │   ├── context/
    │   │   ├── AuthContext.jsx     # JWT auth state management
    │   │   └── CartContext.jsx     # Cart state + API sync
    │   ├── pages/
    │   │   ├── HomePage.jsx        # Hero + Menu with filters
    │   │   ├── LoginPage.jsx       # Login form
    │   │   ├── RegisterPage.jsx    # Registration form
    │   │   ├── OrdersPage.jsx      # Order history
    │   │   ├── OrderSuccessPage.jsx # Post-payment confirmation
    │   │   └── AdminPage.jsx       # Dish management (CRUD)
    │   ├── services/
    │   │   └── api.js              # Axios instance + all API calls
    │   ├── App.jsx                 # Router + providers
    │   ├── main.jsx
    │   └── index.css              # Full design system (CSS variables)
    ├── index.html
    ├── vite.config.js
    ├── .env.example
    └── package.json
```

---

## 🗄️ Database Schema (ER Diagram Explanation)

```
Users ─────┬──< Orders >──< OrderItems >──< Dishes
           └──< CartItems >──────────────< Dishes
```

**Relationships:**
- `User` has many `Orders` (one-to-many)
- `User` has many `CartItems` (one-to-many)
- `Order` has many `OrderItems` (one-to-many)
- `Dish` appears in many `CartItems` and `OrderItems` (one-to-many)
- `CartItem` has a unique constraint on `[userId, dishId]`

**Tables:**
| Table | Key Fields |
|-------|-----------|
| users | id, name, email, password (bcrypt), role (USER/ADMIN) |
| dishes | id, name, description, price, imageUrl, category, rating, deliveryTime, isVeg |
| cart_items | id, userId, dishId, quantity (unique per user+dish) |
| orders | id, userId, status, totalAmount, deliveryCharge, gst, grandTotal, stripeSessionId |
| order_items | id, orderId, dishId, quantity, price (snapshot) |

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:pass@host:5432/foodapp?sslmode=require"
JWT_SECRET=your_32_char_minimum_secret_key_here
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
```

---

## 🚀 Step-by-Step Setup Guide

### Prerequisites
- Node.js 18+
- PostgreSQL (or Neon/Supabase free tier)
- Stripe account (free test mode)

---

### Step 1: Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### Step 2: Setup Database

Option A — **Neon (Recommended, Free)**
1. Go to https://neon.tech → Create account
2. Create new project → Copy the connection string
3. Paste into `DATABASE_URL` in `backend/.env`

Option B — **Supabase (Free)**
1. Go to https://supabase.com → Create project
2. Settings → Database → Copy "URI" connection string
3. Paste into `DATABASE_URL` in `backend/.env`

Option C — **Local PostgreSQL**
```bash
createdb foodapp_db
# DATABASE_URL="postgresql://postgres:password@localhost:5432/foodapp_db"
```

---

### Step 3: Configure Stripe

1. Go to https://dashboard.stripe.com
2. Enable Test Mode (toggle in top-right)
3. Developers → API Keys → Copy **Publishable key** and **Secret key**
4. Add to both `.env` files

For webhooks (local testing):
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:5000/api/payment/webhook
# Copy the webhook secret and add to STRIPE_WEBHOOK_SECRET
```

---

### Step 4: Initialize Database

```bash
cd backend

# Copy env file
cp .env.example .env
# Edit .env with your values

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data (15 Indian dishes + test users)
npm run db:seed
```

---

### Step 5: Run the App

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# → Running on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
cp .env.example .env
# Edit VITE_API_URL and VITE_STRIPE_PUBLISHABLE_KEY
npm run dev
# → Running on http://localhost:5173
```

---

### Step 6: Test the App

**Test accounts (created by seed):**
- 👑 Admin: `admin@foodapp.com` / `admin123`
- 👤 User: `user@foodapp.com` / `user123`

**Test Stripe payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVV: Any 3 digits

---

## 🔌 API Reference

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Register new user |
| POST | /api/auth/login | ❌ | Login user |
| GET | /api/auth/profile | ✅ | Get current user |

### Dishes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/dishes | ❌ | List all dishes (filter by category, isVeg, search) |
| GET | /api/dishes/:id | ❌ | Get dish by ID |
| GET | /api/dishes/categories | ❌ | List all categories |
| POST | /api/dishes | 👑 Admin | Create dish |
| PUT | /api/dishes/:id | 👑 Admin | Update dish |
| DELETE | /api/dishes/:id | 👑 Admin | Delete dish |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/cart | ✅ | Get cart + bill summary |
| POST | /api/cart/add | ✅ | Add item to cart |
| PUT | /api/cart/:dishId | ✅ | Update quantity |
| DELETE | /api/cart/:dishId | ✅ | Remove item |
| DELETE | /api/cart/clear | ✅ | Clear entire cart |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/orders | ✅ | Get user's orders |
| GET | /api/orders/:id | ✅ | Get order details |
| GET | /api/orders/all | 👑 Admin | Get all orders |
| PUT | /api/orders/:id/status | 👑 Admin | Update order status |

### Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/payment/create-checkout-session | ✅ | Create Stripe checkout |
| GET | /api/payment/verify/:sessionId | ✅ | Verify payment & get order |
| POST | /api/payment/webhook | ❌ | Stripe webhook handler |

---

## 🛡️ Security Features

- **JWT Authentication** — Stateless, expiry enforced
- **bcrypt** — Password hashing with salt rounds = 12
- **Helmet.js** — HTTP security headers (XSS, clickjacking, etc.)
- **CORS** — Restricted to frontend URL only
- **Rate Limiting** — 100 req/15min globally; 10 req/15min on auth routes
- **express-validator** — Input validation + sanitization
- **Prisma ORM** — Parameterized queries = no SQL injection
- **Admin Guard** — Role-based route protection

---

## ☁️ Deployment Guide

### Backend → Render.com (Free)

1. Push backend to GitHub
2. Go to https://render.com → New Web Service
3. Connect GitHub repo → select `backend/` as root
4. Build command: `npm install && npx prisma generate && npx prisma db push`
5. Start command: `npm start`
6. Add all env variables in Render dashboard
7. Run seed: Render → Shell → `node prisma/seed.js`

### Frontend → Vercel (Free)

1. Push frontend to GitHub
2. Go to https://vercel.com → Import project
3. Set root directory to `frontend/`
4. Add env variables:
   - `VITE_API_URL` = your Render backend URL + `/api`
   - `VITE_STRIPE_PUBLISHABLE_KEY` = your Stripe publishable key
5. Deploy!

### Database → Neon.tech (Free, 0.5GB)

Already covered in setup Step 2.

---

## 💰 Pricing Logic

| Component | Value |
|-----------|-------|
| Delivery Charge | ₹40 (FREE on orders > ₹500) |
| Platform Fee | ₹5 flat |
| GST | 5% on subtotal |
| Grand Total | Subtotal + Delivery + Platform + GST |

---

## 🎨 UI Features

- **Zomato/Swiggy-inspired** design with warm orange palette
- **Sora + DM Sans** typography pairing
- **Hover animations** on food cards (lift + image zoom)
- **Slide-in cart sidebar** with overlay
- **Skeleton loading** states
- **Category chips** with smooth scroll
- **Veg/Non-veg filters**
- **Responsive** — mobile first design
- **Free delivery banner** in cart

---

## 👨‍💼 Admin Features

- Add, edit, delete dishes
- Set availability status
- Upload dish images via URL
- View all orders with status management
- Protected by role-based guard

---

## 📋 Sample Indian Food Menu (Seeded Data)

| Dish | Category | Price | Veg |
|------|----------|-------|-----|
| Paneer Butter Masala | Main Course | ₹280 | ✅ |
| Veg Biryani | Rice | ₹220 | ✅ |
| Masala Dosa | South Indian | ₹150 | ✅ |
| Chole Bhature | North Indian | ₹180 | ✅ |
| Dal Makhani | Main Course | ₹240 | ✅ |
| Chicken Tikka Masala | Main Course | ₹320 | ❌ |
| Palak Paneer | Main Course | ₹260 | ✅ |
| Pav Bhaji | Street Food | ₹140 | ✅ |
| Butter Naan | Breads | ₹60 | ✅ |
| Gulab Jamun | Desserts | ₹100 | ✅ |
| Chicken Biryani | Rice | ₹320 | ❌ |
| Aloo Tikki Chaat | Street Food | ₹120 | ✅ |
| Mango Lassi | Beverages | ₹90 | ✅ |
| Tandoori Chicken | Starters | ₹380 | ❌ |
| Samosa | Starters | ₹50 | ✅ |

---

## 🔧 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Pure CSS (design system) |
| Routing | React Router v6 |
| State | Context API |
| HTTP | Axios |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + bcryptjs |
| Payments | Stripe Checkout |
| Validation | express-validator |
| Security | Helmet + CORS + Rate Limiting |
| Notifications | react-hot-toast |

# 🍛 FoodApp — Production-Ready Food Ordering Platform

A full-stack food ordering web application inspired by Zomato/Swiggy, built with React + Node.js + PostgreSQL + Stripe.
---
📁 Complete Project Structure
foodapp/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── validators/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── .env.example
    └── package.json

🗄️ Database Architecture (ER Overview)
Users ─────┬──< Orders >──< OrderItems >──< Dishes
           └──< CartItems >──────────────< Dishes

🔗 Relationships :
👤 User → 🧾 Orders (1:N)
👤 User → 🛒 CartItems (1:N)
🧾 Order → 📦 OrderItems (1:N)
🍛 Dish → CartItems & OrderItems (1:N)
🔒 Unique constraint on [userId, dishId]
 
⚙️ Environment Variables :
🔧 Backend (backend/.env)
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:pass@host:5432/foodapp"
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

🌐 Frontend (frontend/.env)
VITE_API_URL=http://localhost:5000/api

🚀 Step-by-Step Setup Guide -

📌 Prerequisites
🟢 Node.js 18+
🟢 PostgreSQL (Local / Neon / Supabase)

📦 Step 1: Install Dependencies

cd backend
npm install

cd ../frontend
npm install

🗄️ Step 2: Setup Database

☁️ Option A — Neon (Free Recommended)

Create account
Create project
Copy connection string
Paste into DATABASE_URL

🗃️ Option B — Supabase (Free)

Create project
Copy DB URI
Paste into DATABASE_URL

💻 Option C — Local PostgreSQL

createdb foodapp_db
🧠 Step 3: Initialize Database
cd backend

cp .env.example .env
# Update database credentials

npm run db:generate
npm run db:push
npm run db:seed

🌱 Seeds:

🍛 15 Indian dishes
👑 1 Admin account
👤 1 Test user

▶️ Step 4: Run the App

🖥️ Backend
cd backend
npm run dev

Runs on:
👉 http://localhost:5000

🌍 Frontend
cd frontend
cp .env.example .env
npm run dev

Runs on:
👉 http://localhost:5173

👥 Test Accounts :

👑 Admin

admin@foodapp.com
admin123

👤 User
user@foodapp.com
user123

💳 Payment System :

Currently uses a Simulated Checkout Flow 🧪
When user places order:
🧾 Order created in database 
🛒 Cart cleared
✅ Redirected to Order Success page

🔮 Future Enhancements -
💳 Razorpay Integration
📲 UPI Support
🔐 Secure Production Payment Gateway

🔌 API Overview

🔐 Authentication :

POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile

🍛 Dishes :

GET /api/dishes
GET /api/dishes/:id
GET /api/dishes/categories
POST /api/dishes (Admin)
PUT /api/dishes/:id (Admin)
DELETE /api/dishes/:id (Admin)

🛒 Cart :

GET /api/cart
POST /api/cart/add
PUT /api/cart/:dishId
DELETE /api/cart/:dishId
DELETE /api/cart/clear

📦 Orders :

GET /api/orders
GET /api/orders/:id
GET /api/orders/all (Admin)
PUT /api/orders/:id/status (Admin)

🛡️ Security Features :

🔐 JWT Authentication
🔒 bcrypt password hashing
🛡️ Helmet security headers
🌐 CORS protection
🚦 Rate limiting
🧪 express-validator
🧠 Prisma ORM (SQL injection safe)
👑 Admin role guard

💰 Pricing Logic :

Component	Value
🚚 Delivery	₹40 (FREE > ₹500)
🏷️ Platform Fee	₹5
🧾 GST	5%
💵 Grand Total	Subtotal + Delivery + Platform + GST

🎨 UI Features :

🍊 Zomato/Swiggy-inspired design
🎯 Clean warm orange theme
✨ Hover animations
🛒 Slide-in cart sidebar
🦴 Skeleton loading states
🏷️ Category chips
🌿 Veg / 🍗 Non-veg filters
📱 Fully responsive (mobile-first)
👨‍💼 Admin Panel
➕ Add dishes
✏️ Edit dishes
❌ Delete dishes
📦 Manage order status
🔐 Protected via role-based access

🧰 Tech Stack :
Layer	Technology
⚛️ Frontend	React 18 + Vite
🛣️ Routing	React Router
🧠 State	Context API
🌐 HTTP	Axios
🚀 Backend	Node.js + Express
🗄️ Database	PostgreSQL
🧩 ORM	Prisma
🔐 Auth	JWT + bcrypt
🛡️ Security	Helmet + Rate Limiting
💳 Payments	Simulated Checkout (Razorpay planned)

🔮 Future Improvements :
💳 Razorpay integration
📲 UPI payments
📡 Real-time order tracking
☁️ Cloudinary image upload

⚡ Redis caching

🌍 Full production deployment

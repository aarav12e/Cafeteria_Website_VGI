# 🍽️ VGI Cafeteria — Vishveshwarya Group of Institution

A full-stack MERN (MongoDB, Express, React, Node.js) campus cafeteria food ordering system with Razorpay payment integration and Clerk authentication.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Clerk account (free) → [clerk.com](https://clerk.com)
- Razorpay account (free) → [razorpay.com](https://razorpay.com)

### Install & Run

```bash
# 1. Backend
cd backend
npm install
# Create .env (see Backend .env section below)
npm run dev        # runs on http://localhost:5000

# 2. Frontend
cd frontend
npm install
# Create .env (see Frontend .env section below)
npm run dev        # runs on http://localhost:5173
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/vgi-cafeteria
PORT=5000
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
```

### Frontend (`frontend/.env`)
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

---

## 👤 User Page Guide

### 1. Sign Up / Sign In (`/auth`)
- Open the website → click **Sign In** in the navbar or the button on the page.
- **New user**: Click **Sign Up** tab → enter your Name, Email, Password → click **Create Account**.
- A **verification code** will be sent to your email. Enter it to activate your account.
- **Returning user**: Use the **Sign In** tab with your email & password.

### 2. Browse Menu (`/menu`)
- The home page shows the **cafeteria menu** with a rotating hero image banner.
- Use the **search bar** to find specific dishes (e.g., "Dal", "Chai").
- Use the **category filter buttons** (All, Main Course, Snacks, Drinks, Desserts, etc.) to filter items.
- Each item card shows:
  - Dish photo
  - Category badge
  - Price (₹)
  - **Add** button (greyed out if unavailable)

### 3. Cart (`/cart`)
- Click **Add** on any dish to add it to your cart.
- The cart icon in the navbar/bottom nav shows the number of items.
- In the cart page:
  - **+/−** buttons to adjust quantity
  - 🗑️ button to remove an item
  - **Order Summary** at the bottom with total
  - **Pay via UPI / Card** button to checkout

### 4. My Orders (`/myorders`)
- Shows your complete order history.
- Each order card displays:
  - Order ID & date/time
  - Items ordered with quantities
  - Payment status: **PAID** / **UNPAID**
  - Order status: **PLACED → PREPARING → READY → COMPLETED**

---

## 🔐 Admin Page Guide

### How to Become an Admin
By default, users who sign up are regular users. To make someone an admin:

**Option A — Via Clerk Dashboard (Recommended):**
1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Navigate to **Users** → find the user
3. Click the user → **Metadata** tab → **Public Metadata**
4. Add: `{ "role": "admin" }` and save.
5. The user will now see the **Admin Panel** link after re-login.

**Option B — Email-based (Development only):**
- Any account whose email contains the word `admin` (e.g., `admin@vgi.edu`) automatically gets admin access.

---

### Admin Dashboard (`/admin/dashboard`)
High-level overview of cafeteria operations:
| Card | Description |
|------|-------------|
| 💰 Total Revenue | Sum of all successfully paid orders |
| 📦 Total Orders | Total number of orders placed |
| ⏳ Active Orders | Orders currently being processed |
| ✅ Completed | Orders that have been delivered |

**Quick Actions** at the bottom let you jump directly to Menu Management or Order Management.

---

### Admin Menu Management (`/admin/menu`)

**Add a new dish:**
1. Click **+ Add Item** (top right)
2. Fill in: Item Name, Price (₹), Category, Image URL, Description (optional)
3. Click **Save Item** — the dish appears instantly

**Edit an existing dish:**
1. Click the **✏️ Edit** button on any dish card
2. Modify the fields in the form
3. Click **Update Item**

**Delete a dish:**
1. Click the **🗑️ Delete** button on the dish card
2. Confirm the deletion in the popup

**Available Categories:**
Main Course, Snacks, Drinks, Desserts, Breakfast, Thali

---

### Admin Order Management (`/admin/orders`)

- View all orders in a **real-time table** (auto-refreshes every 30 seconds)
- Use **filter tabs** at the top to view: All, Placed, Preparing, Ready, Completed, Cancelled

**Order Status Workflow:**

```
PLACED ──► PREPARING ──► READY ──► COMPLETED
  └──────────────────────────────► CANCELLED
```

| Action | When to Use |
|--------|------------|
| **Prepare** | Accept the order and start cooking |
| **Ready** | Food is cooked and ready for pickup |
| **Complete** | Student has collected the food |
| **Cancel** | Cancel the order at any stage |

---

## 💳 Payment Flow (Razorpay)

The cafeteria uses **Razorpay** for secure online payments.

### How it Works

```
User clicks "Pay" 
    │
    ▼
Backend creates an Order record in MongoDB
    │
    ▼
Backend creates a Razorpay Order (gets order ID)
    │
    ▼
Frontend opens Razorpay Checkout popup
(UPI, Credit/Debit Card, Net Banking, Wallets)
    │
    ▼
User completes payment on Razorpay
    │
    ▼
Razorpay sends back: razorpay_order_id, razorpay_payment_id, razorpay_signature
    │
    ▼
Backend verifies the signature (HMAC SHA256)
    │
    ├── ✅ Valid → Updates order paymentStatus = "paid", orderStatus = "placed"
    │
    └── ❌ Invalid → Returns 400 error, order stays "unpaid"
    │
    ▼
User is redirected to "My Orders" page
```

### Test Payments (Development)
Use Razorpay **test mode** keys. Test credentials:
- **UPI:** `success@razorpay`
- **Card:** `4111 1111 1111 1111` | CVV: any 3 digits | Expiry: any future date

### Going Live
1. Complete Razorpay KYC on [razorpay.com](https://razorpay.com)
2. Replace `rzp_test_...` keys with `rzp_live_...` keys in both `.env` files
3. No code changes required

---

## 📁 Project Structure

```
Food/
├── backend/
│   ├── controllers/       # Route handlers (menu, orders, payments, users)
│   ├── models/            # MongoDB schemas
│   ├── routes/            # Express routes
│   ├── middlewares/       # Auth middleware (Clerk JWT verification)
│   ├── config/            # DB connection
│   └── server.js          # Entry point
│
└── frontend/
    ├── public/
    │   ├── 1.jpeg         # Menu hero image 1
    │   ├── 2.jpeg         # Menu hero image 2
    │   └── 3.jpeg         # Menu hero image 3
    └── src/
        ├── components/    # Navbar, BottomNav, FoodCard, UserSync
        ├── pages/
        │   ├── auth/      # AuthPage (sign in / sign up)
        │   ├── user/      # Menu, Cart, MyOrders
        │   └── admin/     # AdminDashboard, AdminMenu, AdminOrders
        ├── context/       # CartContext (global cart state)
        └── hooks/         # useAxios (authenticated API calls)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Authentication | Clerk (JWT-based) |
| Payments | Razorpay (UPI, Cards, Net Banking) |
| Icons | React Icons |

---

## 📞 Support

For issues or questions regarding the cafeteria system, contact the IT admin at Vishveshwarya Group of Institution.

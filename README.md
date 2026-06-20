# Xalbador v2

A full-stack e-commerce platform for selling hosting services and custom development packages with multi-language support, OAuth authentication, and integrated payment processing.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Running the Project](#running-the-project)
- [Configuration](#configuration)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Development](#development)

---

## 🎯 Project Overview

Xalbador v2 is a modern e-commerce platform designed for selling web hosting services and custom development solutions. The platform provides a seamless user experience with multi-language support (English & Indonesian), secure OAuth-based authentication (Google & Discord), and an integrated payment system using Mayar (Indonesian payment provider).

**Key Use Cases:**
- Browse and purchase hosting packages
- Configure custom hosting/development services
- Secure OAuth login with Google and Discord
- Manage user accounts and purchase history
- Admin dashboard for managing products and orders

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3 with Vite
- **Styling**: Tailwind CSS + PostCSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Internationalization**: i18next (English & Indonesian)
- **Animations**: Framer Motion
- **UI Components**: Lucide Icons, Toast notifications (react-hot-toast)
- **Database Client**: Supabase JS

### Backend
- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + OAuth (Google, Discord)
- **Payment**: Mayar API (Indonesian payment gateway)
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan
- **File Upload**: Multer
- **Additional Libraries**: Cookie Parser, UUID

### Database
- **Provider**: Supabase (PostgreSQL)
- **Tables**: Users, Sessions, Products, Categories, Orders, Order Items, Purchases
- **Features**: Row-level security, automatic timestamps, UUID primary keys

---

## ✨ Features

### Authentication & User Management
- 🔐 OAuth 2.0 authentication (Google & Discord)
- 👤 User profile management
- 🔑 JWT-based session management
- 🚪 Secure logout functionality
- 🛡️ Protected routes and API endpoints

### Product Management
- 📦 Multi-category product catalog
- 🌍 Multi-language product descriptions (English & Indonesian)
- 🔍 Product search and filtering by category
- 🎨 Product images and metadata
- 💰 Dynamic pricing with currency support (IDR)

### Shopping & Checkout
- 🛒 Shopping cart with quantity management
- ⚙️ Customizable hosting and development packages
- 📝 Order summary before checkout
- 🏷️ Product categorization and variants

### Payment Processing
- 💳 Mayar payment gateway integration
- 📊 Order tracking and payment status
- 📧 Order notifications
- 🔐 Secure payment form handling
- 🧪 Test mode for development

### Admin Dashboard
- 📊 Admin panel for managing products
- 👥 User management
- 📋 Order management and tracking
- 📈 Sales analytics

### User Experience
- 🌐 Bilingual interface (English & Indonesian)
- 🎨 Dark/Light theme support
- 📱 Responsive design
- ⚡ Fast loading with lazy-loaded routes
- 🔔 Toast notifications for user feedback

---

## 📁 Project Structure

```
xalbador v2/
├── backend/                      # Node.js/Express backend
│   ├── src/
│   │   ├── app.js               # Express app configuration
│   │   ├── config/              # Configuration management
│   │   ├── controllers/         # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── payment.controller.js
│   │   │   ├── products.controller.js
│   │   │   └── user.controller.js
│   │   ├── lib/                 # Utility libraries
│   │   │   ├── supabase.js
│   │   │   ├── jwt.js
│   │   │   └── mayar.js
│   │   ├── middleware/          # Express middleware
│   │   │   ├── auth.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── routes/              # API route definitions
│   │   │   ├── auth.routes.js
│   │   │   ├── products.routes.js
│   │   │   ├── orders.routes.js
│   │   │   ├── payment.routes.js
│   │   │   └── user.routes.js
│   │   └── utils/
│   ├── server.js                # Server entry point
│   ├── package.json
│   ├── Dockerfile               # Production Docker image
│   ├── Dockerfile.dev           # Development Docker image
│   ├── docker-compose.yml       # Docker Compose configuration
│   ├── vercel.json              # Vercel deployment config
│   ├── railway.json             # Railway deployment config
│   └── .env.local               # Environment variables (not in VCS)
│
├── frontend/                     # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # React entry point
│   │   ├── components/
│   │   │   ├── admin/           # Admin dashboard components
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── common/          # Reusable UI components
│   │   │   ├── home/            # Home page sections
│   │   │   ├── layout/          # Layout components
│   │   │   └── store/           # Store/cart components
│   │   ├── context/             # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   └── useProducts.js
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Store.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Account.jsx
│   │   │   └── Success.jsx
│   │   ├── services/
│   │   │   ├── api.js           # API client
│   │   │   └── payment.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── i18n.js          # i18next configuration
│   │   └── public/
│   │       ├── locales/         # i18n translation files
│   │       │   ├── en.json
│   │       │   └── id.json
│   │       └── videos/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vercel.json
│   └── .env.local               # Environment variables (not in VCS)
│
├── database/                     # Database scripts
│   ├── supabase_schema.sql      # Main schema
│   ├── supabase_add_admin_column.sql
│   └── supabase_add_product_image.sql
│
└── README.md                    # This file
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn
- Supabase account (for database)
- Google OAuth credentials
- Discord OAuth credentials (optional)
- Mayar payment account

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <https://github.com/kazutodevs/xalbador>
cd xalbador\ v2

# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

### 2. Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL migrations in Supabase dashboard:
   - Execute `database/supabase_schema.sql`
   - Execute `database/supabase_add_admin_column.sql`
   - Execute `database/supabase_add_product_image.sql`

### 3. Configure Environment Variables

#### Backend `.env.local`
```env
# Server
NODE_ENV=development
PORT=3001
BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173

# Database
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth - Discord
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret

# Payment - Mayar
MAYAR_API_KEY=your-mayar-api-key
MAYAR_URL=https://api.mayar.id (or test URL)

# JWT
JWT_SECRET=your-jwt-secret

# Payment Mode
PAYMENT_MODE=test # or 'live'
```

#### Frontend `.env.local`
```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-supabase-key
```

### 4. OAuth Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `http://localhost:3001/api/auth/callback?provider=google`
6. Copy Client ID and Secret to `.env.local`

#### Discord OAuth
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a New Application
3. Go to OAuth2 → General
4. Add Redirect URL: `http://localhost:3001/api/auth/callback?provider=discord`
5. Copy Client ID and Secret to `.env.local`

---

## 🏃 Running the Project

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

### Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build individual images
docker build -f Dockerfile -t xalbador-backend:latest backend/
docker build -f Dockerfile -t xalbador-frontend:latest frontend/
```

---

## ⚙️ Configuration

### Backend Configuration
Configuration is managed in `backend/src/config/index.js`:
- Environment variables from `.env.local`
- Server port and URLs
- OAuth credentials
- Database connection
- Payment gateway settings

### Frontend Configuration
- API endpoint: `VITE_API_URL`
- Supabase credentials: `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`
- i18n translations: `frontend/public/locales/`

### Database
Supabase PostgreSQL with Row Level Security (RLS) policies

---

## 📡 API Routes

### Authentication (`/api/auth`)
- `GET /google` - Initiate Google OAuth
- `GET /discord` - Initiate Discord OAuth
- `GET /callback` - OAuth callback handler
- `GET /session` - Get current user session (protected)
- `POST /logout` - Logout user (protected)

### Products (`/api/products`)
- `GET /` - Get all products (with filtering & search)
- `GET /:id` - Get product by ID

### Orders (`/api/orders`)
- `GET /` - Get user's orders (protected)
- `GET /:id` - Get order details (protected)

### Payment (`/api/payment`)
- `POST /create` - Create payment order (protected)
- `POST /callback` - Payment gateway webhook
- `GET /success` - Payment success callback

### User (`/api/user`)
- `GET /profile` - Get user profile (protected)
- `GET /purchases` - Get user purchases (protected)
- `PUT /profile` - Update user profile (protected)

---

## 🗄️ Database Schema

### Tables

**users**
- `id` (UUID, PK)
- `email` (TEXT, unique)
- `name` (TEXT)
- `avatar_url` (TEXT)
- `provider` (TEXT) - OAuth provider
- `provider_id` (TEXT)
- `admin` (SMALLINT) - Admin flag
- `created_at`, `updated_at` (TIMESTAMPTZ)

**sessions**
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `session_token` (TEXT, unique)
- `expires_at` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ)

**products**
- `id` (UUID, PK)
- `category_id` (UUID, FK)
- `name_en`, `name_id` (TEXT) - Multi-language names
- `description_en`, `description_id` (TEXT)
- `price` (NUMERIC)
- `image_url` (TEXT)
- `is_active` (BOOLEAN)
- `metadata` (JSONB) - Custom fields
- `created_at`, `updated_at` (TIMESTAMPTZ)

**categories**
- `id` (UUID, PK)
- `name` (TEXT)
- `slug` (TEXT, unique)
- `sort_order` (INT)
- `created_at` (TIMESTAMPTZ)

**orders**
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `order_number` (TEXT, unique)
- `subtotal`, `total` (NUMERIC)
- `currency` (TEXT)
- `status` (TEXT) - pending, paid, failed
- `payment_id` (TEXT)
- `payment_url` (TEXT)
- `paid_at` (TIMESTAMPTZ)
- `created_at`, `updated_at` (TIMESTAMPTZ)

**order_items**
- `id` (UUID, PK)
- `order_id` (UUID, FK)
- `product_id` (UUID, FK)
- `name` (TEXT)
- `quantity` (INT)
- `price`, `total` (NUMERIC)
- `created_at` (TIMESTAMPTZ)

**purchases**
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `order_item_id` (UUID, FK)
- `product_type` (TEXT)
- `details` (JSONB)
- `status` (TEXT) - active, expired
- `expires_at` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ)

---

## 🔧 Development

### Available Scripts

**Backend:**
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run lint     # Run ESLint
```

**Frontend:**
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Style
- ESLint configured for both backend and frontend
- Prettier-compatible formatting (Tailwind Intellisense)

### Project Structure Best Practices
- **Controllers**: Handle request/response logic
- **Middleware**: Authentication, error handling, logging
- **Routes**: API endpoint definitions
- **Services**: API client and payment integration
- **Utils**: Helper functions and constants
- **Components**: Reusable React components
- **Hooks**: Custom React hooks for logic reuse
- **Context**: Global state management

---

## 🚀 Deployment

### Vercel
The project includes `vercel.json` for both frontend and backend:
```bash
# Deploy to Vercel
vercel deploy
```

### Railway
The project includes `railway.json` for Railway deployment:
```bash
# Deploy to Railway
railway up
```

### Docker
```bash
docker-compose up -d
```

---

## 📝 License

This project is proprietary. All rights reserved.

---

## 👤 Author

Created by Kazuto Biz

---

## 📞 Support

For issues or questions, contact the development team.

---

## ✅ Checklist for First-Time Setup

- [ ] Clone repository
- [ ] Install dependencies (backend & frontend)
- [ ] Create Supabase project
- [ ] Run database migrations
- [ ] Set up environment variables
- [ ] Configure OAuth (Google & Discord)
- [ ] Configure Mayar payment API
- [ ] Run backend: `npm run dev`
- [ ] Run frontend: `npm run dev`
- [ ] Access app at `http://localhost:5173`
- [ ] Test OAuth login
- [ ] Test payment flow (use test mode)


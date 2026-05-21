Xalbador/
├── frontend/                    # React + Vite Frontend
│   ├── public/
│   │   ├── videos/
│   │   │   └── hero-bg.mp4
│   │   └── locales/
│   │       ├── en.json
│   │       └── id.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Dropdown.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   ├── Skeleton.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   └── Modal.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Layout.jsx
│   │   │   ├── auth/
│   │   │   │   ├── AuthButtons.jsx
│   │   │   │   ├── UserMenu.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── store/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── CategoryFilter.jsx
│   │   │   │   ├── CustomHosting.jsx
│   │   │   │   ├── CustomDeveloper.jsx
│   │   │   │   └── CartSummary.jsx
│   │   │   └── home/
│   │   │       ├── Hero.jsx
│   │   │       ├── Features.jsx
│   │   │       └── Testimonials.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Store.jsx
│   │   │   ├── Configurator.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Success.jsx
│   │   │   ├── Account.jsx
│   │   │   └── NotFound.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   ├── useProducts.js
│   │   │   └── useTheme.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   └── payment.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── i18n.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── backend/                     # Node.js Backend (Vercel Serverless)
│   ├── api/
│   │   ├── auth/
│   │   │   ├── google.js
│   │   │   ├── discord.js
│   │   │   ├── callback.js
│   │   │   ├── session.js
│   │   │   └── logout.js
│   │   ├── products/
│   │   │   ├── index.js
│   │   │   ├── [id].js
│   │   │   └── categories.js
│   │   ├── orders/
│   │   │   ├── index.js
│   │   │   ├── [id].js
│   │   │   └── user.js
│   │   ├── payment/
│   │   │   ├── create.js
│   │   │   ├── callback.js
│   │   │   └── verify.js
│   │   └── user/
│   │       ├── profile.js
│   │       └── purchases.js
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── mayar.js
│   │   ├── auth.js
│   │   └── middleware.js
│   ├── vercel.json
│   └── package.json
│
├── database/
│   └── schema.sql
│
└── README.md

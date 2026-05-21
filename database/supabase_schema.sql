-- Supabase-compatible schema for Xalbador
-- Run this in the Supabase SQL editor or via psql against your project database.

-- Enable extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- USERS
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  avatar_url text,
  provider text,
  provider_id text,
  admin smallint NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- SESSIONS
CREATE TABLE IF NOT EXISTS public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sessions_session_token ON public.sessions(session_token);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  name_en text,
  name_id text,
  description_en text,
  description_id text,
  price numeric(12,2) DEFAULT 0,
  image_url text,
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  order_number text UNIQUE,
  subtotal numeric(12,2) DEFAULT 0,
  total numeric(12,2) DEFAULT 0,
  currency text DEFAULT 'IDR',
  status text DEFAULT 'pending',
  payment_id text,
  payment_url text,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  name text,
  quantity int DEFAULT 1,
  price numeric(12,2) DEFAULT 0,
  total numeric(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- PURCHASES
CREATE TABLE IF NOT EXISTS public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  order_item_id uuid REFERENCES public.order_items(id) ON DELETE SET NULL,
  product_type text,
  details jsonb DEFAULT '{}',
  status text DEFAULT 'active',
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Helpful views / security: (optional, adjust policies in Supabase dashboard)

-- Trigger to update updated_at on row modification
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to tables that have updated_at
CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Indexes to speed up common lookups
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);

-- End of schema

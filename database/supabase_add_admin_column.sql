-- Supabase migration: add admin flag to users

ALTER TABLE IF EXISTS public.users
ADD COLUMN IF NOT EXISTS admin smallint NOT NULL DEFAULT 0;

UPDATE public.users
SET admin = 0
WHERE admin IS NULL;

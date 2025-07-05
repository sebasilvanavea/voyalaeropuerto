-- Asegurar que user_profiles tenga la columna 'role'
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'driver', 'admin', 'support'));
-- Custom authentication system using PostgreSQL
-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop existing functions to avoid signature conflicts
DROP FUNCTION IF EXISTS auth_authenticate(text, text);
DROP FUNCTION IF EXISTS auth_register_user(text, text, text, text);
DROP TRIGGER IF EXISTS trg_set_updated_at ON app_users;
DROP FUNCTION IF EXISTS set_updated_at();

-- App users table for custom authentication
CREATE TABLE IF NOT EXISTS app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  email_verified boolean NOT NULL DEFAULT false
);

-- Create index on username for faster lookups during login
CREATE INDEX IF NOT EXISTS idx_app_users_username ON app_users(username);
CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);

-- Trigger function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Apply trigger to app_users table
DROP TRIGGER IF EXISTS trg_set_updated_at ON app_users;
CREATE TRIGGER trg_set_updated_at
BEFORE UPDATE ON app_users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Function to register a new user
CREATE OR REPLACE FUNCTION auth_register_user(
  p_email text,
  p_username text,
  p_password text,
  p_full_name text DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  v_id uuid;
  v_hash text;
BEGIN
  IF p_username IS NULL THEN
    RAISE EXCEPTION 'username is required';
  END IF;

  IF p_email IS NOT NULL THEN
    p_email := lower(trim(p_email));
  END IF;

  p_username := trim(p_username);

  IF p_email IS NOT NULL AND EXISTS (SELECT 1 FROM app_users WHERE email = p_email) THEN
    RAISE EXCEPTION 'email already in use';
  END IF;

  IF EXISTS (SELECT 1 FROM app_users WHERE username = p_username) THEN
    RAISE EXCEPTION 'username already in use';
  END IF;

  v_hash := crypt(p_password, gen_salt('bf'));

  INSERT INTO app_users(email, username, password_hash, full_name)
  VALUES (p_email, p_username, v_hash, p_full_name)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- Function to authenticate a user
CREATE OR REPLACE FUNCTION auth_authenticate(
  p_identifier text,
  p_password text
) RETURNS TABLE(user_id uuid, user_email text, user_username text, user_full_name text) LANGUAGE plpgsql AS $$
DECLARE
  v_user_id uuid;
  v_password_hash text;
  v_identifier text := trim(p_identifier);
  v_email text;
  v_username text;
  v_full_name text;
BEGIN
  IF v_identifier IS NULL OR p_password IS NULL THEN
    RETURN;
  END IF;

  SELECT id, password_hash, email, username, full_name
  INTO v_user_id, v_password_hash, v_email, v_username, v_full_name
  FROM app_users
  WHERE (email IS NOT NULL AND lower(email) = lower(v_identifier))
     OR (username IS NOT NULL AND username = v_identifier)
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RETURN;
  END IF;

  IF crypt(p_password, v_password_hash) = v_password_hash THEN
    RETURN QUERY SELECT v_user_id, v_email, v_username, v_full_name;
  END IF;

  RETURN;
END;
$$;

-- Comment for reference
-- Email address and password login is active. Sign in with your registered email and password to access your account.
-- Username-based login is also supported for seamless authentication without email confirmation requirements.

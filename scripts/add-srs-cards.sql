-- Additive: SRS card schedule on users (safe if column already exists).
-- Run against habla-latam-db only; do not drop data.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS "srsCards" jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  resume_link TEXT,
  is_guest BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users USING btree(email);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions USING btree(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions USING btree(user_id);

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Submitted',
  ADD COLUMN IF NOT EXISTS tracking_token TEXT,
  ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

UPDATE applications
SET tracking_token = encode(gen_random_bytes(12), 'hex')
WHERE tracking_token IS NULL;

ALTER TABLE applications
  ALTER COLUMN tracking_token SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'applications_status_check'
      AND conrelid = 'applications'::regclass
  ) THEN
    ALTER TABLE applications
      ADD CONSTRAINT applications_status_check
      CHECK (status IN ('Submitted', 'Reviewing', 'Shortlisted', 'Rejected', 'Hired'));
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_tracking_token
  ON applications USING btree(tracking_token);
CREATE INDEX IF NOT EXISTS idx_applications_user_id
  ON applications USING btree(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status
  ON applications USING btree(status);

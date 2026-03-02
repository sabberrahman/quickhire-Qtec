CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  industry TEXT NOT NULL,
  website TEXT,
  description TEXT NOT NULL,
  total_employees INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(2, 1) NOT NULL DEFAULT 0.0,
  logo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies USING btree(slug);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies USING btree(industry);

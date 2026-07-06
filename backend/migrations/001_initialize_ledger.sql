-- Create schema migration tracking table
CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- Physical inventory ledger
CREATE TABLE IF NOT EXISTS physical_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  available_stock NUMERIC(15,4) NOT NULL DEFAULT 0,
  reserved_stock NUMERIC(15,4) NOT NULL DEFAULT 0,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_available_stock_non_negative CHECK (available_stock >= 0)
);

-- Asset allocation journal
CREATE TABLE IF NOT EXISTS asset_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id UUID NOT NULL REFERENCES physical_inventory(id),
  user_id VARCHAR(255) NOT NULL,
  amount NUMERIC(15,4) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'LOCKED', 'SETTLED', 'FAILED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_allocations_inventory ON asset_allocations(inventory_id);
CREATE INDEX IF NOT EXISTS idx_allocations_user ON asset_allocations(user_id);
CREATE INDEX IF NOT EXISTS idx_allocations_status ON asset_allocations(status);

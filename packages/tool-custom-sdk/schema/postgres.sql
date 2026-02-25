DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'http_method_enum') THEN
    CREATE TYPE http_method_enum AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'auth_mode_enum') THEN
    CREATE TYPE auth_mode_enum AS ENUM ('inherit', 'override', 'none');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS api_operations (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  version_id TEXT NOT NULL,
  folder_id TEXT,
  tool_name TEXT NOT NULL,
  method http_method_enum NOT NULL,
  path TEXT NOT NULL,
  name TEXT,
  description TEXT,
  tags JSONB,
  tool_input_schema JSONB NOT NULL,
  request_definition JSONB NOT NULL,
  responses JSONB
);

CREATE TABLE IF NOT EXISTS api_collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS api_operations_tool_scope_idx
  ON api_operations (collection_id, version_id, tool_name);

CREATE TABLE IF NOT EXISTS api_folders (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  version_id TEXT NOT NULL,
  parent_id TEXT,
  name TEXT NOT NULL,
  order_index INTEGER,
  auth JSONB,
  auth_ref_id TEXT,
  auth_mode auth_mode_enum
);

CREATE TABLE IF NOT EXISTS auth_profiles (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  version_id TEXT,
  name TEXT NOT NULL,
  is_default BOOLEAN,
  enabled BOOLEAN,
  config JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS environments (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  name TEXT NOT NULL,
  variables JSONB NOT NULL
);

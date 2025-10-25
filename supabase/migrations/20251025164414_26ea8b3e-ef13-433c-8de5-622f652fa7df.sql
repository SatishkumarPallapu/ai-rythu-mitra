-- Add unique constraint to crops_master name for upsert operations
ALTER TABLE crops_master ADD CONSTRAINT crops_master_name_key UNIQUE (name);

-- Create index for better performance on crop searches
CREATE INDEX IF NOT EXISTS idx_crops_master_category ON crops_master(category);
CREATE INDEX IF NOT EXISTS idx_crops_master_season ON crops_master(season);
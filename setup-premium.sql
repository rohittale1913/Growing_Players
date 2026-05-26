-- Growing Players: Add Premium Column to Products Table
-- Run this SQL in Supabase Dashboard → SQL Editor

-- Step 1: Add the premium column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS premium boolean DEFAULT false;

-- Step 2: Add documentation comment
COMMENT ON COLUMN products.premium IS 'Marks product as premium - featured on home page';

-- Step 3: Ensure all existing products have a value (set to false)
UPDATE products SET premium = false WHERE premium IS NULL;

-- Verification: Check the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'premium';

-- Show first 5 products with their premium status
SELECT id, name, premium FROM products ORDER BY created_at DESC LIMIT 5;

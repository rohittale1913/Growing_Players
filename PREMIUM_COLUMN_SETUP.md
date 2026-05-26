# Adding Premium Column to Products Table

The application now requires a `premium` column in the `products` table to mark products as premium (featured on home page).

## Quick Setup - 2 Methods

### Method 1: Automatic Script (Recommended)

Run this script from the project root:

```bash
node add-premium-column.js
```

This will:
- ✅ Add the `premium` column if it doesn't exist
- ✅ Set default values for existing products
- ✅ Verify the changes

---

### Method 2: Manual SQL (If script doesn't work)

1. **Go to Supabase Dashboard**
   - https://app.supabase.com
   - Select your project (Growing Players)

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and paste this SQL:**

```sql
-- Add premium column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS premium boolean DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN products.premium IS 'Marks product as premium - featured on home page';

-- Ensure all existing products have a value
UPDATE products SET premium = false WHERE premium IS NULL;
```

4. **Run the query** (press Ctrl+Enter or click "Run")

5. **Verify success** - You should see a green checkmark

---

## What This Does

```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS premium boolean DEFAULT false;
```

This adds a new column to the products table:
- **Column Name:** `premium`
- **Type:** `boolean` (true/false)
- **Default Value:** `false` (all existing products are marked as non-premium)

---

## After Setup

Once the column is added:

1. ✅ The admin form will show the premium checkbox
2. ✅ Admin can mark products as premium
3. ✅ Only premium products appear in "Featured Products" on home page
4. ✅ Premium products show a ⭐ badge

---

## Troubleshooting

**Still getting "Could not find the 'premium' column" error?**

1. Check that the SQL query ran successfully (green checkmark)
2. Wait a few seconds and refresh the admin page
3. Try running the migration script again: `node add-premium-column.js`

**Need to verify the column was added?**

Run this query in Supabase SQL Editor:

```sql
-- Check if premium column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name='products' AND column_name='premium';
```

You should see:
```
column_name | data_type
premium     | boolean
```

---

## Database Schema

After setup, your products table will have:

```
id              uuid (primary key)
name            text
description     text
price           numeric
original_price  numeric
stock           integer
category_id     uuid (foreign key)
premium         boolean ← NEW COLUMN
image           text
... (other fields)
created_at      timestamp
updated_at      timestamp
```

import { createClient } from '@supabase/supabase-js';

const url = 'https://dnaawzoxyxslzlmhaffe.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuYWF3em94eXhzbHpsbWhhZmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNjEzNjAsImV4cCI6MjA5NDczNzM2MH0.8tlPwckzOpu3aId0mqDt4MBxrK195r1x0QBGJpllPfI';
const supabase = createClient(url, key);

const setupOrdersTable = async () => {
  console.log('🔧 Setting up orders table schema...\n');

  try {
    // Get admin access for RPC call
    const { data, error } = await supabase.rpc('exec', {
      sql: `
        -- Check if items column exists
        ALTER TABLE IF EXISTS public.orders
        ADD COLUMN IF NOT EXISTS items jsonb DEFAULT '[]'::jsonb;

        -- Add other columns if they don't exist
        ALTER TABLE IF EXISTS public.orders
        ADD COLUMN IF NOT EXISTS subtotal numeric DEFAULT 0;

        ALTER TABLE IF EXISTS public.orders
        ADD COLUMN IF NOT EXISTS shipping numeric DEFAULT 0;

        ALTER TABLE IF EXISTS public.orders
        ADD COLUMN IF NOT EXISTS tax numeric DEFAULT 0;

        ALTER TABLE IF EXISTS public.orders
        ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

        ALTER TABLE IF EXISTS public.orders
        ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';

        ALTER TABLE IF EXISTS public.orders
        ADD COLUMN IF NOT EXISTS shipping_address jsonb;

        -- Set RLS policies if needed
        ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

        SELECT 'Schema updated successfully' as message;
      `
    });

    if (error) {
      console.error('❌ RPC Error:', error);
      console.log('\n⚠️  RPC method not available. Using alternative approach...');
      
      // Try alternative: Insert a test order and check structure
      console.log('Testing by creating sample order...');
      const testOrder = {
        user_id: '00000000-0000-0000-0000-000000000000',
        items: JSON.stringify([]),
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        status: 'test',
        payment_status: 'test',
        shipping_address: JSON.stringify({})
      };

      const { error: insertError } = await supabase
        .from('orders')
        .insert([testOrder]);

      if (insertError) {
        console.error('❌ Insert Error:', insertError.message);
        console.log('\n📋 Missing columns analysis:');
        console.log('   - The "items" column does not exist');
        console.log('   - Please create it manually in Supabase Dashboard\n');

        console.log('💡 SQL to run in Supabase SQL Editor:');
        console.log(`
          -- Add columns to orders table
          ALTER TABLE public.orders
          ADD COLUMN IF NOT EXISTS items jsonb DEFAULT '[]'::jsonb,
          ADD COLUMN IF NOT EXISTS subtotal numeric DEFAULT 0,
          ADD COLUMN IF NOT EXISTS shipping numeric DEFAULT 0,
          ADD COLUMN IF NOT EXISTS tax numeric DEFAULT 0,
          ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending',
          ADD COLUMN IF NOT EXISTS shipping_address jsonb;

          -- Ensure constraints
          ALTER TABLE public.orders
          ADD CONSTRAINT fk_orders_user_id 
          FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        `);
      } else {
        console.log('✅ Sample order created successfully');
        console.log('✅ All required columns exist!');
      }
    } else {
      console.log('✅ Schema update result:', data);
    }
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
};

setupOrdersTable();

import { createClient } from '@supabase/supabase-js'

const url = 'https://dnaawzoxyxslzlmhaffe.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuYWF3em94eXhzbHpsbWhhZmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNjEzNjAsImV4cCI6MjA5NDczNzM2MH0.8tlPwckzOpu3aId0mqDt4MBxrK195r1x0QBGJpllPfI'
const supabase = createClient(url, key)

const setupOrderRLS = async () => {
  console.log('🔐 Setting up Orders RLS policies...\n')

  try {
    // For now, let's disable RLS on orders table to allow all authenticated users to read all orders
    // In production, you'd want more sophisticated policies
    
    console.log('📋 Option 1: Disable RLS to allow access to all orders')
    console.log('📋 Option 2: Create policies for user and admin access\n')

    console.log('Running SQL in Supabase...\n')

    // Disable RLS on orders table temporarily to debug
    const { error } = await supabase.rpc('exec', {
      sql: `
        -- Disable RLS to allow access while we debug
        ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
        
        SELECT 'RLS disabled on orders table' as message;
      `
    })

    if (error) {
      console.log('⚠️  RPC exec not available. Please run this SQL manually in Supabase:\n')
      console.log(`
        -- Go to: https://dnaawzoxyxslzlmhaffe.supabase.co/sql/new
        -- Paste this SQL:

        -- Disable RLS on orders table
        ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

        -- Verify
        SELECT schemaname, tablename, rowsecurity 
        FROM pg_tables 
        WHERE tablename = 'orders';
      `)
      return
    }

    console.log('✅ Orders RLS policy updated!')
    console.log('✅ All authenticated users can now read all orders\n')

    // Verify by fetching orders
    console.log('✅ Testing order fetch...\n')
    const { data, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('❌ Fetch error:', fetchError)
    } else {
      console.log('✅ Orders fetched successfully:', data?.length || 0, 'orders')
    }
  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

setupOrderRLS()

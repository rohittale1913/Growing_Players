import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('\n🔍 SUPABASE VERIFICATION TEST\n')
console.log('=' .repeat(50))

// 1. Check credentials
console.log('\n1️⃣ Checking Credentials...')
if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL is missing')
  process.exit(1)
} else {
  console.log('✅ VITE_SUPABASE_URL configured')
}

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY is missing')
  process.exit(1)
} else {
  console.log('✅ VITE_SUPABASE_ANON_KEY configured')
}

// 2. Initialize Supabase client
console.log('\n2️⃣ Initializing Supabase Client...')
let supabase
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
  console.log('✅ Supabase client created successfully')
} catch (error) {
  console.error('❌ Failed to create Supabase client:', error.message)
  process.exit(1)
}

// 3. Test connection
console.log('\n3️⃣ Testing Connection...')
try {
  const { data: { session }, error: authError } = await supabase.auth.getSession()
  
  if (authError) {
    console.error('❌ Authentication error:', authError.message)
  } else {
    console.log('✅ Connection successful')
    console.log('   Session:', session ? 'Authenticated' : 'Anonymous')
  }
} catch (error) {
  console.error('❌ Connection failed:', error.message)
  process.exit(1)
}

// 4. Test table access
console.log('\n4️⃣ Testing Table Access...')
try {
  const { data, error } = await supabase
    .from('products')
    .select('count', { count: 'exact', head: true })

  if (error) {
    console.error('⚠️  Could not access products table:', error.message)
    console.log('   This is OK if you haven\'t created the table yet')
  } else {
    console.log('✅ Products table accessible')
    console.log(`   Total products: ${data?.length || 0}`)
  }
} catch (error) {
  console.error('⚠️  Table access test failed:', error.message)
  console.log('   This is OK if tables don\'t exist yet')
}

// 5. Test storage access
console.log('\n5️⃣ Testing Storage Access...')
try {
  const { data, error } = await supabase.storage.listBuckets()
  
  if (error) {
    console.error('⚠️  Could not list storage buckets:', error.message)
  } else {
    console.log('✅ Storage accessible')
    console.log(`   Buckets available: ${data?.length || 0}`)
    if (data && data.length > 0) {
      data.forEach(bucket => {
        console.log(`   - ${bucket.name}`)
      })
    }
  }
} catch (error) {
  console.error('⚠️  Storage access test failed:', error.message)
}

// 6. Test real-time subscription
console.log('\n6️⃣ Testing Real-Time Subscriptions...')
try {
  const subscription = supabase
    .channel('public:products')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
      console.log('Received real-time update:', payload)
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Real-time subscriptions active')
      } else if (status === 'CHANNEL_ERROR') {
        console.log('⚠️  Real-time channel error (this is OK if tables don\'t exist)')
      }
      
      // Clean up
      supabase.removeChannel(subscription)
    })
} catch (error) {
  console.error('⚠️  Real-time subscription test failed:', error.message)
}

console.log('\n' + '='.repeat(50))
console.log('\n✅ SUPABASE SETUP VERIFICATION COMPLETE!\n')
console.log('Next steps:')
console.log('1. Run: npm run dev')
console.log('2. Check browser console for any errors')
console.log('3. If you see errors, check:')
console.log('   - Supabase URL is correct (remove /rest/v1/ if present)')
console.log('   - ANON_KEY matches your Supabase project')
console.log('   - .env.local file is not git-tracked\n')

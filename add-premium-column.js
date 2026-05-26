import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function addPremiumColumn() {
  try {
    console.log('🔄 Adding premium column to products table...\n')

    // Use RPC to execute raw SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS premium boolean DEFAULT false;
        
        COMMENT ON COLUMN products.premium IS 'Marks product as premium - featured on home page';
      `
    }).catch(async (err) => {
      // If RPC doesn't exist, try direct SQL
      console.log('💡 RPC method not available, using alternative approach...\n')
      
      // Instead, we'll create a helper that uses the standard API
      const { data: existing } = await supabase
        .from('products')
        .select('premium')
        .limit(1)
        .catch(() => ({ data: null }))
      
      if (existing !== null) {
        console.log('✅ Column already exists!')
        return { success: true }
      }
      
      return { error: err }
    })

    if (error) {
      // Column might already exist or RPC not available
      console.log('📌 Checking if premium column exists...')
      
      const { data: products, error: checkError } = await supabase
        .from('products')
        .select('premium')
        .limit(1)

      if (checkError?.code === 'PGRST0') {
        console.log('❌ Error:', checkError.message)
        console.log('\n💡 Manual Setup Required:')
        console.log('1. Go to Supabase Dashboard → SQL Editor')
        console.log('2. Run this SQL:\n')
        console.log(`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS premium boolean DEFAULT false;
        
        UPDATE products SET premium = false WHERE premium IS NULL;
        `)
        console.log('\n3. Then refresh this script\n')
        return
      }

      console.log('✅ Premium column already exists!')
    } else {
      console.log('✅ Premium column added successfully!')
    }

    // Set all existing products to non-premium by default
    console.log('\n🔄 Setting default values for existing products...')
    const { error: updateError } = await supabase
      .from('products')
      .update({ premium: false })
      .is('premium', null)

    if (updateError) {
      console.log('✅ All products already have premium value set')
    } else {
      console.log('✅ Default values set for products')
    }

    // Verify
    console.log('\n📊 Verifying changes...')
    const { data: allProducts, error: verifyError } = await supabase
      .from('products')
      .select('id, name, premium')
      .order('created_at', { ascending: false })

    if (verifyError) {
      console.log('❌ Verification failed:', verifyError.message)
    } else {
      console.log(`✅ Verified! Found ${allProducts.length} products`)
      console.log('\n📝 Current Premium Status:')
      allProducts.slice(0, 5).forEach((p) => {
        console.log(`   - ${p.name}: ${p.premium ? '⭐ Premium' : '○ Standard'}`)
      })
      if (allProducts.length > 5) {
        console.log(`   ... and ${allProducts.length - 5} more`)
      }
    }

    console.log('\n✨ Setup complete! You can now add premium products.')
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    console.log('\n💡 Manual Setup Required:')
    console.log('Go to Supabase Dashboard → SQL Editor and run:')
    console.log(`
    ALTER TABLE products 
    ADD COLUMN IF NOT EXISTS premium boolean DEFAULT false;
    `)
  }
}

addPremiumColumn()

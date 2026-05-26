import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function setupGlazeCategory() {
  try {
    console.log('🔍 Checking for Glaze Gel category...')

    // Check if Glaze Gel category exists
    const { data: existingCategory, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .eq('name', 'Glaze Gel')
      .single()

    let glazeCategoryId

    if (fetchError && fetchError.code === 'PGRST116') {
      // Category doesn't exist, create it
      console.log('📝 Creating Glaze Gel category...')
      const { data: newCategory, error: createError } = await supabase
        .from('categories')
        .insert([
          {
            name: 'Glaze Gel',
            description: 'Premium glaze gels for cake decoration and design',
            image: '' // Add image URL if available
          }
        ])
        .select()

      if (createError) throw createError

      glazeCategoryId = newCategory[0].id
      console.log('✅ Glaze Gel category created with ID:', glazeCategoryId)
    } else if (fetchError) {
      throw fetchError
    } else {
      glazeCategoryId = existingCategory.id
      console.log('✅ Glaze Gel category already exists with ID:', glazeCategoryId)
    }

    // Get all products without a category
    console.log('\n📦 Fetching products...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')

    if (productsError) throw productsError

    console.log(`Found ${products.length} products`)

    // Show products without category
    const productsWithoutCategory = products.filter(p => !p.category_id)
    console.log(`\n⚠️  ${productsWithoutCategory.length} products without category:`)
    productsWithoutCategory.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name} (ID: ${p.id})`)
    })

    if (productsWithoutCategory.length > 0) {
      console.log('\n✏️  Assigning all products without category to Glaze Gel...')

      // Update all products without category
      const { error: updateError } = await supabase
        .from('products')
        .update({ category_id: glazeCategoryId })
        .is('category_id', null)

      if (updateError) throw updateError

      console.log('✅ All products without category assigned to Glaze Gel')
    }

    // Show final status
    const { data: updatedProducts, error: checkError } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', glazeCategoryId)

    if (checkError) throw checkError

    console.log(`\n📊 Final Status:`)
    console.log(`✅ Glaze Gel category has ${updatedProducts.length} products:`)
    updatedProducts.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name}`)
    })

    console.log('\n✨ Setup complete!')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

setupGlazeCategory()

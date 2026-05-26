import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function diagnoseProductIssues() {
  try {
    console.log('🔍 Diagnosing product database issues...\n')

    // Check categories
    console.log('1️⃣  Checking categories:')
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name')

    if (catError) {
      console.error('❌ Error fetching categories:', catError)
    } else {
      console.log(`   ✅ Found ${categories.length} categories:`)
      categories.forEach((cat) => {
        console.log(`      - ${cat.name} (ID: ${cat.id})`)
      })
    }

    // Check products
    console.log('\n2️⃣  Checking products:')
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, name, price, stock, category_id, sku, asin')

    if (prodError) {
      console.error('❌ Error fetching products:', prodError)
      return
    }

    console.log(`   ✅ Found ${products.length} products\n`)

    // Check for missing category_id
    const missingCategory = products.filter((p) => !p.category_id)
    if (missingCategory.length > 0) {
      console.log(`⚠️  ${missingCategory.length} products missing category_id:`)
      missingCategory.forEach((p) => {
        console.log(`      - ${p.name} (ID: ${p.id})`)
      })
      console.log(
        '   Fix: Run "node setup-glaze-category.js" to assign them\n'
      )
    } else {
      console.log('   ✅ All products have category_id assigned\n')
    }

    // Check for invalid category IDs
    console.log('3️⃣  Checking for invalid category references:')
    const validCategoryIds = new Set(categories.map((c) => c.id))
    const invalidProducts = products.filter(
      (p) => p.category_id && !validCategoryIds.has(p.category_id)
    )

    if (invalidProducts.length > 0) {
      console.log(
        `   ❌ ${invalidProducts.length} products with invalid category_id:`
      )
      invalidProducts.forEach((p) => {
        console.log(
          `      - ${p.name} has category_id: ${p.category_id} (doesn't exist)`
        )
      })
      console.log(
        '   Fix: Update these products to use a valid category_id\n'
      )
    } else {
      console.log('   ✅ All category references are valid\n')
    }

    // Check for duplicate SKUs
    console.log('4️⃣  Checking for duplicate SKUs:')
    const skuMap = {}
    products.forEach((p) => {
      if (p.sku) {
        if (!skuMap[p.sku]) {
          skuMap[p.sku] = []
        }
        skuMap[p.sku].push(p.name)
      }
    })

    const duplicateSKUs = Object.entries(skuMap).filter(([_, names]) => names.length > 1)
    if (duplicateSKUs.length > 0) {
      console.log(`   ⚠️  ${duplicateSKUs.length} duplicate SKUs found:`)
      duplicateSKUs.forEach(([sku, names]) => {
        console.log(`      - SKU "${sku}": ${names.join(', ')}`)
      })
      console.log('   Note: Make sure SKUs are unique or leave blank\n')
    } else {
      console.log('   ✅ No duplicate SKUs\n')
    }

    // Check for duplicate ASINs
    console.log('5️⃣  Checking for duplicate ASINs:')
    const asinMap = {}
    products.forEach((p) => {
      if (p.asin) {
        if (!asinMap[p.asin]) {
          asinMap[p.asin] = []
        }
        asinMap[p.asin].push(p.name)
      }
    })

    const duplicateASINs = Object.entries(asinMap).filter(([_, names]) => names.length > 1)
    if (duplicateASINs.length > 0) {
      console.log(`   ⚠️  ${duplicateASINs.length} duplicate ASINs found:`)
      duplicateASINs.forEach(([asin, names]) => {
        console.log(`      - ASIN "${asin}": ${names.join(', ')}`)
      })
      console.log('   Note: Make sure ASINs are unique or leave blank\n')
    } else {
      console.log('   ✅ No duplicate ASINs\n')
    }

    // Summary
    console.log('📊 Summary:')
    if (missingCategory.length === 0 && invalidProducts.length === 0 &&
        duplicateSKUs.length === 0 && duplicateASINs.length === 0) {
      console.log('   ✅ Database is healthy! No issues found.')
    } else {
      console.log('   ⚠️  Issues found. See above for details.')
      console.log('\n💡 Common causes of 409 errors:')
      console.log('   - Missing or invalid category_id')
      console.log('   - Duplicate SKU or ASIN values')
      console.log('   - Missing required fields')
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

diagnoseProductIssues()

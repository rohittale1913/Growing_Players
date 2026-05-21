import { createClient } from '@supabase/supabase-js'

// Using service role key for admin operations
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SERVICE_ROLE_KEY // You'll need to add this to .env
)

const categories = [
  {
    name: 'Glaze',
    description: 'Premium glazes and icing products for cake decoration',
    image: ''
  },
  {
    name: 'Crushes',
    description: 'Edible crushes, sprinkles, and cake decoration pieces',
    image: ''
  }
]

async function addCategories() {
  try {
    console.log('Adding categories...')
    
    for (const category of categories) {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
      
      if (error) {
        console.error(`Failed to add ${category.name}:`, error)
      } else {
        console.log(`✅ Added category: ${category.name}`)
      }
    }
    
    console.log('✅ All categories added successfully!')
  } catch (error) {
    console.error('Error:', error.message)
  }
}

addCategories()

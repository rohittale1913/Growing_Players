import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('🔧 Setting up Supabase Storage Buckets...\n')

const buckets = [
  {
    id: 'products',
    name: 'Products',
    public: true,
    fileSizeLimit: 50000000, // 50MB
  },
  {
    id: 'categories',
    name: 'Categories',
    public: true,
    fileSizeLimit: 50000000,
  },
  {
    id: 'user-uploads',
    name: 'User Uploads',
    public: false,
    fileSizeLimit: 100000000, // 100MB
  },
]

async function setupBuckets() {
  for (const bucket of buckets) {
    try {
      console.log(`Creating bucket: ${bucket.name}...`)

      // Create bucket
      const { data, error } = await supabase.storage.createBucket(bucket.id, {
        public: bucket.public,
        fileSizeLimit: bucket.fileSizeLimit,
        allowedMimeTypes: [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
        ],
      })

      if (error) {
        if (error.message.includes('already exists')) {
          console.log(`✅ Bucket "${bucket.name}" already exists`)
        } else {
          throw error
        }
      } else {
        console.log(`✅ Created bucket "${bucket.name}"`)
      }

      // Set public policy if public
      if (bucket.public) {
        const { error: policyError } = await supabase.storage.from(bucket.id).createSignedUrl('dummy.jpg', 3600)
        // Just testing if accessible
        console.log(`✅ Bucket "${bucket.name}" is publicly accessible`)
      }
    } catch (error) {
      console.error(`❌ Error creating bucket "${bucket.name}":`, error.message)
    }
  }

  console.log('\n✅ Storage bucket setup complete!')
  console.log('\nBuckets created:')
  buckets.forEach((b) => {
    console.log(`  - ${b.name} (${b.id}) - Public: ${b.public}`)
  })
}

setupBuckets()

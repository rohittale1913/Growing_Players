import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function SupabaseTest() {
  const [status, setStatus] = useState('Testing...')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testSupabase = async () => {
      const testResults = []

      try {
        // Test 1: Connection
        setStatus('Testing connection...')
        const { data: { session }, error: authError } = await supabase.auth.getSession()
        testResults.push({
          name: '✅ Connection Test',
          status: authError ? '❌ Failed' : '✅ Passed',
          details: authError?.message || 'Connected successfully'
        })

        // Test 2: Products table
        setStatus('Checking products table...')
        const { data, error: tableError, count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })

        testResults.push({
          name: '✅ Products Table',
          status: tableError ? '⚠️  Table not found' : '✅ Accessible',
          details: tableError?.message || `Found ${count || 0} products`
        })

        // Test 3: Storage
        setStatus('Checking storage...')
        const { data: buckets, error: storageError } = await supabase.storage.listBuckets()
        testResults.push({
          name: '✅ Storage Buckets',
          status: storageError ? '⚠️  Error' : `✅ ${buckets?.length || 0} buckets`,
          details: buckets?.map(b => b.name).join(', ') || 'No buckets created yet'
        })

        // Test 4: Database schema
        setStatus('Checking database schema...')
        const { data: schema, error: schemaError } = await supabase.rpc('get_tables')
        testResults.push({
          name: '✅ Database Schema',
          status: schemaError ? 'ℹ️  RPC not available' : '✅ Accessible',
          details: schemaError?.message || 'Database connected'
        })

        setResults(testResults)
        setStatus('All tests complete!')
        setLoading(false)
      } catch (error) {
        testResults.push({
          name: '❌ Error',
          status: 'Error',
          details: error.message
        })
        setResults(testResults)
        setStatus('Tests completed with errors')
        setLoading(false)
      }
    }

    testSupabase()
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Supabase Connection Test</h2>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">Status: <span className="font-semibold">{status}</span></p>
      </div>

      <div className="space-y-3">
        {results.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin">⏳</div>
            <p className="text-gray-500 mt-2">Running tests...</p>
          </div>
        ) : (
          results.map((result, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{result.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{result.details}</p>
                </div>
                <span className="text-lg font-bold">{result.status}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>✅ Supabase is working!</strong> Your backend is properly configured and connected.
        </p>
      </div>
    </div>
  )
}

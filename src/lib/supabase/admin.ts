import { createClient } from '@supabase/supabase-js'

// Note: This client bypasses RLS and should ONLY be used in server-side logic
// where you need administrative privileges (like webhook processing, order creation).
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
)

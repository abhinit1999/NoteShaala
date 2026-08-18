import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { id: productId } = await params

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // 2. Verify Ownership
    const { data: access } = await supabase
      .from('user_products')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .eq('access_status', 'active')
      .single()

    if (!access) {
      return new NextResponse('Unauthorized access to product', { status: 403 })
    }

    // 3. Fetch Product file path
    const { data: product } = await supabase
      .from('products')
      .select('protected_file_url')
      .eq('id', productId)
      .single()

    if (!product || !product.protected_file_url) {
      return new NextResponse('No digital file associated with this product', { status: 404 })
    }

    // 4. Generate a short-lived Signed URL (60 seconds)
    // We MUST use the supabaseAdmin client because the digital-products bucket may have RLS
    // preventing the normal user from generating signed URLs unless we wrote specific policies for it.
    // Since we verified ownership in step 2, using admin is secure here.
    const { data: signedUrlData, error: signError } = await supabaseAdmin
      .storage
      .from('digital-products')
      .createSignedUrl(product.protected_file_url, 60)

    if (signError || !signedUrlData) {
      console.error('Error generating signed URL:', signError)
      return new NextResponse('Failed to generate secure download link', { status: 500 })
    }

    // Optional: Log the download
    await supabaseAdmin.from('downloads').insert({
      user_id: user.id,
      product_id: productId,
    })

    // 5. Redirect the user to the signed URL so the download starts immediately
    return NextResponse.redirect(signedUrlData.signedUrl)

  } catch (error) {
    console.error('Download handler error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

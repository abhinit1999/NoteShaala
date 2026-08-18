'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
    
  if (!profile || profile.role !== 'admin') {
    throw new Error('Forbidden')
  }
  
  return user
}

export async function createProduct(formData: any) {
  try {
    await checkAdmin()
    
    // Generate a slug from title if not provided
    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        title: formData.title,
        slug,
        short_description: formData.short_description,
        description: formData.description,
        price: parseFloat(formData.price),
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        is_free: formData.is_free,
        is_published: formData.is_published,
        cover_image: formData.cover_image,
        category_id: formData.category_id || null,
        estimated_time: formData.estimated_time,
        prerequisites: formData.prerequisites ? formData.prerequisites.split(',').map((s: string) => s.trim()) : [],
        protected_file_url: formData.protected_file_url, // For PDFs or digital files
        content_json: formData.content_json ? JSON.parse(formData.content_json) : null
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/products')
    revalidatePath('/admin/products')
    return { success: true, data }

  } catch (error: any) {
    console.error('Create product error:', error)
    return { error: error.message }
  }
}

export async function updateProduct(id: string, formData: any) {
  try {
    await checkAdmin()
    
    const { data, error } = await supabaseAdmin
      .from('products')
      .update({
        title: formData.title,
        slug: formData.slug,
        short_description: formData.short_description,
        description: formData.description,
        price: parseFloat(formData.price),
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        is_free: formData.is_free,
        is_published: formData.is_published,
        cover_image: formData.cover_image,
        category_id: formData.category_id || null,
        estimated_time: formData.estimated_time,
        prerequisites: formData.prerequisites ? (typeof formData.prerequisites === 'string' ? formData.prerequisites.split(',').map((s: string) => s.trim()) : formData.prerequisites) : [],
        protected_file_url: formData.protected_file_url,
        content_json: formData.content_json ? (typeof formData.content_json === 'string' ? JSON.parse(formData.content_json) : formData.content_json) : null
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/products')
    revalidatePath(`/products/${formData.slug}`)
    revalidatePath('/admin/products')
    return { success: true, data }

  } catch (error: any) {
    console.error('Update product error:', error)
    return { error: error.message }
  }
}

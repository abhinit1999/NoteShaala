import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/product-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface EditProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const supabase = await createClient()
  const { id } = await params

  // Fetch product data
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) {
    notFound()
  }

  // Fetch categories for the select dropdown
  const { data: categories } = await supabase
    .from('categories')
    .select('id, title')
    .order('title', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 rounded-md hover:bg-muted text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
          <p className="text-muted-foreground">Update your product details.</p>
        </div>
      </div>

      <ProductForm initialData={product} categories={categories || []} />
    </div>
  )
}

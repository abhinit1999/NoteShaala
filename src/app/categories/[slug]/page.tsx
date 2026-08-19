import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/product-card'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 60

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = await createClient()
  const { slug } = await params

  // Fetch category details
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!category) {
    notFound()
  }

  // Fetch products for this category
  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      title,
      slug,
      short_description,
      price,
      compare_at_price,
      cover_image,
      is_free,
      created_at,
      categories (
        title,
        slug
      )
    `)
    .eq('category_id', category.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="container pt-8 pb-8 md:pt-12 md:pb-12 flex flex-col gap-8">
      {/* Category Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{category.title}</h1>
        {category.description && (
          <p className="text-lg text-muted-foreground">{category.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between border-b pb-4">
        <p className="text-sm text-muted-foreground">
          Showing {products?.length || 0} products
        </p>
        <Link href="/products" className="text-sm font-medium hover:text-primary hover:underline">
          View all products &rarr;
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <div className="py-10 text-center border rounded-lg border-dashed bg-muted/50">
          <h2 className="text-lg font-medium">No products in this category yet</h2>
          <p className="text-sm text-muted-foreground mt-1">Check back later for new additions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

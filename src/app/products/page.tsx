import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/product-card'
import Link from 'next/link'

export const revalidate = 60

interface ProductsPageProps {
  searchParams: Promise<{
    sort?: string
    category?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const supabase = await createClient()
  const resolvedSearchParams = await searchParams
  
  const sort = resolvedSearchParams.sort || 'newest'
  const categorySlug = resolvedSearchParams.category

  // Fetch all active categories for filtering
  const { data: categories } = await supabase
    .from('categories')
    .select('title, slug')
    .eq('is_active', true)
    .order('title', { ascending: true })

  // Build the product query
  let query = supabase
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
      category_id,
      categories (
        title,
        slug
      )
    `)
    .eq('is_published', true)

  if (categorySlug) {
    const category = categories?.find(c => c.slug === categorySlug)
    if (category) {
      // Find the ID of the category from our fetched categories list
      // We need to fetch the full category list to get the IDs, wait, our select only got title and slug!
      // Let's rely on another query to get the category ID
      const { data: catData } = await supabase.from('categories').select('id').eq('slug', categorySlug).single()
      if (catData) {
        query = query.eq('category_id', catData.id)
      }
    }
  }

  // Handle sorting
  switch (sort) {
    case 'price-asc':
      query = query.order('price', { ascending: true })
      break
    case 'price-desc':
      query = query.order('price', { ascending: false })
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
      break
  }

  const { data: products } = await query

  return (
    <div className="container pt-8 pb-8 md:pt-12 md:pb-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 space-y-8">
        <div>
          <h3 className="font-semibold mb-4 text-lg">Categories</h3>
          <ul className="space-y-2">
            <li>
              <Link 
                href={`/products?sort=${sort}`}
                className={`text-sm hover:text-primary transition-colors ${!categorySlug ? 'font-medium text-primary' : 'text-muted-foreground'}`}
              >
                All Categories
              </Link>
            </li>
            {categories?.map((cat) => (
              <li key={cat.slug}>
                <Link 
                  href={`/products?category=${cat.slug}&sort=${sort}`}
                  className={`text-sm hover:text-primary transition-colors ${categorySlug === cat.slug ? 'font-medium text-primary' : 'text-muted-foreground'}`}
                >
                  {cat.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4 text-lg">Sort By</h3>
          <ul className="space-y-2">
            <li>
              <Link 
                href={`/products?${categorySlug ? `category=${categorySlug}&` : ''}sort=newest`}
                className={`text-sm hover:text-primary transition-colors ${sort === 'newest' ? 'font-medium text-primary' : 'text-muted-foreground'}`}
              >
                Newest Arrivals
              </Link>
            </li>
            <li>
              <Link 
                href={`/products?${categorySlug ? `category=${categorySlug}&` : ''}sort=price-asc`}
                className={`text-sm hover:text-primary transition-colors ${sort === 'price-asc' ? 'font-medium text-primary' : 'text-muted-foreground'}`}
              >
                Price: Low to High
              </Link>
            </li>
            <li>
              <Link 
                href={`/products?${categorySlug ? `category=${categorySlug}&` : ''}sort=price-desc`}
                className={`text-sm hover:text-primary transition-colors ${sort === 'price-desc' ? 'font-medium text-primary' : 'text-muted-foreground'}`}
              >
                Price: High to Low
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            {categorySlug && categories 
              ? categories.find(c => c.slug === categorySlug)?.title || 'Products' 
              : 'All Notes & Guides'}
          </h1>
          <p className="text-muted-foreground mt-2">
            Browse our collection of high-quality educational resources.
          </p>
        </div>

        {!products || products.length === 0 ? (
          <div className="py-10 text-center border rounded-lg border-dashed bg-muted/50">
            <h2 className="text-lg font-medium">No products found</h2>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

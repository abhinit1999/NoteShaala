import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default async function LibraryPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const isAdmin = user.email === process.env.ADMIN_EMAIL

  // Fetch purchased products
  const { data: userProducts } = await supabase
    .from('user_products')
    .select(`
      granted_at,
      products (
        id,
        title,
        short_description,
        cover_image,
        slug
      )
    `)
    .eq('user_id', user.id)
    .eq('access_status', 'active')

  return (
    <div className="container max-w-6xl pt-8 pb-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Library</h1>
          <p className="text-muted-foreground">Access your purchased educational resources.</p>
        </div>
        {isAdmin && (
          <Link href="/admin/products/new" className={buttonVariants({ variant: "default" })}>
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Link>
        )}
      </div>

      {!userProducts || userProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center border rounded-lg border-dashed">
          <h2 className="text-xl font-semibold mb-2">Your library is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't purchased any products yet.</p>
          <Link href="/products" className={buttonVariants()}>Explore Notes & Guides</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userProducts.map((item: any) => (
            <div key={item.products.id} className="group relative border rounded-lg overflow-hidden flex flex-col">
              {item.products.cover_image ? (
                <div className="aspect-[4/3] bg-muted relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.products.cover_image} 
                    alt={item.products.title}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">No cover</span>
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold line-clamp-1">{item.products.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-1">
                  {item.products.short_description}
                </p>
                <p className="text-xs text-muted-foreground mt-4 mb-4">
                  Purchased on {new Date(item.granted_at).toLocaleDateString()}
                </p>
                <div className="flex flex-col gap-2 mt-auto">
                  <Link href={`/library/${item.products.slug}`} className={buttonVariants({ variant: "default", className: "w-full" })}>Access Content</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

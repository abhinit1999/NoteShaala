import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { siteConfig } from '@/config/site'

interface ProductCardProps {
  product: {
    id: string
    title: string
    slug: string
    short_description: string | null
    price: number
    compare_at_price: number | null
    cover_image: string | null
    is_free: boolean
    categories?: {
      title: string
    } | null
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = 
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
      : 0

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden flex flex-col transition-all hover:shadow-md border-muted">
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {product.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.cover_image}
              alt={product.title}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
              <span className="text-sm">No Image</span>
            </div>
          )}
          
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.is_free && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground font-semibold">
                Free
              </Badge>
            )}
            {discount > 0 && !product.is_free && (
              <Badge variant="destructive" className="font-semibold">
                {discount}% OFF
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          {product.categories && (
            <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">
              {product.categories.title}
            </p>
          )}
          
          <h3 className="font-semibold text-lg line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {product.short_description}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.is_free ? (
              <span className="font-bold text-lg">Free</span>
            ) : (
              <>
                <span className="font-bold text-lg">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: siteConfig.currency,
                    maximumFractionDigits: 0,
                  }).format(product.price)}
                </span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: siteConfig.currency,
                      maximumFractionDigits: 0,
                    }).format(product.compare_at_price)}
                  </span>
                )}
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

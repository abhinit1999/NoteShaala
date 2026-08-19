import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { CheckoutButton } from '@/components/checkout-button'
import { siteConfig } from '@/config/site'

interface CheckoutPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const supabase = await createClient()
  const { slug } = await params
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()
    
  if (!product) notFound()

  return (
    <div className="container pt-8 pb-12 min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full bg-surface border border-border rounded-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>

        <h1 className="text-2xl font-bold mb-6 text-center relative z-10">Complete Your Purchase</h1>
        
        {product.cover_image && (
          <div className="aspect-video w-full rounded-lg overflow-hidden mb-6 relative z-10 border border-border/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.cover_image} alt={product.title} className="object-cover w-full h-full" />
          </div>
        )}
        
        <div className="relative z-10">
          <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
          <p className="text-muted-foreground text-sm mb-6 line-clamp-3">{product.short_description}</p>
          
          <div className="flex justify-between items-center mb-8 border-t border-b border-border py-4">
            <span className="font-medium text-on-surface-variant">Total Amount</span>
            <span className="text-3xl font-bold text-white">
              {product.is_free ? 'Free' : new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: siteConfig.currency,
                maximumFractionDigits: 0,
              }).format(product.price)}
            </span>
          </div>
          
          <CheckoutButton productId={product.id} isFree={product.is_free} className="w-full h-12 text-lg" />
          
          <p className="text-xs text-center text-muted-foreground mt-4">
            Secure payment powered by Razorpay. You will receive instant access after payment.
          </p>
        </div>
      </div>
    </div>
  )
}

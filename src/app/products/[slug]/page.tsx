import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckoutButton } from '@/components/checkout-button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { siteConfig } from '@/config/site'
import { CheckCircle2, Clock, BookOpen, Star } from 'lucide-react'

export const revalidate = 60

interface ProductDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const supabase = await createClient()
  const { slug } = await params

  // Fetch product details
  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        title,
        slug
      )
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!product) {
    notFound()
  }

  // Parse content JSON if it exists
  const contentData = product.content_json ? (typeof product.content_json === 'string' ? JSON.parse(product.content_json) : product.content_json) : null
  const chapters = contentData?.chapters || []

  const discount = 
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
      : 0

  return (
    <div className="container py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column - Product Images & Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header (Mobile mostly, but visible on desktop too) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/products" className="hover:text-primary">Products</Link>
              <span>/</span>
              {product.categories && (
                <>
                  <Link href={`/categories/${product.categories.slug}`} className="hover:text-primary">
                    {product.categories.title}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="truncate">{product.title}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {product.title}
            </h1>
            
            <p className="text-xl text-muted-foreground">
              {product.short_description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm mt-4">
              {product.estimated_time && (
                <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-md">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium">{product.estimated_time}</span>
                </div>
              )}
              {chapters.length > 0 && (
                <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-md">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="font-medium">{chapters.length} Modules</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-md">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">4.9 (120 reviews)</span>
              </div>
            </div>
          </div>

          {/* Main Cover Image */}
          <div className="aspect-[16/9] bg-muted rounded-xl overflow-hidden border">
            {product.cover_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={product.cover_image} 
                alt={product.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Preview Available
              </div>
            )}
          </div>

          {/* Tabs for Content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="overview" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="contents" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Course Contents
              </TabsTrigger>
              <TabsTrigger 
                value="faq" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                FAQ
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="py-6 space-y-8">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  <p>Detailed description coming soon.</p>
                )}
              </div>

              {product.prerequisites && product.prerequisites.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Requirements / Prerequisites</h3>
                  <ul className="space-y-2">
                    {product.prerequisites.map((req: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="contents" className="py-6">
              {chapters.length > 0 ? (
                <Accordion className="w-full">
                  {chapters.map((chapter: any, index: number) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-medium hover:no-underline">
                        <div className="flex gap-4">
                          <span className="text-muted-foreground w-12 shrink-0">Mod {index + 1}</span>
                          <span>{chapter.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-16 text-muted-foreground">
                        {chapter.description || 'No detailed description for this module.'}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-muted-foreground">Course content outline will be available soon.</p>
              )}
            </TabsContent>
            
            <TabsContent value="faq" className="py-6">
              <Accordion className="w-full">
                <AccordionItem value="faq-1">
                  <AccordionTrigger className="text-left">Is this a lifetime purchase?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes, once purchased you have lifetime access to these notes and any future updates.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger className="text-left">Can I download the PDF?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes, you can download the PDF to your local device or read it online through our secure viewer.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger className="text-left">Do you offer refunds?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Due to the digital nature of the product, we generally do not offer refunds. Please ensure this product meets your needs before purchasing.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Sticky Checkout Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 border rounded-xl p-6 shadow-sm bg-card text-card-foreground">
            <div className="space-y-6">
              
              {/* Pricing */}
              <div>
                {product.is_free ? (
                  <div className="text-4xl font-bold">Free</div>
                ) : (
                  <div className="flex flex-col">
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-bold">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: siteConfig.currency,
                          maximumFractionDigits: 0,
                        }).format(product.price)}
                      </span>
                      {product.compare_at_price && product.compare_at_price > product.price && (
                        <span className="text-xl text-muted-foreground line-through mb-1">
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: siteConfig.currency,
                            maximumFractionDigits: 0,
                          }).format(product.compare_at_price)}
                        </span>
                      )}
                    </div>
                    {discount > 0 && (
                      <div className="mt-2">
                        <Badge variant="destructive" className="font-semibold text-sm">
                          Save {discount}% Today
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* What you'll get */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  What&apos;s Included
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Lifetime Access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Downloadable PDF</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Free Future Updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Mobile & Desktop Friendly</span>
                  </li>
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 pt-4">
                <CheckoutButton productId={product.id} isFree={product.is_free} />
                <p className="text-xs text-center text-muted-foreground">
                  Secure payment via Razorpay. Instant access.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

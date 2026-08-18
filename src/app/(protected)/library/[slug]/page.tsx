import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ArrowLeft, Download, FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface LibraryItemPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function LibraryItemPage({ params }: LibraryItemPageProps) {
  const supabase = await createClient()
  const { slug } = await params

  // 1. Authenticate
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // 2. Fetch Product Details
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!product) {
    notFound()
  }

  // 3. Verify Ownership
  const { data: access } = await supabase
    .from('user_products')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', product.id)
    .eq('access_status', 'active')
    .single()

  if (!access) {
    // User does not own this product, redirect to public sales page
    redirect(`/products/${slug}`)
  }

  const contentData = product.content_json ? (typeof product.content_json === 'string' ? JSON.parse(product.content_json) : product.content_json) : null
  const chapters = contentData?.chapters || []

  return (
    <div className="container max-w-5xl py-8 md:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
        <div className="space-y-4">
          <Link href="/library" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.title}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {product.short_description}
          </p>
        </div>

        {product.protected_file_url && (
          <div className="shrink-0">
            <Link href={`/api/downloads/${product.id}`} className={buttonVariants({ size: "lg", className: "w-full md:w-auto shadow-md" })}>
              <Download className="w-5 h-5 mr-2" />
              Download Materials
            </Link>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Secure, expiring link
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t">
        
        {/* Left Col - Cover */}
        <div className="md:col-span-1 space-y-4">
          <div className="aspect-[4/3] rounded-xl overflow-hidden border bg-muted">
            {product.cover_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.cover_image} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <FileText className="w-12 h-12 opacity-20" />
              </div>
            )}
          </div>
          <div className="bg-muted/50 p-4 rounded-lg border text-sm">
            <h3 className="font-medium mb-2">Access Status</h3>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
              <div className="w-2 h-2 rounded-full bg-current"></div>
              <span>Lifetime Access Active</span>
            </div>
          </div>
        </div>

        {/* Right Col - Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="contents" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="contents" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Course Contents
              </TabsTrigger>
              <TabsTrigger 
                value="details" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Full Details
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="contents" className="py-6">
              {chapters.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground mb-6">
                    Use this outline as a guide while you read through the downloaded materials.
                  </p>
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
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                  <p>Download the materials to view the contents.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="py-6">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  <p>No additional details provided.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

      </div>
    </div>
  )
}

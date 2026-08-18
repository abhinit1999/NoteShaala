import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Folder } from 'lucide-react'

export const revalidate = 60

export default async function CategoriesPage() {
  const supabase = await createClient()

  // Fetch all active categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('title', { ascending: true })

  // We can also fetch the product count per category, but let's keep it simple for now
  
  return (
    <div className="container pt-32 pb-12 md:pt-40 md:pb-16 flex flex-col gap-8 min-h-[calc(100vh-8rem)]">
      <div className="max-w-3xl mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Browse Categories</h1>
        <p className="text-lg text-muted-foreground">
          Explore our collection of notes and guides organized by topics.
        </p>
      </div>

      {!categories || categories.length === 0 ? (
        <div className="py-20 text-center border rounded-lg border-dashed bg-muted/50">
          <h2 className="text-lg font-medium">No categories found</h2>
          <p className="text-sm text-muted-foreground mt-1">Check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50 group">
                <CardHeader className="pb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Folder className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2">
                    {category.description || 'Explore learning resources for this topic.'}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

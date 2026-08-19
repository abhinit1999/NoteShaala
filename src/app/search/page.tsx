import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product-card";
import { redirect } from "next/navigation";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : undefined;
  
  if (!q) {
    redirect("/");
  }

  const supabase = await createClient();

  // Perform full text search or simple ilike
  const { data: products } = await supabase
    .from('products')
    .select(`
      id, title, slug, short_description, price, compare_at_price, 
      cover_image, is_free, created_at,
      categories (title, slug)
    `)
    .eq('is_published', true)
    .ilike('title', `%${q}%`)
    .order('created_at', { ascending: false });

  return (
    <div className="container pt-8 pb-8 md:pt-12 md:pb-12 flex flex-col gap-8 min-h-[50vh]">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Search Results</h1>
        <p className="text-lg text-muted-foreground">Results for "{q}"</p>
      </div>

      <div className="flex items-center justify-between border-b pb-4">
        <p className="text-sm text-muted-foreground">
          Found {products?.length || 0} products
        </p>
      </div>

      {!products || products.length === 0 ? (
        <div className="py-10 text-center border rounded-lg border-dashed bg-muted/50">
          <h2 className="text-lg font-medium">No results found</h2>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

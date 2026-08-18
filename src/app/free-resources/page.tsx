import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product-card";

export const revalidate = 60;

export default async function FreeResourcesPage() {
  const supabase = await createClient();

  // Fetch only free products
  const { data: products } = await supabase
    .from("products")
    .select(`
      id, title, slug, short_description, price, compare_at_price, 
      cover_image, is_free, created_at, category_id,
      categories (title, slug)
    `)
    .eq("is_published", true)
    .eq("is_free", true)
    .order("created_at", { ascending: false });

  return (
    <div className="pt-32 max-w-screen-2xl mx-auto px-6 mb-24 min-h-[70vh]">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-green-400">Free Resources</h1>
        <p className="text-lg text-on-surface-variant">
          High-quality guides, cheatsheets, and resources — completely free for our community.
        </p>
      </div>

      {!products || products.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl">
          <h2 className="text-xl font-medium text-white">No free resources available yet</h2>
          <p className="text-on-surface-variant mt-2">We are constantly adding new content. Check back later!</p>
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

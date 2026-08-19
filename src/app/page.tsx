import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SubscribeForm } from "@/components/subscribe-form";

export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();

  // Parallelize data fetching to reduce waterfall delays
  const [productsRes, categoriesRes] = await Promise.all([
    supabase
      .from('products')
      .select(`
        id, title, slug, short_description, price, compare_at_price, 
        cover_image, is_free, created_at, category_id,
        categories (title, slug)
      `)
      .eq('is_published', true)
      .eq('is_featured', true)
      .limit(4),
    supabase
      .from('categories')
      .select('id, title, slug, description')
      .eq('is_active', true)
      .order('title', { ascending: true })
      .limit(6)
  ]);

  let products = productsRes.data;
  const categories = categoriesRes.data;

  // Fallback to newest products if no featured ones exist
  if (!products || products.length === 0) {
    const { data: newest } = await supabase
      .from('products')
      .select(`
        id, title, slug, short_description, price, compare_at_price, 
        cover_image, is_free, created_at, category_id,
        categories (title, slug)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(4);
    products = newest;
  }

  return (
    <div className="pt-12 max-w-screen-2xl mx-auto px-6 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-glow-gradient pointer-events-none -z-10"></div>
      
      {/* BEGIN: HeroSection */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-12 py-16 lg:py-24">
        <div className="flex-1 space-y-8 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold text-primary uppercase tracking-wider">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            Premium Digital Marketplace
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            <span className="jump-animate" style={{animationDelay: '0s'}}>MASTER AI.</span><br/>
            <span className="jump-animate" style={{animationDelay: '0.2s'}}>CREATE MORE.</span><br/>
            <span className="jump-animate" style={{animationDelay: '0.4s'}}><span className="text-gradient">LEARN</span> WITHOUT LIMITS.</span>
          </h1>
          <p className="text-lg text-on-surface-variant max-w-xl">
            Premium handwritten notes, AI video prompts, GenAI resources and creator tools — all in one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/products" className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-lg shadow-primary/20">
              Explore Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </Link>
            <Link href="/free-resources" className="px-8 py-3 glass-panel text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Browse Free Resources
            </Link>
          </div>
          <div className="flex items-center gap-6 text-sm text-on-surface-variant pt-4">
            <span className="flex items-center gap-2"><span className="text-yellow-500">⚡</span> Instant Access</span>
            <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg> Lifetime Access</span>
            <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg> Secure Payment</span>
          </div>
        </div>

        {/* Right Side 3D Image */}
        <div className="flex-1 relative hidden lg:flex items-center justify-center max-w-lg xl:max-w-xl w-full">
          <div className="absolute inset-0 bg-primary/40 blur-[120px] rounded-full mix-blend-screen"></div>
          <div className="relative z-20 w-full animate-bounce" style={{animationDuration: '6s'}}>
            <div 
              className="relative w-full h-full flex items-center justify-center"
              style={{
                maskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)'
              }}
            >
              <Image 
                src="/hero-3d.png" 
                alt="Premium Digital Marketplace" 
                width={800} 
                height={800}
                className="object-cover mix-blend-screen opacity-90 scale-110"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      {/* END: HeroSection */}
      
      {/* BEGIN: Explore Categories */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Explore by Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories && categories.length > 0 ? categories.map((category, index) => {
            const categoryStyles = [
              { bg: 'bg-purple-500/20', shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]', emoji: '📝' },
              { bg: 'bg-blue-500/20', shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]', emoji: '🎬' },
              { bg: 'bg-emerald-500/20', shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]', emoji: '🖼️' },
              { bg: 'bg-indigo-500/20', shadow: 'shadow-[0_0_20px_rgba(99,102,241,0.3)]', emoji: '🤖' },
              { bg: 'bg-orange-500/20', shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]', emoji: '💼' },
              { bg: 'bg-pink-500/20', shadow: 'shadow-[0_0_20px_rgba(236,72,153,0.3)]', emoji: '🎁' }
            ];
            const style = categoryStyles[index % categoryStyles.length];

            return (
              <Link key={category.id} href={`/categories/${category.slug}`} className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center hover:bg-white/5 transition-colors cursor-pointer group">
                <div className={`w-16 h-16 rounded-xl ${style.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${style.shadow}`}>
                  <span className="text-3xl">{style.emoji}</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">{category.title}</h3>
                <p className="text-xs text-on-surface-variant line-clamp-1">{category.description || 'Explore resources'}</p>
              </Link>
            );
          }) : (
            <p className="text-on-surface-variant col-span-full text-center py-8">No categories found. Check back later!</p>
          )}
        </div>
      </section>
      {/* END: Explore Categories */}

      {/* BEGIN: Featured Products */}
      <section className="py-16">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-sm font-medium text-on-surface-variant hover:text-white glass-panel px-4 py-2 rounded-lg transition-colors">View All Products</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {products && products.length > 0 ? products.map((product, index) => {
            // Determine badge based on index/status for visual parity with design
            const badges = [
              { text: 'Bestseller', color: 'bg-orange-500' },
              { text: 'New', color: 'bg-blue-500' },
              { text: 'Free', color: 'bg-green-500' },
              { text: 'Popular', color: 'bg-yellow-500' }
            ];
            const badge = product.is_free ? badges[2] : badges[index % badges.length];
            const imageUrl = product.cover_image || "https://lh3.googleusercontent.com/aida-public/AB6AXuD7UJ67NaD0ZhYurUa7IrglBKlAtJvyngDxzpbyx4vu4v4v-KZh2NIQ1Sqxupan57mxDU1z_IQ_V28qu7KPAmLMwOUDJA_05aof_F43WYaITCL4ZMteGtGDqjXU2LMM-B4f9Npo3BHf1jPeBofE62pLPWF3Kr-J8Wz2S-WGS6ep6xBIJQzQvxIOErwNlREM_nhKubFOTHGoMWKqAOd89sa0mTcDcc0j5gQFLklI_JXcJyb96ORYNx7e"; // fallback image

            return (
              <div key={product.id} className="glass-panel rounded-2xl overflow-hidden flex flex-col group relative">
                <div className={`absolute top-3 left-3 z-10 ${badge.color} text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider`}>
                  {badge.text}
                </div>
                <div className="h-48 overflow-hidden bg-surface-bright relative flex items-center justify-center">
                  {product.is_free && !product.cover_image ? (
                    <div className="text-center bg-gradient-to-br from-surface to-surface-bright w-full h-full flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white block">FREE</span>
                      <span className="text-xl font-semibold text-gray-300">RESOURCE</span>
                    </div>
                  ) : (
                    <Image alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" src={imageUrl} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"/>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-sm text-on-surface-variant mb-4 flex-1 line-clamp-2">{product.short_description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      {product.is_free ? (
                        <>
                          <span className="text-xl font-bold text-green-400">₹0</span>
                          <span className="text-sm text-green-500/80">Free</span>
                        </>
                      ) : (
                        <>
                          <span className="text-xl font-bold text-purple-400">₹{product.price}</span>
                          {product.compare_at_price && (
                            <span className="text-sm text-on-surface-variant line-through">₹{product.compare_at_price}</span>
                          )}
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                      <span className="text-yellow-500">★</span> 4.9 ({Math.floor(Math.random() * 500) + 100})
                    </div>
                  </div>
                  <Link href={`/checkout/${product.slug}`} className="mt-4 w-full py-2 bg-primary hover:bg-primary-hover rounded-lg flex items-center justify-center gap-2 transition-colors text-white font-semibold">
                    {product.is_free ? 'Get Access Now' : 'Buy Now'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  </Link>
                </div>
              </div>
            );
          }) : (
            <p className="text-on-surface-variant col-span-full text-center py-8">More products coming soon...</p>
          )}
        </div>
      </section>
      {/* END: Featured Products */}

      {/* BEGIN: Why Choose */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose NoteShaala?</h2>
        <div className="flex flex-wrap lg:flex-nowrap gap-4 justify-between">
          <div className="glass-panel p-4 rounded-xl flex items-start gap-4 flex-1 min-w-[200px]">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Premium Quality</h3>
              <p className="text-xs text-on-surface-variant mt-1">Curated &amp; well-structured content</p>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-xl flex items-start gap-4 flex-1 min-w-[200px]">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Instant Access</h3>
              <p className="text-xs text-on-surface-variant mt-1">Download instantly after purchase</p>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-xl flex items-start gap-4 flex-1 min-w-[200px]">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Affordable Pricing</h3>
              <p className="text-xs text-on-surface-variant mt-1">Best prices for premium content</p>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-xl flex items-start gap-4 flex-1 min-w-[200px]">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Lifetime Access</h3>
              <p className="text-xs text-on-surface-variant mt-1">One-time payment, lifetime access</p>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-xl flex items-start gap-4 flex-1 min-w-[200px]">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Regular Updates</h3>
              <p className="text-xs text-on-surface-variant mt-1">Content updated regularly</p>
            </div>
          </div>
        </div>
      </section>
      {/* END: Why Choose */}

      {/* BEGIN: StatsBar */}
      <section className="glass-panel rounded-2xl p-8 my-16 flex flex-wrap lg:flex-nowrap items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-sm text-on-surface-variant font-medium">Trusted by</p>
            <p className="text-lg font-bold">learners &amp; creators</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-yellow-500 text-xs">★★★★★</div>
              <span className="text-xs text-on-surface-variant">4.9/5 from 1,200+ users</span>
            </div>
          </div>
          <div className="flex -space-x-3">
            <Image alt="User" width={40} height={40} className="rounded-full border-2 border-surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGQbwBx8mPFs5_-jfwfYO-dCpnOkb08FgOjsmHy_wUmk1YyIFdKY1pNoXb8-kzRZWOr7LF3dslI0M5iGmWHTabkCwcXCn7TVLC8g0_LTNy0qdCLyVen9sklF--uL2Mm2yqXu1zrsGDL5obEKsdSAAf4KC5_YETWSpkbBZMXJ1EEpzS3ZqnLFESOzV9-RUcSIul9RKut1zo6ISJN82xhRVCkbhOmzf73S3T1qcFNP85j49K01Fvlc3A"/>
            <Image alt="User" width={40} height={40} className="rounded-full border-2 border-surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARBaoQ6Fbi3H2LA3DWK4ozBSwvm-s7trdTYb7Ahkq6YkC765v2Re-n9mHTU1ddhErDf_sHOAjFMDWfKzayFGpfZ6JmWtYmepWIiliAIGTnyU7q8Lsxj_bUNsm5t7EZy7Nn76S7Rf07o6ZGcAvXTNG7HPRa6a2lPiz9jxtbvDtvdWIreLex_iQdtudpM8lTbMOcBbE1RZMdRa27GJ3AXPTNyOWytI3XJqiCChJQ5Pit0Ir95_1mEt_0"/>
            <Image alt="User" width={40} height={40} className="rounded-full border-2 border-surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp9nSbBbEMRbmEHkf--cZKOItTK48AG87uA_XYXXea71PufVnSZJd7oWH09cfs-lHDzrEpIpglSp6n1WUDw17w35fWRvAsc9Nl3PAvLWNzhfN5Pbhxha7yT9ZSNUpZkW5-ox2wEjeOSP-ED2BqKNYVHCD7Ovs2qvJdlyhRDlt5OczB_PgvSapX-sJxldLGQq6qDbAWligvaP3kCgSb9LVelyOL-nxC0hXa6avgPgnaS7ay_fbLmY66"/>
            <Image alt="User" width={40} height={40} className="rounded-full border-2 border-surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6SXlXJSywKq6YmKTxpLItCRUhMay1EiS9Qki5etj6ekUhARjRUwyPiMbj0yHDDoGsaJ6UTj6HJtQ3Mm0Se4dcfq5lMFMveWdD9TUqC10ox1UEjAawUH226uZohKXRB5RR26JlouRQmS6tusgFqfZ6uoimLGa_vXHyO4U6rCcf6PRgIC-vuxrkBI6AA2nZBTvrWvZsvl0KdUeLInHYMsK_rLKOdp7pL-sSYl122M2BFtU1gB94E2Bs"/>
          </div>
        </div>
        <div className="hidden lg:block w-px h-16 bg-border"></div>
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-primary">1K+</p>
            <p className="text-sm text-on-surface-variant mt-1">Premium Products</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-pink-500">5K+</p>
            <p className="text-sm text-on-surface-variant mt-1">Happy Customers</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-500">10K+</p>
            <p className="text-sm text-on-surface-variant mt-1">Downloads</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-500">24/7</p>
            <p className="text-sm text-on-surface-variant mt-1">Support</p>
          </div>
        </div>
      </section>
      {/* END: StatsBar */}

      {/* BEGIN: CTA Banner */}
      <section className="glass-panel rounded-3xl p-8 md:p-12 my-16 bg-gradient-to-r from-surface-bright/50 to-primary/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="relative z-10 max-w-xl w-full">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Free Resources<br/>&amp; Exclusive Updates</h2>
          <SubscribeForm />
        </div>
        <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="relative w-full h-full flex items-center justify-center animate-bounce" style={{animationDuration: '4s'}}>
            <span className="text-8xl drop-shadow-2xl">💌</span>
          </div>
        </div>
      </section>
      {/* END: CTA Banner */}
    </div>
  );
}

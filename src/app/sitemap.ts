import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch live products
  const { data: products } = await supabaseAdmin
    .from("products")
    .select("slug, updated_at")
    .eq("is_published", true);

  // Fetch active categories
  const { data: categories } = await supabaseAdmin
    .from("categories")
    .select("slug, updated_at")
    .eq("is_active", true);

  const productUrls: MetadataRoute.Sitemap = (products || []).map((product) => ({
    url: `${siteConfig.url}/products/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = (categories || []).map((category) => ({
    url: `${siteConfig.url}/categories/${category.slug}`,
    lastModified: new Date(category.updated_at),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const routes: MetadataRoute.Sitemap = [
    "",
    "/explore",
    "/products",
    "/categories",
    "/free-resources",
    "/blog",
    "/about",
    "/contact",
    "/faq",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.7,
  }));

  return [...routes, ...productUrls, ...categoryUrls];
}

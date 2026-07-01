import type { MetadataRoute } from "next";
import { getAllBlogPostsAsync } from "./lib/blogs";
import { getAllProductsAsync, productCategories } from "./lib/products";

const siteUrl = "https://toknavgnss.md";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const baseRoutes = ["", "/products", "/about", "/contact", "/inquiry", "/blog", "/news"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now
  }));

  const categoryRoutes = productCategories.map((category) => ({
    url: `${siteUrl}/products/${category.slug}`,
    lastModified: now
  }));

  const [allProducts, allBlogPosts] = await Promise.all([
    getAllProductsAsync(),
    getAllBlogPostsAsync()
  ]);

  const productRoutes = allProducts.map((product) => ({
    url: `${siteUrl}/products/${product.categorySlug}/${product.slug}`,
    lastModified: now
  }));

  const blogRoutes = allBlogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: now
  }));

  return [...baseRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}

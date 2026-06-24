import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "./lib/blogs";
import { getAllProducts, productCategories } from "./lib/products";

const siteUrl = "https://toknavgnss.md";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const baseRoutes = ["", "/products", "/about", "/contact", "/inquiry", "/blog", "/news"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now
  }));

  const categoryRoutes = productCategories.map((category) => ({
    url: `${siteUrl}/products/${category.slug}`,
    lastModified: now
  }));

  const productRoutes = getAllProducts().map((product) => ({
    url: `${siteUrl}/products/${product.categorySlug}/${product.slug}`,
    lastModified: now
  }));

  const blogRoutes = getAllBlogPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: now
  }));

  return [...baseRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}

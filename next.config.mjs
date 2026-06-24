/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  async rewrites() {
    return [
      { source: "/index.html", destination: "/" },
      { source: "/products.html", destination: "/products" },
      { source: "/blog.html", destination: "/blog" },
      { source: "/about.html", destination: "/about" },
      { source: "/contact.html", destination: "/contact" },
      { source: "/inquiry.html", destination: "/inquiry" },
      { source: "/news.html", destination: "/news" },
      { source: "/thanks.html", destination: "/thanks" },
      { source: "/products/:category/index.html", destination: "/products/:category" },
      { source: "/products/:category/:model.html", destination: "/products/:category/:model" },
      { source: "/blog/:slug.html", destination: "/blog/:slug" }
    ];
  }
};
export default nextConfig;

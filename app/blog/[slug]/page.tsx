import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Search } from "lucide-react";
import SiteHeader from "../../components/SiteHeader";
import { getAllBlogPosts, getBlogPost, renderMarkdown } from "../../lib/blogs";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.seoTitle,
    description: post.metaDescription
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const relatedPosts = getAllBlogPosts().filter((item) => item.slug !== post.slug);

  return (
    <main>
      <SiteHeader />

      <article className="blog-detail">
        <div className="blog-detail-hero">
          <Link className="back-link" href="/blog">
            <ArrowLeft size={17} /> <span data-i18n="cta.backToBlog">Back to Blog</span>
          </Link>
          <div className="blog-detail-meta">
            <span><Clock size={16} /> {post.wordCount.toLocaleString()} words</span>
            {post.primaryKeyword && <span><Search size={16} /> {post.primaryKeyword}</span>}
          </div>
          <h1>{post.title}</h1>
          <p>{post.metaDescription}</p>
          <div className="blog-detail-actions">
            <a className="primary-button" href="/inquiry">
              <span data-i18n="cta.getQuote">Get a Quote</span> <ArrowRight size={18} />
            </a>
            <a className="secondary-button" href="/contact">
              <span data-i18n="cta.contactUs">Contact Us</span>
            </a>
          </div>
        </div>

        <div className="blog-layout">
          <aside className="blog-aside">
            <div className="blog-aside-card">
              <strong data-i18n="blog.aside.title">Need a recommendation?</strong>
              <span data-i18n="blog.aside.text">
                Send your target application, country and quantity. TOKNAV can
                recommend a suitable product or solution package.
              </span>
              <a href="/inquiry"><span data-i18n="cta.sendRequirements">Send Your Requirements</span> <ArrowRight size={16} /></a>
            </div>
            <div className="blog-aside-card muted-card">
              <strong data-i18n="blog.more">More guides</strong>
              {relatedPosts.map((item) => (
                <Link href={`/blog/${item.slug}`} key={item.slug}>{item.title}</Link>
              ))}
            </div>
          </aside>

          <div className="blog-content">{renderMarkdown(post.content)}</div>
        </div>
      </article>
    </main>
  );
}

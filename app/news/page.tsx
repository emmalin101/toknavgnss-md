import { ArrowRight, Flame, TrendingUp } from "lucide-react";
import CmsBlocksRenderer from "../components/CmsBlocksRenderer";
import SiteHeader from "../components/SiteHeader";
import { getBlockData, getPublishedCmsPageByPath } from "../lib/cms/public";

const newsItems = [
  {
    title: "GNSS and RTK workflows continue to move toward cloud-connected field teams",
    source: "Inside GNSS",
    link: "https://insidegnss.com/",
    image: "/assets/products/gnss-receiver-series-combo.webp",
    summary:
      "Industry buyers are watching RTK receivers, correction services and field software become more connected across surveying and construction workflows."
  },
  {
    title: "Geospatial teams are using LiDAR, UAV mapping and mobile scanning for faster site documentation",
    source: "Geo Week News",
    link: "https://www.geoweeknews.com/news",
    image: "/assets/products/tsr20.webp",
    summary:
      "LiDAR scanning, reality capture and drone mapping are practical tools for project inspection, digital twins and faster field documentation."
  },
  {
    title: "Hydrographic survey projects increasingly use compact USVs for safer water data collection",
    source: "GIM International",
    link: "https://www.gim-international.com/news",
    image: "/assets/products/tboat20.webp",
    summary:
      "Unmanned surface vessels can help teams collect bathymetry and water-monitoring data while reducing manual work in difficult water environments."
  }
];

const hotSearches = [
  { keyword: "RTK GNSS receiver price", trend: "Buyer intent", heat: "98" },
  { keyword: "CORS / VRS correction workflow", trend: "Infrastructure", heat: "92" },
  { keyword: "UAV LiDAR and SLAM mapping", trend: "Reality capture", heat: "89" },
  { keyword: "USV bathymetric survey", trend: "Hydrographic", heat: "84" },
  { keyword: "Machine control GNSS", trend: "Construction", heat: "81" },
  { keyword: "Precision agriculture auto steering", trend: "Agriculture", heat: "78" },
  { keyword: "GNSS antenna selection", trend: "Survey equipment", heat: "75" },
  { keyword: "RTK base station setup", trend: "Field workflow", heat: "73" },
  { keyword: "Construction layout receiver", trend: "Engineering", heat: "70" },
  { keyword: "Deformation monitoring GNSS", trend: "Monitoring", heat: "68" },
  { keyword: "GIS handheld data collector", trend: "GIS fieldwork", heat: "65" },
  { keyword: "Robotic line marking system", trend: "Sports field", heat: "62" }
];

const fallbackHero = {
  label: "News",
  title: "GNSS and Geospatial Industry Updates",
  subtitle: "Short, easy-to-read updates for surveying, mapping, construction, machine control and positioning buyers."
};

export default function NewsPage() {
  const cmsPage = getPublishedCmsPageByPath("/news");
  const hero = getBlockData(cmsPage, "hero", fallbackHero, "page-hero");

  return (
    <main>
      <SiteHeader />
      <section className="blog-hero news-hero">
        <div>
          <span className="contact-label">{String(hero.label)}</span>
          <h1>{String(hero.title)}</h1>
          <p>{String(hero.subtitle)}</p>
        </div>
        <aside className="news-hot-panel" aria-label="Industry trending searches">
          <div className="news-hot-panel-head">
            <span><Flame size={18} /> Industry Hot Searches</span>
            <strong>Geospatial Trending Topics</strong>
          </div>
          <div className="news-hot-list">
            {hotSearches.map((item, index) => (
              <a
                href={`https://news.google.com/search?q=${encodeURIComponent(item.keyword)}`}
                target="_blank"
                rel="noopener noreferrer"
                key={item.keyword}
              >
                <em>{String(index + 1).padStart(2, "0")}</em>
                <span>
                  <strong>{item.keyword}</strong>
                  <small>{item.trend}</small>
                </span>
                <b>{item.heat}</b>
              </a>
            ))}
          </div>
          <div className="news-hot-foot">
            <TrendingUp size={17} />
            <span>Focused on surveying, GNSS, GIS, SLAM, USV and machine-control buyer topics.</span>
          </div>
        </aside>
      </section>
      <CmsBlocksRenderer blocks={cmsPage?.blocks || []} />
      <section className="blog-index section">
        <div className="blog-card-grid">
          {newsItems.map((item) => (
            <article className="blog-card" key={item.title}>
              <img src={item.image} alt="" style={{ width: "100%", borderRadius: 12, marginBottom: 18, aspectRatio: "16 / 9", objectFit: "cover" }} />
              <div className="blog-card-meta">
                <span>Industry</span>
                <span>{item.source}</span>
              </div>
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                Source Link <ArrowRight size={17} />
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export function generateMetadata() {
  const cmsPage = getPublishedCmsPageByPath("/news");
  return {
    title: cmsPage?.seoTitle || "TOKNAV News | GNSS and Geospatial Industry Updates",
    description: cmsPage?.seoDescription || "Read concise GNSS, RTK, surveying, GIS, LiDAR, USV and machine-control industry updates from TOKNAV.",
    openGraph: cmsPage?.ogImage ? { images: [cmsPage.ogImage] } : undefined
  };
}

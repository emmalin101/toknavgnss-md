(() => {
  const feedQueries = [
    "GNSS RTK surveying mapping",
    "geospatial GIS LiDAR UAV mapping",
    "construction surveying machine control",
    "hydrographic survey USV bathymetry",
    "SLAM mapping LiDAR scanner"
  ];

  const fallbackItems = [
    {
      title: "GNSS and RTK workflows continue to move toward cloud-connected field teams",
      link: "https://insidegnss.com/",
      source: "Inside GNSS",
      pubDate: new Date().toISOString(),
      description: "Industry buyers are watching RTK receivers, correction services and field software become more connected across surveying and construction workflows.",
      image: "public/assets/products/gnss-receiver-series-combo.webp"
    },
    {
      title: "Geospatial teams are using LiDAR, UAV mapping and mobile scanning for faster site documentation",
      link: "https://www.geoweeknews.com/news",
      source: "Geo Week News",
      pubDate: new Date().toISOString(),
      description: "Recent geospatial coverage often highlights LiDAR scanning, reality capture and drone mapping as practical tools for project inspection and digital-twin workflows.",
      image: "public/assets/products/tsr20.webp"
    },
    {
      title: "Surveying buyers compare receiver durability, correction methods and software compatibility",
      link: "https://www.xyht.com/",
      source: "xyHt",
      pubDate: new Date().toISOString(),
      description: "For professional field crews, product selection is usually about stable positioning, rugged design, software fit and supplier support rather than one single specification.",
      image: "public/assets/about/feedback-las-vegas-field.webp"
    },
    {
      title: "Hydrographic survey projects increasingly use compact USVs for safer water data collection",
      link: "https://www.gim-international.com/news",
      source: "GIM International",
      pubDate: new Date().toISOString(),
      description: "Unmanned surface vessels can help teams collect bathymetry or water-monitoring data while reducing manual work in difficult water environments.",
      image: "public/assets/products/tboat20.webp"
    },
    {
      title: "Machine control and precision agriculture remain strong GNSS application areas",
      link: "https://www.gpsworld.com/",
      source: "GPS World",
      pubDate: new Date().toISOString(),
      description: "GNSS positioning continues to support machine guidance, land leveling and precision agriculture workflows where repeatability and field efficiency matter.",
      image: "public/assets/products/tmc20.webp"
    }
  ];

  const state = {
    allItems: [],
    activeTopic: "All",
    selectedItem: null,
    comments: []
  };

  const topics = ["All", "GNSS", "Surveying", "GIS", "LiDAR", "UAV", "USV", "SLAM", "Machine Control"];
  const commentsKey = "toknav-news-comments-v1";
  const fallbackImages = {
    GNSS: "public/assets/products/gnss-receiver-series-combo.webp",
    Surveying: "public/assets/about/feedback-las-vegas-field.webp",
    GIS: "public/assets/products/pcr500.webp",
    LiDAR: "public/assets/products/tsr20.webp",
    UAV: "public/assets/products/tha-x601a.webp",
    USV: "public/assets/products/tboat20.webp",
    SLAM: "public/assets/products/tsr20-angle.webp",
    "Machine Control": "public/assets/products/tmc20.webp",
    Default: "public/assets/products/gnss-receiver-series-combo.webp"
  };

  const els = {};

  function qs(selector) {
    return document.querySelector(selector);
  }

  function stripHtml(value = "") {
    const doc = new DOMParser().parseFromString(value, "text/html");
    return (doc.body.textContent || "")
      .replace(/\s+/g, " ")
      .replace(/View Full Coverage on Google News/gi, "")
      .trim();
  }

  function absoluteImageUrl(url) {
    if (!url) return "";
    const clean = String(url).trim();
    if (!clean) return "";
    if (clean.startsWith("//")) return `https:${clean}`;
    if (/^https?:\/\//i.test(clean)) return clean;
    return clean;
  }

  function imageFromHtml(value = "") {
    const match = String(value).match(/<img[^>]+src=["']([^"']+)["']/i);
    return absoluteImageUrl(match?.[1] || "");
  }

  function fallbackImageForTopic(topic) {
    return fallbackImages[topic] || fallbackImages.Default;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function feedUrl(query) {
    const q = encodeURIComponent(`${query} when:7d`);
    return `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`;
  }

  async function fetchFeed(query) {
    const url = feedUrl(query);
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl, { cache: "no-store" });
      if (!response.ok) throw new Error("AllOrigins unavailable");
      const xml = await response.text();
      const doc = new DOMParser().parseFromString(xml, "application/xml");
      const items = [...doc.querySelectorAll("item")].map((item) => {
        const sourceNode = item.querySelector("source");
        return {
          title: stripHtml(item.querySelector("title")?.textContent || ""),
          link: item.querySelector("link")?.textContent || url,
          source: stripHtml(sourceNode?.textContent || "Google News"),
          pubDate: item.querySelector("pubDate")?.textContent || new Date().toISOString(),
          description: stripHtml(item.querySelector("description")?.textContent || ""),
          image: absoluteImageUrl(
            item.querySelector("media\\:content, content")?.getAttribute("url") ||
            item.querySelector("enclosure")?.getAttribute("url") ||
            imageFromHtml(item.querySelector("description")?.textContent || "")
          )
        };
      });
      if (items.length) return items;
    } catch {
      // Fall through to JSON proxy below.
    }

    const jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
    const response = await fetch(jsonUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`Feed failed: ${query}`);
    const data = await response.json();
    return (data.items || []).map((item) => ({
      title: stripHtml(item.title || ""),
      link: item.link || url,
      source: stripHtml(item.author || item.source || "Google News"),
      pubDate: item.pubDate || new Date().toISOString(),
      description: stripHtml(item.description || item.content || ""),
      image: absoluteImageUrl(
        item.thumbnail ||
        item.enclosure?.link ||
        item.enclosure?.url ||
        imageFromHtml(item.description || item.content || "")
      )
    }));
  }

  function topicForItem(item) {
    const text = `${item.title} ${item.description}`.toLowerCase();
    if (/slam|scanner|scan/.test(text)) return "SLAM";
    if (/usv|bathym|hydrographic|water/.test(text)) return "USV";
    if (/uav|drone|aerial/.test(text)) return "UAV";
    if (/lidar|laser|point cloud|reality capture/.test(text)) return "LiDAR";
    if (/machine control|autosteer|agriculture|tractor|construction/.test(text)) return "Machine Control";
    if (/gis|geospatial|map|mapping/.test(text)) return "GIS";
    if (/survey|surveyor|surveying/.test(text)) return "Surveying";
    return "GNSS";
  }

  function makeSummary(item) {
    const clean = stripHtml(item.description);
    if (clean.length > 100) return clean.slice(0, 260).replace(/\s+\S*$/, "") + ".";
    const topic = item.topic || topicForItem(item);
    const source = item.source || "industry media";
    return `This ${topic} update from ${source} is relevant for surveying, mapping or positioning teams. Buyers can use it as a quick signal for market trends, application demand and technology direction.`;
  }

  function normalizeItems(items) {
    const seen = new Set();
    return items
      .filter((item) => item.title && item.link)
      .map((item) => {
        const topic = topicForItem(item);
        return {
          ...item,
          source: item.source || "Google News",
          topic,
          summary: makeSummary(item),
          image: item.image || fallbackImageForTopic(topic),
          time: new Date(item.pubDate || Date.now())
        };
      })
      .filter((item) => {
        const key = item.title.toLowerCase().replace(/\W+/g, " ").slice(0, 90);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => b.time - a.time)
      .slice(0, 20);
  }

  function formatDate(date) {
    try {
      return new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(date);
    } catch {
      return "Today";
    }
  }

  function filteredItems() {
    if (state.activeTopic === "All") return state.allItems;
    return state.allItems.filter((item) => item.topic === state.activeTopic);
  }

  function renderTopics() {
    els.topicFilters.innerHTML = topics.map((topic) => `
      <button class="${topic === state.activeTopic ? "is-active" : ""}" data-topic="${escapeHtml(topic)}" type="button">
        ${escapeHtml(topic)}
      </button>
    `).join("");
    els.topicFilters.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        state.activeTopic = button.dataset.topic;
        render();
      });
    });
  }

  function renderNews() {
    const items = filteredItems();
    els.newsGrid.innerHTML = items.length ? items.map((item, index) => `
      <article class="news-card ${index === 0 && state.activeTopic === "All" ? "featured" : ""}" style="--news-image: url('${escapeHtml(item.image)}')">
        <div class="news-card-bg" aria-hidden="true"></div>
        <div class="news-card-top">
          <span class="news-topic">${escapeHtml(item.topic)}</span>
          <span>${escapeHtml(formatDate(item.time))}</span>
        </div>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.summary)}</p>
        <div class="news-card-footer">
          <span>${escapeHtml(item.source)}</span>
          <button data-link="${escapeHtml(item.link)}" type="button">Read Briefing</button>
        </div>
      </article>
    `).join("") : `
      <div class="news-empty">
        <strong>No items in this topic right now.</strong>
        <span>Try All or refresh the page later. Daily feeds change with industry coverage.</span>
      </div>
    `;

    els.newsGrid.querySelectorAll("button[data-link]").forEach((button) => {
      button.addEventListener("click", () => {
        const item = state.allItems.find((candidate) => candidate.link === button.dataset.link);
        if (item) openNewsDetail(item);
      });
    });
  }

  function renderStats() {
    els.newsCount.textContent = state.allItems.length;
    els.lastUpdated.textContent = new Intl.DateTimeFormat("en", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date());
    els.sourceCount.textContent = new Set(state.allItems.map((item) => item.source)).size;
  }

  function openNewsDetail(item) {
    state.selectedItem = item;
    els.detailTitle.textContent = item.title;
    els.detailMeta.textContent = `${item.topic} · ${item.source} · ${formatDate(item.time)}`;
    els.detailSummary.textContent = item.summary;
    els.detailSource.href = item.link;
    els.detailSource.textContent = `Open source link: ${item.source}`;
    els.detailDialog.showModal();
  }

  function loadComments() {
    try {
      state.comments = JSON.parse(localStorage.getItem(commentsKey) || "[]");
    } catch {
      state.comments = [];
    }
  }

  function saveComments() {
    localStorage.setItem(commentsKey, JSON.stringify(state.comments.slice(0, 80)));
  }

  function renderComments() {
    els.commentList.innerHTML = state.comments.length ? state.comments.map((comment) => `
      <article class="comment-card">
        <div>
          <strong>${escapeHtml(comment.name)}</strong>
          <span>${escapeHtml(comment.date)}</span>
        </div>
        <p>${escapeHtml(comment.message)}</p>
      </article>
    `).join("") : `
      <div class="comment-empty">
        <strong>No comments yet.</strong>
        <span>Leave a note about industry trends, buyer questions or product topics worth tracking.</span>
      </div>
    `;
  }

  function submitComment(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.elements.name.value.trim() || "Guest";
    const message = form.elements.message.value.trim();
    if (!message) return;
    state.comments.unshift({
      name,
      message,
      date: new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date())
    });
    saveComments();
    form.reset();
    renderComments();
  }

  function render() {
    renderTopics();
    renderStats();
    renderNews();
    renderComments();
  }

  async function loadNews() {
    els.newsGrid.innerHTML = `
      <div class="news-loading">
        <strong>Loading daily surveying news...</strong>
        <span>Collecting GNSS, GIS, LiDAR, UAV, USV and mapping updates.</span>
      </div>
    `;
    try {
      const results = await Promise.allSettled(feedQueries.map(fetchFeed));
      const items = results.flatMap((result) => result.status === "fulfilled" ? result.value : []);
      state.allItems = normalizeItems(items);
      if (state.allItems.length < 10) {
        state.allItems = normalizeItems([...state.allItems, ...fallbackItems]);
      }
    } catch {
      state.allItems = normalizeItems(fallbackItems);
    }
    render();
  }

  function cacheElements() {
    Object.assign(els, {
      newsGrid: qs("#newsGrid"),
      topicFilters: qs("#topicFilters"),
      newsCount: qs("#newsCount"),
      lastUpdated: qs("#lastUpdated"),
      sourceCount: qs("#sourceCount"),
      detailDialog: qs("#newsDetailDialog"),
      detailTitle: qs("#detailTitle"),
      detailMeta: qs("#detailMeta"),
      detailSummary: qs("#detailSummary"),
      detailSource: qs("#detailSource"),
      detailClose: qs("#detailClose"),
      commentForm: qs("#commentForm"),
      commentList: qs("#commentList")
    });
  }

  function init() {
    cacheElements();
    loadComments();
    els.detailClose.addEventListener("click", () => els.detailDialog.close());
    els.commentForm.addEventListener("submit", submitComment);
    renderTopics();
    renderComments();
    loadNews();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

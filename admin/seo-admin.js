const ACCESS_CODE = "toknav-seo";
const STORAGE_KEY = "toknav-seo-admin-v1";

const state = {
  data: null,
  selectedId: null,
  selectedTextId: null,
  selectedAssetId: null,
  selectedBlogDraftId: null,
  unlocked: false
};

const els = {};

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function showToast(message) {
  if (!els.adminToast) return;
  els.adminToast.textContent = message;
  els.adminToast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    els.adminToast.classList.remove("is-visible");
  }, 2600);
}

function activatePanel(panelId, updateHash = true) {
  const id = panelId === "dashboard" ? "dashboard-panel" : panelId;
  if (!id) return;
  const panel = document.getElementById(id);
  if (!panel || !panel.classList.contains("admin-panel")) return;
  qsa(".admin-panel").forEach((item) => item.classList.toggle("is-active", item.id === id));
  qsa(".admin-nav a").forEach((link) => {
    const target = link.getAttribute("href")?.replace("#", "");
    link.classList.toggle("active", target === id);
  });
  localStorage.setItem("toknav-admin-active-panel", id);
  if (updateHash) history.replaceState(null, "", `#${id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function slugId() {
  return `page-${Date.now()}`;
}

function contentId(prefix) {
  return `${prefix}-${Date.now()}`;
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function makeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || `blog-${Date.now()}`;
}

const PAGE_OPTIONS = [
  ["index.html", "首页"],
  ["products.html", "产品总览页"],
  ["products/gnss-receivers/index.html", "GNSS Receivers 类目页"],
  ["products/gnss-receivers/{model}.html", "GNSS Receiver 型号详情页"],
  ["products/gnss-antennas/index.html", "GNSS Antennas 类目页"],
  ["products/rugged-gis/index.html", "Rugged & GIS 类目页"],
  ["products/precision-agriculture-machine-control/index.html", "Precision Agriculture & Machine Control 类目页"],
  ["products/solutions/index.html", "Solutions 类目页"],
  ["about.html", "About 页面"],
  ["contact.html", "Contact 页面"],
  ["inquiry.html", "询盘页面"],
  ["blog/index.html", "Blog 汇总页"],
  ["blog/{slug}.html", "Blog 详情页"],
  ["news.html", "新闻资讯页"],
  ["Global Header", "全站页头"],
  ["Global Footer", "全站页脚"]
];

const DEFAULT_TEXT_SLOTS = [
  {
    id: "copy-home-hero-title",
    label: "首页首屏标题",
    page: "index.html",
    section: "Hero",
    locale: "English",
    currentText: "High-Precision GNSS Receivers & RTK Solutions Manufacturer",
    newText: "",
    notes: "建议保持 1-2 行，突出 GNSS receiver、RTK solutions 和 manufacturer。"
  },
  {
    id: "copy-home-hero-subtitle",
    label: "首页首屏说明",
    page: "index.html",
    section: "Hero",
    locale: "English",
    currentText: "Delivering reliable, centimeter-level positioning solutions for surveying, construction, agriculture, and industrial applications worldwide.",
    newText: "",
    notes: "适合广告落地页，建议简洁说明客户行业和核心价值。"
  },
  {
    id: "copy-home-products-title",
    label: "首页产品类目标题",
    page: "index.html",
    section: "Our Product Categories",
    locale: "English",
    currentText: "Our Product Categories",
    newText: "",
    notes: "该区域配图保持不变，只建议调整标题和说明文字。"
  },
  {
    id: "copy-home-applications-title",
    label: "首页应用场景标题",
    page: "index.html",
    section: "Applications",
    locale: "English",
    currentText: "Applications",
    newText: "",
    notes: "用于承接测绘、施工、农业、机械控制、监测、GIS 等行业流量。"
  },
  {
    id: "copy-contact-company-cn",
    label: "联系页中文公司名",
    page: "contact.html",
    section: "Company Information",
    locale: "Chinese",
    currentText: "广州市图科信息技术有限公司",
    newText: "",
    notes: "中文公司名必须保持一行展示，不要拆成竖排。"
  },
  {
    id: "copy-contact-company-en",
    label: "联系页英文公司名",
    page: "contact.html",
    section: "Company Information",
    locale: "English",
    currentText: "Guangzhou Toksurvey Information Technology Co., Ltd",
    newText: "",
    notes: "英文公司名用于海外客户识别和表单信任。"
  },
  {
    id: "copy-contact-address-cn",
    label: "联系页中文地址",
    page: "contact.html",
    section: "Address",
    locale: "Chinese",
    currentText: "广州市黄埔区彩频路9号",
    newText: "",
    notes: "中文地址建议和英文地址并列展示。"
  },
  {
    id: "copy-contact-address-en",
    label: "联系页英文地址",
    page: "contact.html",
    section: "Address",
    locale: "English",
    currentText: "No. 9 Caipin Road, Huangpu District, Guangzhou, China",
    newText: "",
    notes: "适合 Google Business、GSC 和海外询盘客户查看。"
  },
  {
    id: "copy-footer-tagline",
    label: "全站页脚品牌语",
    page: "Global Footer",
    section: "Footer",
    locale: "English",
    currentText: "High-precision positioning solutions for a smarter world.",
    newText: "",
    notes: "保持简短，适合全站页脚。"
  },
  {
    id: "copy-product-overview-title",
    label: "产品总览页标题",
    page: "products.html",
    section: "Hero",
    locale: "English",
    currentText: "TOKNAV Product Categories",
    newText: "",
    notes: "用于产品总览页首屏，建议清楚说明 GNSS、GIS、农业、机器控制和方案产品线。"
  },
  {
    id: "copy-gnss-receiver-category-title",
    label: "GNSS Receivers 类目页标题",
    page: "products/gnss-receivers/index.html",
    section: "Category Hero",
    locale: "English",
    currentText: "GNSS Receivers for Surveying, Mapping and Construction",
    newText: "",
    notes: "该页面适合承接 GNSS receiver、RTK receiver、survey receiver 相关关键词。"
  },
  {
    id: "copy-product-detail-hero-title",
    label: "产品详情页标题模板",
    page: "products/gnss-receivers/{model}.html",
    section: "Product Detail Hero",
    locale: "English",
    currentText: "{Model Name} GNSS Receiver",
    newText: "",
    notes: "每个型号详情页都可以复制这个文字位，再改成具体型号。"
  },
  {
    id: "copy-product-detail-cta",
    label: "产品详情页询盘 CTA",
    page: "products/gnss-receivers/{model}.html",
    section: "CTA",
    locale: "English",
    currentText: "Send Requirements",
    newText: "",
    notes: "建议保持短按钮文案，适合广告落地页转化。"
  },
  {
    id: "copy-solutions-title",
    label: "Solutions 类目页标题",
    page: "products/solutions/index.html",
    section: "Hero",
    locale: "English",
    currentText: "GNSS Application Solutions",
    newText: "",
    notes: "用于形变监测、划线机器人、无人船、SLAM 等方案入口。"
  },
  {
    id: "copy-antennas-category-title",
    label: "GNSS Antennas 类目页标题",
    page: "products/gnss-antennas/index.html",
    section: "Category Hero",
    locale: "English",
    currentText: "GNSS Antennas for High-Precision Positioning",
    newText: "",
    notes: "用于天线类目页，适合 antenna、survey antenna、RTK antenna 相关关键词。"
  },
  {
    id: "copy-rugged-gis-category-title",
    label: "Rugged & GIS 类目页标题",
    page: "products/rugged-gis/index.html",
    section: "Category Hero",
    locale: "English",
    currentText: "Rugged GIS Data Collectors and Field Terminals",
    newText: "",
    notes: "用于手簿、P8、GIS 采集设备相关页面。"
  },
  {
    id: "copy-ag-machine-category-title",
    label: "农业和机械控制类目页标题",
    page: "products/precision-agriculture-machine-control/index.html",
    section: "Category Hero",
    locale: "English",
    currentText: "Precision Agriculture and Machine Control Solutions",
    newText: "",
    notes: "用于农机导航、自动驾驶、机器控制产品页。"
  },
  {
    id: "copy-about-title",
    label: "About 页面标题",
    page: "about.html",
    section: "Hero",
    locale: "English",
    currentText: "About TOKNAV",
    newText: "",
    notes: "用于公司介绍页，可突出研发、制造、海外项目支持。"
  },
  {
    id: "copy-about-timeline-title",
    label: "About 产品时间轴标题",
    page: "about.html",
    section: "Product Timeline",
    locale: "English",
    currentText: "Product Development Timeline",
    newText: "",
    notes: "用于展示产品发布历史。"
  },
  {
    id: "copy-inquiry-title",
    label: "询盘页标题",
    page: "inquiry.html",
    section: "Form Hero",
    locale: "English",
    currentText: "Tell Us Your Project Requirements",
    newText: "",
    notes: "询盘页面标题要减少压力，突出快速响应。"
  },
  {
    id: "copy-blog-index-title",
    label: "Blog 汇总页标题",
    page: "blog/index.html",
    section: "Hero",
    locale: "English",
    currentText: "TOKNAV Blog",
    newText: "",
    notes: "用于 SEO 内容入口，可强调 GNSS buying guide、applications、product updates。"
  },
  {
    id: "copy-news-title",
    label: "新闻资讯页标题",
    page: "news.html",
    section: "Hero",
    locale: "English",
    currentText: "Surveying Industry News",
    newText: "",
    notes: "用于测绘行业资讯和轻资讯入口。"
  },
  {
    id: "copy-header-quote-button",
    label: "页头询盘按钮",
    page: "Global Header",
    section: "Navigation CTA",
    locale: "English",
    currentText: "Get a Quote",
    newText: "",
    notes: "全站页头按钮，建议保持短而明确。"
  }
];

const DEFAULT_ASSET_SLOTS = [
  {
    id: "asset-home-hero",
    label: "首页首屏主图",
    page: "index.html",
    currentPath: "public/assets/gnss-receiver-homepage-banner-original.png",
    recommendedSize: "1920 x 760 px",
    alt: "TOKNAV GNSS receivers and RTK solutions for construction surveying",
    replacementName: "",
    replacementDataUrl: "",
    notes: "首屏图需要蓝白科技风，文字区域保持干净。"
  },
  {
    id: "asset-home-application-survey",
    label: "首页应用场景 - Land Surveying",
    page: "index.html",
    currentPath: "public/assets/rtk-field-use-1.jpg",
    recommendedSize: "900 x 1200 px",
    alt: "Land surveying and mapping with GNSS receiver",
    replacementName: "",
    replacementDataUrl: "",
    notes: "竖图，底部可加轻微暗色遮罩。"
  },
  {
    id: "asset-home-application-construction",
    label: "首页应用场景 - Construction",
    page: "index.html",
    currentPath: "public/assets/home-app-construction.jpg",
    recommendedSize: "900 x 1200 px",
    alt: "Construction engineering GNSS application",
    replacementName: "",
    replacementDataUrl: "",
    notes: "建议使用建筑工地、塔吊、测量人员相关图片。"
  },
  {
    id: "asset-home-application-agriculture",
    label: "首页应用场景 - Precision Agriculture",
    page: "index.html",
    currentPath: "public/assets/home-app-agriculture.jpg",
    recommendedSize: "900 x 1200 px",
    alt: "Precision agriculture guidance and GNSS positioning",
    replacementName: "",
    replacementDataUrl: "",
    notes: "建议使用拖拉机、田地、自动驾驶农业场景。"
  },
  {
    id: "asset-home-application-machine",
    label: "首页应用场景 - Machine Control",
    page: "index.html",
    currentPath: "public/assets/home-app-machine.jpg",
    recommendedSize: "900 x 1200 px",
    alt: "Machine control and road construction positioning",
    replacementName: "",
    replacementDataUrl: "",
    notes: "建议使用压路机、推土机或施工机械场景。"
  },
  {
    id: "asset-home-application-monitoring",
    label: "首页应用场景 - Monitoring",
    page: "index.html",
    currentPath: "public/assets/home-app-monitoring.jpg",
    recommendedSize: "900 x 1200 px",
    alt: "Monitoring and deformation GNSS application",
    replacementName: "",
    replacementDataUrl: "",
    notes: "建议使用水坝、桥梁、边坡监测场景。"
  },
  {
    id: "asset-home-application-gis",
    label: "首页应用场景 - GIS Data",
    page: "index.html",
    currentPath: "public/assets/home-app-gis.jpg",
    recommendedSize: "900 x 1200 px",
    alt: "GIS data collection and mapping application",
    replacementName: "",
    replacementDataUrl: "",
    notes: "建议使用航拍、地图数据或 GIS 采集场景。"
  },
  {
    id: "asset-logo-blue",
    label: "全站蓝色 Logo",
    page: "Global Header",
    currentPath: "public/assets/toknav-logo-blue.png",
    recommendedSize: "Transparent PNG / WebP",
    alt: "TOKNAV logo",
    replacementName: "",
    replacementDataUrl: "",
    notes: "用于导航栏和浅色背景。"
  },
  {
    id: "asset-product-overview-hero",
    label: "产品总览页首屏图",
    page: "products.html",
    currentPath: "public/assets/products/gnss-receiver-series-combo.webp",
    recommendedSize: "1600 x 760 px",
    alt: "TOKNAV product categories for GNSS and positioning solutions",
    replacementName: "",
    replacementDataUrl: "",
    notes: "用于产品总览页，建议展示多类产品而不是单个套装。"
  },
  {
    id: "asset-gnss-receiver-category-main",
    label: "GNSS Receivers 类目主图",
    page: "products/gnss-receivers/index.html",
    currentPath: "public/assets/products/gnss-receiver-series-combo.webp",
    recommendedSize: "1400 x 900 px",
    alt: "TOKNAV GNSS receiver models combination",
    replacementName: "",
    replacementDataUrl: "",
    notes: "类目页主图应展示多个接收机型号组合，不要出现整套箱包。"
  },
  {
    id: "asset-product-detail-main",
    label: "产品详情页主图模板",
    page: "products/gnss-receivers/{model}.html",
    currentPath: "public/assets/products/{model}.webp",
    recommendedSize: "1200 x 900 px",
    alt: "TOKNAV {Model Name} GNSS receiver product image",
    replacementName: "",
    replacementDataUrl: "",
    notes: "每个型号详情页可复制这个素材位，替换成具体型号单品图。"
  },
  {
    id: "asset-product-detail-gallery",
    label: "产品详情页细节图/应用图",
    page: "products/gnss-receivers/{model}.html",
    currentPath: "public/assets/products/{model}-detail.webp",
    recommendedSize: "1200 x 800 px",
    alt: "TOKNAV {Model Name} detail and application image",
    replacementName: "",
    replacementDataUrl: "",
    notes: "用于产品细节、接口、屏幕、现场安装或应用场景。"
  },
  {
    id: "asset-solutions-hero",
    label: "Solutions 类目页首屏图",
    page: "products/solutions/index.html",
    currentPath: "public/assets/products/tr10pro-marking-robot.png",
    recommendedSize: "1600 x 760 px",
    alt: "TOKNAV GNSS application solutions",
    replacementName: "",
    replacementDataUrl: "",
    notes: "可轮换为划线机器人、TBoat、TSR20 SLAM 或形变监测方案图。"
  },
  {
    id: "asset-antennas-category-main",
    label: "GNSS Antennas 类目主图",
    page: "products/gnss-antennas/index.html",
    currentPath: "public/assets/products/tsa520.webp",
    recommendedSize: "1400 x 900 px",
    alt: "TOKNAV GNSS antenna product image",
    replacementName: "",
    replacementDataUrl: "",
    notes: "用于天线类目页，可放 TSA520、TAG66、TAG88 等单品或组合图。"
  },
  {
    id: "asset-rugged-gis-category-main",
    label: "Rugged & GIS 类目主图",
    page: "products/rugged-gis/index.html",
    currentPath: "public/assets/products/pcr500.webp",
    recommendedSize: "1400 x 900 px",
    alt: "TOKNAV rugged GIS data collector",
    replacementName: "",
    replacementDataUrl: "",
    notes: "用于手簿、GIS 采集器、Rugged 设备类目页。"
  },
  {
    id: "asset-ag-machine-category-main",
    label: "农业和机械控制类目主图",
    page: "products/precision-agriculture-machine-control/index.html",
    currentPath: "public/assets/products/tmc20.webp",
    recommendedSize: "1400 x 900 px",
    alt: "TOKNAV precision agriculture and machine control display",
    replacementName: "",
    replacementDataUrl: "",
    notes: "用于农机导航、机械控制屏幕和应用场景图。"
  },
  {
    id: "asset-inquiry-form-visual",
    label: "询盘页表单辅助图",
    page: "inquiry.html",
    currentPath: "public/assets/customer-visit.jpg",
    recommendedSize: "1200 x 900 px",
    alt: "TOKNAV project inquiry support",
    replacementName: "",
    replacementDataUrl: "",
    notes: "用于询盘页侧边图，可展示销售支持、出货检查、客户沟通等。"
  },
  {
    id: "asset-about-video-cover",
    label: "About 公司视频封面",
    page: "about.html",
    currentPath: "public/assets/customer-visit.jpg",
    recommendedSize: "1600 x 900 px",
    alt: "TOKNAV company introduction video cover",
    replacementName: "",
    replacementDataUrl: "",
    notes: "用于公司介绍视频区域，最好有人物、工厂或团队画面。"
  },
  {
    id: "asset-about-feedback-gallery",
    label: "About 客户反馈照片墙",
    page: "about.html",
    currentPath: "public/assets/about/feedback-las-vegas-group.webp",
    recommendedSize: "1200 x 900 px",
    alt: "TOKNAV customer feedback and exhibition photo",
    replacementName: "",
    replacementDataUrl: "",
    notes: "可维护多张客户返图，优先选择客户出镜多的照片。"
  },
  {
    id: "asset-about-cert-gallery",
    label: "About 证书照片墙",
    page: "about.html",
    currentPath: "public/assets/about/cert-iso9001.webp",
    recommendedSize: "1000 x 1400 px",
    alt: "TOKNAV certification gallery image",
    replacementName: "",
    replacementDataUrl: "",
    notes: "用于 CE、FCC、RoHS、ISO 等证书图片更新。"
  },
  {
    id: "asset-contact-map",
    label: "Contact 地址地图/办公室图",
    page: "contact.html",
    currentPath: "public/assets/customer-visit.jpg",
    recommendedSize: "1400 x 900 px",
    alt: "TOKNAV office location in Guangzhou",
    replacementName: "",
    replacementDataUrl: "",
    notes: "可替换为 OpenStreetMap 截图、办公室照片或公司门头图。"
  },
  {
    id: "asset-blog-cover-template",
    label: "Blog 默认封面图",
    page: "blog/{slug}.html",
    currentPath: "public/assets/products/tr10pro-marking-robot.png",
    recommendedSize: "1600 x 900 px",
    alt: "TOKNAV blog cover image",
    replacementName: "",
    replacementDataUrl: "",
    notes: "新增博客时可替换成对应产品或应用场景图。"
  },
  {
    id: "asset-news-fallback",
    label: "新闻资讯默认配图",
    page: "news.html",
    currentPath: "public/assets/rtk-rooftop-test.jpg",
    recommendedSize: "1200 x 720 px",
    alt: "TOKNAV GNSS news fallback image",
    replacementName: "",
    replacementDataUrl: "",
    notes: "没有新闻配图时使用 Toknav 产品或测试场景图。"
  },
  {
    id: "asset-footer-logo-white",
    label: "全站页脚白色 Logo",
    page: "Global Footer",
    currentPath: "public/assets/toknav-logo-white.png",
    recommendedSize: "Transparent PNG / WebP",
    alt: "TOKNAV white logo",
    replacementName: "",
    replacementDataUrl: "",
    notes: "用于深蓝色页脚。"
  }
];

const DEFAULT_BLOG_DRAFT = {
  id: "draft-tr10pro-white",
  title: "TR10Pro Gets a New White Body: What Changed from the Green Version?",
  slug: "tr10pro-new-white-body",
  category: "Product Updates",
  date: todayDate(),
  seoTitle: "TR10Pro New White Body: Updated Line Marking Robot Design",
  metaDescription: "Learn why the TR10Pro line marking robot changed from a green body to a white body and what it means for buyers, dealers and field users.",
  cover: "/public/assets/products/tr10pro-marking-robot.png",
  coverDataUrl: "",
  excerpt: "TOKNAV TR10Pro has moved from the earlier green body to a cleaner white body, keeping the product focused on field marking and easier visual presentation.",
  content: "## Why TOKNAV Updated the TR10Pro Body Color\nThe new white body gives TR10Pro a cleaner and more consistent product appearance for overseas distributors, sports field contractors and municipal marking teams.\n\n## What Remains Focused on Field Work\nThe update is mainly about visual presentation and brand consistency. Buyers should still evaluate positioning workflow, paint handling, field preparation and after-sales support before placing an order.\n\n## Who Should Pay Attention\nDealers, line marking service providers and project buyers can use the new visual version for product demonstrations, catalog updates and marketing materials.",
  faq: "Is the new TR10Pro a completely different product? | The main change discussed here is the body appearance update from green to white.\nWho is TR10Pro suitable for? | It is suitable for sports field marking, project marking and related field automation scenarios.",
  ctaText: "Send Your Requirements",
  ctaHref: "../contact.html"
};

function ensureAdminContent() {
  if (!state.data.site) state.data.site = { updatedAt: todayDate() };
  if (!Array.isArray(state.data.textSlots) || !state.data.textSlots.length) {
    state.data.textSlots = DEFAULT_TEXT_SLOTS.map((item) => ({ ...item }));
  } else {
    mergeMissingItems(state.data.textSlots, DEFAULT_TEXT_SLOTS);
  }
  if (!Array.isArray(state.data.assets) || !state.data.assets.length) {
    state.data.assets = DEFAULT_ASSET_SLOTS.map((item) => ({ ...item }));
  } else {
    mergeMissingItems(state.data.assets, DEFAULT_ASSET_SLOTS);
  }
  if (!Array.isArray(state.data.blogDrafts) || !state.data.blogDrafts.length) {
    state.data.blogDrafts = [{ ...DEFAULT_BLOG_DRAFT }];
  }
  state.selectedTextId = state.selectedTextId || state.data.textSlots[0]?.id;
  state.selectedAssetId = state.selectedAssetId || state.data.assets[0]?.id;
  state.selectedBlogDraftId = state.selectedBlogDraftId || state.data.blogDrafts[0]?.id;
}

function mergeMissingItems(target, defaults) {
  const existingIds = new Set(target.map((item) => item.id));
  defaults.forEach((item) => {
    if (!existingIds.has(item.id)) target.push({ ...item });
  });
}

function knownPagesFor(kind) {
  const source = kind === "asset" ? state.data.assets : state.data.textSlots;
  const map = new Map(PAGE_OPTIONS);
  source.forEach((item) => {
    if (item.page && !map.has(item.page)) map.set(item.page, item.page);
  });
  return [...map.entries()];
}

async function loadInitialData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    state.data = JSON.parse(saved);
    ensureAdminContent();
    return;
  }
  const response = await fetch("/admin/seo-data.json", { cache: "no-store" });
  state.data = await response.json();
  ensureAdminContent();
}

function saveData() {
  state.data.site.updatedAt = new Date().toISOString().slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data, null, 2));
}

function pageScore(page) {
  let score = 0;
  const titleLength = page.seoTitle.trim().length;
  const metaLength = page.metaDescription.trim().length;
  if (page.focusKeyword.trim()) score += 15;
  if (titleLength >= 45 && titleLength <= 65) score += 20;
  else if (titleLength >= 35 && titleLength <= 75) score += 12;
  if (metaLength >= 120 && metaLength <= 165) score += 25;
  else if (metaLength >= 90 && metaLength <= 180) score += 14;
  if (page.h1.trim()) score += 12;
  if (page.cta.trim()) score += 10;
  if (Number(page.internalLinks) >= 3) score += 10;
  if (page.notes.trim()) score += 8;
  return Math.min(score, 100);
}

function getFilteredPages() {
  const search = els.searchInput.value.trim().toLowerCase();
  const type = els.typeFilter.value;
  const status = els.statusFilter.value;
  return state.data.pages.filter((page) => {
    const text = `${page.url} ${page.focusKeyword} ${page.seoTitle} ${page.h1}`.toLowerCase();
    return (!search || text.includes(search)) &&
      (!type || page.type === type) &&
      (!status || page.status === status);
  });
}

function renderMetrics() {
  const pages = state.data.pages;
  const avg = pages.length
    ? Math.round(pages.reduce((sum, page) => sum + pageScore(page), 0) / pages.length)
    : 0;
  els.metricTotal.textContent = pages.length;
  els.metricScore.textContent = avg;
  els.metricHigh.textContent = pages.filter((page) => page.priority === "High").length;
  els.metricDraft.textContent = pages.filter((page) => page.status !== "Live").length;
}

function renderFilters() {
  const types = [...new Set(state.data.pages.map((page) => page.type))].sort();
  const current = els.typeFilter.value;
  els.typeFilter.innerHTML = '<option value="">全部类型</option>' +
    types.map((type) => `<option ${type === current ? "selected" : ""}>${escapeHtml(type)}</option>`).join("");
}

function renderPageList() {
  const pages = getFilteredPages();
  els.pageList.innerHTML = pages.map((page) => {
    const score = pageScore(page);
    return `
      <button class="page-card ${page.id === state.selectedId ? "is-active" : ""}" data-id="${escapeHtml(page.id)}" type="button">
        <strong>${escapeHtml(page.h1 || page.seoTitle || page.url)}</strong>
        <small>${escapeHtml(page.url)}</small>
        <div class="tag-row">
          <span class="tag ${page.priority.toLowerCase()}">${escapeHtml(page.priority)}</span>
          <span class="tag ${page.status.toLowerCase()}">${escapeHtml(page.status)}</span>
          <span class="tag">${score}/100</span>
        </div>
      </button>
    `;
  }).join("");

  els.pageList.querySelectorAll(".page-card").forEach((button) => {
    button.addEventListener("click", () => selectPage(button.dataset.id));
  });
}

function currentPage() {
  return state.data.pages.find((page) => page.id === state.selectedId) || state.data.pages[0];
}

function renderChecklist(page) {
  const items = [
    ["关键词", Boolean(page.focusKeyword.trim())],
    ["Title 长度", page.seoTitle.length >= 45 && page.seoTitle.length <= 65],
    ["Meta 长度", page.metaDescription.length >= 120 && page.metaDescription.length <= 165],
    ["H1", Boolean(page.h1.trim())],
    ["CTA", Boolean(page.cta.trim())],
    ["内链 ≥ 3", Number(page.internalLinks) >= 3],
    ["备注", Boolean(page.notes.trim())]
  ];
  els.seoChecklist.innerHTML = items.map(([label, pass]) => `
    <div class="check-item ${pass ? "pass" : "warn"}">
      <span>${pass ? "✓" : "!"}</span>
      <span>${escapeHtml(label)}</span>
    </div>
  `).join("");
}

function renderEditor() {
  const page = currentPage();
  if (!page) return;
  state.selectedId = page.id;
  els.editorTitle.textContent = page.h1 || page.seoTitle || page.url;
  els.scorePill.textContent = `${pageScore(page)}/100`;
  els.pageEditor.elements.type.value = page.type;
  els.pageEditor.elements.priority.value = page.priority;
  els.pageEditor.elements.status.value = page.status;
  els.pageEditor.elements.url.value = page.url;
  els.pageEditor.elements.focusKeyword.value = page.focusKeyword;
  els.pageEditor.elements.seoTitle.value = page.seoTitle;
  els.pageEditor.elements.metaDescription.value = page.metaDescription;
  els.pageEditor.elements.h1.value = page.h1;
  els.pageEditor.elements.cta.value = page.cta;
  els.pageEditor.elements.internalLinks.value = page.internalLinks;
  els.pageEditor.elements.notes.value = page.notes;
  els.titleCount.textContent = `${page.seoTitle.length} chars`;
  els.metaCount.textContent = `${page.metaDescription.length} chars`;
  els.openPageLink.href = publicPageHref(page.url);
  renderChecklist(page);
  renderPageList();
}

function publicPageHref(url) {
  if (url === "/") return "../index.html";
  const clean = url.replace(/^\/+|\/+$/g, "");
  if (!clean) return "../index.html";
  if (clean.startsWith("products/") && clean.split("/").length === 2) {
    return `../${clean}/index.html`;
  }
  if (clean === "blog") return "../blog/index.html";
  return `../${clean}.html`;
}

function selectPage(id) {
  state.selectedId = id;
  renderEditor();
}

function saveCurrentPage(event) {
  event.preventDefault();
  const page = currentPage();
  if (!page) return;
  const fields = new FormData(els.pageEditor);
  page.type = fields.get("type").trim();
  page.priority = fields.get("priority");
  page.status = fields.get("status");
  page.url = fields.get("url").trim();
  page.focusKeyword = fields.get("focusKeyword").trim();
  page.seoTitle = fields.get("seoTitle").trim();
  page.metaDescription = fields.get("metaDescription").trim();
  page.h1 = fields.get("h1").trim();
  page.cta = fields.get("cta").trim();
  page.internalLinks = Number(fields.get("internalLinks") || 0);
  page.notes = fields.get("notes").trim();
  saveData();
  showToast("页面 SEO 已保存");
  renderAll();
}

function addPage() {
  const page = {
    id: slugId(),
    type: "Product Page",
    priority: "Medium",
    status: "Draft",
    url: "/new-page/",
    focusKeyword: "",
    seoTitle: "",
    metaDescription: "",
    h1: "New Page",
    cta: "Get a Quote",
    internalLinks: 0,
    notes: ""
  };
  state.data.pages.unshift(page);
  state.selectedId = page.id;
  saveData();
  showToast("已新增页面");
  renderAll();
}

function renderBlogIdeas() {
  els.blogGrid.innerHTML = state.data.blogIdeas.map((item) => `
    <article class="blog-card">
      <div class="tag-row">
        <span class="tag ${item.priority.toLowerCase()}">${escapeHtml(item.priority)}</span>
        <span class="tag">${escapeHtml(item.intent)}</span>
      </div>
      <strong>${escapeHtml(item.title)}</strong>
      <span>Keyword: ${escapeHtml(item.keyword)}</span>
      <span>${escapeHtml(item.notes)}</span>
    </article>
  `).join("");
}

function addBlogIdea() {
  const title = prompt("请输入博客标题");
  if (!title) return;
  state.data.blogIdeas.unshift({
    id: `blog-${Date.now()}`,
    priority: "Medium",
    keyword: "",
    title,
    intent: "SEO content",
    notes: "Add target keyword, CTA and internal links."
  });
  saveData();
  showToast("已新增博客选题");
  renderBlogIdeas();
}

function currentTextSlot() {
  return state.data.textSlots.find((item) => item.id === state.selectedTextId) || state.data.textSlots[0];
}

function renderTextPageFilter() {
  if (!els.textPageFilter) return;
  const current = els.textPageFilter.value;
  els.textPageFilter.innerHTML = '<option value="">全部页面</option>' +
    knownPagesFor("text").map(([value, label]) => `<option value="${escapeHtml(value)}" ${value === current ? "selected" : ""}>${escapeHtml(label)} · ${escapeHtml(value)}</option>`).join("");
}

function filteredTextSlots() {
  const page = els.textPageFilter?.value || "";
  return state.data.textSlots.filter((item) => !page || item.page === page);
}

function renderTextSlots() {
  if (!els.textSlotList) return;
  const items = filteredTextSlots();
  if (!items.some((item) => item.id === state.selectedTextId) && items[0]) {
    state.selectedTextId = items[0].id;
  }
  els.textSlotList.innerHTML = items.length ? items.map((item) => {
    const hasNewText = Boolean(item.newText?.trim());
    return `
      <button class="page-card ${item.id === state.selectedTextId ? "is-active" : ""}" data-id="${escapeHtml(item.id)}" type="button">
        <strong>${escapeHtml(item.label)}</strong>
        <small>${escapeHtml(item.page)} · ${escapeHtml(item.section)}</small>
        <div class="tag-row">
          <span class="tag">${escapeHtml(item.locale || "English")}</span>
          <span class="tag ${hasNewText ? "live" : "draft"}">${hasNewText ? "Updated" : "Waiting"}</span>
        </div>
      </button>
    `;
  }).join("") : '<div class="empty-state">当前页面还没有文字位，点击“新增文字位”即可添加。</div>';
  els.textSlotList.querySelectorAll(".page-card").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedTextId = button.dataset.id;
      renderTextEditor();
      renderTextSlots();
    });
  });
}

function renderTextEditor() {
  if (!els.textEditor) return;
  const item = currentTextSlot();
  if (!item) return;
  state.selectedTextId = item.id;
  els.textEditorTitle.textContent = item.label;
  els.textStatusPill.textContent = item.newText?.trim() ? "Updated" : "Draft";
  els.textEditor.elements.label.value = item.label || "";
  els.textEditor.elements.page.value = item.page || "";
  els.textEditor.elements.section.value = item.section || "";
  els.textEditor.elements.locale.value = item.locale || "";
  els.textEditor.elements.currentText.value = item.currentText || "";
  els.textEditor.elements.newText.value = item.newText || "";
  els.textEditor.elements.notes.value = item.notes || "";
}

function saveCurrentText(event) {
  event.preventDefault();
  const item = currentTextSlot();
  if (!item) return;
  const fields = new FormData(els.textEditor);
  item.label = fields.get("label").trim();
  item.page = fields.get("page").trim();
  item.section = fields.get("section").trim();
  item.locale = fields.get("locale").trim();
  item.currentText = fields.get("currentText").trim();
  item.newText = fields.get("newText").trim();
  item.notes = fields.get("notes").trim();
  saveData();
  showToast("网站文字已保存");
  renderTextSlots();
  renderTextEditor();
}

function addTextSlot() {
  const label = prompt("请输入文字位置名称，例如：首页按钮文案");
  if (!label) return;
  const page = els.textPageFilter?.value || "index.html";
  const item = {
    id: contentId("copy"),
    label,
    page,
    section: "New Section",
    locale: "English",
    currentText: "",
    newText: "",
    notes: ""
  };
  state.data.textSlots.unshift(item);
  state.selectedTextId = item.id;
  saveData();
  showToast("已新增文字位");
  renderTextSlots();
  renderTextEditor();
}

function textSnippet(item) {
  return [
    `位置: ${item.label}`,
    `页面: ${item.page}`,
    `区域: ${item.section}`,
    `语言: ${item.locale}`,
    `当前文字: ${item.currentText}`,
    `修改后文字: ${item.newText || "(未填写)"}`,
    `备注: ${item.notes}`
  ].join("\n");
}

function copyTextSnippet() {
  const text = textSnippet(currentTextSlot());
  navigator.clipboard?.writeText(text);
  els.exportOutput.value = text;
}

function downloadTextPackage() {
  const payload = {
    type: "toknav-website-copy-update",
    updatedAt: new Date().toISOString(),
    instructions: [
      "把 newText 非空的项目同步到对应页面。",
      "如果 newText 为空，表示该位置只是记录当前文案，不需要替换。",
      "同步后请检查桌面端、移动端和多语言切换。"
    ],
    items: state.data.textSlots
  };
  const content = JSON.stringify(payload, null, 2);
  els.exportOutput.value = content;
  showToast("文字更新包已生成");
  downloadFile("toknav-website-copy-update.json", content, "application/json");
}

function currentAsset() {
  return state.data.assets.find((item) => item.id === state.selectedAssetId) || state.data.assets[0];
}

function renderAssetPageFilter() {
  if (!els.assetPageFilter) return;
  const current = els.assetPageFilter.value;
  els.assetPageFilter.innerHTML = '<option value="">全部页面</option>' +
    knownPagesFor("asset").map(([value, label]) => `<option value="${escapeHtml(value)}" ${value === current ? "selected" : ""}>${escapeHtml(label)} · ${escapeHtml(value)}</option>`).join("");
}

function filteredAssets() {
  const page = els.assetPageFilter?.value || "";
  return state.data.assets.filter((item) => !page || item.page === page);
}

function assetPreviewSrc(item) {
  const value = item?.replacementDataUrl || item?.currentPath || "/public/assets/toknav-logo-blue.png";
  if (value.startsWith("data:") || value.startsWith("http")) return value;
  if (value.startsWith("../public/")) return value.replace("..", "");
  if (value.startsWith("../")) return value;
  if (value.startsWith("/")) return value;
  if (value.startsWith("public/")) return `/${value}`;
  return value;
}

function renderAssetSlots() {
  if (!els.assetSlotList) return;
  const items = filteredAssets();
  if (!items.some((item) => item.id === state.selectedAssetId) && items[0]) {
    state.selectedAssetId = items[0].id;
  }
  els.assetSlotList.innerHTML = items.length ? items.map((item) => {
    const hasFile = Boolean(item.replacementDataUrl);
    return `
      <button class="page-card ${item.id === state.selectedAssetId ? "is-active" : ""}" data-id="${escapeHtml(item.id)}" type="button">
        <strong>${escapeHtml(item.label)}</strong>
        <small>${escapeHtml(item.page)} · ${escapeHtml(item.recommendedSize)}</small>
        <div class="tag-row">
          <span class="tag">${escapeHtml(item.currentPath || "No path")}</span>
          <span class="tag ${hasFile ? "live" : "draft"}">${hasFile ? "New file" : "Waiting"}</span>
        </div>
      </button>
    `;
  }).join("") : '<div class="empty-state">当前页面还没有素材位，点击“新增素材位”即可添加。</div>';
  els.assetSlotList.querySelectorAll(".page-card").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedAssetId = button.dataset.id;
      renderAssetEditor();
      renderAssetSlots();
    });
  });
}

function renderAssetEditor() {
  if (!els.assetEditor) return;
  const item = currentAsset();
  if (!item) return;
  state.selectedAssetId = item.id;
  els.assetEditorTitle.textContent = item.label;
  els.assetStatusPill.textContent = item.replacementDataUrl ? "New File" : "Ready";
  els.assetPreview.src = assetPreviewSrc(item);
  els.assetPreview.alt = item.alt || item.label;
  els.assetEditor.elements.label.value = item.label || "";
  els.assetEditor.elements.page.value = item.page || "";
  els.assetEditor.elements.currentPath.value = item.currentPath || "";
  els.assetEditor.elements.recommendedSize.value = item.recommendedSize || "";
  els.assetEditor.elements.alt.value = item.alt || "";
  els.assetEditor.elements.replacementName.value = item.replacementName || "";
  els.assetEditor.elements.notes.value = item.notes || "";
}

function saveCurrentAsset(event) {
  event.preventDefault();
  const item = currentAsset();
  if (!item) return;
  const fields = new FormData(els.assetEditor);
  item.label = fields.get("label").trim();
  item.page = fields.get("page").trim();
  item.currentPath = fields.get("currentPath").trim();
  item.recommendedSize = fields.get("recommendedSize").trim();
  item.alt = fields.get("alt").trim();
  item.replacementName = fields.get("replacementName").trim();
  item.notes = fields.get("notes").trim();
  saveData();
  showToast("素材信息已保存");
  renderAssetSlots();
  renderAssetEditor();
}

function addAssetSlot() {
  const label = prompt("请输入素材位置名称，例如：产品页主图");
  if (!label) return;
  const page = els.assetPageFilter?.value || "index.html";
  const item = {
    id: contentId("asset"),
    label,
    page,
    currentPath: "",
    recommendedSize: "1200 x 800 px",
    alt: "",
    replacementName: "",
    replacementDataUrl: "",
    notes: ""
  };
  state.data.assets.unshift(item);
  state.selectedAssetId = item.id;
  saveData();
  showToast("已新增素材位");
  renderAssetSlots();
  renderAssetEditor();
}

function assetSnippet(item) {
  return [
    `素材位置: ${item.label}`,
    `页面: ${item.page}`,
    `当前路径: ${item.currentPath}`,
    `推荐尺寸: ${item.recommendedSize}`,
    `ALT: ${item.alt}`,
    `新文件名: ${item.replacementName || "(未上传)"}`,
    `备注: ${item.notes}`
  ].join("\n");
}

function copyAssetSnippet() {
  const text = assetSnippet(currentAsset());
  navigator.clipboard?.writeText(text);
  els.exportOutput.value = text;
}

function downloadAssetPackage() {
  const payload = {
    type: "toknav-website-asset-update",
    updatedAt: new Date().toISOString(),
    instructions: [
      "把 replacementDataUrl 非空的图片保存成 replacementName。",
      "上传到对应 currentPath 所在目录，或按维护人员建议重命名路径。",
      "同步页面里的 img src 与 alt，并检查移动端裁切。"
    ],
    assets: state.data.assets
  };
  const content = JSON.stringify(payload, null, 2);
  els.exportOutput.value = content;
  showToast("素材更新包已生成");
  downloadFile("toknav-website-asset-update.json", content, "application/json");
}

function readImageInput(input, callback) {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => callback(file, reader.result);
  reader.readAsDataURL(file);
}

function currentBlogDraft() {
  return state.data.blogDrafts.find((item) => item.id === state.selectedBlogDraftId) || state.data.blogDrafts[0];
}

function parseFaq(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [question, ...answerParts] = line.split("|");
      return {
        question: question?.trim() || "",
        answer: answerParts.join("|").trim()
      };
    })
    .filter((item) => item.question && item.answer);
}

function markdownToHtml(value) {
  const lines = String(value || "").split("\n");
  let inList = false;
  const html = [];
  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      return;
    }
    if (line.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${escapeHtml(line.slice(2))}</li>`);
      return;
    }
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
    if (line.startsWith("### ")) {
      html.push(`<h3>${escapeHtml(line.slice(4))}</h3>`);
    } else if (line.startsWith("## ")) {
      html.push(`<h2>${escapeHtml(line.slice(3))}</h2>`);
    } else {
      html.push(`<p>${escapeHtml(line)}</p>`);
    }
  });
  if (inList) html.push("</ul>");
  return html.join("\n");
}

function blogCoverSrc(draft) {
  const value = draft.coverDataUrl || draft.cover || "/public/assets/products/tr10pro-marking-robot.png";
  if (typeof value === "string" && value.startsWith("../public/")) return value.replace("..", "");
  return value;
}

function renderBlogEditor() {
  if (!els.blogEditor) return;
  const draft = currentBlogDraft();
  if (!draft) return;
  state.selectedBlogDraftId = draft.id;
  els.blogEditor.elements.title.value = draft.title || "";
  els.blogEditor.elements.slug.value = draft.slug || makeSlug(draft.title);
  els.blogEditor.elements.category.value = draft.category || "";
  els.blogEditor.elements.date.value = draft.date || todayDate();
  els.blogEditor.elements.seoTitle.value = draft.seoTitle || "";
  els.blogEditor.elements.metaDescription.value = draft.metaDescription || "";
  els.blogEditor.elements.cover.value = draft.cover || "";
  els.blogEditor.elements.excerpt.value = draft.excerpt || "";
  els.blogEditor.elements.content.value = draft.content || "";
  els.blogEditor.elements.faq.value = draft.faq || "";
  els.blogEditor.elements.ctaText.value = draft.ctaText || "Send Your Requirements";
  els.blogEditor.elements.ctaHref.value = draft.ctaHref || "../contact.html";
  renderBlogPreview();
}

function updateDraftFromEditor(draft) {
  const fields = new FormData(els.blogEditor);
  draft.title = fields.get("title").trim();
  draft.slug = makeSlug(fields.get("slug") || draft.title);
  draft.category = fields.get("category").trim();
  draft.date = fields.get("date") || todayDate();
  draft.seoTitle = fields.get("seoTitle").trim();
  draft.metaDescription = fields.get("metaDescription").trim();
  draft.cover = fields.get("cover").trim();
  draft.excerpt = fields.get("excerpt").trim();
  draft.content = fields.get("content").trim();
  draft.faq = fields.get("faq").trim();
  draft.ctaText = fields.get("ctaText").trim();
  draft.ctaHref = fields.get("ctaHref").trim();
}

function saveCurrentBlogDraft(event) {
  event?.preventDefault();
  const draft = currentBlogDraft();
  if (!draft) return;
  updateDraftFromEditor(draft);
  saveData();
  renderBlogPreview();
}

function addBlogDraft() {
  const draft = {
    ...DEFAULT_BLOG_DRAFT,
    id: contentId("draft"),
    title: "New Blog Article",
    slug: `new-blog-${Date.now()}`,
    date: todayDate(),
    coverDataUrl: ""
  };
  state.data.blogDrafts.unshift(draft);
  state.selectedBlogDraftId = draft.id;
  saveData();
  renderBlogEditor();
}

function blogCardHtml(draft) {
  const slug = makeSlug(draft.slug || draft.title);
  const cover = blogCoverSrc(draft);
  return `<article class="blog-card">
  <a href="./${escapeHtml(slug)}.html">
    <img src="${escapeHtml(cover)}" alt="${escapeHtml(draft.title)}">
    <span>${escapeHtml(draft.category || "Blog")}</span>
    <h3>${escapeHtml(draft.title)}</h3>
    <p>${escapeHtml(draft.excerpt || draft.metaDescription || "")}</p>
  </a>
</article>`;
}

function blogHtml(draft) {
  const slug = makeSlug(draft.slug || draft.title);
  const faqs = parseFaq(draft.faq);
  const faqHtml = faqs.length ? `
      <section class="article-faq">
        <h2>FAQ</h2>
        ${faqs.map((item) => `<details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`).join("\n        ")}
      </section>` : "";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(draft.seoTitle || draft.title)}</title>
  <meta name="description" content="${escapeHtml(draft.metaDescription || draft.excerpt || "")}">
  <style>
    :root { --blue: #1b2c96; --ink: #061124; --muted: #617089; --line: #d8e5f6; --soft: #f4f8ff; }
    * { box-sizing: border-box; }
    body { margin: 0; color: var(--ink); background: linear-gradient(180deg, #fff, #f4f8ff); font-family: Inter, Arial, sans-serif; }
    a { color: inherit; }
    .blog-article-page { padding: 56px 20px; }
    .article-shell { max-width: 980px; margin: 0 auto; }
    .article-back { display: inline-flex; margin-bottom: 28px; color: var(--blue); font-weight: 900; text-decoration: none; }
    .article-meta { color: var(--blue); font-weight: 900; letter-spacing: .02em; }
    h1 { max-width: 860px; margin: 12px 0 16px; font-size: clamp(38px, 6vw, 72px); line-height: 1; letter-spacing: 0; }
    .article-excerpt { max-width: 760px; color: var(--muted); font-size: 20px; line-height: 1.7; }
    .article-cover { width: 100%; max-height: 560px; margin: 32px 0; border-radius: 8px; object-fit: cover; border: 1px solid var(--line); box-shadow: 0 22px 70px rgba(20,40,137,.12); }
    .article-content { display: grid; gap: 8px; }
    .article-content h2, .article-faq h2, .article-cta h2 { margin: 34px 0 8px; font-size: 34px; line-height: 1.15; }
    .article-content h3 { margin: 24px 0 6px; font-size: 24px; }
    .article-content p, .article-content li, .article-faq p, .article-cta p { color: var(--muted); font-size: 18px; line-height: 1.85; }
    .article-faq { margin-top: 36px; }
    details { padding: 18px 0; border-top: 1px solid var(--line); }
    summary { cursor: pointer; font-weight: 900; }
    .article-cta { margin-top: 44px; padding: 30px; border-radius: 8px; color: #fff; background: var(--blue); }
    .article-cta h2, .article-cta p { color: #fff; margin-top: 0; }
    .article-cta a { display: inline-flex; min-height: 46px; align-items: center; padding: 0 20px; border-radius: 8px; color: var(--blue); background: #fff; font-weight: 900; text-decoration: none; }
  </style>
</head>
<body>
  <main class="blog-article-page">
    <article class="article-shell">
      <a href="./index.html" class="article-back">Back to Blog</a>
      <p class="article-meta">${escapeHtml(draft.category || "Blog")} · ${escapeHtml(draft.date || todayDate())}</p>
      <h1>${escapeHtml(draft.title)}</h1>
      <p class="article-excerpt">${escapeHtml(draft.excerpt || "")}</p>
      <img class="article-cover" src="${escapeHtml(blogCoverSrc(draft))}" alt="${escapeHtml(draft.title)}">
      <div class="article-content">
        ${markdownToHtml(draft.content)}
      </div>${faqHtml}
      <section class="article-cta">
        <h2>Need a product recommendation?</h2>
        <p>Send your application, quantity and target market. TOKNAV will help you prepare a practical product selection and quote.</p>
        <a href="${escapeHtml(draft.ctaHref || "../contact.html")}">${escapeHtml(draft.ctaText || "Send Your Requirements")}</a>
      </section>
    </article>
  </main>
  <script src="/public/assets/i18n-static.js?v=20260618c"></script>
</body>
</html>
<!-- Suggested file path: /blog/${escapeHtml(slug)}.html -->`;
}

function renderBlogPreview() {
  if (!els.blogPreview) return;
  const draft = currentBlogDraft();
  if (!draft) return;
  updateDraftFromEditor(draft);
  const faqs = parseFaq(draft.faq);
  els.blogPreview.innerHTML = `
    <article>
      <img src="${escapeHtml(blogCoverSrc(draft))}" alt="${escapeHtml(draft.title)}">
      <span class="tag">${escapeHtml(draft.category || "Blog")}</span>
      <h1>${escapeHtml(draft.title || "Untitled Blog")}</h1>
      <p class="preview-meta">${escapeHtml(draft.date || todayDate())}</p>
      <p>${escapeHtml(draft.excerpt || draft.metaDescription || "")}</p>
      <div class="preview-body">${markdownToHtml(draft.content)}</div>
      ${faqs.length ? `<h2>FAQ</h2>${faqs.map((item) => `<details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`).join("")}` : ""}
    </article>
  `;
}

function downloadBlogHtml() {
  saveCurrentBlogDraft();
  const draft = currentBlogDraft();
  const content = blogHtml(draft);
  els.blogOutput.value = content;
  downloadFile(`${makeSlug(draft.slug || draft.title)}.html`, content, "text/html;charset=utf-8");
}

function copyBlogCard() {
  saveCurrentBlogDraft();
  const content = blogCardHtml(currentBlogDraft());
  els.blogOutput.value = content;
  navigator.clipboard?.writeText(content);
}

function downloadBlogPackage() {
  saveCurrentBlogDraft();
  const draft = currentBlogDraft();
  const payload = {
    type: "toknav-blog-update",
    updatedAt: new Date().toISOString(),
    instructions: [
      "把 html 保存到 /blog/slug.html。",
      "把 blogCardHtml 添加到博客汇总页。",
      "发布后检查 title、meta description、封面图片、CTA 和移动端排版。"
    ],
    draft,
    html: blogHtml(draft),
    blogCardHtml: blogCardHtml(draft)
  };
  const content = JSON.stringify(payload, null, 2);
  els.blogOutput.value = content;
  downloadFile(`toknav-blog-package-${makeSlug(draft.slug || draft.title)}.json`, content, "application/json");
}

function renderTechnicalList() {
  els.technicalList.innerHTML = state.data.technicalChecklist
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
}

function pageSnippet(page) {
  return [
    `URL: ${page.url}`,
    `Focus Keyword: ${page.focusKeyword}`,
    `SEO Title: ${page.seoTitle}`,
    `Meta Description: ${page.metaDescription}`,
    `H1: ${page.h1}`,
    `CTA: ${page.cta}`,
    `Internal Links: ${page.internalLinks}`,
    `Notes: ${page.notes}`
  ].join("\n");
}

function copySnippet() {
  const text = pageSnippet(currentPage());
  navigator.clipboard?.writeText(text);
  els.exportOutput.value = text;
}

function exportRows() {
  return state.data.pages.map((page) => ({
    type: page.type,
    priority: page.priority,
    status: page.status,
    url: page.url,
    focusKeyword: page.focusKeyword,
    seoTitle: page.seoTitle,
    metaDescription: page.metaDescription,
    h1: page.h1,
    cta: page.cta,
    internalLinks: page.internalLinks,
    score: pageScore(page),
    notes: page.notes
  }));
}

function toCsv(rows) {
  const headers = Object.keys(rows[0] || {});
  const escapeCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [headers.join(","), ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(","))].join("\n");
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportJson() {
  const content = JSON.stringify(state.data, null, 2);
  els.exportOutput.value = content;
  downloadFile("toknav-seo-admin-backup.json", content, "application/json");
}

function exportCsv() {
  const content = toCsv(exportRows());
  els.exportOutput.value = content;
  downloadFile("toknav-seo-page-list.csv", content, "text/csv;charset=utf-8");
}

function copyAll() {
  const content = state.data.pages.map(pageSnippet).join("\n\n---\n\n");
  els.exportOutput.value = content;
  navigator.clipboard?.writeText(content);
}

async function resetData() {
  if (!confirm("确定恢复初始数据？当前浏览器里的修改会被清除。")) return;
  localStorage.removeItem(STORAGE_KEY);
  await loadInitialData();
  state.selectedId = state.data.pages[0]?.id;
  state.selectedTextId = state.data.textSlots[0]?.id;
  state.selectedAssetId = state.data.assets[0]?.id;
  state.selectedBlogDraftId = state.data.blogDrafts[0]?.id;
  renderAll();
}

function unlock() {
  if (els.accessCode.value.trim() !== ACCESS_CODE) {
    els.accessCode.focus();
    els.accessCode.value = "";
    els.accessCode.placeholder = "访问码不正确";
    return;
  }
  state.unlocked = true;
  localStorage.setItem("toknav-seo-admin-unlocked", "1");
  els.lockedLayer.classList.remove("is-locked");
  els.accessPanel.style.display = "none";
  activatePanel(location.hash.replace("#", "") || "dashboard-panel", false);
  showToast("已进入后台");
}

function bindEvents() {
  qsa(".admin-nav a, .home-entry").forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = link.getAttribute("href")?.replace("#", "");
      if (!target) return;
      event.preventDefault();
      activatePanel(target);
    });
  });
  els.unlockButton.addEventListener("click", unlock);
  els.accessCode.addEventListener("keydown", (event) => {
    if (event.key === "Enter") unlock();
  });
  els.searchInput.addEventListener("input", renderPageList);
  els.typeFilter.addEventListener("change", renderPageList);
  els.statusFilter.addEventListener("change", renderPageList);
  els.pageEditor.addEventListener("submit", saveCurrentPage);
  els.textEditor.addEventListener("submit", saveCurrentText);
  els.assetEditor.addEventListener("submit", saveCurrentAsset);
  els.blogEditor.addEventListener("submit", saveCurrentBlogDraft);
  els.textPageFilter.addEventListener("change", () => {
    renderTextSlots();
    renderTextEditor();
  });
  els.assetPageFilter.addEventListener("change", () => {
    renderAssetSlots();
    renderAssetEditor();
  });
  els.addPageButton.addEventListener("click", addPage);
  els.addTextButton.addEventListener("click", addTextSlot);
  els.addAssetButton.addEventListener("click", addAssetSlot);
  els.addBlogButton.addEventListener("click", addBlogIdea);
  els.newBlogDraftButton.addEventListener("click", addBlogDraft);
  els.resetButton.addEventListener("click", resetData);
  els.copySnippetButton.addEventListener("click", copySnippet);
  els.copyTextButton.addEventListener("click", copyTextSnippet);
  els.copyAssetButton.addEventListener("click", copyAssetSnippet);
  els.copyBlogCardButton.addEventListener("click", copyBlogCard);
  els.downloadJsonButton.addEventListener("click", exportJson);
  els.downloadCsvButton.addEventListener("click", exportCsv);
  els.downloadTextPackageButton.addEventListener("click", downloadTextPackage);
  els.downloadAssetPackageButton.addEventListener("click", downloadAssetPackage);
  els.downloadBlogHtmlButton.addEventListener("click", downloadBlogHtml);
  els.downloadBlogPackageButton.addEventListener("click", downloadBlogPackage);
  els.copyAllButton.addEventListener("click", copyAll);
  els.assetFileInput.addEventListener("change", () => {
    readImageInput(els.assetFileInput, (file, result) => {
      const item = currentAsset();
      if (!item) return;
      item.replacementName = file.name;
      item.replacementDataUrl = result;
      saveData();
      showToast("新素材已读取，可预览并保存");
      renderAssetEditor();
      renderAssetSlots();
    });
  });
  els.blogCoverInput.addEventListener("change", () => {
    readImageInput(els.blogCoverInput, (file, result) => {
      const draft = currentBlogDraft();
      if (!draft) return;
      draft.cover = file.name;
      draft.coverDataUrl = result;
      saveData();
      showToast("博客封面已读取，可预览并保存");
      renderBlogEditor();
    });
  });
  els.blogEditor.elements.title.addEventListener("input", () => {
    if (!els.blogEditor.elements.slug.value.trim()) {
      els.blogEditor.elements.slug.value = makeSlug(els.blogEditor.elements.title.value);
    }
  });
  ["title", "slug", "category", "date", "seoTitle", "metaDescription", "cover", "excerpt", "content", "faq", "ctaText", "ctaHref"].forEach((name) => {
    els.blogEditor.elements[name].addEventListener("input", renderBlogPreview);
  });
  ["seoTitle", "metaDescription"].forEach((name) => {
    els.pageEditor.elements[name].addEventListener("input", () => {
      els.titleCount.textContent = `${els.pageEditor.elements.seoTitle.value.length} chars`;
      els.metaCount.textContent = `${els.pageEditor.elements.metaDescription.value.length} chars`;
    });
  });
}

function cacheElements() {
  Object.assign(els, {
    accessPanel: qs("#accessPanel"),
    adminToast: qs("#adminToast"),
    accessCode: qs("#accessCode"),
    unlockButton: qs("#unlockButton"),
    lockedLayer: qs("#lockedLayer"),
    metricTotal: qs("#metricTotal"),
    metricScore: qs("#metricScore"),
    metricHigh: qs("#metricHigh"),
    metricDraft: qs("#metricDraft"),
    searchInput: qs("#searchInput"),
    typeFilter: qs("#typeFilter"),
    statusFilter: qs("#statusFilter"),
    pageList: qs("#pageList"),
    pageEditor: qs("#pageEditor"),
    textEditor: qs("#textEditor"),
    assetEditor: qs("#assetEditor"),
    blogEditor: qs("#blogEditor"),
    editorTitle: qs("#editorTitle"),
    textEditorTitle: qs("#textEditorTitle"),
    assetEditorTitle: qs("#assetEditorTitle"),
    scorePill: qs("#scorePill"),
    textStatusPill: qs("#textStatusPill"),
    assetStatusPill: qs("#assetStatusPill"),
    titleCount: qs("#titleCount"),
    metaCount: qs("#metaCount"),
    seoChecklist: qs("#seoChecklist"),
    openPageLink: qs("#openPageLink"),
    addPageButton: qs("#addPageButton"),
    addTextButton: qs("#addTextButton"),
    addAssetButton: qs("#addAssetButton"),
    addBlogButton: qs("#addBlogButton"),
    newBlogDraftButton: qs("#newBlogDraftButton"),
    resetButton: qs("#resetButton"),
    copySnippetButton: qs("#copySnippetButton"),
    copyTextButton: qs("#copyTextButton"),
    copyAssetButton: qs("#copyAssetButton"),
    copyBlogCardButton: qs("#copyBlogCardButton"),
    downloadJsonButton: qs("#downloadJsonButton"),
    downloadCsvButton: qs("#downloadCsvButton"),
    downloadTextPackageButton: qs("#downloadTextPackageButton"),
    downloadAssetPackageButton: qs("#downloadAssetPackageButton"),
    downloadBlogHtmlButton: qs("#downloadBlogHtmlButton"),
    downloadBlogPackageButton: qs("#downloadBlogPackageButton"),
    copyAllButton: qs("#copyAllButton"),
    exportOutput: qs("#exportOutput"),
    textSlotList: qs("#textSlotList"),
    textPageFilter: qs("#textPageFilter"),
    assetSlotList: qs("#assetSlotList"),
    assetPageFilter: qs("#assetPageFilter"),
    assetFileInput: qs("#assetFileInput"),
    assetPreview: qs("#assetPreview"),
    blogCoverInput: qs("#blogCoverInput"),
    blogPreview: qs("#blogPreview"),
    blogOutput: qs("#blogOutput"),
    blogGrid: qs("#blogGrid"),
    technicalList: qs("#technicalList")
  });
}

function renderAll() {
  renderFilters();
  renderMetrics();
  renderPageList();
  renderEditor();
  renderTextPageFilter();
  renderTextSlots();
  renderTextEditor();
  renderAssetPageFilter();
  renderAssetSlots();
  renderAssetEditor();
  renderBlogIdeas();
  renderBlogEditor();
  renderTechnicalList();
}

async function init() {
  cacheElements();
  await loadInitialData();
  ensureAdminContent();
  state.selectedId = state.data.pages[0]?.id;
  state.selectedTextId = state.data.textSlots[0]?.id;
  state.selectedAssetId = state.data.assets[0]?.id;
  state.selectedBlogDraftId = state.data.blogDrafts[0]?.id;
  els.lockedLayer.classList.add("is-locked");
  if (localStorage.getItem("toknav-seo-admin-unlocked") === "1") {
    state.unlocked = true;
    els.lockedLayer.classList.remove("is-locked");
    els.accessPanel.style.display = "none";
  }
  bindEvents();
  renderAll();
  const initialPanel = location.hash.replace("#", "") || localStorage.getItem("toknav-admin-active-panel") || "dashboard-panel";
  activatePanel(initialPanel, Boolean(location.hash));
}

init();

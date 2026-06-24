(function () {
  const STORAGE_KEY = "toknav-preferred-language";
  const languages = [
    { code: "en", nativeName: "English", dir: "ltr" },
    { code: "ro", nativeName: "Română", dir: "ltr" },
    { code: "ru", nativeName: "Русский", dir: "ltr" }
  ];

  const copy = {
    "Language": {
      ru: "Язык",
      ro: "Limbă"
    },
    "Products": {
      ru: "Продукты",
      ro: "Produse"
    },
    "Solutions": {
      ru: "Решения",
      ro: "Soluții"
    },
    "About": {
      ru: "О нас",
      ro: "Despre noi"
    },
    "Blog": {
      ru: "Блог",
      ro: "Blog"
    },
    "Contact": {
      ru: "Контакты",
      ro: "Contact"
    },
    "Get a Quote": {
      ru: "Получить цену",
      ro: "Solicită ofertă"
    },
    "Get a Quote →": {
      ru: "Получить цену →",
      ro: "Solicită ofertă →"
    },
    "Explore Products ›": {
      ru: "Посмотреть продукты ›",
      ro: "Explorează produsele ›"
    },
    "Download Catalog": {
      ru: "Скачать каталог",
      ro: "Descarcă catalogul"
    },
    "Send Requirements →": {
      ru: "Отправить требования →",
      ro: "Trimite cerințele →"
    },
    "View All Products →": {
      ru: "Все продукты →",
      ro: "Vezi toate produsele →"
    },
    "View More ›": {
      ru: "Подробнее ›",
      ro: "Vezi mai multe ›"
    },
    "High-Precision GNSS Receivers & RTK Solutions Manufacturer": {
      ru: "Производитель высокоточных GNSS-приемников и RTK-решений",
      ro: "Producător de receptoare GNSS de înaltă precizie și soluții RTK"
    },
    "Reliable centimeter-level positioning solutions for surveying, construction, agriculture and industrial applications worldwide.": {
      ru: "Решения сантиметрового позиционирования для геодезии, строительства, сельского хозяйства и промышленности.",
      ro: "Soluții fiabile de poziționare la nivel de centimetru pentru topografie, construcții, agricultură și aplicații industriale la nivel global."
    },
    "Our Product Categories": {
      ru: "Категории продуктов",
      ro: "Categoriile noastre de produse"
    },
    "Professional GNSS and positioning solutions for diverse industries and applications.": {
      ru: "Профессиональные GNSS-решения для разных отраслей и задач.",
      ro: "Soluții profesionale GNSS și de poziționare pentru industrii și aplicații diverse."
    },
    "Why Choose TOKNAV": {
      ru: "Почему выбирают TOKNAV",
      ro: "De ce să alegeți TOKNAV"
    },
    "Built on innovation. Backed by experience. Trusted worldwide.": {
      ru: "Инновации, опыт и доверие по всему миру.",
      ro: "Bazat pe inovație. Susținut de experiență. De încredere la nivel global."
    },
    "Applications": {
      ru: "Применения",
      ro: "Aplicații"
    },
    "High-precision positioning empowers a wide range of industries.": {
      ru: "Высокоточное позиционирование помогает многим отраслям.",
      ro: "Poziționarea de înaltă precizie susține o gamă largă de industrii."
    },
    "Trusted by Professionals Around the World": {
      ru: "Нам доверяют профессионалы по всему миру",
      ro: "De încredere pentru profesioniști din întreaga lume"
    },
    "TOKNAV products support reliable positioning work across surveying, construction, agriculture and monitoring projects.": {
      ru: "Продукты TOKNAV помогают в геодезии, строительстве, сельском хозяйстве и мониторинге.",
      ro: "Produsele TOKNAV susțin lucrări fiabile de poziționare în proiecte de topografie, construcții, agricultură și monitorizare."
    },
    "Learn More About Us": {
      ru: "Узнать больше о нас",
      ro: "Aflați mai multe despre noi"
    },
    "Need a GNSS Solution?": {
      ru: "Нужно GNSS-решение?",
      ro: "Aveți nevoie de o soluție GNSS?"
    },
    "Tell us your product, quantity, country and application. TOKNAV will recommend a practical quote package.": {
      ru: "Укажите продукт, количество, страну и применение. TOKNAV подготовит практичное предложение.",
      ro: "Spuneți-ne produsul, cantitatea, țara și aplicația. TOKNAV va recomanda un pachet de ofertă practic."
    },
    "Product Center": {
      ru: "Центр продуктов",
      ro: "Centru de produse"
    },
    "Application Scenarios": {
      ru: "Сценарии применения",
      ro: "Scenarii de aplicație"
    },
    "Key Features": {
      ru: "Ключевые особенности",
      ro: "Funcții cheie"
    },
    "Complete Specifications": {
      ru: "Полные характеристики",
      ro: "Specificații complete"
    },
    "Downloads": {
      ru: "Загрузки",
      ro: "Descărcări"
    },
    "Inquiry": {
      ru: "Запрос",
      ro: "Solicitare"
    },
    "Related Models": {
      ru: "Похожие модели",
      ro: "Modele conexe"
    },
    "Contact Sales": {
      ru: "Связаться с продажами",
      ro: "Contactați vânzările"
    },
    "Submit Inquiry": {
      ru: "Отправить запрос",
      ro: "Trimite solicitarea"
    },
    "GNSS Receiver Manufacturer · High-Precision Positioning Solutions": {
      ru: "Производитель GNSS-приемников · Высокоточные решения позиционирования",
      ro: "Producător de receptoare GNSS · Soluții de poziționare de înaltă precizie"
    }
  };

  function normalize(value) {
    const code = String(value || "").trim().toLowerCase().split("-")[0];
    return languages.some((language) => language.code === code) ? code : "en";
  }

  function getLanguage(code) {
    return languages.find((language) => language.code === code) || languages[0];
  }

  function translate(source, code) {
    if (code === "en") return source;
    return copy[source]?.[code] || source;
  }

  function createSwitcher(activeCode) {
    if (document.querySelector(".language-switcher")) return;
    const header = document.querySelector(".site-header");
    if (!header) return;

    const wrapper = document.createElement("div");
    wrapper.className = "language-switcher";
    wrapper.innerHTML = [
      "<svg aria-hidden=\"true\" viewBox=\"0 0 24 24\" width=\"17\" height=\"17\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M2 12h20\"></path><path d=\"M12 2a15.3 15.3 0 0 1 0 20\"></path><path d=\"M12 2a15.3 15.3 0 0 0 0 20\"></path></svg>",
      "<label class=\"language-switcher-label\" for=\"toknav-language-select\">Language</label>",
      "<select aria-label=\"Select language\" class=\"language-switcher-select\" id=\"toknav-language-select\"></select>"
    ].join("");

    const select = wrapper.querySelector("select");
    languages.forEach((language) => {
      const option = document.createElement("option");
      option.value = language.code;
      option.textContent = language.nativeName;
      select.appendChild(option);
    });
    select.value = activeCode;
    select.addEventListener("change", () => setLanguage(select.value));

    const cta = header.querySelector(".header-cta");
    header.insertBefore(wrapper, cta || null);
  }

  const searchPages = [
    { title: "GNSS Receivers", url: "/products/gnss-receivers/index.html", category: "Products", text: "RTK receivers, base stations and CORS receivers for surveying, mapping and construction." },
    { title: "GNSS Antennas", url: "/products/gnss-antennas/index.html", category: "Products", text: "Survey antennas, choke ring antennas and helix antennas for high-precision GNSS projects." },
    { title: "Rugged & GIS", url: "/products/rugged-gis/index.html", category: "Products", text: "Field controllers and portable GIS data collection terminals." },
    { title: "Precision Agriculture & Machine Control", url: "/products/precision-agriculture-machine-control/index.html", category: "Products", text: "Auto steering, land leveling and machine control guidance solutions." },
    { title: "GNSS Application Solutions", url: "/products/gnss-application-solutions/index.html", category: "Solutions", text: "Monitoring, CORS, marking robot, USV and SLAM solution packages." },
    { title: "TR10Pro Marking Robot", url: "/products/gnss-application-solutions/marking-robot.html", category: "Solutions", text: "Robotic sports field and line marking solution." },
    { title: "TBoat USV Series", url: "/products/gnss-application-solutions/tboat-series.html", category: "Solutions", text: "Unmanned surface vessel for hydrographic survey and water mapping." },
    { title: "TSR20 SLAM Scanner", url: "/products/gnss-application-solutions/tsr20.html", category: "Solutions", text: "Handheld SLAM mapping system for indoor and outdoor scanning." },
    { title: "T50Pro GNSS Receiver", url: "/products/gnss-receivers/t50pro.html", category: "GNSS Receiver", text: "Professional RTK rover for survey and construction teams." },
    { title: "T30Pro GNSS Receiver", url: "/products/gnss-receivers/t30pro.html", category: "GNSS Receiver", text: "High-performance multi-constellation RTK receiver." },
    { title: "T5Lite GNSS Receiver", url: "/products/gnss-receivers/t5lite.html", category: "GNSS Receiver", text: "Compact GNSS RTK receiver for cost-sensitive surveying projects." },
    { title: "Blog", url: "/blog.html", category: "Resources", text: "GNSS buying guides, application articles and SEO resources." },
    { title: "News", url: "/news.html", category: "Resources", text: "Surveying, GNSS, robotics and positioning industry news." },
    { title: "About TOKNAV", url: "/about.html", category: "Company", text: "Company profile, timeline, certificates and customer feedback." },
    { title: "Contact TOKNAV", url: "/contact.html", category: "Contact", text: "Company address, map, email and inquiry form." },
    { title: "Get a Quote", url: "/inquiry.html", category: "Inquiry", text: "Send GNSS product requirements and project details to TOKNAV." }
  ];

  function injectGlobalUtilitiesStyle() {
    if (document.getElementById("toknav-global-utilities-style")) return;
    const style = document.createElement("style");
    style.id = "toknav-global-utilities-style";
    style.textContent = `
      .toknav-site-search-button {
        width: 44px;
        height: 44px;
        display: inline-grid;
        place-items: center;
        border: 1px solid rgba(255,255,255,.34);
        border-radius: 999px;
        background: rgba(255,255,255,.12);
        color: currentColor;
        font-size: 20px;
        cursor: pointer;
        transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
      }
      .toknav-site-search-button:hover {
        transform: translateY(-1px) scale(1.04);
        box-shadow: 0 14px 28px rgba(7,57,143,.18);
        background: rgba(255,255,255,.2);
      }
      body:not(.toknav-home) .toknav-site-search-button {
        border-color: rgba(7,57,143,.18);
        color: #07398f;
        background: rgba(255,255,255,.88);
      }
      .toknav-site-search-button.is-floating {
        position: fixed;
        top: 18px;
        right: 18px;
        z-index: 10001;
        color: #07398f;
        background: rgba(255,255,255,.92);
        box-shadow: 0 16px 36px rgba(7,57,143,.18);
      }
      .toknav-search-overlay {
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: none;
        padding: 92px 20px 32px;
        background: rgba(4,14,32,.56);
        backdrop-filter: blur(12px);
      }
      .toknav-search-overlay.is-open { display: block; }
      .toknav-search-dialog {
        width: min(760px, 100%);
        margin: 0 auto;
        border: 1px solid rgba(188,211,245,.75);
        border-radius: 18px;
        background: rgba(255,255,255,.96);
        box-shadow: 0 32px 80px rgba(2,18,46,.28);
        overflow: hidden;
      }
      .toknav-search-head {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 18px 20px;
        border-bottom: 1px solid #e1ebf7;
      }
      .toknav-search-head input {
        flex: 1;
        min-width: 0;
        height: 46px;
        border: 0;
        outline: 0;
        color: #071325;
        background: transparent;
        font-size: 17px;
        font-weight: 700;
      }
      .toknav-search-close {
        width: 38px;
        height: 38px;
        border: 0;
        border-radius: 999px;
        background: #edf4ff;
        color: #07398f;
        cursor: pointer;
        font-size: 22px;
      }
      .toknav-search-results {
        max-height: min(60vh, 520px);
        overflow: auto;
        padding: 10px;
      }
      .toknav-search-result {
        display: grid;
        gap: 7px;
        padding: 15px 16px;
        border-radius: 12px;
        color: #071325;
        text-decoration: none;
      }
      .toknav-search-result:hover {
        background: #eef6ff;
      }
      .toknav-search-result small {
        color: #07398f;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: .08em;
      }
      .toknav-search-result strong {
        font-size: 18px;
      }
      .toknav-search-result span {
        color: #627188;
        font-size: 14px;
        line-height: 1.5;
      }
      .toknav-search-empty {
        padding: 24px 18px 28px;
        color: #627188;
        text-align: center;
      }
      .social-link-email svg {
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      @media (max-width: 760px) {
        .toknav-site-search-button { width: 40px; height: 40px; }
        .toknav-search-overlay { padding-top: 72px; }
        .toknav-search-head input { font-size: 15px; }
      }
    `;
    document.head.appendChild(style);
  }

  function createSearch() {
    const header = document.querySelector(".site-header");
    if (document.querySelector(".toknav-site-search-button")) return;
    injectGlobalUtilitiesStyle();

    const button = document.createElement("button");
    button.type = "button";
    button.className = "toknav-site-search-button";
    button.setAttribute("aria-label", "Search");
    button.textContent = "🔍";

    if (header) {
      const cta = header.querySelector(".header-cta");
      header.insertBefore(button, cta || null);
    } else {
      button.classList.add("is-floating");
      document.body.appendChild(button);
    }

    const overlay = document.createElement("div");
    overlay.className = "toknav-search-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Site search");
    overlay.innerHTML = [
      '<div class="toknav-search-dialog">',
      '<div class="toknav-search-head"><span aria-hidden="true">🔍</span><input type="search" placeholder="Search products, solutions, blogs..." aria-label="Search website"><button type="button" class="toknav-search-close" aria-label="Close search">×</button></div>',
      '<div class="toknav-search-results" aria-live="polite"></div>',
      '</div>'
    ].join("");
    document.body.appendChild(overlay);

    const input = overlay.querySelector("input");
    const results = overlay.querySelector(".toknav-search-results");
    const close = overlay.querySelector(".toknav-search-close");

    function render(query) {
      const needle = String(query || "").trim().toLowerCase();
      const items = (needle ? searchPages.filter((item) => [item.title, item.category, item.text].join(" ").toLowerCase().includes(needle)) : searchPages.slice(0, 8)).slice(0, 10);
      if (!items.length) {
        results.innerHTML = '<div class="toknav-search-empty">No matching page found. Try GNSS receiver, antenna, marking robot, USV or contact.</div>';
        return;
      }
      results.innerHTML = items.map((item) => `<a class="toknav-search-result" href="${item.url}"><small>${item.category}</small><strong>${item.title}</strong><span>${item.text}</span></a>`).join("");
    }

    function openSearch() {
      overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
      render(input.value);
      window.setTimeout(() => input.focus(), 30);
    }

    function closeSearch() {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
      button.focus();
    }

    button.addEventListener("click", openSearch);
    close.addEventListener("click", closeSearch);
    input.addEventListener("input", () => render(input.value));
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeSearch();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.classList.contains("is-open")) closeSearch();
    });
  }

  function ensureFooterEmailIcon() {
    injectGlobalUtilitiesStyle();
    document.querySelectorAll(".social-links").forEach((list) => {
      if (list.querySelector('a[href^="mailto:info@toknavgnss.md"]')) return;
      const link = document.createElement("a");
      link.className = "social-link social-link-email";
      link.href = "mailto:info@toknavgnss.md,sales@toknavgnss.md";
      link.setAttribute("aria-label", "Email TOKNAV");
      link.title = "Email";
      link.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m4 7 8 6 8-6"></path></svg>';
      list.appendChild(link);
    });
  }

  function translateExactTextNodes(code) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || ["SCRIPT", "STYLE", "TEXTAREA", "OPTION"].includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      const source = node.__toknavSourceText || node.nodeValue.trim();
      node.__toknavSourceText = source;
      const leading = node.nodeValue.match(/^\s*/)?.[0] || "";
      const trailing = node.nodeValue.match(/\s*$/)?.[0] || "";
      node.nodeValue = leading + translate(source, code) + trailing;
    });
  }

  function translateAttributes(code) {
    document.querySelectorAll("[placeholder]").forEach((element) => {
      const source = element.dataset.toknavPlaceholder || element.getAttribute("placeholder");
      element.dataset.toknavPlaceholder = source;
      element.setAttribute("placeholder", translate(source, code));
    });
    document.querySelectorAll("[title]").forEach((element) => {
      const source = element.dataset.toknavTitle || element.getAttribute("title");
      element.dataset.toknavTitle = source;
      element.setAttribute("title", translate(source, code));
    });
    document.querySelectorAll("[aria-label]").forEach((element) => {
      const source = element.dataset.toknavAria || element.getAttribute("aria-label");
      element.dataset.toknavAria = source;
      element.setAttribute("aria-label", translate(source, code));
    });
  }

  function applyLanguage(code) {
    const language = getLanguage(code);
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.dir;
    document.documentElement.dataset.locale = language.code;
    translateExactTextNodes(language.code);
    translateAttributes(language.code);
    document.querySelectorAll(".language-switcher-select").forEach((select) => {
      select.value = language.code;
      select.setAttribute("aria-label", translate("Language", language.code));
    });
    document.querySelectorAll(".language-switcher-label").forEach((label) => {
      label.textContent = translate("Language", language.code);
    });
  }

  function setLanguage(value) {
    const code = normalize(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // Ignore private browsing storage errors.
    }
    applyLanguage(code);
  }

  function bootToknavUtilities() {
    let activeCode = "en";
    try {
      activeCode = normalize(window.localStorage.getItem(STORAGE_KEY) || navigator.language);
    } catch {
      activeCode = normalize(navigator.language);
    }
    createSwitcher(activeCode);
    createSearch();
    ensureFooterEmailIcon();
    applyLanguage(activeCode);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootToknavUtilities);
  } else {
    bootToknavUtilities();
  }
})();

"use client";

import { useEffect, useMemo, useState } from "react";

type AdminLanguage = "en" | "ro";

const STORAGE_KEY = "toknav-admin-language";

const languages: Array<{ code: AdminLanguage; label: string }> = [
  { code: "en", label: "English" },
  { code: "ro", label: "Română" }
];

const roMessages: Record<string, string> = {
  "Language": "Limba",
  "Admin Login": "Autentificare admin",
  "Initialize Admin": "Inițializare admin",
  "Manage website content, SEO, products and media.": "Gestionați conținutul site-ului, SEO, produsele și media.",
  "No admin exists yet. This first login will create the administrator account.": "Nu există încă un administrator. Prima autentificare va crea contul de administrator.",
  "Email": "Email",
  "Password": "Parolă",
  "At least 10 characters": "Cel puțin 10 caractere",
  "Please wait...": "Vă rugăm așteptați...",
  "Login": "Autentificare",
  "Create Admin": "Creează admin",
  "Login failed.": "Autentificarea a eșuat.",
  "CMS / SEO Admin": "CMS / Admin SEO",
  "Dashboard": "Tablou de bord",
  "Pages": "Pagini",
  "Blog": "Blog",
  "Products": "Produse",
  "Media": "Media",
  "Settings": "Setări",
  "Logout": "Ieșire",
  "View Website": "Vezi site-ul",
  "Manage TOKNAV website content, SEO, products, blog posts and media from one place.": "Gestionați dintr-un singur loc conținutul site-ului TOKNAV, SEO, produsele, articolele de blog și media.",
  "Blog Posts": "Articole blog",
  "Edit Page Content": "Editează conținutul paginii",
  "Hero text, images, CTA blocks, SEO title and description.": "Text hero, imagini, blocuri CTA, titlu SEO și descriere.",
  "Add Blog": "Adaugă blog",
  "Create SEO posts with slug, cover image, tags and metadata.": "Creați articole SEO cu slug, imagine copertă, etichete și metadate.",
  "Add Product": "Adaugă produs",
  "Publish product pages with specs, gallery and inquiry content.": "Publicați pagini de produse cu specificații, galerie și conținut pentru solicitări.",
  "Upload Media": "Încarcă media",
  "Manage product photos, blog covers and SEO image alt text.": "Gestionați fotografii de produs, coperți de blog și text ALT pentru SEO.",
  "Syncing...": "Se sincronizează...",
  "Sync Current Website Content": "Sincronizează conținutul actual al site-ului",
  "Import all visible pages and product model data into the CMS for editing.": "Importă în CMS toate paginile vizibile și datele modelelor de produs pentru editare.",
  "Edit draft and published content without touching code.": "Editați conținutul ciornă și publicat fără să modificați codul.",
  "New Page": "Pagină nouă",
  "New Blog Post": "Articol blog nou",
  "New Product": "Produs nou",
  "Edit": "Editează",
  "Delete": "Șterge",
  "Delete this item?": "Ștergeți acest element?",
  "No content yet. Create the first item.": "Nu există conținut încă. Creați primul element.",
  "Media Library": "Bibliotecă media",
  "Upload images, edit alt text and copy URLs for pages, blogs and products.": "Încărcați imagini, editați textul ALT și copiați URL-uri pentru pagini, bloguri și produse.",
  "Image file": "Fișier imagine",
  "Alt text": "Text ALT",
  "Describe the image for SEO": "Descrieți imaginea pentru SEO",
  "Upload Image": "Încarcă imagine",
  "Copy URL": "Copiază URL",
  "Uploaded successfully.": "Încărcare reușită.",
  "Upload failed.": "Încărcarea a eșuat.",
  "Delete failed.": "Ștergerea a eșuat.",
  "Failed to load media.": "Nu s-a putut încărca media.",
  "Edit Blog Post": "Editează articolul de blog",
  "Create SEO posts with markdown-style body content.": "Creați articole SEO cu conținut în stil Markdown.",
  "Save Draft": "Salvează ciornă",
  "Publish": "Publică",
  "Title": "Titlu",
  "Slug": "Slug",
  "Category": "Categorie",
  "Author": "Autor",
  "Published at": "Publicat la",
  "Status": "Stare",
  "Draft": "Ciornă",
  "Published": "Publicat",
  "draft": "ciornă",
  "published": "publicat",
  "Summary": "Rezumat",
  "Body image": "Imagine în articol",
  "Choose a saved image and insert it into the Body at a custom position.": "Alegeți o imagine salvată și inserați-o în articol la poziția dorită.",
  "Choose image": "Alege imagine",
  "ALT text": "Text ALT",
  "Caption, optional": "Legendă, opțional",
  "Current cursor position": "Poziția curentă a cursorului",
  "Start of body": "Începutul articolului",
  "End of body": "Sfârșitul articolului",
  "After paragraph number": "După numărul paragrafului",
  "Paragraph number": "Număr paragraf",
  "Insert into Body": "Inserează în articol",
  "Body": "Conținut",
  "Tags, comma separated": "Etichete, separate prin virgulă",
  "SEO title": "Titlu SEO",
  "SEO description": "Descriere SEO",
  "Cover image": "Imagine copertă",
  "Choose media": "Alege media",
  "Open Preview": "Deschide previzualizare",
  "Saved successfully.": "Salvat cu succes.",
  "Save failed.": "Salvarea a eșuat.",
  "Failed to load blog.": "Nu s-a putut încărca blogul.",
  "Please choose an image before inserting it into the article body.": "Alegeți o imagine înainte de inserarea în articol.",
  "Edit Product": "Editează produs",
  "Manage product specs, gallery, category, SEO and inquiry landing content.": "Gestionați specificațiile, galeria, categoria, SEO și conținutul de solicitare al produsului.",
  "Name": "Nume",
  "Product type / kicker": "Tip produs / etichetă",
  "Entry RTK receiver": "Receptor RTK entry-level",
  "Price, optional": "Preț, opțional",
  "Leave blank for quote": "Lăsați gol pentru ofertă",
  "Featured": "Recomandat",
  "No": "Nu",
  "Yes": "Da",
  "Where does this appear on the website?": "Unde apare pe site?",
  "Main image, product type, summary, description, applications, highlights and specs are shown on the product category card and product detail page after publishing.": "Imaginea principală, tipul produsului, rezumatul, descrierea, aplicațiile, punctele forte și specificațiile apar pe cardul categoriei și pe pagina detaliată după publicare.",
  "Short summary shown on cards and hero": "Rezumat scurt afișat pe carduri și hero",
  "Detailed product page description": "Descriere detaliată pentru pagina produsului",
  "Applications, one per line": "Aplicații, câte una pe linie",
  "Highlights / selling points, one per line": "Puncte forte / argumente de vânzare, câte unul pe linie",
  "Specs / parameters": "Specificații / parametri",
  "Parameter name, e.g. Protection": "Nume parametru, ex. Protecție",
  "Parameter value, e.g. IP68": "Valoare parametru, ex. IP68",
  "Add parameter": "Adaugă parametru",
  "Remove blank rows": "Elimină rândurile goale",
  "Only rows with both parameter name and value will appear on the website. Blank rows are removed after publishing.": "Doar rândurile cu nume și valoare vor apărea pe site. Rândurile goale se elimină după publicare.",
  "SEO tags, comma separated": "Etichete SEO, separate prin virgulă",
  "Gallery URLs, one per line": "URL-uri galerie, câte unul pe linie",
  "Main image": "Imagine principală",
  "Open Media Library": "Deschide biblioteca media",
  "Failed to load product.": "Nu s-a putut încărca produsul.",
  "Edit Page": "Editează pagina",
  "Manage page SEO fields and editable content blocks.": "Gestionați câmpurile SEO ale paginii și blocurile editabile.",
  "Page title": "Titlul paginii",
  "Path": "Cale",
  "OG image": "Imagine OG",
  "Blocks": "Blocuri",
  "Add Block": "Adaugă bloc",
  "Up": "Sus",
  "Down": "Jos",
  "Remove": "Elimină",
  "Block label": "Etichetă bloc",
  "Preview": "Previzualizare",
  "Published pages can be viewed on the same path after save.": "Paginile publicate pot fi vizualizate pe aceeași cale după salvare.",
  "Choose media URL": "Alege URL media",
  "No image selected": "Nicio imagine selectată",
  "Untitled slot": "Slot fără titlu",
  "Link": "Link",
  "Icon key": "Cheie pictogramă",
  "Image": "Imagine",
  "Caption": "Legendă",
  "Gallery image": "Imagine galerie",
  "Hero banner image": "Imagine banner hero",
  "Content": "Conținut",
  "Images, one URL per line": "Imagini, câte un URL pe linie",
  "FAQ, one row per line: Question | Answer": "FAQ, câte un rând: Întrebare | Răspuns",
  "Metrics, one row per line: Value | Label | Icon key": "Metrici, câte un rând: Valoare | Etichetă | Cheie pictogramă",
  "Icon keys: global, building, team, support.": "Chei pictogramă: global, building, team, support.",
  "Customer photo": "Fotografie client",
  "Certificate": "Certificat",
  "Custom JSON": "JSON personalizat",
  "Failed to load page.": "Nu s-a putut încărca pagina.",
  "Manage global website SEO, branding, social links and admin password.": "Gestionați SEO global, brandingul, linkurile sociale și parola de admin.",
  "Save Settings": "Salvează setările",
  "Website name": "Numele site-ului",
  "Primary inquiry email": "Email principal pentru solicitări",
  "Secondary inquiry email": "Email secundar pentru solicitări",
  "Phone": "Telefon",
  "WhatsApp": "WhatsApp",
  "Logo URL": "URL logo",
  "Favicon URL": "URL favicon",
  "Default SEO title": "Titlu SEO implicit",
  "Default SEO description": "Descriere SEO implicită",
  "Footer text": "Text subsol",
  "Facebook": "Facebook",
  "Instagram": "Instagram",
  "LinkedIn": "LinkedIn",
  "YouTube": "YouTube",
  "Change Password": "Schimbă parola",
  "Use at least 10 characters. The password is stored as a hash.": "Folosiți cel puțin 10 caractere. Parola este stocată ca hash.",
  "New password": "Parolă nouă",
  "Update Password": "Actualizează parola",
  "Settings saved.": "Setările au fost salvate.",
  "Password updated.": "Parola a fost actualizată.",
  "Password update failed.": "Actualizarea parolei a eșuat.",
  "Failed to load settings.": "Nu s-au putut încărca setările.",
  "Failed to load dashboard.": "Nu s-a putut încărca tabloul de bord.",
  "Failed to load CMS data.": "Nu s-au putut încărca datele CMS.",
  "Sync failed.": "Sincronizarea a eșuat.",
  "Untitled": "Fără titlu",
  "GNSS Receivers": "Receptoare GNSS",
  "Rugged & GIS": "Rugged & GIS",
  "GNSS Antennas": "Antene GNSS",
  "Precision Agriculture & Machine Control": "Agricultură de precizie și control utilaje",
  "Accessories": "Accesorii",
  "GNSS Application Solutions": "Soluții de aplicații GNSS"
};

const enMessages = Object.fromEntries(Object.entries(roMessages).map(([english, romanian]) => [romanian, english]));

function normalizedLanguage(value: string | null): AdminLanguage {
  return value === "ro" ? "ro" : "en";
}

function translateLiteral(value: string, language: AdminLanguage) {
  return language === "ro" ? roMessages[value] || value : enMessages[value] || value;
}

function translateText(value: string, language: AdminLanguage) {
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed) return value;
  const translated = translateLiteral(trimmed, language);
  if (translated === trimmed) return value;
  return value.replace(value.trim(), translated);
}

function shouldSkipTextNode(node: Text) {
  const parent = node.parentElement;
  if (!parent) return true;
  return Boolean(parent.closest("script, style, noscript, svg, input, textarea"));
}

function applyAdminLanguage(language: AdminLanguage) {
  if (typeof document === "undefined") return;

  document.documentElement.lang = language;
  document.documentElement.dir = "ltr";
  document.documentElement.dataset.adminLocale = language;

  const root = document.querySelector(".admin-body") || document.body;
  const walker = document.createTreeWalker(root, window.NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node = walker.nextNode();

  while (node) {
    if (node.nodeType === window.Node.TEXT_NODE && !shouldSkipTextNode(node as Text)) {
      textNodes.push(node as Text);
    }
    node = walker.nextNode();
  }

  for (const textNode of textNodes) {
    textNode.nodeValue = translateText(textNode.nodeValue || "", language);
  }

  root.querySelectorAll<HTMLElement>("[placeholder], [aria-label], [title]").forEach((element) => {
    ["placeholder", "aria-label", "title"].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (!value) return;
      element.setAttribute(attribute, translateLiteral(value, language));
    });
  });
}

export default function AdminLanguageSwitcher() {
  const [language, setLanguage] = useState<AdminLanguage>("en");
  const label = useMemo(() => (language === "ro" ? "Limba" : "Language"), [language]);

  useEffect(() => {
    const saved = normalizedLanguage(window.localStorage.getItem(STORAGE_KEY));
    setLanguage(saved);
  }, []);

  useEffect(() => {
    let isApplying = false;

    function run() {
      if (isApplying) return;
      isApplying = true;
      applyAdminLanguage(language);
      window.localStorage.setItem(STORAGE_KEY, language);
      window.setTimeout(() => {
        isApplying = false;
      }, 0);
    }

    run();
    const observer = new MutationObserver(run);
    const root = document.querySelector(".admin-body") || document.body;
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [language]);

  return (
    <label className="admin-language-switcher">
      <span>{label}</span>
      <select value={language} onChange={(event) => setLanguage(normalizedLanguage(event.target.value))} aria-label={label}>
        {languages.map((item) => (
          <option value={item.code} key={item.code}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}

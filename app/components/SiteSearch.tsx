"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

export type SearchItem = {
  title: string;
  url: string;
  category: string;
  text: string;
};

export default function SiteSearch({ items }: { items: SearchItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const source = needle
      ? items.filter((item) =>
          [item.title, item.category, item.text].join(" ").toLowerCase().includes(needle)
        )
      : items;

    return source.slice(0, 10);
  }, [items, query]);

  return (
    <div className="site-search">
      <button
        aria-label="Search TOKNAV website"
        className="site-search-button"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <Search size={19} />
      </button>

      {isOpen ? (
        <div className="site-search-overlay" role="dialog" aria-modal="true" aria-label="Site search">
          <div className="site-search-panel">
            <div className="site-search-head">
              <Search size={21} />
              <input
                autoFocus
                placeholder="Search products, solutions, blogs..."
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button aria-label="Close search" onClick={() => setIsOpen(false)} type="button">
                <X size={20} />
              </button>
            </div>

            <div className="site-search-results">
              {results.length ? (
                results.map((item) => (
                  <a href={item.url} key={`${item.category}-${item.url}`} onClick={() => setIsOpen(false)}>
                    <span>{item.category}</span>
                    <strong>{item.title}</strong>
                    <small>{item.text}</small>
                  </a>
                ))
              ) : (
                <p>No matching page found. Try GNSS receiver, antenna, marking robot, USV or contact.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

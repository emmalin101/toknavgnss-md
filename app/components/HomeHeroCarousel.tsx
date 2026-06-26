"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type HeroCarouselItem = {
  title?: string;
  href?: string;
  image?: string;
};

export default function HomeHeroCarousel({ items }: { items: HeroCarouselItem[] }) {
  const slides = useMemo(
    () => items.filter((item) => item.image && item.title),
    [items]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  if (!slides.length) return null;

  const active = slides[activeIndex] || slides[0];
  const goTo = (index: number) => setActiveIndex((index + slides.length) % slides.length);

  return (
    <div className="home-hero-carousel-wrap">
      <div className="home-hero-carousel" aria-live="polite">
        <a className="home-hero-slide is-active" href={active.href || "#products"}>
          <img src={active.image} alt={active.title || "TOKNAV product"} />
          <span>
            <strong>{active.title}</strong>
            <small>View product details</small>
          </span>
        </a>
        <button className="home-hero-carousel-arrow prev" type="button" onClick={() => goTo(activeIndex - 1)} aria-label="Previous featured product">
          <ChevronLeft size={28} />
        </button>
        <button className="home-hero-carousel-arrow next" type="button" onClick={() => goTo(activeIndex + 1)} aria-label="Next featured product">
          <ChevronRight size={28} />
        </button>
      </div>
      <div className="home-hero-carousel-dots" aria-label="Choose featured product">
        {slides.map((item, index) => (
          <button
            className={index === activeIndex ? "active" : ""}
            key={`${item.title || item.image}-dot`}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Show ${item.title}`}
            aria-pressed={index === activeIndex}
          />
        ))}
      </div>
    </div>
  );
}

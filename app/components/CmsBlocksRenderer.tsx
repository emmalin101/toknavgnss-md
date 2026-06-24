import type { CmsBlock } from "../lib/cms/types";

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function list(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())) : [];
}

export default function CmsBlocksRenderer({ blocks }: { blocks: CmsBlock[] }) {
  const visibleBlocks = blocks.filter((block) => block.type !== "hero" && block.type !== "custom");
  if (!visibleBlocks.length) return null;

  return (
    <section className="cms-page-blocks">
      {visibleBlocks.map((block) => {
        if (block.type === "rich_text") {
          return (
            <article className="cms-rich-text" key={block.id}>
              {text(block.data.content)
                .split(/\n{2,}/)
                .filter(Boolean)
                .map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
            </article>
          );
        }

        if (block.type === "image") {
          return (
            <figure className="cms-image-block" key={block.id}>
              <img src={text(block.data.image)} alt={text(block.data.alt) || text(block.data.caption)} />
              {text(block.data.caption) ? <figcaption>{text(block.data.caption)}</figcaption> : null}
            </figure>
          );
        }

        if (block.type === "gallery") {
          return (
            <div className="cms-gallery-block" key={block.id}>
              {list(block.data.images).map((image) => (
                <img src={image} alt={block.title || "TOKNAV gallery image"} key={image} />
              ))}
            </div>
          );
        }

        if (block.type === "cta") {
          return (
            <article className="cms-cta-block" key={block.id}>
              <div>
                <h2>{text(block.data.title)}</h2>
                <p>{text(block.data.description)}</p>
              </div>
              {text(block.data.buttonText) ? <a href={text(block.data.buttonLink) || "/inquiry"}>{text(block.data.buttonText)}</a> : null}
            </article>
          );
        }

        if (block.type === "faq") {
          const items = Array.isArray(block.data.items) ? (block.data.items as Array<{ question?: string; answer?: string }>) : [];
          return (
            <div className="cms-faq-block" key={block.id}>
              {block.title ? <h2>{block.title}</h2> : null}
              {items.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          );
        }

        return null;
      })}
    </section>
  );
}

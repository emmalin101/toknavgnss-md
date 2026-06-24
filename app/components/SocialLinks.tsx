import { socialLinks, type SocialPlatform } from "../lib/socialLinks";

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === "Facebook") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M14.45 8.58V6.9c0-.72.18-1.08 1.16-1.08h1.44V3.02h-2.3c-2.76 0-3.73 1.37-3.73 3.68v1.88H8.95v2.88h2.07v8.52h3.43v-8.52h2.3l.31-2.88h-2.61Z" />
      </svg>
    );
  }

  if (platform === "Instagram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M7.8 3h8.4A4.8 4.8 0 0 1 21 7.8v8.4a4.8 4.8 0 0 1-4.8 4.8H7.8A4.8 4.8 0 0 1 3 16.2V7.8A4.8 4.8 0 0 1 7.8 3Zm0 2.1a2.7 2.7 0 0 0-2.7 2.7v8.4a2.7 2.7 0 0 0 2.7 2.7h8.4a2.7 2.7 0 0 0 2.7-2.7V7.8a2.7 2.7 0 0 0-2.7-2.7H7.8Zm4.2 3.1a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6Zm0 2.1a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Zm4.15-2.45a.95.95 0 1 1 0-1.9.95.95 0 0 1 0 1.9Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M6.65 8.9H3.5v11.1h3.15V8.9ZM5.08 4a1.83 1.83 0 1 0 0 3.66A1.83 1.83 0 0 0 5.08 4Zm14.92 9.85c0-3.02-1.61-4.43-3.76-4.43a3.25 3.25 0 0 0-2.94 1.62V8.9h-3.02v11.1h3.15v-5.49c0-1.45.27-2.86 2.08-2.86 1.78 0 1.81 1.67 1.81 2.95v5.4H20v-6.15Z" />
    </svg>
  );
}

export default function SocialLinks() {
  return (
    <div className="social-links" aria-label="TOKNAV social media links">
      {socialLinks.map((item) => (
        <a
          className={`social-link social-link-${item.platform.toLowerCase()}`}
          href={item.url}
          key={item.platform}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.ariaLabel}
          title={item.platform}
        >
          <SocialIcon platform={item.platform} />
        </a>
      ))}
    </div>
  );
}

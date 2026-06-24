const GITHUB_PUBLIC_BASE = "https://raw.githubusercontent.com/emmalin101/toknavgnss-md/main/public";

export function resolveDownloadHref(href: string) {
  if (href.startsWith("/assets/downloads/")) {
    return `${GITHUB_PUBLIC_BASE}${href}`;
  }
  return href;
}

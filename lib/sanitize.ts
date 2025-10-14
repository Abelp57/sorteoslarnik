export function normalizeImageUrl(input?: string | null): string | null {
  if (!input) return null;
  let s = String(input).trim();

  // https:/  -> https://   |   http:/ -> http://
  s = s.replace(/^https:\//i, "https://").replace(/^http:\//i, "http://");

  // [img]...[/img]
  const tag = s.match(/\[img\](.*?)\[\/img\]/i);
  if (tag?.[1]) s = tag[1].trim();

  // [url=...]...[/url] y restos de BBCode
  s = s.replace(/^\[url=.*?\]/i, "").replace(/\[\/url\]$/i, "");
  s = s.replace(/\[\/?img\]/gi, "").replace(/\[\/?url.*?\]/gi, "").trim();

  // basura al final
  s = s.replace(/[)\s'"]+$/, "");

  try {
    const u = new URL(s);
    return `${u.protocol}//${u.host}${u.pathname}${u.search}${u.hash}`;
  } catch {
    return null;
  }
}
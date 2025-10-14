export function cleanImageUrl(input?: string | null) {
  if (!input) return "";
  let s = String(input).trim();
  s = s.replace(/^https:\//i, "https://").replace(/^http:\//i, "http://");
  const tag = s.match(/\[img\](.*?)\[\/img\]/i);
  if (tag?.[1]) s = tag[1].trim();
  s = s.replace(/^\[url=.*?\]/i, "").replace(/\[\/url\]$/i, "");
  s = s.replace(/\[\/?img\]/gi, "").replace(/\[\/?url.*?\]/gi, "").trim();
  s = s.replace(/[)\s'"]+$/, "");
  return s;
}
export function fmt(date?: Date | string | null) {
  if (!date) return null;
  const d = new Date(date as any);
  if (isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "long", timeStyle: "short" }).format(d);
}
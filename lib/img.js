export function cleanImageUrl(input) {
  if (!input) return "";
  let s = String(input).trim();
  s = s.replace(/^https:\//i, "https://").replace(/^http:\//i, "http://");  // https:/ -> https://
  const tag = s.match(/\[img\](.*?)\[\/img\]/i);
  if (tag && tag[1]) s = tag[1].trim();
  s = s.replace(/^\[url=.*?\]/i, "").replace(/\[\/url\]$/i, "");
  s = s.replace(/\[\/?img\]/gi, "").replace(/\[\/?url.*?\]/gi, "").trim();
  s = s.replace(/[)\s'"]+$/, "");
  return s;
}

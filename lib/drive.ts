export function fromDrive(url?: string | null): string {
  if (!url) return "";
  try {
    // Soporta: /file/d/ID/view ...  o  ?id=ID  o  open?id=ID
    const m = url.match(/\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
    if (!m) return url;
    const id = m[1];
    return `https://drive.google.com/uc?export=view&id=${id}`;
  } catch {
    return url;
  }
}

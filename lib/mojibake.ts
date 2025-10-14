// lib/mojibake.ts (ASCII puro)
export function looksMojibake(s: string): boolean {
  if (!s) return false;
  return /[\ÃƒÆ’\\]/.test(s); // ÃƒÆ’Ã†€™ ÃƒÆ’‚¬Å¡ ÃƒÆ’¢
}

export function decodeMojibake(s: string): string {
  if (!s) return s;
  try {
    // Reinterpreta como latin1 y decodifica a utf8
    const bytes = new TextEncoder().encode(s);               // utf8 bytes
    let latin1 = "";
    for (let i = 0; i < bytes.length; i++) latin1 += String.fromCharCode(bytes[i]);
    const fixed = decodeURIComponent(escape(latin1));        // latin1 -> utf8
    // Normaliza algunos comunes por si quedaron
    return fixed
      .replace(/\ /g, " ")
      .replace(/Ver mÃƒ¡s\b/gi, "Ver mÃƒÆ’¡s")
      .replace(/\bAun\b/gi, "AÃƒÆ’ºn")
      .replace(/proxima/gi, "prÃƒÆ’³xima");
  } catch {
    return s;
  }
}

export function fixText(s: string): string {
  return looksMojibake(s) ? decodeMojibake(s) : s;
}

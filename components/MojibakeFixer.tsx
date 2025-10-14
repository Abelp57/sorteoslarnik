"use client";
import { useEffect } from "react";

function looksMojibake(s: string) { return /[\ÃƒÆ’\\]/.test(s); } // ÃƒÆ’Ã†€™ ÃƒÆ’‚¬Å¡ ÃƒÆ’¢
function latin1ToUtf8(s: string) { try { return decodeURIComponent(escape(s)); } catch { return s; } }

function normalizeSpanish(s: string) {
  return s
    .replace(/\bAun\b/g, "A\\Ãƒºn")
    .replace(/\bAUN\b/g, "A\\ÃƒÅ¡N")
    .replace(/\bmas\b/g, "m\\Ãƒ¡s")
    .replace(/\bMas\b/g, "M\\Ãƒ¡s")
    .replace(/Ver\\s+mas\\b/gi, (m) => (m[0] === "V" ? "Ver m\\Ãƒ¡s" : "ver m\\Ãƒ¡s"))
    .replace(/Ver\\s+m\\?s\\b/gi, "Ver m\\Ãƒ¡s")
    .replace(/\\bproxima\\b/gi, (m) => (m[0] === "p" ? "pr\\Ãƒ³xima" : "Pr\\Ãƒ³xima"));
}

function fixText(s: string) {
  if (!s) return s;
  let t = s;
  if (looksMojibake(t)) t = latin1ToUtf8(t);
  t = normalizeSpanish(t);
  return t;
}

export default function MojibakeFixer() {
  useEffect(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    let n: Node | null;
    while ((n = walker.nextNode())) nodes.push(n as Text);
    for (const node of nodes) {
      const before = node.nodeValue || "";
      const after = fixText(before);
      if (after !== before) node.nodeValue = after;
    }
  }, []);
  return null;
}
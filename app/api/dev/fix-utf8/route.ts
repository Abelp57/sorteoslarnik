// app/api/dev/fix-utf8/route.ts
// RUN ONCE: abre /api/dev/fix-utf8 en tu navegador con el proyecto levantado.
// Corrige mojibake (ÃƒÆ’Ã†€™, ÃƒÆ’‚¬Å¡, ÃƒÆ’¢) en TODOS los modelos/columnas string que existan.
// TambiÃƒÆ’©n normaliza textos comunes: "Aun"->"AÃƒÆ’ºn", "Ver mÃƒ¡s"->"Ver mÃƒÆ’¡s", "proxima"->"prÃƒÆ’³xima".
// Luego BORRA este archivo.

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function looksMojibake(s: string) {
  return /[\ÃƒÆ’\\]/.test(s); // ÃƒÆ’Ã†€™ ÃƒÆ’‚¬Å¡ ÃƒÆ’¢
}

// latin1 -> utf8 sin meter acentos literales:
function latin1ToUtf8(s: string) {
  try {
    // Buffer.from(s, 'latin1') no existe en navegador, pero aquÃƒÆ’­ estamos server-side (Node).
    return Buffer.from(s, "latin1").toString("utf8");
  } catch {
    return s;
  }
}

function normalizeSpanish(s: string) {
  if (!s) return s;
  let t = s;

  // "Aun" -> "AÃƒÆ’ºn"
  t = t.replace(/\bAun\b/g, "A\Ãƒºn");
  t = t.replace(/\bAUN\b/g, "A\ÃƒÅ¡N");
  t = t.replace(/\bAun\b/gi, (m) => m[0] === "A" ? "A\Ãƒºn" : "a\Ãƒºn");

  // "mas" -> "mÃƒÆ’¡s" (sin tocar palabras mÃƒÆ’¡s largas)
  t = t.replace(/\bmas\b/g, "m\Ãƒ¡s");
  t = t.replace(/\bMas\b/g, "M\Ãƒ¡s");

  // "Ver mÃƒ¡s" variantes
  t = t.replace(/Ver\s+mas\b/gi, (m) =>
    m[0] === "V" ? "Ver m\Ãƒ¡s" : "ver m\Ãƒ¡s"
  );
  t = t.replace(/Ver\s+m\?s\b/gi, "Ver m\Ãƒ¡s");

  // "proxima" -> "prÃƒÆ’³xima"
  t = t.replace(/\bproxima\b/gi, (m) =>
    m[0] === "p" ? "pr\Ãƒ³xima" : "Pr\Ãƒ³xima"
  );

  // "Ver todas" -> "Ver todas las rifas" (si no tiene ya "las rifas")
  t = t.replace(/Ver\s+todas(?!\s+las\s+rifas)/gi, "Ver todas las rifas");

  // Asegura puntos/flechas rotas comunes
  t = t.replace(/->/g, "\€ €™"); // -> a flecha ‚¬ ‚¬„¢
  return t;
}

function fixString(s: unknown): unknown {
  if (typeof s !== "string" || s.length === 0) return s;
  let out = s;
  if (looksMojibake(out)) out = latin1ToUtf8(out);
  out = normalizeSpanish(out);
  return out;
}

// Lista de modelos probables. Si alguno no existe en tu esquema, se ignora con try/catch.
const CANDIDATE_MODELS = [
  "raffle", "winner", "sponsor",
  "hero", "homeHero", "marketing", "flyer",
  "faq", "setting", "config",
  "category", "product",
];

async function fixModel(modelName: string) {
  // @ts-ignore €š¬‚¬Å“ acceso dinÃƒÆ’¡mico
  const model = prisma[modelName];
  if (!model || typeof model.findMany !== "function") return { model: modelName, skipped: true };

  const rows = await model.findMany({ take: 10000 }); // suficiente para panel/admin
  let changed = 0;

  for (const row of rows) {
    const updateData: Record<string, any> = {};
    let touched = false;

    for (const [k, v] of Object.entries(row)) {
      if (typeof v === "string") {
        const fixed = fixString(v) as string;
        if (fixed !== v) {
          updateData[k] = fixed;
          touched = true;
        }
      } else if (v && typeof v === "object" && !Array.isArray(v)) {
        // Si hay JSON con textos dentro (p.ej. metadata), intenta mapear strings
        const jsonFixed: any = {};
        let jsonTouched = false;
        for (const [jk, jv] of Object.entries(v as any)) {
          if (typeof jv === "string") {
            const fj = fixString(jv) as string;
            jsonFixed[jk] = fj;
            jsonTouched ||= (fj !== jv);
          } else {
            jsonFixed[jk] = jv;
          }
        }
        if (jsonTouched) {
          updateData[k] = jsonFixed;
          touched = true;
        }
      }
    }

    if (touched) {
      // @ts-ignore
      await model.update({ where: { id: (row as any).id }, data: updateData });
      changed++;
    }
  }

  return { model: modelName, rows: rows.length, changed };
}

export async function GET() {
  const results: any[] = [];
  for (const m of CANDIDATE_MODELS) {
    try {
      results.push(await fixModel(m));
    } catch (e: any) {
      results.push({ model: m, error: e?.message || String(e) });
    }
  }
  return NextResponse.json({ ok: true, results }, { status: 200 });
}

"use client";
import { useEffect } from "react";

/**
 * Oculta SOLO el hero legacy buscando textos característicos.
 * No usa selectores globales para no tocar el hero nuevo ni otras secciones.
 */
export default function HideLegacyHero(){
  useEffect(() => {
    try{
      const candidates = Array.from(document.querySelectorAll("section,div"));
      for(const el of candidates){
        const t = (el.textContent || "");
        if(
          t.includes("Sorteos Larnik") &&
          t.includes("Pagos seguros") &&
          t.includes("Premios reales")
        ){
          (el as HTMLElement).style.display = "none";
          break;
        }
      }
    }catch{}
  },[]);
  return null;
}
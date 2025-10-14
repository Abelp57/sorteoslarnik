'use client';
import React, { useEffect } from 'react';
import { cleanImageUrl } from '@/lib/img';
export default function GlobalImageGuard({ fallback = '/brand/favicon.png' }: { fallback?: string }) {
  useEffect(() => {
    const seen = new WeakSet();
    const fix = (img: HTMLImageElement) => {
      if (seen.has(img)) return; seen.add(img);
      try{
        const raw = img.getAttribute('data-src') ?? img.getAttribute('src') ?? '';
        const cleaned = cleanImageUrl(raw);
        if (cleaned && img.src !== cleaned) img.src = cleaned;
        if (!img.getAttribute('loading')) img.setAttribute('loading','lazy');
        if (!img.getAttribute('decoding')) img.setAttribute('decoding','async');
        img.addEventListener('error', () => { if (img.src !== fallback) img.src = fallback; }, { once:false });
      }catch{}
    };
    document.querySelectorAll('img').forEach((n)=>fix(n as HTMLImageElement));
    const mo = new MutationObserver((muts) => {
      muts.forEach((m)=>{
        if (m.type === 'childList'){
          m.addedNodes.forEach((n)=>{
            if (n instanceof HTMLImageElement) fix(n);
            else if (n instanceof Element) n.querySelectorAll('img').forEach((im)=>fix(im as HTMLImageElement));
          });
        } else if (m.type === 'attributes' && m.target instanceof HTMLImageElement){
          fix(m.target as HTMLImageElement);
        }
      });
    });
    mo.observe(document.documentElement, { subtree:true, childList:true, attributes:true, attributeFilter:['src','data-src'] });
    return () => mo.disconnect();
  }, [fallback]);
  return null;
}
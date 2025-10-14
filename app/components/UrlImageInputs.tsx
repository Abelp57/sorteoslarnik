"use client";
import React from "react";

export default function UrlImageInputs({
  initialMain = "",
  initialGallery = [],
}: {
  initialMain?: string;
  initialGallery?: string[];
}) {
  const [main, setMain] = React.useState(initialMain);
  const [galleryText, setGalleryText] = React.useState(
    (initialGallery ?? []).join("\n")
  );

  const gallery = React.useMemo(
    () =>
      galleryText
        .split(/[\n,;]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 8),
    [galleryText]
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">
          URL de imagen principal (portada/miniatura)
        </label>
        <input
          type="url"
          placeholder="https://"
          value={main}
          onChange={(e) => setMain(e.target.value)}
          className="mt-1 w-full rounded-xl border px-3 py-2"
        />
        {main && (
          <img
            src={main}
            alt="Portada"
            className="mt-2 h-32 rounded-xl border object-cover"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">
          Galería del producto <span className="opacity-70">(una URL por línea, máx. 8)</span>
        </label>
        <textarea
          rows={3}
          placeholder={"https://...\nhttps://..."}
          value={galleryText}
          onChange={(e) => setGalleryText(e.target.value)}
          className="mt-1 w-full rounded-xl border px-3 py-2"
        />
        {!!gallery.length && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {gallery.map((g) => (
              <img
                key={g}
                src={g}
                className="h-20 w-full rounded-lg border object-cover"
              />
            ))}
          </div>
        )}
      </div>

      {/* Campos que enviará el form a la API */}
      <input type="hidden" name="mainImage" value={main} />
      <input type="hidden" name="galleryImages" value={JSON.stringify(gallery)} />

      <p className="text-xs opacity-70">
        Tip: si no tienes hosting de imágenes, sube a{" "}
        <a href="https://postimages.org/" target="_blank" className="underline">
          postimages.org
        </a>{" "}
        y pega aquí los enlaces directos.
      </p>
    </div>
  );
}


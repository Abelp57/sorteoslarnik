"use client";

import React from "react";

type Props = {
  label: string;
  name: string;
  multiple?: boolean;
  max?: number;
  initialUrl?: string;
  initialUrls?: string[];
};

export default function CloudinaryUploader({ label, name, multiple, max = 8, initialUrl, initialUrls }: Props) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
  const [uploading, setUploading] = React.useState(false);
  const [urls, setUrls] = React.useState<string[]>([]);

  React.useEffect(() => {
    const init = multiple ? (initialUrls ?? []) : (initialUrl ? [initialUrl] : []);
    if (init.length && urls.length === 0) setUrls(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files || !cloud || !preset) return;
    setUploading(true);
    const next: string[] = [];
    for (let i = 0; i < files.length; i++) {
      if (!multiple && i > 0) break;
      if (multiple && next.length + urls.length >= max) break;

      const fd = new FormData();
      fd.append("file", files[i]);
      fd.append("upload_preset", preset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/upload`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data?.secure_url) next.push(data.secure_url as string);
    }
    setUrls(prev => [...prev, ...next]);
    setUploading(false);
  }

  function removeAt(idx: number) {
    setUrls(prev => prev.filter((_, i) => i !== idx));
  }

  const hiddenValue = multiple ? JSON.stringify(urls) : (urls[0] ?? "");

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <input
        type="file" accept="image/*" multiple={!!multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="block w-full text-sm file:mr-3 file:px-3 file:py-2 file:rounded-xl file:border file:bg-transparent file:cursor-pointer"
      />
      {uploading && <p className="text-xs opacity-70">Subiendo...</p>}
      {!!urls.length && (
        <div className="flex flex-wrap gap-2">
          {urls.map((u, i) => (
            <div key={u} className="relative">
              <img src={u} alt={`img-${i}`} className="h-20 w-20 object-cover rounded-xl border" />
              <button type="button" onClick={() => removeAt(i)} className="absolute -top-2 -right-2 bg-black/70 text-white text-xs rounded-full px-2 py-1" aria-label="Eliminar">�?"???</button>
            </div>
          ))}
        </div>
      )}
      <input type="hidden" name={name} value={hiddenValue} />
    </div>
  );
}



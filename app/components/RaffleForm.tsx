import UrlImageInputs from "./UrlImageInputs";
import CloudinaryUploader from "./CloudinaryUploader";

export type RaffleValues = {
  title?: string;
  category?: string;
  price?: number;
  digits?: number;
  total?: number;
  startNumber?: number;
  status?: string;
  drawAt?: string | null;
  drawMethod?: string | null;
  drawPlatform?: string | null;
  mainImage?: string | null;
  galleryImages?: string[];
  shortDescription?: string | null;
  description?: string | null; // ← NUEVO
};

const hasCloudinary =
  !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
  !!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function RaffleForm({
  action,
  values = {},
}: {
  action: string;
  values?: RaffleValues;
}) {
  const toDatetimeLocalValue = (dateStr?: string | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr as any);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <form action={action} method="POST" className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Título</label>
          <input
            name="title"
            defaultValue={values.title ?? ""}
            required
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Precio</label>
          <input
            type="number"
            name="price"
            min="1"
            defaultValue={values.price ?? 0}
            required
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Dígitos</label>
          <input
            type="number"
            name="digits"
            min="1"
            defaultValue={values.digits ?? 4}
            required
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Total de boletos</label>
          <input
            type="number"
            name="total"
            min="1"
            defaultValue={values.total ?? 1000}
            required
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Número inicial</label>
          <input
            type="number"
            name="startNumber"
            min="0"
            defaultValue={values.startNumber ?? 1}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Estado</label>
          <select
            name="status"
            defaultValue={values.status ?? "DRAFT"}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          >
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Categoría</label>
          <input
            name="category"
            defaultValue={values.category ?? "GENERAL"}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
          <p className="text-xs opacity-60 mt-1">
            Si la dejas vacía, se guardará como GENERAL.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Fecha y hora del sorteo</label>
          <input
            type="datetime-local"
            name="drawAt"
            className="mt-1 w-full rounded-xl border px-3 py-2"
            defaultValue={toDatetimeLocalValue(values.drawAt ?? null)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Método</label>
          <select
            name="drawMethod"
            defaultValue={values.drawMethod ?? "LIVE_STREAM"}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          >
            <option value="LIVE_STREAM">Transmisión en vivo</option>
            <option value="LOTERIA_NACIONAL">Lotería Nacional</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Plataforma / Medio</label>
          <input
            type="text"
            name="drawPlatform"
            defaultValue={values.drawPlatform ?? ""}
            placeholder='Facebook / Instagram / YouTube / "No aplica"'
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </div>
      </div>

      <hr className="my-6" />

      {hasCloudinary ? (
        <>
          <CloudinaryUploader
            label="Imagen principal (portada/miniatura)"
            name="mainImage"
            initialUrl={values.mainImage ?? undefined}
          />
          <div className="mt-4">
            <CloudinaryUploader
              label="Galería del producto (hasta 8)"
              name="galleryImages"
              multiple
              max={8}
              initialUrls={values.galleryImages ?? []}
            />
          </div>
        </>
      ) : (
        <>
          <div className="rounded-xl border px-3 py-2 text-xs opacity-80">
            Modo sin Cloudinary: pega las <b>URLs</b> de tus imágenes abajo.
          </div>
          <UrlImageInputs
            initialMain={values.mainImage ?? undefined}
            initialGallery={values.galleryImages ?? []}
          />
        </>
      )}

      <hr className="my-6" />

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Descripción breve</label>
          <textarea
            name="shortDescription"
            rows={4}
            placeholder="Resumen atractivo del producto"
            className="mt-1 w-full rounded-xl border px-3 py-2"
            maxLength={300}
            defaultValue={values.shortDescription ?? ""}
          />
          <p className="text-xs opacity-70 mt-1">Máx. 300 caracteres.</p>
        </div>

        {/* ← Sustituimos “Características” por descripción larga */}
        <div>
          <label className="block text-sm font-medium">Descripción del premio</label>
          <p className="text-xs opacity-70 mt-1">
            Texto libre y detallado. Se muestra en la página pública bajo “Descripción”.
          </p>
          <textarea
            name="description"
            rows={8}
            placeholder={`Ejemplo:
iPhone 17 Pro Max 1TB con pantalla Super Retina XDR de 6.9", 120 Hz, Ceramic Shield 2 y chip A19 Pro. Cámara principal de 48 MP con zoom óptico hasta 8×, video 4K/ProRes y cámara frontal de 18 MP con Center Stage. Batería de larga duración y resistencia IP68.`}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            defaultValue={values.description ?? ""}
          />
          <p className="text-xs opacity-70 mt-1">Tip: usa saltos de línea para separar párrafos.</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <a href="/admin/rifas" className="px-4 py-2 rounded-xl border">Cancelar</a>
        <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white">
          Guardar
        </button>
      </div>
    </form>
  );
}

export const dynamic = "force-dynamic";

import AdminWinnersClient from "./AdminWinnersClient";

export default function WinnersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Ganadores</h1>
        <a href="/admin/rifas" className="rounded-xl border px-3 py-2">Volver</a>
      </div>
      <AdminWinnersClient />
    </div>
  );
}

'use client';

import { useState, useTransition } from 'react';

export default function DeleteRaffleButton({
  id,
  onDeleted,
  className,
}: {
  id: string;
  onDeleted?: () => void;
  className?: string;
}) {
  const [confirm, setConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () =>
    startTransition(async () => {
      const res = await fetch(`/api/raffles/${id}/delete`, { method: 'POST' });
      if (res.ok) {
        onDeleted?.();
        window.location.href = '/admin/rifas';
      } else {
        const j = await res.json().catch(() => ({ error: 'Delete failed' }));
        alert(j.error || 'Delete failed');
      }
    });

  if (!confirm) {
    return (
      <button
        type="button"
        className={className || 'rounded-xl border px-3 py-2 text-sm text-red-600'}
        onClick={() => setConfirm(true)}
      >
        Eliminar
      </button>
    );
  }

  return (
    <button
      type="button"
      className={className || 'rounded-xl border px-3 py-2 text-sm text-white bg-red-600'}
      disabled={isPending}
      onClick={handleDelete}
    >
      {isPending ? 'Eliminando…' : 'Confirmar eliminación'}
    </button>
  );
}

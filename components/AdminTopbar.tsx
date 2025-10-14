'use client'

import Link from 'next/link'

export default function AdminTopbar() {
  return (
    <header className="admin-topbar">
      <div className="flex items-center gap-2">
        <span className="text-sm text-white/70">Admin</span>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/" className="btn btn-ghost btn-sm">Ver sitio</Link>
      </div>
    </header>
  )
}



import Link from 'next/link';
import type { ReactNode } from 'react'
import BrandLogo from '../../components/BrandLogo'
import AdminTopbar from '../../components/AdminTopbar'
import './admin.css'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin min-h-screen text-white">
      <div className="admin-shell">
        <aside className="admin-aside">
          <div className="px-4 py-4 flex items-center gap-3">
            <BrandLogo />
          </div>

          <nav className="px-3 py-2 space-y-2">
      <li><Link href="/admin/hero">Hero</Link></li>
            
<Link href="/admin" className="admin-navlink">Panel principal</Link>

            <details className="admin-submenu" open>
              <summary>Rifas</summary>
              <ul>
                <li><Link href="/admin/rifas" className="admin-subnavlink">Lista de rifas</Link></li>
                <li><Link href="/admin/rifas/new" className="admin-subnavlink">Nueva rifa</Link></li>
              </ul>
            </details>
/* ... */
<li className="mt-2">
  <details>
    <summary className="font-medium">Marketing</summary>
    <ul className="ml-3 mt-1 space-y-1">
      <li><a href="/admin/marketing/flyer">Flyer flotante</a></li>
      <li><a href="/admin/marketing/sponsors">Patrocinadores</a></li>
    </ul>
  </details>
</li>
<li className="mt-2"><a href="/admin/winners">Ganadores</a></li>
/* ... */
</nav>

          <div className="mt-auto p-3 text-xs text-white/60">© {new Date().getFullYear()} Sorteos Larnik</div>
        </aside>

        <div className="admin-main">
          <AdminTopbar />
          <main className="admin-content">{children}</main>
        </div>
      </div>
    </div>
  )
}


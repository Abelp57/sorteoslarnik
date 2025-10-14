import Image from 'next/image'
import Link from 'next/link'

export default function BrandLogo() {
  return (
    <Link href="/admin" className="flex items-center gap-3 no-underline">
      <Image src="/brand/logo.png" alt="Sorteos Larnik" width={40} height={40} priority />
      <div className="leading-tight">
        <div className="font-semibold text-white">Sorteos Larnik</div>
        <div className="text-xs text-white/70">Panel de administración</div>
      </div>
    </Link>
  )
}



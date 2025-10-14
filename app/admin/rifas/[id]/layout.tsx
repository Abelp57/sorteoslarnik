import AdminDeleteFloating from "../_components/AdminDeleteFloating"

export default function RifaDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* Solo rutas con [id] muestran el botón flotante */}
      <AdminDeleteFloating />
    </>
  )
}
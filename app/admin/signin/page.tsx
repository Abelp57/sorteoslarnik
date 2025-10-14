export default function SignIn(){
  return (
    <div className="min-h-[70vh] grid place-items-center">
      <form action="/api/auth/login" method="post" className="card p-6 w-[min(420px,92%)]">
        <h1 className="text-2xl font-extrabold mb-3">Entrar a Admin</h1>
        <label className="block mb-2 text-sm">Correo
          <input name="email" type="email" defaultValue="admin@larnik.mx" className="w-full rounded border border-white/20 bg-white/10 px-3 py-2"/>
        </label>
        <label className="block mb-4 text-sm">Contraseña
          <input name="password" type="password" defaultValue="123456" className="w-full rounded border border-white/20 bg-white/10 px-3 py-2"/>
        </label>
        <button className="btn btn-primary w-full">Entrar</button>
        <p className="text-xs text-white/60 mt-2">Demo: usa las credenciales prellenadas.</p>
      </form>
    </div>
  )
}




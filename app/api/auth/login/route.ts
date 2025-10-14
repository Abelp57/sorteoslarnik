import { NextResponse } from "next/server"

export async function POST(req: Request){
  const form = await req.formData()
  const email = String(form.get("email")||"")
  const password = String(form.get("password")||"")
  if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
    const res = NextResponse.redirect(new URL("/(admin)", req.url))
    res.cookies.set("larnik_token","ok",{ httpOnly:true, path:"/", sameSite:"lax" })
    return res
  }
  return NextResponse.redirect(new URL("/(admin)/signin?error=1", req.url))
}




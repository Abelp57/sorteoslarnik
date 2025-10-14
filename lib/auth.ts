import { cookies } from "next/headers"
export function isAuthed(){ return cookies().get("larnik_token")?.value === "ok" }




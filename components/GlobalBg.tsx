"use client";
export default function GlobalBg(){
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0"
           style={{
             background: "radial-gradient(800px 600px at 12% 0%, rgba(255,120,180,0.18), transparent 60%), radial-gradient(800px 600px at 90% 10%, rgba(120,180,255,0.18), transparent 60%), #0b1220"
           }}/>
      <div className="absolute inset-0 opacity-[0.07]"
           style={{
             backgroundImage: "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
             backgroundSize: "22px 22px"
           }}/>
    </div>
  )
}
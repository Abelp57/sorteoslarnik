import React from "react";
import HeroAdmin from "@/components/admin/HeroAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page(){
  return (
    <main className="p-6">
      <HeroAdmin />
    </main>
  );
}
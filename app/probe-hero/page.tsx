import HeroSection from "@/components/HeroSection";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page(){
  return (
    <main className="container mx-auto max-w-7xl px-4 md:px-6 py-8 space-y-6">
      <h1 className="text-xl font-semibold">Probe: Hero</h1>
      <HeroSection />
    </main>
  );
}
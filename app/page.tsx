import Header from "@/components/header";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <>
      <main className="px-10 md:px-20 py-10 space-y-6 md:space-y-10">
        <Header />
        <Hero />
      </main>
    </>
  );
}

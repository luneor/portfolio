import { Hero } from "@/components/sections/hero";

/*
  Home carries just the hero, which also holds the primary navbar. Every other
  section sits on its own route, Contact included.
*/
export default function Home() {
  return (
    <main id="main">
      <Hero />
    </main>
  );
}

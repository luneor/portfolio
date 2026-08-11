import { Hero } from "@/components/sections/hero";
import { Contact } from "@/components/sections/contact";

/*
  Home carries just the hero (which now also holds the primary navbar) and
  Contact. Work sits on its own route, in line with AI, About and CV.
*/
export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Contact />
    </main>
  );
}

import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
import { Ai } from "@/components/sections/ai";
import { About } from "@/components/sections/about";
import { Cv } from "@/components/sections/cv";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Work />
      <Ai />
      <About />
      <Cv />
      <Contact />
    </main>
  );
}

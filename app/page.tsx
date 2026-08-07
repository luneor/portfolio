import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
import { Contact } from "@/components/sections/contact";

/*
  The site is split across routes rather than one long scroll: home carries the
  hero and the work, with AI, About and CV on their own pages. Contact closes
  every page, so there's always a way to get in touch without navigating.
*/
export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Work />
      <Contact />
    </main>
  );
}

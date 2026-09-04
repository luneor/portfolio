import { Hero } from "@/components/sections/hero";
import { HomeProcess } from "@/components/sections/home-process";
import { HomeWork } from "@/components/sections/home-work";

/*
  The hero, then three case studies, then the two writing-led sections.

  The hero used to be the whole page. Everything was behind a click and that
  one sentence had to carry the entire decision to go further, which is a lot
  to ask of a line of text. Scrolling into the work is the cheaper ask.

  Still only a preview: three of the five case studies, and each block links
  on rather than restating the page it points at.
*/
export default function Home() {
  return (
    <main id="main">
      <Hero />
      <HomeWork />
      <HomeProcess />
    </main>
  );
}

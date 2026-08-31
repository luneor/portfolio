import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "Contact | Hanru Wehmeyer",
  description:
    "Get in touch with Hanru Wehmeyer, UX Designer at Genio, about UX work, collaborations or roles.",
};

/*
  Contact used to be a section at the foot of every page. It is a route of its
  own now: repeated on eight pages it was something to scroll past, and the
  form is a destination, so it gets a page and the hero's gradient field.
*/
export default function ContactPage() {
  return (
    <main id="main">
      <Contact />
    </main>
  );
}

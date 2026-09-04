export interface Testimonial {
  key: string;
  name: string;
  role: string;
  href: string;
  quote: string;
}

/*
  What colleagues say, in their words. Data rather than markup, so adding a
  third is one entry and not another hand-built block that has to be kept in
  line with the first two.

  `quote` stays a plain string: these are somebody else's sentences, and the
  moment the type allows JSX in here it becomes possible to emphasise a phrase
  they didn't emphasise themselves.

  These are excerpts, cut to a comparable length so no one voice dominates the
  set. Where anything has been dropped from the middle there is an ellipsis, so
  the edit is visible in the quote rather than hidden by it. Nothing is
  reordered and no words are substituted.
*/
export const TESTIMONIALS: Testimonial[] = [
  {
    key: "paul-davis",
    name: "Paul Davis",
    role: "Head of UX",
    href: "https://www.linkedin.com/in/pauldavisuk/",
    quote:
      "When Hanru interviewed for the role, he was one of more than 600 applicants. The shortlist came down to a group of very strong designers, and what made Hanru stand out was the depth of his thinking and his creativity\u2026 He also showed real originality, bringing design and art together in a way that felt distinctive but still right for the brief.",
  },
  {
    key: "marianne-jennings",
    name: "Marianne Jennings",
    role: "Product Manager",
    href: "https://www.linkedin.com/in/mariannejennings/",
    quote:
      "Hanru holds the title of Junior UX Designer, but there is nothing junior about him\u2026 He is always anchored to the right questions: what problem are we actually solving, and what is the simplest way to solve it for the user? The result is work I can only describe as having a kind of simple elegance.",
  },
  {
    key: "blair-gibson",
    name: "Blair Gibson",
    role: "Senior UX Designer",
    href: "https://www.linkedin.com/in/mrblairgibson/",
    quote:
      "He is endlessly curious, never hesitating to ask questions and always ensuring that every angle has been explored. He makes experimentation look effortless, embracing a wide range of AI tools to strengthen his UX process, accelerate prototyping and explore new approaches to creating effective interview guides and surveys.",
  },
];

import type { Metadata } from "next";
import { Ai } from "@/components/sections/ai";

export const metadata: Metadata = {
  title: "On AI | Hanru Wehmeyer",
  description:
    "How Hanru Wehmeyer works with AI as a UX designer, leaning on it for pace without letting it skip the thinking, plus concept work where AI is part of the design itself.",
};

export default function AiPage() {
  return (
    <main id="main">
      <Ai />
    </main>
  );
}

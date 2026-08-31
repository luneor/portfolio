/*
  `mt-auto` pins the footer to the bottom of the viewport on a page too short to
  fill it. `body` is `min-h-full flex flex-col`, so the auto margin takes up the
  slack that used to sit under the footer as an empty band. It never showed
  before because every page ended with a full Contact section; now that Contact
  is a route of its own, About and the Process pages can end well short of the
  fold.
*/
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border py-6 text-center text-[0.85rem] text-foreground-muted">
      <div className="mx-auto max-w-page px-6">
        <p>&copy; 2026 Hanru Wehmeyer. Built with Next.js, Tailwind CSS &amp; Motion.</p>
      </div>
    </footer>
  );
}

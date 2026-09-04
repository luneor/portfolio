/*
  A collapsed panel for supporting detail a reader can opt into: an interview
  script, a question list, a protocol. The point is to evidence a claim without
  the evidence swamping the prose around it.

  Built on native <details>/<summary> rather than state and a button, so it
  works before hydration, is keyboard-operable and announced as a disclosure by
  screen readers for free, and can still be found by in-page search in browsers
  that look inside closed details elements.

  The default marker is hidden (`list-none` plus the WebKit pseudo-element,
  since Safari ignores the former) and replaced with a chevron that rotates on
  open, so the affordance sits where the eye expects it.
*/
export function Disclosure({
  summary,
  children,
}: {
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group rounded-lg border border-border bg-background-alt">
      <summary className="cursor-pointer list-none rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
        {/*
          The flex layout lives on this span rather than the <summary>, so the
          summary keeps its default `display: list-item`. Overriding a
          summary's display is what breaks its disclosure semantics in some
          browsers, and this page is the last place to risk that.
        */}
        <span className="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-foreground">
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="size-3.5 shrink-0 text-brand-weak transition-transform duration-200 group-open:rotate-90"
          >
            <path
              d="M6 3.5 11 8l-5 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {summary}
        </span>
      </summary>
      <div className="border-t border-border px-4 py-4 text-sm">{children}</div>
    </details>
  );
}

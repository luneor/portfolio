/*
  The Memor tone-of-voice comparison: the same nudge written twice, once in
  the "app talk" every productivity app defaults to, once in the brutally
  honest voice the project shipped.

  Rebuilt as markup rather than the screenshot it replaces. The original PNG
  was clipped flush on its right and bottom edges, and a screenshot of two
  lines of text is the wrong asset anyway: here the copy is real text, so it
  reflows on a phone, scales with the reader's font size, can be selected and
  read by a screen reader, and follows the light/dark theme instead of baking
  one in.

  Both cards are deliberately identical apart from the words. The whole point
  of the comparison is that only the tone changed.
*/
function Notification({ label, body }: { label: string; body: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-[0.72rem] tracking-[0.03em] text-foreground-muted">
        {label}
      </p>
      <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-border bg-background-alt p-4">
        <span className="text-sm font-semibold text-foreground">memor.</span>
        <p className="text-[0.95rem] leading-snug text-foreground">{body}</p>
      </div>
    </div>
  );
}

export function ToneComparison() {
  return (
    <figure className="flex flex-col gap-3">
      <div className="grid items-stretch gap-4 sm:grid-cols-2">
        <Notification
          label="App talk"
          body="Here's your reminder you should be on a walk now."
        />
        <Notification
          label="Brutally honest"
          body="You are an idiot, go on a walk, stop burning out at your desk."
        />
      </div>
      <figcaption className="font-mono text-[0.72rem] leading-relaxed tracking-[0.03em] text-foreground-muted">
        The Brutally Honest voice in action, motivation that reads like a friend
        keeping you in check.
      </figcaption>
    </figure>
  );
}

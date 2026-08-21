import { NextResponse } from "next/server";

/*
  Backs the contact form (see components/sections/contact.tsx). Sends via
  Resend rather than posting straight to a third-party form endpoint from the
  client: keeping the API key server-side, and giving the form its own
  same-origin route to call means no external service is ever visible to the
  page or trusted with client-side secrets.

  Needs two things set as environment variables in the Vercel project
  (Project Settings -> Environment Variables) before this actually sends
  anything:
    - RESEND_API_KEY   - from https://resend.com (free tier: 100 emails/day,
                          no credit card). Sign-up and key creation has to be
                          done by hand, an agent can't create the account.
    - CONTACT_TO_EMAIL - inbox to receive messages, defaults to the address
                          already public on the contact section.

  Optional:
    - RESEND_FROM_EMAIL - defaults to Resend's shared onboarding@resend.dev
                          sender, which works immediately with no setup. Once
                          hanruwehmeyer.com is verified as a sending domain in
                          Resend, point this at an address on it instead
                          (e.g. contact@hanruwehmeyer.com) for a from-address
                          that matches the site rather than resend.dev.
*/

const RESEND_API_URL = "https://api.resend.com/emails";
const DEFAULT_TO_EMAIL = "hanruweh@hotmail.com";
const DEFAULT_FROM_EMAIL = "Portfolio contact form <onboarding@resend.dev>";

// Generous but not unbounded, matches what a real message looks like and
// keeps someone from POSTing megabytes at the route.
const MAX_FIELD_LENGTH = 5000;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// Deliberately simple (no external validation library): just enough to
// reject obviously-wrong input before it reaches Resend.
function isPlausibleEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, message } = (body ?? {}) as Record<string, unknown>;

  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(message)) {
    return NextResponse.json(
      { error: "Name, email, and message are all required." },
      { status: 400 }
    );
  }

  if (
    name.length > MAX_FIELD_LENGTH ||
    email.length > MAX_FIELD_LENGTH ||
    message.length > MAX_FIELD_LENGTH
  ) {
    return NextResponse.json({ error: "One of the fields is too long." }, { status: 400 });
  }

  if (!isPlausibleEmail(email)) {
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Fails loudly server-side (visible in Vercel's runtime logs) but with a
    // generic message to the visitor: they don't need to know the site's
    // backend isn't configured yet, just that it didn't go through.
    console.error("Contact form: RESEND_API_KEY is not set.");
    return NextResponse.json(
      { error: "Sorry, something went wrong sending that. Please email directly instead." },
      { status: 500 }
    );
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL;

  try {
    const resendResponse = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `Portfolio contact form: ${name}`,
        html: `<p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p><p>${escapeHtml(
          message
        ).replace(/\n/g, "<br />")}</p>`,
        text: `From: ${name} (${email})\n\n${message}`,
      }),
    });

    if (!resendResponse.ok) {
      const detail = await resendResponse.text();
      console.error("Contact form: Resend API error", resendResponse.status, detail);
      return NextResponse.json(
        { error: "Sorry, something went wrong sending that. Please email directly instead." },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Contact form: failed to reach Resend", error);
    return NextResponse.json(
      { error: "Sorry, something went wrong sending that. Please email directly instead." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

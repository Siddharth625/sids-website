import { profile } from "@/content/site";

/**
 * Lead capture behind the assistant's question limit.
 *
 * Sends through Resend, which is a plain authenticated POST, so this
 * needs no SDK. If the send fails the lead is written to the server
 * log at error level *before* anything is returned - a contact form
 * that quietly loses the message is worse than one that admits it is
 * broken, and the log is the only copy left at that point.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ENDPOINT = "https://api.resend.com/emails";

/* Resend only sends from a domain you have verified. Until Sid
   verifies his, `onboarding@resend.dev` is the sandbox sender every
   Resend account gets, and it can only deliver to the account's own
   address - which happens to be exactly where this is going. */
const FROM = process.env.CONTACT_FROM ?? "onboarding@resend.dev";

const LIMITS = { name: 120, email: 200, phone: 40, reason: 2_000 };

/* Deliberately loose. Anything stricter rejects real addresses, and
   whether the address works is settled by the reply landing or not. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c] as string,
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = clean(input.name, LIMITS.name);
  const email = clean(input.email, LIMITS.email);
  const phone = clean(input.phone, LIMITS.phone);
  const reason = clean(input.reason, LIMITS.reason);

  if (!name) {
    return Response.json({ error: "Name is required." }, { status: 400 });
  }
  if (!EMAIL.test(email)) {
    return Response.json(
      { error: "That email doesn't look right." },
      { status: 400 },
    );
  }

  const lead = { name, email, phone, reason, at: new Date().toISOString() };

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[contact] RESEND_API_KEY missing - lead not sent:", lead);
    return Response.json(
      {
        error: `Couldn't send that from here. Please email ${profile.email} directly.`,
      },
      { status: 503 },
    );
  }

  const rows = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "not given"],
    ["Reason", reason || "not given"],
  ]
    .map(
      ([label, value]) =>
        `<p style="margin:0 0 12px"><strong>${label}:</strong> ${escapeHtml(
          value,
        )}</p>`,
    )
    .join("");

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: `Site assistant <${FROM}>`,
        to: [profile.email],
        /* So replying in the mail client goes to the visitor rather
           than to the sending domain. */
        reply_to: email,
        subject: `${name} asked to get in touch`,
        html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">
<p style="margin:0 0 16px">Someone reached the question limit on the site assistant and left their details.</p>
${rows}
</div>`,
      }),
    });

    if (!response.ok) {
      console.error(
        "[contact] send failed",
        response.status,
        await response.text().catch(() => ""),
        lead,
      );
      return Response.json(
        { error: "Couldn't send that. Please email directly." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("[contact] send threw", error, lead);
    return Response.json(
      { error: "Couldn't send that. Please email directly." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}

import prisma from "@/lib/prisma";
import { isRateLimited } from "@/lib/rate-limit";
import { emailSchema } from "@/lib/validation";
import { NextRequest } from "next/server";

const FROM = "PayLinks <salut@paylinks.ro>";

const TEXT_RO = `👋 Salut,

Te-ai înscris pe lista de așteptare PayLinks.

Întrebare rapidă:

Care va fi prima ta încasare?

1 servicii (freelancing)
2 strângere de fonduri
3 produse digitale
4 donații

Răspunde cu un cuvânt.

Mulțumim 🙏,
Echipa PayLinks`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const emailRaw: string = body?.email ?? "";
    const parsed = emailSchema.safeParse(emailRaw);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ ok: false, error: "invalid_email" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }
    const email = parsed.data;

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limited = await isRateLimited({
      key: `${ip}:waitlist`,
      windowMs: 60_000,
      max: 5,
    });
    if (limited) {
      return new Response(
        JSON.stringify({ ok: false, error: "rate_limited" }),
        { status: 429, headers: { "content-type": "application/json" } }
      );
    }

    // email is valid here
    try {
      await prisma.waitlist.create({ data: { email } });
    } catch (err: any) {
      // Ignore unique constraint violations
      if (err?.code !== "P2002") throw err;
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY missing" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: FROM,
        to: [email],
        subject: "Activează înscrierea la PayLinks",
        text: TEXT_RO,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return new Response(
        JSON.stringify({ ok: false, error: "resend_failed", details: errText }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    const data = await res.json();
    return new Response(JSON.stringify({ ok: true, id: data?.id, email }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ ok: false, error: e?.message ?? "unknown_error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}

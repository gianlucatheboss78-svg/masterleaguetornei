import { createServerFn } from "@tanstack/react-start";

export const createProCheckout = createServerFn({ method: "POST" })
  .inputValidator((input: { origin: string }) => input)
  .handler(async ({ data }) => {
    const secret = process.env["STRIPE_SECRET_KEY"];
    if (!secret) {
      return { ok: false as const, error: "Collega Stripe nelle Environment Variables" };
    }

    const body = new URLSearchParams();
    body.set("mode", "subscription");
    body.set("success_url", `${data.origin}/pro?checkout=success`);
    body.set("cancel_url", `${data.origin}/pro?checkout=cancel`);
    body.set("line_items[0][quantity]", "1");
    body.set("line_items[0][price_data][currency]", "eur");
    body.set("line_items[0][price_data][unit_amount]", "999");
    body.set("line_items[0][price_data][recurring][interval]", "month");
    body.set("line_items[0][price_data][product_data][name]", "Master League PRO");
    body.set(
      "line_items[0][price_data][product_data][description]",
      "Tornei illimitati, 12 sport, 1000 loghi, 195 bandiere",
    );
    body.set("subscription_data[trial_period_days]", "7");
    body.set("allow_promotion_codes", "true");

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    const json = (await res.json()) as { url?: string; error?: { message?: string } };
    if (!res.ok || !json.url) {
      return { ok: false as const, error: json.error?.message ?? "Errore Stripe" };
    }
    return { ok: true as const, url: json.url };
  });

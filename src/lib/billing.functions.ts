import { createServerFn } from "@tanstack/react-start";

const PRO_PRODUCT_ID = "prod_VJ0uGX2PoKi4jO";

export const createProCheckout = createServerFn({ method: "POST" })
  .inputValidator((input: { origin: string }) => input)
  .handler(async ({ data }) => {
    const secret = process.env["STRIPE_SECRET_KEY"];
    if (!secret) {
      return { ok: false as const, error: "Collega Stripe nelle Environment Variables" };
    }

    const authHeaders = {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    // 1) Recupera il price attivo ricorrente collegato al prodotto esistente
    const priceRes = await fetch(
      `https://api.stripe.com/v1/prices?product=${PRO_PRODUCT_ID}&active=true&limit=10`,
      { headers: authHeaders },
    );
    const priceJson = (await priceRes.json()) as {
      data?: { id: string; recurring?: { interval?: string } | null }[];
      error?: { message?: string };
    };
    if (!priceRes.ok) {
      return { ok: false as const, error: priceJson.error?.message ?? "Errore Stripe" };
    }
    const price =
      priceJson.data?.find((p) => p.recurring?.interval === "month") ?? priceJson.data?.[0];
    if (!price) {
      return { ok: false as const, error: "Nessun prezzo attivo per il prodotto PRO" };
    }

    // 2) Checkout hosted con trial 7 giorni
    const body = new URLSearchParams();
    body.set("mode", "subscription");
    body.set("success_url", `${data.origin}/pro?checkout=success`);
    body.set("cancel_url", `${data.origin}/pro?checkout=cancel`);
    body.set("line_items[0][quantity]", "1");
    body.set("line_items[0][price]", price.id);
    body.set("subscription_data[trial_period_days]", "7");
    body.set("allow_promotion_codes", "true");

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: authHeaders,
      body,
    });
    const json = (await res.json()) as { url?: string; error?: { message?: string } };
    if (!res.ok || !json.url) {
      return { ok: false as const, error: json.error?.message ?? "Errore Stripe" };
    }
    return { ok: true as const, url: json.url };
  });

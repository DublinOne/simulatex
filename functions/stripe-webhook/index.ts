import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "npm:stripe"
import { createClient } from "npm:@blinkdotnew/sdk"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
})

const blink = createClient({
  projectId: Deno.env.get("VITE_BLINK_PROJECT_ID") || "",
  secretKey: Deno.env.get("BLINK_SECRET_KEY") || "",
})

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  const signature = req.headers.get("stripe-signature")
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")

  try {
    const body = await req.text()
    let event: Stripe.Event

    if (webhookSecret && signature) {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
    } else {
      event = JSON.parse(body)
    }

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const stripeCustomerId = session.customer as string
        const stripeSubscriptionId = session.subscription as string

        if (userId) {
          const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)
          await blink.db.subscriptions.upsert({
            id: stripeSubscriptionId,
            user_id: userId,
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
            status: subscription.status,
            plan_type: "pro", // Hardcoded for this tier
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
        }
        break

      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        const updatedSub = event.data.object as Stripe.Subscription
        await blink.db.subscriptions.update(updatedSub.id, {
          status: updatedSub.status,
          current_period_end: new Date(updatedSub.current_period_end * 1000).toISOString(),
        })
        break
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error(`Error processing webhook: ${error.message}`)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})

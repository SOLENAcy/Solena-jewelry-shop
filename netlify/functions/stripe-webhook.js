const Stripe = require("stripe");
const { createClient } = require("@supabase/supabase-js");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {
    const sig = event.headers["stripe-signature"];

    const stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (stripeEvent.type === "checkout.session.completed") {

      const session = stripeEvent.data.object;

      const products = JSON.parse(
        session.metadata.products
      );

      for (const name of products) {

        await supabase
          .from("products")
          .update({ stock: 0 })
          .eq("name", name);

      }
    }

    return {
      statusCode: 200,
      body: "OK"
    };

  } catch (err) {

    return {
      statusCode: 400,
      body: err.message
    };

  }
};

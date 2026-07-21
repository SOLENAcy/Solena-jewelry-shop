const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { items } = JSON.parse(event.body);

    const priceMap = {
      "Crystal Drop Necklace": "price_1Tvf1RV05QL3H1iJ8C9oBNOT",
      "Moon Crab Pendant": "price_1TvfADV05QL3H1iJVnEHDB97",
      "Cross Necklace (Gold)": "price_1TvfAhV05QL3H1iJhLIubXXa",
      "Cross Necklace (Silver)": "price_1TvfKxV05QL3H1iJWEDJugmG",
      "Birthstone Pendant": "price_1TvfLrV05QL3H1iJwvmhds8E",
      "Tree of Life Necklace": "price_1TvfMCV05QL3H1iJr3ONgkZg"
    };

    const line_items = items.map(item => ({
      price: priceMap[item.name],
      quantity: 1
    }));

    const session = await stripe.checkout.sessions.create({
  mode: "payment",
  line_items,

  metadata: {
    products: JSON.stringify(items.map(item => item.name))
  },

  success_url: "https://gilded-baklava-cc2ec8.netlify.app/?success=true",
  cancel_url: "https://gilded-baklava-cc2ec8.netlify.app/?canceled=true"
});

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

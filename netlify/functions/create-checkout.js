const Stripe = require("stripe");
const { createClient } = require("@supabase/supabase-js");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: "Method not allowed"
      })
    };
  }

  try {

    const { items } = JSON.parse(event.body);


    // CHECK STOCK
    for (const item of items) {

      const { data, error } = await supabase
        .from("products")
        .select("stock")
        .eq("name", item.name)
        .single();


      if (error) {
        throw new Error(
          `Stock check failed for ${item.name}: ${error.message}`
        );
      }


      if (data.stock <= 0) {

        return {
          statusCode: 400,
          body: JSON.stringify({
            error: `${item.name} is sold out`
          })
        };

      }

    }


    const priceMap = {

      "Crystal Crystal Drop Necklace":
        "price_1Tvf1RV05QL3H1iJ8C9oBNOT",

      "Moon Crab Pendant":
        "price_1TvfADV05QL3H1iJVnEHDB97",

      "Cross Necklace (Gold)":
        "price_1TvfAhV05QL3H1iJhLIubXXa",

      "Cross Necklace (Silver)":
        "price_1TvfKxV05QL3H1iJWEDJugmG",

      "Birthstone Pendant":
        "price_1TvfLrV05QL3H1iJwvmhds8E",

      "Tree of Life Necklace":
        "price_1TvfMCV05QL3H1iJr3ONgkZg"

    };


    const line_items = items.map(item => {

      const price = priceMap[item.name];

      if (!price) {
        throw new Error(
          `No Stripe price found for ${item.name}`
        );
      }

      return {
        price: price,
        quantity: 1
      };

    });



    const session = await stripe.checkout.sessions.create({

      mode: "payment",

      line_items: line_items,


      metadata: {
        products: JSON.stringify(
          items.map(item => item.name)
        )
      },


      success_url:
        "https://gilded-baklava-cc2ec8.netlify.app/?success=true",


      cancel_url:
        "https://gilded-baklava-cc2ec8.netlify.app/?canceled=true"

    });



    return {

      statusCode: 200,

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        url: session.url
      })

    };


  } catch (err) {

    console.log(err);

    return {

      statusCode: 500,

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        error: err.message
      })

    };

  }

};

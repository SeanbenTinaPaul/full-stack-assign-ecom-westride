const prisma = require("../config/prisma");
// This is your test secret API key.
const stripe = require("stripe")(
   "sk_test_51QlpOAGb4ZSqFhpE6FhBvXqzDC2qX4JmY7Eq1m95ByjMqhQ9KeNcKr56CXhua6v4sRijTDVNSBaqjtJPX2lGKzmP005cQUf1Pp"
);
//save in cloud ONLY NOT DB → https://dashboard.stripe.com/test/payments 
exports.createPayment = async (req, res) => {
   try {
      //req.user.id from authCheck
      const cart = await prisma.cart.findFirst({
         where: {
            orderedById: Number(req.user.id)
         }
      });
      console.log("cart for payment->", cart);

      const convertToTHBforCloud = cart.cartTotal * 100
      // Create a PaymentIntent with the order amount and currency
      //ต้องเรียก api นี้จึงจะ display <Elements> ใน PaymentMethod.jsx
      const paymentIntent = await stripe.paymentIntents.create({
         //หน่วยเงินเป็น สตางค์ → เอาไป X 100
         amount: convertToTHBforCloud,
         //  amount: calculateOrderAmount(items),
         currency: "thb",
         // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
         automatic_payment_methods: {
            enabled: true
         }
      });

      res.status(200).json({
         success: true,
         message: "Create Payment Success.",
         clientSecret: paymentIntent.client_secret
         //  data: users
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "Error!!! Cannot get all user."
      });
   }
};

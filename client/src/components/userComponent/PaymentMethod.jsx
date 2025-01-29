//parent → src\pages\user\PaymentUser.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { createPaymentUser } from "@/api/PaymentAuth";
import useEcomStore from "@/store/ecom-store";
import CheckoutForm from "./CheckoutForm";

//secret API key "pk_..." → ต่างกันใน user
const stripePromise = loadStripe(
   "pk_test_51QlpOAGb4ZSqFhpEUEYYjEdhd3y4fInGQXktSrOcMeB8OScSs1ewoNY4CqPCiu5A7cRJXWeaHurkPabCctEqtFeX008XPOOCHC"
);

//------------------------------------------------------------------------------------------
function PaymentMethod({ setIsSaveAddress, isSaveAddress }) {
   //เก็บ clientSecret from res.data.clientSecret
   const { token } = useEcomStore((state) => state);
   const [clientSecret, setClientSecret] = useState("");
   // console.log("token from PaymentMethod", token);
   const appearance = {
      theme: "stripe",
      variables: {
         colorPrimary: "#86198f"
      }
   };
   // Enable the skeleton loader UI for optimal loading.
   const loader = "auto";

   useEffect(() => {
      const createPaymentIntent = async () => {
         try {
            if (isSaveAddress) {
               //Save transaction in cloud ONLY
               const res = await createPaymentUser(token);
               console.log("res.data createPaymentUser", res.data);
               //key man to display <Elements> is clientSecret must be → ${id}_secret_${secret}
               setClientSecret(res.data.clientSecret);
            }
         } catch (err) {
            console.error("Error creating payment intent", err);
            throw err; //to stop continue executing
         }
      };

      createPaymentIntent();
   }, [token, isSaveAddress]);

   return (
      <div className='min-w-[600px]'>
         {isSaveAddress && clientSecret && (
            <Elements
               options={{ clientSecret, appearance, loader }}
               stripe={stripePromise}
            >
               <CheckoutForm isSaveAddress={isSaveAddress} />
            </Elements>
         )}
      </div>
   );
}

PaymentMethod.propTypes = {
   setIsSaveAddress: PropTypes.func.isRequired,
   isSaveAddress: PropTypes.bool
};

export default PaymentMethod;

//parent → PaymentMethod.jsx
import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { saveOrderUser } from "@/api/userAuth";
import useEcomStore from "@/store/ecom-store";
import { Button } from "@/components/ui/button";
import { Landmark } from "lucide-react";
import "../../stripe.css";
/*
card num : 4242 4242 4242 4242
expire date : 12/34
security code : 567
*/
export default function CheckoutForm({ isSaveAddress }) {
   const { token, resetCartsAfterPurchas } = useEcomStore((state) => state);
   const stripe = useStripe();
   const elements = useElements();
   const [message, setMessage] = useState(null);
   const [isLoading, setIsLoading] = useState(false);

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!stripe || !elements) {
         // Stripe.js hasn't yet loaded.
         // Make sure to disable form submission until Stripe.js has loaded.
         return;
      }

      setIsLoading(true);

      const payload = await stripe.confirmPayment({
         elements,
         //  confirmParams: {
         //     // Make sure to change this to your payment completion page

         //     // return_url: "http://localhost:3000/complete",
         //  },
         redirect: "if_required" //telling Stripe to handle these redirects automatically, if necessary.
      });

      /*
      เก็บหมด → payload.paymentIntent
      เก็บจำเป็น
        → .amount
        → .id
        → .currency
      */

      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      if (payload.error) {
         setMessage(payload.error.message);
      } else {
         //create Order in DB
         console.log("payload purchase", payload);
         try {
            const res = await saveOrderUser(token, payload);
            console.log("res.data CheckoutForm", res.data);
            // resetCartsAfterPurchas();
         } catch (err) {
            console.error(err);
            throw err; //to stop continue executing
         }
         //  setMessage("An unexpected error occurred.");
      }

      setIsLoading(false);
   };


   const paymentElementOptions = {
      layout: "accordion"
   };

   return (
      <form
         id='payment-form'
         onSubmit={handleSubmit}
         className='bg-card p-4 rounded-xl shadow-md'
      >
         <PaymentElement
            id='payment-element'
            options={paymentElementOptions}
            className=''
         />
         <Button
            disabled={(isLoading || !stripe || !elements) && !isSaveAddress}
            id='submit'
            className='w-full mt-4 bg-fuchsia-800 text-white py-2 rounded-md transition-colors duration-300 hover:bg-fuchsia-700 shadow-md'
         >
            <span id='button-text'>
               {isLoading ? (
                  <div
                     className='w-4'
                     id='spinner'
                  >
                     <Landmark className='w-4 animate-bounceScale' />
                  </div>
               ) : (
                  "Purchase"
               )}
            </span>
         </Button>
         {/* Show any error or success messages */}
         {message && <div id='payment-message'>{message}</div>}
      </form>
   );
}

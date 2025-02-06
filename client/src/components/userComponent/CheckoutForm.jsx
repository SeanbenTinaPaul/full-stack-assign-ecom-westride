//parent → PaymentMethod.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { reqCancelPayment } from "@/api/PaymentAuth";
import { saveOrderUser } from "@/api/userAuth";
import useEcomStore from "@/store/ecom-store";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Landmark } from "lucide-react";
import "../../stripe.css";
/*
card num : 4242 4242 4242 4242
expire date : 12/34
security code : 567
*/
export default function CheckoutForm({ isSaveAddress, paymentIntentData }) {
   const { token, resetCartsAfterPurchas,updateStatusSaveToCart } = useEcomStore((state) => state);
   const navigate = useNavigate();
   const { toast } = useToast();
   const stripe = useStripe();
   const elements = useElements();
   const [message, setMessage] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const [showConfirmDialog, setShowConfirmDialog] = useState(false);

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!stripe || !elements) {
         // Stripe.js hasn't yet loaded.
         // Make sure to disable form submission until Stripe.js has loaded.
         return;
      }

      setIsLoading(true);
      //Cloud (status: 'succeeded') || ('incomplete') if payload.paymentIntent.status !== "succeeded"
      const payload = await stripe.confirmPayment({
         elements,
         //  confirmParams: {
         //     // Make sure to change this to your payment completion page

         //  return_url: "http://localhost:3000/complete",
         //  },
         redirect: "if_required" //telling Stripe to handle these redirects automatically, if necessary.
      });

      /*
      เก็บหมด → payload.paymentIntent
      เก็บจำเป็น
        → .amount
        → .id
        → .currency
        → .status
      */

      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      console.log("payload", payload);
      if (payload.paymentIntent.status !== "succeeded") {
         // console.log("payment staus wrong", payload.paymentIntent.status);
         toast({
            variant: "destructive",
            title: "Error!",
            description: "Payment Failed"
         });
         setIsLoading(false);
         return;
      } else if (payload.error) {
         setMessage(payload.error.message);
         toast({
            variant: "destructive",
            title: "Error!",
            description: payload.error.message
         });
         setIsLoading(false);
         return;
      } else if (payload.paymentIntent.status === "succeeded") {
         //create Order record in DB
         try {
            const res = await saveOrderUser(token, payload);
            console.log("res.data CheckoutForm", res.data);
            resetCartsAfterPurchas();
            updateStatusSaveToCart(false);//reset isSaveToCart , carts is empty now so user need to save cart again
            navigate("/user/history");
         } catch (err) {
            console.error(err);
            throw err; //to stop continue executing
         }
      }

      setIsLoading(false);
   };

   const handleCancelPurchase = async () => {
      //   console.log("paymentIntentData", paymentIntentData);
      try {
         const res = await reqCancelPayment(token, paymentIntentData);
         //  console.log("res.data reqCancelPayment", res.data);
         setShowConfirmDialog(false);
         navigate("/user/history");
      } catch (err) {
         console.log(err);
      }
   };

   const paymentElementOptions = {
      layout: "accordion"
   };

   return (
      <div>
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
               className='w-full mt-4 bg-gradient-to-r from-fuchsia-800 to-fuchsia-600 hover:from-fuchsia-700 hover:to-fuchsia-500 text-white py-2 rounded-xl transition-colors duration-300 shadow-md'
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
            <Button
               variant='secondary'
               type='button'
               //onClick={handleCancelPurchase}
               onClick={() => setShowConfirmDialog(true)}
               className='w-full mt-4 py-2 shadow-md rounded-xl bg-slate-50'
            >
               Cancel Purchase
            </Button>
            {/* Show any error or success messages */}
            {message && <div id='payment-message'>{message}</div>}
         </form>
         <AlertDialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
         >
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure to cancel the purchase ?</AlertDialogTitle>
                  <AlertDialogDescription>
                     No cost or penalty. Your vouchers and cart items will be saved. Feel free to
                     come back when you're ready.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel onClick={handleCancelPurchase}>
                     Confirm cancellation
                  </AlertDialogCancel>
                  <AlertDialogAction>Return to purchase</AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </div>
   );
}

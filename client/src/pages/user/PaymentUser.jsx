import React, { useState } from "react";
import CardPurchase from "@/components/userComponent/CardPurchase";
import PaymentMethod from "@/components/userComponent/PaymentMethod";

const Payment = () => {
   const [isSaveAddress, setIsSaveAddress] = useState(false);
   const [isShowCreditCard, setIsShowCreditCard] = useState(false);
   return (
      <div className='relative min-h-screen w-full'>
         {/* Credit Card Info Box */}
         <div
            // onMouseEnter={setIsShowCreditCard(true)} → infinite loop bc immediately calls the function
            onMouseEnter={() => setIsShowCreditCard(true)}
            onMouseLeave={() => setIsShowCreditCard(false)}
            className='fixed top-5 right-5 z-50 w-32 hover:w-52 opacity-30 hover:opacity-100 bg-card rounded-lg shadow-lg  transition-all duration-300 hover:shadow-xl'
         >
            <div className='p-3 cursor-pointer'>
               <p className='font-light text-xs mb-2 text-gray-500'>
                  Hover me for Dummy Credit Card ▼
               </p>
               {isShowCreditCard && (
                  <div className='space-y-1 text-sm bg-card'>
                     <p>Card num : 4242 4242 4242 4242</p>
                     <p className="text-gray-600">Expire date : 12/34</p>
                     <p>Security code : 567</p>
                     <p className="text-gray-600">Country : Thailand </p>
                     <p className="text-gray-500">more info : docs.stripe.com/testing </p>
                  </div>
               )}
            </div>
         </div>

         {/* Main Content */}
         <div className='flex flex-wrap gap-4 p-4'>
            <CardPurchase
               setIsSaveAddress={setIsSaveAddress}
               isSaveAddress={isSaveAddress}
            />
            <PaymentMethod
               setIsSaveAddress={setIsSaveAddress}
               isSaveAddress={isSaveAddress}
            />
         </div>
      </div>
   );
};

export default Payment;

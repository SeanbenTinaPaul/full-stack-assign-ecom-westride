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
            className='fixed top-24 right-5 z-50 w-32 hover:w-64 opacity-50 hover:opacity-100 bg-yellow-300 hover:bg-card rounded-xl shadow-lg  transition-all duration-500 hover:shadow-xl'
         >
            <div className='p-3 cursor-pointer'>
               <p className='font-light text-xs mb-2 text-gray-900'>
                  Hover me for Dummy Credit Card ▼
               </p>
               {isShowCreditCard && (
                  <div className='space-y-1 text-sm '>
                     <p>Card num : 4242 4242 4242 4242</p>
                     <p className='text-gray-600'>Expire date : 12/34</p>
                     <p>Security code : 567</p>
                     <p className='text-gray-600'>Country : Thailand </p>
                     <p className='text-gray-500'>more info : docs.stripe.com/testing </p>
                  </div>
               )}
            </div>
         </div>

         {/* Main Content */}
         <div className='flex flex-wrap gap-4 p-4 justify-center'>
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

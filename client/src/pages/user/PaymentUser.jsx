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
                  <main className='space-y-2 text-sm '>
                     <section className='font-medium'>For Card</section>
                     <p>
                        Card num : <strong>4242 4242 4242 4242</strong>
                     </p>
                     <p className='text-gray-600'>
                        Expire date : <strong>12/34</strong>
                     </p>
                     <p>
                        Security code : <strong>567</strong>
                     </p>
                     <p className='text-gray-600'>
                        Country : <strong>Thailand</strong>
                     </p>
                     <p className='text-gray-500'>more info : docs.stripe.com/testing </p>
                     <hr />
                     <section className='font-medium'>
                        For PromptPay <span className='text-xs'>(no mobile needed)</span>
                     </section>
                     <div className='text-gray-600'>
                        Email :{" "}
                        <span>
                           <strong>any_email@mail.com</strong>
                        </span>
                     </div>
                     <p>
                        click '<strong>Purchase</strong>'
                     </p>
                     <div className='text-gray-600 '>
                        click{" "}
                        <span className='bg-slate-50 p-1 border rounded-sm shadow'>
                           Simulate scan
                        </span>
                     </div>
                     <div className="mt-4">
                        click
                        <span className="p-1  rounded-sm shadow bg-purple-500 text-white">AUTHORIZE TEST PAYMENT</span>
                     </div>
                     <p className='text-gray-600'>close the browser tab</p>
                  </main>
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

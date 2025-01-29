import React, { useState } from "react";
import CardPurchase from "@/components/userComponent/CardPurchase";
import PaymentMethod from "@/components/userComponent/PaymentMethod";

const Payment = () => {
   const [isSaveAddress, setIsSaveAddress] = useState(false);
   return (
      <div className='flex flex-wrap gap-4'>
         <CardPurchase
            setIsSaveAddress={setIsSaveAddress}
            isSaveAddress={isSaveAddress}
         />
         <PaymentMethod
            setIsSaveAddress={setIsSaveAddress}
            isSaveAddress={isSaveAddress}
         />
      </div>
   );
};

export default Payment;

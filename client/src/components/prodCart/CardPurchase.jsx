import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getCartUser } from "@/api/userAuth";
import useEcomStore from "@/store/ecom-store";

import { formatNumber } from "@/utilities/formatNumber";
import { Button } from "../ui/button";
import ShippingFee from "@/utilities/ShippingFee";
import { set } from "lodash";

function CardPurchase(props) {
   const { token, carts } = useEcomStore((state) => state);
   const [prodOnCartArr, setProdOnCartArr] = useState([]);
   const [cartTotal, setCartTotal] = useState(0);
   const [toTalDiscount, setTotalDiscount] = useState(0);
   const [noDisTotalPrice, setNoDisTotalPrice] = useState(0);

   useEffect(() => {
      const handleGetCartUser = async () => {
         try {
            const res = await getCartUser(token);
            console.log("res.data.carts getCartUser", res.data);
            //    console.log("res.data.cartTotal", res.data.cartTotal);
            setProdOnCartArr(res.data.ProductOnCart);
            setCartTotal(res.data["Total price"]);
            setTotalDiscount(res.data.totalCartDiscount)
            setNoDisTotalPrice(res.data.totalPriceNoDiscount)
         } catch (err) {
            console.log(err);
         }
      };
      handleGetCartUser();
   }, [token]);

   return (
      <div className='mx-auto'>
         <main className='flex justify-center flex-wrap gap-4'>
            {/* left :Address*/}
            <article className='w-1/2'>
               <div className='p-4 rounded-md border shadow-md space-y-4 bg-slate-200'>
                  <h1>Address</h1>
                  <textarea className='w-full p-2 border rounded-lg h-24 ' />
                  <Button className='w-full hover:bg-slate-500'>Save Address</Button>
               </div>
            </article>
            {/* right:Summary */}
            <article className='w-1/2'>
               <div className='p-4 rounded-md border shadow-md space-y-4 bg-slate-200'>
                  <h1>Summary</h1>
                  {/* item list */}
                  {/* {console.log("prodOnCartArr", prodOnCartArr)} */}
                  {prodOnCartArr?.map((obj) => (
                     <section key={obj.id}>
                        <div className='flex justify-between items-end'>
                           <div>
                              <p>Title: {obj.product.title}</p>
                              <p>
                                 Item Total: {obj.count} x ฿{formatNumber(obj.buyPriceNum)}
                              </p>
                           </div>
                           <div>
                              <p>฿{formatNumber(obj.count * obj.buyPriceNum)}</p>
                           </div>
                        </div>
                     </section>
                  ))}

                  <section>
                     <div className='flex justify-between items-center'>
                        <p>Shipping Fee</p>
                        <div className='flex items-center'>
                           <p className='line-through text-green-700 italic font-medium'>฿0.00</p>
                           <span>
                              <ShippingFee className='inline w-5 font-extrabold text-green-600' />
                           </span>
                        </div>
                     </div>
                     <div className='flex justify-between items-center'>
                        <p>Discount</p>
                        <p>-฿{formatNumber(toTalDiscount)}</p>
                     </div>
                  </section>
                  <section>
                     <div className='flex justify-between items-center'>
                        <p className='font-bold'>Net Total</p>
                        <p>฿{formatNumber(cartTotal)}</p>
                     </div>
                  </section>
                  <section>
                     <Button className='w-full mt-4 bg-fuchsia-800 text-white py-2 shadow-md rounded-md hover:bg-fuchsia-700'>
                        Purchase
                     </Button>
                  </section>
               </div>
            </article>
         </main>
      </div>
   );
}

CardPurchase.propTypes = {};

export default CardPurchase;

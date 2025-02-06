//parent → src\pages\user\PaymentUser.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getCartUser, saveAddressUser } from "@/api/userAuth";
import useEcomStore from "@/store/ecom-store";

import { formatNumber } from "@/utilities/formatNumber";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import ShippingFee from "@/utilities/ShippingFee";
import { MapPinHouse,ShoppingBasket  } from "lucide-react";

function CardPurchase({ setIsSaveAddress, isSaveAddress }) {
   const { token, carts,isSaveToCart,updateStatusSaveToCart } = useEcomStore((state) => state);
   const { toast } = useToast();
   const [prodOnCartArr, setProdOnCartArr] = useState([]);
   const [cartTotal, setCartTotal] = useState(0);
   const [toTalDiscount, setTotalDiscount] = useState(0);
   const [noDisTotalPrice, setNoDisTotalPrice] = useState(0);
   //address manage
   const [address, setAddress] = useState({ address: "" });
   // const [isSaveAddress, setIsSaveAddress] = useState(false);

   useEffect(() => {
      const handleGetCartUser = async () => {
         try {
            //Not suuposd to fetch carts record if call saveOrderUser() in CheckoutForm.jsx → Backend:saveOrder(){ prisma.cart.deleteMany()}
            const res = await getCartUser(token);
            // console.log("res.data.carts getCartUser", res.data);
            // console.log("res.data.cartTotal", res.data.cartTotal);
            setProdOnCartArr(res.data.ProductOnCart);
            setCartTotal(res.data["Total price"]);
            setTotalDiscount(res.data.totalCartDiscount);
            setNoDisTotalPrice(res.data.totalPriceNoDiscount);
         } catch (err) {
            console.log(err);
         }
      };
      handleGetCartUser();
   }, [token]);

   const handleSaveAddress = async () => {
      if (address.address.trim() === "") {
         toast({
            variant: "destructive",
            title: "Error!",
            description: "Please enter address"
         });
         return;
      }
      try {
         const res = await saveAddressUser(token, address);
         setIsSaveAddress(true);
         console.log("res.data", res.data);
      } catch (err) {
         console.log(err);
      }
   };
   return (
      <div className='mx-auto min-w-[600px] pt-6'>
         <main className='flex justify-center flex-wrap gap-4'>
            {/* left :Address*/}
            <article className='w-1/2'>
               <div className='p-4 rounded-xl border shadow-md space-y-4 bg-card'>
                  <div className='flex items-center gap-2'>
                     <MapPinHouse className='drop-shadow-sm'size={20} />
                     <p className="text-lg text-slate-700 font-sans font-semibold">Address</p>
                  </div>
                  <textarea
                     onChange={(e) => setAddress({ address: e.target.value.trim() })}
                     placeholder='Please enter address to display payment methods'
                     className='w-full p-2 h-24 overflow-hidden transition-all duration-300 shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent  rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'
                  />
                  <div className='disabled:cursor-not-allowed text-sm text-slate-400 w-full p-2 overflow-hidden transition-all duration-300 shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent  rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'>
                     e.g. 123/4 หมู่ที่ 5 ถนนมิตรภาพ ต.แม่พริก อ.เมืองขอนแก่น จ.ขอนแก่น 40000
                  </div>
                  <Button
                     disabled={carts.length === 0 && !isSaveToCart}
                     onClick={handleSaveAddress}
                     className='w-full rounded-xl transition-all duration-300 hover:bg-slate-500 shadow-md '
                  >
                     Save Address
                  </Button>
               </div>
            </article>
            {/* right:Summary */}
            <article className='w-1/2'>
               <div className='p-4 rounded-xl border shadow-md space-y-4 bg-card'>
                  <div className="flex items-center gap-2">
                     <ShoppingBasket className='drop-shadow-sm ' size={20} />
                     <p className="text-lg text-slate-700 font-sans font-semibold">Summary</p>
                  </div>
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
                              <ShippingFee className='inline w-5 font-extrabold text-green-600 ' />
                           </span>
                        </div>
                     </div>
                     <div className='flex justify-between items-center'>
                        <p>Original Price</p>
                        <p>฿{formatNumber(noDisTotalPrice)}</p>
                     </div>
                     <div className='flex justify-between items-center'>
                        <p>Savings</p>
                        <p>-฿{formatNumber(toTalDiscount)}</p>
                     </div>
                  </section>
                  <section>
                     <div className='flex justify-between items-center'>
                        <p className='font-bold'>Net Total</p>
                        <p>฿{formatNumber(cartTotal)}</p>
                     </div>
                  </section>
                  {/* <section>
                     <Button
                        variant='primary'
                        disabled={!isSaveAddress}
                        className='w-full mt-4 bg-fuchsia-800 text-white py-2 rounded-md transition-colors duration-300 hover:bg-fuchsia-700 shadow-md'
                     >
                        Purchase
                     </Button>
                  </section> */}
               </div>
            </article>
         </main>
      </div>
   );
}

CardPurchase.propTypes = {
   setIsSaveAddress: PropTypes.func.isRequired,
   isSaveAddress: PropTypes.bool
};

export default CardPurchase;

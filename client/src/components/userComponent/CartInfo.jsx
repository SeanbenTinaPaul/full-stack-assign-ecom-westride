//perent → Shop.jsx
import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import useEcomStore from "@/store/ecom-store";
import { formatNumber } from "@/utilities/formatNumber";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/hooks/use-toast";
import { createCartUser } from "@/api/userAuth";

function CartInfo(props) {
   const {
      token,
      carts,
      adjustQuantity,
      removeCart,
      updateStatusSaveToCart,
      showLogoutConfirm,
      setShowLogoutConfirm,
      actionLogout,
      getProduct
   } = useEcomStore((state) => state);
   //carts === [{ categoryId:, buyPriceNum:,countCart:,discounts:,promotion:, },{},..]
   const { toast } = useToast();

   // console.log("carts in CartInfo", carts);
   // Sync with products when carts or products change
   const handleClickAddDelamount = () => {
      getProduct(1000, 1);
      // console.log("carts after click add", carts);
   };
   // Safe discount amount getter
   const getDiscountAmount = useCallback((cart) => {
      //check if isAtive === true (not expired)
      //isAtive === true → can use discount
      // console.log('check cart sample',cart)
      let today = new Date();
      let startDate = new Date(cart?.discounts?.[0]?.startDate);
      let endDate = new Date(cart?.discounts?.[0]?.endDate);
      // console.log(today, '' ,startDate,cart?.discounts?.[0]?.startDate  );
      if (cart?.discounts?.[0]?.isActive && today < endDate && today >= startDate) {
         // console.log("carts?.discounts?.[0]?.amount", cart?.discounts?.[0]?.amount);
         return cart?.discounts?.[0]?.amount;
      }
      return null;
   },[])
   //cal percent discount for badge
   const renderPercentDiscount = useCallback((cart) => {
      const discountAmount = getDiscountAmount(cart);
      if (cart?.promotion && discountAmount) {
         //  console.log("pro vs dis", cart?.promotion ,discountAmount );
         return Math.max(cart?.promotion, discountAmount);
      } else if (cart?.promotion) {
         // console.log("carts.promotion", cart?.promotion);
         return cart?.promotion;
      } else if (discountAmount) {
         // console.log("discountAmount", discountAmount);
         return discountAmount;
      }
      return null;
   }, []);
   
   const toTalPrice = useCallback(() => {
      let total = carts.reduce((acc, curr) => acc + curr.buyPriceNum * curr.countCart, 0);
      return total;
   }, [carts]);

   // Calculate total price
   //    useEffect(() => {
   //       console.log("carts in CartInfo", carts);
   //       setTotalPrice(carts.reduce((acc, curr) => acc + curr.price * curr.countCart, 0));
   //    }, [carts]);

   const handleRmCart = (prodId) => {
      removeCart(prodId);
   };
   //send req to backend
   const handleCreateCart = async () => {
      try {
         //need req.body.carts: [{id, countCart, count, price, buyPriceNum, discount, productId},{..}]
         const res = await createCartUser(token, { carts: carts });
         console.log("res.data.cart", res.data.cart);
         console.log("res.data.productOnCart", res.data.productOnCart);
         if (res.data.success) {
            toast({
               title: "Your cart is now saved.",
               description: "Feel free to browse more or come back later to complete your purchase."
            });
         } else {
            console.log("error", res.data.message);
            toast({
               variant: "destructive",
               title: "error",
               description: "Adding to cart Not success"
            });
         }
      } catch (err) {
         console.log(err);
      }
   };

   return (
      <div className='h-full w-full bg-gradient-to-r from-card to-slate-100 p-4 rounded-xl shadow-md'>
         {/* Border */}
         <main className=' bg-gradient-to-r from-card to-slate-100 p-2 rounded-lg Input-3Dshadow'>
            {/* card */}
            {carts.map((cart) => (
               <div
                  key={cart.id}
                  className='bg-card p-2 mb-2 rounded-md shadow-md '
               >
                  {/* row 1 : img + title+ desc+badge+trash*/}
                  <article className='flex justify-between mb-2 '>
                     {/*  left :img + title+ desc+badge*/}
                     <div className='flex gap-2 items-center  w-full'>
                        <section className=' relative flex-shrink-0  text-center items-center aspect-square w-16 h-16 object-cover border-2 border-white bg-gray-300 rounded-md overflow-hidden'>
                           {cart.images?.[0] ? (
                              <img
                                 src={cart.images?.[0]?.url}
                                 alt='no img'
                                 className='w-full h-full object-cover'
                              />
                           ) : (
                              "No image"
                           )}
                        </section>
                        {/* badge+title+desc */}
                        <section className='block w-3/4'>
                           {(cart?.promotion || getDiscountAmount(cart)) && (
                              <Badge className='bg-red-500 px-1'>
                                 -{renderPercentDiscount(cart)}%
                              </Badge>
                           )}
                           <p className='font-medium text-sm whitespace-normal break-words'>
                              {cart.title}
                           </p>
                           {/* <p className='text-xs whitespace-normal break-words'>
                              {cart.description}
                           </p> */}
                        </section>
                     </div>
                     {/* right : trash*/}
                     <section
                        onClick={() => handleRmCart(cart.id)}
                        className='cursor-pointer'
                     >
                        <Trash2 className='w-4 drop-shadow-md hover:text-rose-500 hover:scale-125 transition duration-300' />
                     </section>
                  </article>
                  {/* row 2: quantity + price */}
                  <article className='flex justify-between items-center'>
                     {/* LEFT:quantity */}
                     <section className=' px-2 py-1 rounded-xl Input-3Dshadow'>
                        <button
                           onClick={() => {
                              adjustQuantity(cart.id, cart.countCart - 1);
                              handleClickAddDelamount();
                           }}
                           className='px-1 w-6 rounded-md Btn-3Dshadow'
                        >
                           -
                        </button>
                        <span className='px-4 font-light text-xs'>{cart.countCart}</span>
                        <button
                           disabled={cart.countCart >= cart.quantity}
                           onClick={() => {
                              adjustQuantity(cart.id, cart.countCart + 1);
                              handleClickAddDelamount();
                           }}
                           className='px-1 w-6 rounded-md Btn-3Dshadow'
                        >
                           +
                        </button>
                     </section>
                     {/* RIGHT: price */}
                     <section>
                        {cart.countCart >= cart.quantity && (
                           <p className='text-xs text-red-500'>level reached</p>
                        )}
                        <div className='font-normal text-sm text-fuchsia-900'>
                           ฿{formatNumber(cart.buyPriceNum * cart.countCart)}
                        </div>
                     </section>
                  </article>
               </div>
            ))}
            {/* Total */}
            <article className='flex justify-between px-2'>
               <span className='font-bold'>Total</span>
               <span className='font-bold '>฿{formatNumber(toTalPrice())}</span>
            </article>
            {/* btn */}
            {/* <Link to='/user/cart'> */}
            <Button
               disabled={carts.length === 0}
               onClick={() => {
                  updateStatusSaveToCart(true);
                  handleCreateCart();
               }}
               className='w-full mt-4 py-2 shadow-md rounded-xl Btn-gradientFuchsia'
            >
               Place Order
            </Button>
         </main>
      </div>
   );
}

CartInfo.propTypes = {};

export default CartInfo;

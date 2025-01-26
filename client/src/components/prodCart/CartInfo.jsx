//perent → Shop.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import useEcomStore from "@/store/ecom-store";
import { formatNumber } from "@/utilities/formatNumber";
import { Badge } from "../ui/badge";

function CartInfo(props) {
   const { carts, adjustQuantity, removeCart, toTalPrice } = useEcomStore((state) => state);
   //carts === [{ categoryId:, buyPriceNum:,countCart:,discounts:,promotion:, },{},..]
   // console.log("carts in CartInfo", carts);

   // Safe discount amount getter
   const getDiscountAmount = (cart) => {
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
   };
   //cal percent discount for badge
   const renderPercentDiscount = (cart) => {
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
   };

   // Calculate total price
   //    useEffect(() => {
   //       console.log("carts in CartInfo", carts);
   //       setTotalPrice(carts.reduce((acc, curr) => acc + curr.price * curr.countCart, 0));
   //    }, [carts]);

   const handleRmCart = (prodId) => {
      removeCart(prodId);
   };
   return (
      <div>
         <h1 className='text-xl font-normal'>Cart</h1>
         {/* Border */}
         <div className='bg-card border p-2 rounded-md shadow-md'>
            {/* card */}
            {carts.map((cart) => (
               <div
                  key={cart.id}
                  className='bg-card p-2 mb-2 rounded-md shadow-md '
               >
                  {/* row 1 : img + title+ desc+badge+trash*/}
                  <div className='flex justify-between mb-2 '>
                     {/*  left :img + title+ desc+badge*/}
                     <div className='flex gap-2 items-center  w-full'>
                        <div className=' relative flex-shrink-0  text-center items-center aspect-square w-16 h-16 object-cover border-2 border-white bg-gray-300 rounded-md overflow-hidden'>
                           {cart.images?.[0] ? (
                              <img
                                 src={cart.images?.[0]?.url}
                                 alt='no img'
                                 className='w-full h-full object-cover'
                              />
                           ) : (
                              "No image"
                           )}
                        </div>
                        {/* badge+title+desc */}
                        <div className='block w-3/4'>
                           {(cart?.promotion || getDiscountAmount(cart)) && (
                              <Badge className='bg-red-500 px-1'>
                                 -{renderPercentDiscount(cart)}%
                              </Badge>
                           )}
                           <p className='font-medium text-sm whitespace-normal break-words'>
                              {cart.title}
                           </p>
                           <p className='text-xs whitespace-normal break-words'>
                              {cart.description}
                           </p>
                        </div>
                     </div>
                     {/* right : trash*/}
                     <div
                        onClick={() => handleRmCart(cart.id)}
                        className='cursor-pointer'
                     >
                        <Trash2 className='w-4 drop-shadow-md hover:text-rose-500 hover:scale-125 transition duration-300' />
                     </div>
                  </div>
                  {/* row 2: quantity + price */}
                  <div className='flex justify-between items-center'>
                     {/* LEFT:quantity */}
                     <div className='border px-2 py-1 overflow-hidden transition-all duration-300 shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent p-2 rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'>
                        <button
                           onClick={() => adjustQuantity(cart.id, cart.countCart - 1)}
                           className='px-1 w-6 bg-gradient-to-b from-card to-gray-100 rounded-md shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),0_4px_6px_rgba(0,0,0,0.15)] hover:from-gray-300 hover:to-gray-400 hover:shadow-[inset_0_-1px_2px_rgba(0,0,0,0.15),0_6px_8px_rgba(0,0,0,0.2)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] active:translate-y-0.5 transition-all duration-500'
                        >
                           -
                        </button>
                        <span className='px-4 font-light text-xs'>{cart.countCart}</span>
                        <button
                           onClick={() => adjustQuantity(cart.id, cart.countCart + 1)}
                           className='px-1 w-6 bg-gradient-to-b from-card to-gray-100 rounded-md shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),0_4px_6px_rgba(0,0,0,0.15)] hover:from-gray-300 hover:to-gray-400 hover:shadow-[inset_0_-1px_2px_rgba(0,0,0,0.15),0_6px_8px_rgba(0,0,0,0.2)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] active:translate-y-0.5 transition-all duration-500'
                        >
                           +
                        </button>
                     </div>
                     {/* RIGHT: price */}
                     <div className='font-normal text-sm text-fuchsia-900'>
                        ฿{formatNumber(cart.buyPriceNum * cart.countCart)}
                     </div>
                  </div>
               </div>
            ))}
            {/* Total */}
            <div className='flex justify-between px-2'>
               <span className='font-bold'>Total</span>
               <span className='font-bold '>฿{formatNumber(toTalPrice())}</span>
            </div>
            {/* btn */}
            <Link to='/cart'>
               <Button className='w-full mt-4 bg-fuchsia-800 text-white py-2 shadow-md rounded-md hover:bg-fuchsia-700'>
                  Checkout
               </Button>
            </Link>
         </div>
      </div>
   );
}

CartInfo.propTypes = {};

export default CartInfo;

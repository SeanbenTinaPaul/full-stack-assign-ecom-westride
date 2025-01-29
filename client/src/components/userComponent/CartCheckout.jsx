//parent → Cart.jsx
import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { createCartUser } from "@/api/userAuth";
import useEcomStore from "@/store/ecom-store";
import { formatNumber } from "@/utilities/formatNumber";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";

import { ListChecks, Trash2 } from "lucide-react";

function CartCheckout(props) {
   const {
      carts,
      adjustQuantity,
      removeCart,
      user,
      token,
      products,
      getProduct,
      updateStatusSaveToCart
   } = useEcomStore((state) => state);
   const [totalDiscount, setTotalDiscount] = useState(0);
   const [totalNet, setTotalNet] = useState(0);
   const [total, setTotal] = useState(0);
   const navigate = useNavigate();
   const { toast } = useToast();

   console.log(user);
   // console.log("carts in ListCheckout", { carts });

   // Sync with products when carts or products change
   useEffect(() => {
      // Only fetch if needed (e.g., products array is empty)
      if (!products.length) {
         getProduct();
      }
   }, [products, getProduct]);

   //send req to backend
   const handleCreateCart = async () => {
      try {
         const res = await createCartUser(token, { carts });
         console.log("res.data.cart", res.data.cart);
         console.log("res.data.productOnCart", res.data.productOnCart);
         updateStatusSaveToCart(true);
         if (res.data.success) {
            navigate("/user/payment");
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
   // Safe discount amount getter
   const getDiscountAmount = (cart) => {
      //check if isAtive === true (not expired)
      //isAtive === true → can use discount
      let today = new Date();
      let startDate = new Date(cart?.discounts?.[0]?.startDate);
      let endDate = new Date(cart?.discounts?.[0]?.endDate);
      if (cart?.discounts?.[0]?.isActive && today < endDate && today >= startDate) {
         // console.log("carts?.discounts?.[0]?.amount", cart?.discounts?.[0]?.amount);
         return cart?.discounts?.[0]?.amount;
      }
      return null;
   };
   //move howMuchDiscount out of useEffect() and carts.forEach((cart) =>{..}) to prevent infinite render
   const howMuchDiscount = useCallback((cart) => {
      const discountAmount = getDiscountAmount(cart);
      const price = cart.price * cart.countCart;

      if (cart?.promotion > discountAmount) {
         return price * (cart.promotion / 100);
      } else if (cart?.promotion < discountAmount) {
         return price * (discountAmount / 100);
      }
      return 0;
   }, []); // Empty dependency array since getDiscountAmount is stable

   // Calculate discounts whenever carts update
   useEffect(() => {
      let totalDisc = 0;
      let total = 0;
      let totalNet = 0;

      carts.forEach((cart) => {
         let discAmount = howMuchDiscount(cart);
         totalDisc += discAmount;
         total += cart.price * cart.countCart;
         totalNet += cart.price * cart.countCart - discAmount;
      });

      setTotalDiscount(totalDisc);
      setTotal(total);
      setTotalNet(totalNet);
   }, [carts, howMuchDiscount]);

   //cal promotion va discount price | หาเฉพาะจำนวนที่ไม่ต้องจ่าย

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

   const handleRmCart = (prodId) => {
      removeCart(prodId);
   };
   return (
      <div className='bg-card p-4 rounded-md shadow-md'>
         {/* header */}
         <div className='flex'>
            <ListChecks size={24} />
            <p>Product List</p>
         </div>

         {/* list */}
         <div>
            {/* left */}
            <div>
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
                              className='px-3 w-8 h-8 bg-gradient-to-b from-card to-gray-100 rounded-xl shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),0_4px_6px_rgba(0,0,0,0.15)] hover:from-gray-300 hover:to-gray-400 hover:shadow-[inset_0_-1px_2px_rgba(0,0,0,0.15),0_6px_8px_rgba(0,0,0,0.2)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] active:translate-y-0.5 transition-all duration-500'
                           >
                              -
                           </button>
                           <span className='px-4 font-light text-xs'>{cart.countCart}</span>
                           <button
                              onClick={() => adjustQuantity(cart.id, cart.countCart + 1)}
                              className='px-3 w-8 h-8 bg-gradient-to-b from-card to-gray-100 rounded-xl shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),0_4px_6px_rgba(0,0,0,0.15)] hover:from-gray-300 hover:to-gray-400 hover:shadow-[inset_0_-1px_2px_rgba(0,0,0,0.15),0_6px_8px_rgba(0,0,0,0.2)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] active:translate-y-0.5 transition-all duration-500'
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
            </div>
            {/* rigt :total net price*/}
            {/* w-full overflow-hidden transition-all duration-300 shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent p-2 rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)] */}
            {carts.length > 0 && (
               <div className='w-full overflow-hidden transition-all duration-300 shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent p-2 rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'>
                  {/* className="bg-card p-2 mb-2 rounded-md shadow-md" */}
                  <div className='flex justify-between p-2 mb-2 '>
                     <p>Total</p>
                     <p>฿{formatNumber(total)}</p>
                  </div>
                  <div className='flex justify-between  p-2 mb-2  '>
                     <p>Discounts</p>
                     <p>-฿{formatNumber(totalDiscount)}</p>
                  </div>
                  <div className='flex justify-between  p-2 mb-2  '>
                     <p>Net Price</p>
                     <p>฿{formatNumber(totalNet)}</p>
                  </div>
               </div>
            )}
         </div>
         {/* className='px-3 w-8 h-8 bg-gradient-to-b from-card to-gray-100 rounded-xl shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),0_4px_6px_rgba(0,0,0,0.15)] hover:from-gray-300 hover:to-gray-400 hover:shadow-[inset_0_-1px_2px_rgba(0,0,0,0.15),0_6px_8px_rgba(0,0,0,0.2)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] active:translate-y-0.5 transition-all duration-500' */}
         <Link>
            <Button
               variant='primary'
               className='w-full mt-4 bg-fuchsia-800 text-white py-2 shadow-md rounded-lg hover:bg-fuchsia-700 transition-all duration-300'
               onClick={handleCreateCart}
            >
               Checkout
            </Button>
         </Link>
         <Link to={"/user/shop"}>
            <Button
               variant='secondary'
               type='button'
               className='w-full mt-4  py-2 shadow-md rounded-lg bg-slate-50'
            >
               Continue Shopping
            </Button>
         </Link>
      </div>
   );
}

CartCheckout.propTypes = {};

export default CartCheckout;

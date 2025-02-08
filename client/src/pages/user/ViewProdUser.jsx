import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { formatNumber } from "@/utilities/formatNumber";
import { renderStar } from "@/utilities/renderStars";
//component ui
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
//icons
import { Heart, ShoppingCart, Star, StarHalf, ChevronLeft, ShoppingBasket } from "lucide-react";
import useEcomStore from "@/store/ecom-store";
import { createCartUser } from "@/api/userAuth";
import { Link, useParams, useNavigate } from "react-router-dom";

import { motion } from "motion/react";
import { readProduct } from "@/api/ProductAuth";

const inputProd = {
   title: "",
   description: "",
   price: "",
   quantity: "",
   categoryId: "",
   countCart: 0,
   images: [], //save url of images from Cloudinary→ [{url:..},{url:..}]
   avgRating: 0,
   comment: ""
};

function ViewProdUser(props) {
   const {
      user,
      token,
      getCategory,
      getProduct,
      categories,
      addToCart,
      synCartwithProducts,
      carts,
      adjustQuantity,
      updateStatusSaveToCart
   } = useEcomStore((state) => state);
   const { id } = useParams();
   const navigate = useNavigate();

   const { toast } = useToast();
   const [isFavorite, setIsFavorite] = useState(false);
   //to save price after discount + promotion → for further Checkout
   const [productData, setProductData] = useState(inputProd);
   const [totalNet, setTotalNet] = useState(0);
   //click heart or not
   // Add loading state
   const [isLoading, setIsLoading] = useState(true);
   const [quantity, setQuantity] = useState(1);

   const handleFavorite = () => {
      setIsFavorite(!isFavorite);
   };

   // quantity change locally without affecting cart
   const handleQuantityChange = (change) => {
      const newCount = quantity + change;
      //not display 0 , not excess than stock from db
      if (newCount < 1 || newCount > productData.quantity) return;
      setQuantity(newCount);
      getProduct(1000, 1); //to update fresh stock from db
   };
   // 'Add to Cart' btn - keeps user on current page
   const handleAddToCart = () => {
      //update countCart to productData
      const productForCart = {
         ...productData,
         countCart: quantity
      };

      addToCart(productForCart);

      toast({
         title: "Added to cart",
         description: `${quantity} x ${productData.title} added to cart`
      });
   };

   // 'Buy now'btm - navigat to "/user/payment"
   const handleBuyNow = async () => {
      try {
         setIsLoading(true);
         // calculate latest prices
         const { buyPriceNum, preferDiscount } = calDiscountedPrice();
         // first add to cart with current quantity state
         const productForCart = {
            id: productData.id,
            countCart: quantity,
            price: productData.price,
            buyPriceNum: buyPriceNum,
            preferDiscount: preferDiscount,
            // include other needed product data
            title: productData.title,
            images: productData.images,
            quantity: productData.quantity
         };

         // add to cart global state first
         addToCart(productForCart);
         // structure data for backend
         /*
         need req.body.carts: [{id, countCart, count, price, buyPriceNum, discount, productId},{..}]
         */
         const cartData = {
            carts: [
               {
                  id: productData.id,
                  productId: productData.id,
                  countCart: quantity,
                  count: quantity,
                  price: productData.price,
                  buyPriceNum: buyPriceNum,
                  discount: preferDiscount
               }
            ]
         };

         // create cart in db with current product
         const res = await createCartUser(token, cartData);

         if (res.status === 400) {
            toast({
               title: "We're sorry!",
               description: `${res.data.message} Please adjust quantity to proceed.`
            });
            return;
         }

         updateStatusSaveToCart(true);
         if (res.data.success) {
            navigate("/user/payment");
         } else {
            toast({
               variant: "destructive",
               title: "Error",
               description: "Failed to process purchase"
            });
         }
      } catch (err) {
         console.error(err);
         toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to process purchase"
         });
      } finally {
         setIsLoading(false);
      }
   };

   //2. Safe discount amount getter
   const getDiscountAmount = useCallback(() => {
      const today = new Date();
      const startDate = new Date(productData?.discounts?.[0]?.startDate);
      const endDate = new Date(productData?.discounts?.[0]?.endDate);

      if (productData?.discounts?.[0]?.isActive && today < endDate && today >= startDate) {
         return productData?.discounts?.[0]?.amount;
      }
      return null;
   }, [productData?.discounts]);
   //create new the price after discount OR promotion in productData for further Checkout
   const calDiscountedPrice = useCallback(() => {
      const discountAmount = getDiscountAmount();
      const price = productData?.price || 0;

      let buyPrice = formatNumber(price);
      let buyPriceNum = price;
      let preferDiscount = null;

      if (productData?.promotion > discountAmount) {
         preferDiscount = productData.promotion;
         buyPriceNum = price * (1 - productData.promotion / 100);
      } else if (discountAmount) {
         preferDiscount = discountAmount;
         buyPriceNum = price * (1 - discountAmount / 100);
      }

      buyPrice = formatNumber(buyPriceNum);

      return { buyPrice: buyPrice, buyPriceNum: buyPriceNum, preferDiscount: preferDiscount };
   }, [productData?.price, productData?.promotion, getDiscountAmount]);
   // Sync with cart data
   useEffect(() => {
      if (!productData?.id) return;

      const cartItem = carts.find((item) => item.id === productData.id);
      const { buyPrice, buyPriceNum, preferDiscount } = calDiscountedPrice();

      setProductData((prev) => ({
         ...prev,
         countCart: cartItem?.countCart || 0,
         buyPrice,
         buyPriceNum,
         preferDiscount
      }));
   }, [productData?.id, carts, calDiscountedPrice]);

   //  useEffect(() => {
   //     const calDiscountPrice = () => {
   //        const discountAmount = getDiscountAmount();
   //        let buyPrice = formatNumber(productData?.price); //assign เผื่อไม่มี discount กับ promotion
   //        let buyPriceNum = productData?.price;
   //        let preferDiscount = null;

   //        if (productData?.promotion > discountAmount) {
   //           preferDiscount = productData.promotion;
   //           buyPriceNum = productData.price * (1 - productData.promotion / 100);
   //           buyPrice = formatNumber(buyPriceNum);
   //        } else if (productData?.promotion < discountAmount) {
   //           preferDiscount = discountAmount;
   //           buyPriceNum = productData.price * (1 - productData.discounts[0].amount / 100);
   //           buyPrice = formatNumber(buyPriceNum);
   //        }

   //        // selct carts[i].id vs productData.id when first render | if existProdIndex !== -1 ► setProductData(carts[existProdIndex])
   //        if (carts.length > 0) {
   //           let existProdIndex = carts.findIndex((item) => item.id === productData.id);
   //           setProductData((prev) => ({
   //              ...prev,
   //              ...carts[existProdIndex],
   //              buyPrice: buyPrice,
   //              buyPriceNum: buyPriceNum,
   //              preferDiscount: preferDiscount
   //           }));
   //        }

   //        setProductData((prev) => ({
   //           ...prev,
   //           buyPrice: buyPrice,
   //           buyPriceNum: buyPriceNum,
   //           preferDiscount: preferDiscount
   //        }));
   //        // synCartwithProducts(productData);
   //     };
   //     calDiscountPrice();

   //     synCartwithProducts(productData);
   //  }, [setProductData, carts]);

   const handleGoBack = async () => {
      try {
         setIsLoading(true);
         // Fetch shop products before navigation
         await getProduct(100, 1);
         navigate(-1, { replace: true });
      } catch (err) {
         console.error("Error navigating back:", err);
         toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to navigate back"
         });
      } finally {
         setIsLoading(false);
      }
   };
   useEffect(() => {
      const fetchData = async () => {
         try {
            setIsLoading(true);
            const res = await readProduct(id);
            setProductData(res.data.data);
            await getCategory();
         } catch (err) {
            console.error("Error fetching product:", err);
            toast({
               variant: "destructive",
               title: "Error",
               description: "Failed to load product details"
            });
            // Redirect on error
            navigate(-1, { replace: true });
         } finally {
            setIsLoading(false);
         }
      };

      fetchData();

      // Cleanup function
      return () => {
         setProductData(inputProd);
         setIsFavorite(false);
      };
   }, [id, getCategory, navigate]);
   // Show loading state
   if (isLoading) {
      return <div className='mt-10 ml-4 py-6 px-4'>Loading...</div>;
   }

   //1.cal promotion vs discount price
   const renderDiscountPrice = (price) => {
      const discountAmount = getDiscountAmount();
      if (productData?.promotion > discountAmount) {
         return formatNumber(price * (1 - productData.promotion / 100));
      } else if (productData?.promotion < discountAmount) {
         return formatNumber(price * (1 - productData.discounts[0].amount / 100));
      }
      return formatNumber(price);
   };
   //3.cal percent discount for badge
   const renderPercentDiscount = () => {
      const discountAmount = getDiscountAmount();
      if (productData?.promotion && discountAmount) {
         return Math.max(productData.promotion, discountAmount);
      } else if (productData?.promotion) {
         return productData.promotion;
      } else if (discountAmount) {
         return discountAmount;
      }
      return null;
   };

   return (
      <div className='mt-10 ml-4 py-6 px-4'>
         <div>
            <div
               //  to={"/user/shop"}
               className='cursor-pointer'
               onClick={handleGoBack}
            >
               <ChevronLeft />
            </div>
         </div>
         {/* {console.log("prodObj", prodObj)} */}
         {/* {console.log("productData", productData)} */}
         <main className='flex w-[90dvw] h-[60dvh] min-w-[700px] bg-gradient-to-br from-card to-slate-100 '>
            {/* Image*/}
            <article className='w-1/2 h-full '>
               <img
                  src={productData?.images?.[0]?.url || ""}
                  // Without optional chaining → prodObj.images[0].url ► NO '.' in front of [0]
                  alt='No image'
                  className='w-full h-3/4 object-cover bg-gradient-to-tr from-slate-100 to-slate-200 border'
               />
               <div className='h-1/4 border border-green-400'>Swiper pending..</div>
            </article>
            <article className='w-1/2 flex flex-col'>
               <header className='flex flex-col h-52 w-full p-4 gap-2 border-2 border-yellow-300'>
                  <p className='font-medium text-2xl drop-shadow '>{productData.title}</p>
                  {(productData?.promotion || getDiscountAmount()) && (
                     <Badge className='w-12 bg-red-500 py-1 px-2'>
                        -{renderPercentDiscount()}%
                     </Badge>
                  )}
                  {/* fav btn */}
                  <section className='flex justify-between'>
                     <div className='mt-1  flex items-center space-x-1'>
                        {renderStar(productData.avgRating)}
                        <span className='text-lg text-gray-500 ml-1  '>
                           {productData.avgRating}
                        </span>
                     </div>
                     <Button
                        variant='ghost'
                        size='icon'
                        onClick={handleFavorite}
                        className={`hover:bg-white/80`}
                     >
                        <Heart
                           className={`w-8 h-8  ${
                              isFavorite ? "text-red-500 fill-current" : "text-gray-500"
                           }`}
                        />
                     </Button>
                  </section>
                  <section>
                     <header className='h-24 px-4 py-2  '>
                        {/* className='flex justify-between items-start' */}
                        <div className='flex justify-between items-start '>
                           <p className='text-base font-medium text-gray-500 s'>Brand title</p>
                        </div>
                        <p className='text-base font-normal text-gray-500 '>
                           sold : {productData.sold}
                        </p>
                     </header>
                  </section>
               </header>
               {/*title + description+ brand  */}
               <header className='flex flex-col justify-between h-full border-4 border-purple-500 '>
                  {/* <div className="border-2 border-red-300  flex flex-col justify-between h-full"> */}
                  {/*className='space-y-1 px-4 py-2 max-lg:py-1 max-lg:px-2'  */}

                  {/* price + discount + rating */}
                  <section className='p-4 border'>
                     <div className='flex space-x-4 '>
                        {/* ราคาหลังหัก promotion */}
                        <span className='text-3xl font-bold text-blue-600 drop-shadow'>
                           ฿
                           {productData?.promotion || getDiscountAmount()
                              ? renderDiscountPrice(productData?.price)
                              : formatNumber(productData?.price)}
                        </span>
                        {/* ราคาจริง มีขีด line-through */}
                        <span className='text-xl text-gray-500 line-through  '>
                           {productData?.promotion || getDiscountAmount()
                              ? `฿${formatNumber(productData?.price)}`
                              : ""}
                        </span>
                     </div>
                  </section>
                  {/* </div> */}
                  <section>
                     <div className='flex justify-between items-center '>
                        {/* LEFT:quantity */}
                        <div className='flex items-center space-x-4'>
                           <section className='border px-2 py-1 overflow-hidden transition-all duration-300 shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent p-2 rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'>
                              <button
                                 onClick={() => handleQuantityChange(-1)}
                                 disabled={quantity <= 1}
                                 className='px-3 w-8 h-8 bg-gradient-to-b from-card to-gray-100 rounded-xl shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),0_4px_6px_rgba(0,0,0,0.15)] hover:from-gray-300 hover:to-gray-400 hover:shadow-[inset_0_-1px_2px_rgba(0,0,0,0.15),0_6px_8px_rgba(0,0,0,0.2)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] active:translate-y-0.5 transition-all duration-500'
                              >
                                 -
                              </button>
                              <span className='px-4 font-light text-xs'>{quantity}</span>
                              <button
                                 onClick={() => handleQuantityChange(1)}
                                 disabled={quantity >= productData.quantity}
                                 className='px-3 w-8 h-8 bg-gradient-to-b from-card to-gray-100 rounded-xl shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),0_4px_6px_rgba(0,0,0,0.15)] hover:from-gray-300 hover:to-gray-400 hover:shadow-[inset_0_-1px_2px_rgba(0,0,0,0.15),0_6px_8px_rgba(0,0,0,0.2)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] active:translate-y-0.5 transition-all duration-500'
                              >
                                 +
                              </button>
                           </section>
                           <p className='font-light text-xs text-gray-500'>
                              {/* In stock: {cart.quantity - cart.countCart} */}
                              In stock: {productData.quantity - quantity}
                           </p>
                        </div>
                        {/* RIGHT: price */}
                        {/* {console.log("cart buyPriceNum", cart)} */}
                        <section className='font-medium text-base text-fuchsia-900'>
                           {/* ฿{formatNumber(cart.buyPriceNum * cart.countCart)} */}
                        </section>
                     </div>
                  </section>
                  {/* Add to cart BTN */}
                  <footer className='p-4 border-2'>
                     {!user ? (
                        <Link
                           to='/login'
                           className='flex gap-4 w-full'
                        >
                           <Button className='w-full h-10 bg-gradient-to-r from-fuchsia-800 to-fuchsia-600 hover:from-fuchsia-700 hover:to-fuchsia-500 text-white py-2 shadow-md rounded-xl'>
                              <ShoppingBasket className='w-4 h-4 mr-2  ' />
                              <span className='inline drop-shadow'>Buy now</span>
                           </Button>
                           <Button className='w-full h-10 rounded-xl  hover:bg-slate-500'>
                              <ShoppingCart className='w-4 h-4 mr-2  ' />
                              <span className='inline '>Add to cart</span>
                           </Button>
                        </Link>
                     ) : (
                        <div className='flex gap-4 w-full'>
                           <Button
                              onClick={handleBuyNow}
                              disabled={isLoading}
                              className='w-full h-10 bg-gradient-to-r from-fuchsia-800 to-fuchsia-600 hover:from-fuchsia-700 hover:to-fuchsia-500 text-white py-2 shadow-md rounded-xl'
                           >
                              <ShoppingBasket className='w-4 h-4 mr-2 drop-shadow ' />
                              <span className='inline drop-shadow'>Buy now</span>
                           </Button>
                           <Button
                              onClick={handleAddToCart}
                              disabled={isLoading}
                              className='w-full h-10 rounded-xl  hover:bg-slate-500'
                           >
                              <ShoppingCart className='w-4 h-4 mr-2  ' />
                              <span className='inline '>Add to cart</span>
                           </Button>
                        </div>
                     )}
                  </footer>
               </header>
            </article>
         </main>
      </div>
   );
}

ViewProdUser.propTypes = {};

export default ViewProdUser;

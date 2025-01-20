//parent → Shop.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { formatNumber } from "@/utilities/formatNumber";
//component ui
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
//icons
import { Heart, ShoppingCart, Star, StarHalf } from "lucide-react";

function CardProd({ rating = 4.5, promotion = 10, prodObj }) {
   const [isFavorite, setIsFavorite] = useState(false);

   const handleFavorite = () => {
      setIsFavorite(!isFavorite);
   };

   //render star
   const renderStar = (rate) => {
      const stars = [];
      const totalStars = 5;

      for (let i = 1; i <= totalStars; i++) {
         if (i <= rate || i - rate <= 0.21) {
            //full yellow star || if x.8 or x.9 → full yellow
            //fill bg only in svg area ► fill-current text-*-*
            stars.push(
               <Star
                  key={`full-star-${i}`}
                  className='w-4 h-4 fill-current text-yellow-500'
               />
            );
         } else if (i - 0.5 <= rate) {
            //half yellow star
            stars.push(
               <div className='relative'>
                  <Star className='w-4 h-4 fill-current text-gray-300' />
                  <StarHalf
                     key={`half-star-${i}`}
                     className='absolute top-0 left-0 w-4 h-4 fill-current text-yellow-500'
                  />
               </div>
            );
         } else {
            //full grey star
            stars.push(
               <Star
                  key={`empty-star-${i}`}
                  className='w-4 h-4 fill-current text-gray-300'
               />
            );
         }
      }
      return stars;
   };


   // Safe discount amount getter
   const getDiscountAmount = () => {
      //check if isAtive === true (not expired)
      if (prodObj?.discounts?.[0]?.isActive) {
         return prodObj?.discounts?.[0]?.amount;
      }
      return null;
    };

   //cal promotion va discount price
   const renderDiscountPrice = (price) => {
      const discountAmount = getDiscountAmount();
      if (prodObj?.promotion > discountAmount) {
         return formatNumber(price * (1 - prodObj.promotion / 100));
      } else if (prodObj?.promotion < discountAmount) {
         return formatNumber(price * (1 - prodObj.discounts[0].amount / 100));
      } else {
         return formatNumber(price);
      }
   };
   //cal percent discount for badge
   const renderPercentDiscount = () => {
      const discountAmount = getDiscountAmount();
      if (prodObj?.promotion && discountAmount) {
        return Math.max(prodObj.promotion, discountAmount);
      } else if (prodObj?.promotion) {
        return prodObj.promotion;
      } else if (discountAmount) {
        return discountAmount;
      }
      return null;
    };

   return (
      <div>
         {console.log("prodObj", prodObj)}
         <Card className='w-72 h-96 max-lg:w-36 max-lg:h-52 overflow-hidden'>
            {/* Product Image */}
            <div className='relative'>
               <img
                  src={prodObj?.images?.[0]?.url || ""}
                  // Without optional chaining → prodObj.images[0].url ► NO '.' in front of [0]
                  alt='No image'
                  className='w-full h-52 max-lg:h-32 object-cover bg-slate-200'
               />
               {(prodObj?.promotion || getDiscountAmount()) && (
                  <Badge className='absolute top-2 right-2 bg-red-500'>
                    -{renderPercentDiscount()}%
                  </Badge>
                )}
               <Button
                  variant='ghost'
                  size='icon'
                  onClick={handleFavorite}
                  className={`absolute top-2 left-2 hover:bg-white/80`}
               >
                  <Heart
                     className={`w-5 h-5  ${
                        isFavorite ? "text-red-500 fill-current" : "text-gray-500"
                     }`}
                  />
               </Button>
            </div>

            <CardHeader className='space-y-1 px-4 py-2 max-lg:py-1'>
               <div className='flex justify-between items-start'>
                  <div>
                     <h3 className='font-normal text-sm max-lg:text-xs'>{prodObj.title}</h3>
                     <p className='text-sm text-gray-500 max-lg:hidden'>{prodObj.description}</p>
                  </div>
                  <p className='text-sm text-gray-500'>Brand title</p>
               </div>
            </CardHeader>

            <CardContent className='pb-2 px-4 my-0  pt-0 max-lg:py-1'>
               <div className='flex items-center space-x-2'>
                  <span className='text-xl font-bold text-blue-600 max-lg:text-lg'>
                     {/* ราคาหลังหัก promotion */}
                  ฿{(prodObj?.promotion || getDiscountAmount())
                ? renderDiscountPrice(prodObj?.price)
                : formatNumber(prodObj?.price)}
                  </span>
                  <span className='text-sm text-gray-500 line-through'>
                     {/* ราคาจริง มีขีด line-through */}
              {(prodObj?.promotion || getDiscountAmount()) 
                ? `฿${formatNumber(prodObj?.price)}` 
                : ""}
            </span>
               </div>
               <div className='mt-1 mb-0 flex items-center space-x-1'>
                  {renderStar(prodObj.avgRating)}
                  <span className='text-sm text-gray-500 ml-1'>{prodObj.avgRating}</span>
               </div>
            </CardContent>

            <CardFooter className='px-4 max-lg:relative'>
               <Button className='w-full max-lg:w-10 max-lg:absolute max-lg:-top-12 max-lg:right-4 hover:bg-slate-500'>
                  <ShoppingCart className='w-4 h-4 mr-2 max-lg:mr-0 ' />
                  <span className='inline max-lg:hidden'>Add to cart</span>
               </Button>
            </CardFooter>
         </Card>
      </div>
   );
}

CardProd.propTypes = {
   rating: PropTypes.number,
   promotion: PropTypes.number,
   prodObj: PropTypes.object.isRequired,
};

export default CardProd;

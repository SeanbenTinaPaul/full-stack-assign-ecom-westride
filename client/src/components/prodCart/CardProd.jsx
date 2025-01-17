//parent → Shop.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
//component ui
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
//icons
import { Heart, ShoppingCart, Star, StarHalf } from "lucide-react";

function CardProd({ rating = 4.5, promotion = 10, prodArr }) {
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
                  key={`star-${i}`}
                  className='w-4 h-4 fill-current text-yellow-500'
               />
            );
         } else if (i - 0.5 <= rate) {
            //half yellow star
            stars.push(
               <div className='relative'>
                  <Star className='w-4 h-4 fill-current text-gray-300' />
                  <StarHalf
                     key={`star-${i}`}
                     className='absolute top-0 left-0 w-4 h-4 fill-current text-yellow-500'
                  />
               </div>
            );
         } else {
            //full grey star
            stars.push(
               <Star
                  key={`stargrey-${i}`}
                  className='w-4 h-4 fill-current text-gray-300'
               />
            );
         }
      }
      return stars;
   };

   return (
      <div>
         <Card className='w-72 h-96 max-lg:w-36 max-lg:h-52 overflow-hidden'>
            {/* Product Image */}
            <div className='relative'>
               <img
                  src=''
                  alt='No image'
                  className='w-full h-52 max-lg:h-32 object-cover bg-slate-200'
               />
               <Badge className='absolute top-2 right-2 bg-red-500'>-{promotion}%</Badge>
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
                     <h3 className='font-normal text-sm max-lg:text-xs'>Product title</h3>
                     <p className='text-sm text-gray-500 max-lg:hidden'>description...</p>
                  </div>
                  <p className='text-sm text-gray-500'>Brand title</p>
               </div>
            </CardHeader>

            <CardContent className='pb-2 px-4 my-0  pt-0 max-lg:py-1'>
               <div className='flex items-center space-x-2'>
                  <span className='text-xl font-bold text-blue-600 max-lg:text-lg'>฿990</span>
                  <span className='text-sm text-gray-500 line-through'>฿1,190</span>
               </div>
               <div className='mt-1 mb-0 flex items-center space-x-1'>
                  {renderStar(rating)}
                  <span className='text-sm text-gray-500 ml-1'>{rating}</span>
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
   prodArr: PropTypes.array,
};

export default CardProd;

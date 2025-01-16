//parent → Shop.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star, StarHalf } from "lucide-react";

function CardProd({ rating = 4.5, discount = 10 }) {
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
         <Card className='w-72 overflow-hidden'>
            {/* Product Image */}
            <div className='relative'>
               <img
                  src='/api/placeholder/400/300'
                  alt='No image'
                  className='w-full h-48 object-cover bg-slate-200'
               />
               <Badge className='absolute top-2 right-2 bg-red-500'>-{discount}%</Badge>
               <Button
                  variant='ghost'
                  size='icon'
                  onClick={handleFavorite}
                  className={`absolute top-2 left-2 hover:bg-white/80`}
               >
                  <Heart className={`w-5 h-5  ${isFavorite ? "text-red-500 fill-current" : "text-gray-500"}`} />
               </Button>
            </div>

            <CardHeader className='space-y-1 p-4'>
               <div className='flex justify-between items-start'>
                  <div>
                     <h3 className='font-semibold text-lg'>Product title</h3>
                     <p className='text-sm text-gray-500'>description...</p>
                  </div>
                  <p className='text-sm text-gray-500'>Brand title</p>
               </div>
            </CardHeader>

            <CardContent className='p-4 pt-0'>
               <div className='flex items-center space-x-2'>
                  <span className='text-xl font-bold text-blue-600'>฿990</span>
                  <span className='text-sm text-gray-500 line-through'>฿1,190</span>
               </div>
               <div className='mt-2 flex items-center space-x-1'>
                  {renderStar(rating)}
                  <span className='text-sm text-gray-500 ml-1'>{rating}</span>
               </div>
            </CardContent>

            <CardFooter className='p-4'>
               <Button className='w-full'>
                  <ShoppingCart className='w-4 h-4 mr-2' />
                  Add to cart
               </Button>
            </CardFooter>
         </Card>
      </div>
   );
}

CardProd.propTypes = {
   raing: PropTypes.number,
   discount: PropTypes.number,
};

export default CardProd;

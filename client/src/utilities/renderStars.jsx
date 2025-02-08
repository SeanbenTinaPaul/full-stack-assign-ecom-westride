import React from 'react';
import { Star, StarHalf } from 'lucide-react';

export const renderStar = (rate) => {
  const stars = [];
  const totalStars = 5;

  for (let i = 1; i <= totalStars; i++) {
    if (i <= rate || i - rate <= 0.21) {
      // Full yellow star || if x.8 or x.9 → full yellow
      stars.push(
        <Star
          key={`full-star-${i}`}
          className='w-6 h-6 fill-current text-yellow-500 max-lg:w-6 max-lg:h-6 drop-shadow'
        />
      );
    } else if (i - 0.5 <= rate) {
      // Half yellow star
      stars.push(
        <div
          key={`half-star-container-${i}`}
          className='relative'
        >
          <Star className='w-6 h-6 fill-current text-gray-300 max-lg:w-6 max-lg:h-6' />
          <StarHalf className='absolute top-0 left-0 w-6 h-6 fill-current text-yellow-500 max-lg:w-6 max-lg:h-6' />
        </div>
      );
    } else {
      // Empty gray star
      stars.push(
        <Star
          key={`empty-star-${i}`}
          className='w-6 h-6 fill-current text-gray-300 max-lg:w-6 max-lg:h-6 drop-shadow'
        />
      );
    }
  }
  return stars;
};

export default renderStar;
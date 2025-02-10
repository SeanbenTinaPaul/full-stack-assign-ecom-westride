import React from "react";
import ReactStars from "react-rating-stars-component";
import PropTypes from "prop-types";

const StarRating = ({ rating = 0, onRatingChange = () => {}, prodId = null, orderId = null }) => {
   const handleRatingChange = (newRating) => {
      onRatingChange(orderId, prodId, newRating);
   };
   return (
      <ReactStars
         count={5}
         value={rating}
         onChange={handleRatingChange}
         size={20}
         isHalf={false}
         activeColor='#ffd700'
      />
   );
};
StarRating.propTypes = {
   rating: PropTypes.number,
   onRatingChange: PropTypes.func,
   prodId: PropTypes.number,
   orderId: PropTypes.number
};
export default StarRating;

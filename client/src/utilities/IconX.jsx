import React from "react";
import PropTypes from "prop-types";

const IconX = ({ bgColor, className }) => {
   const contrastColor = bgColor === "black" ? "white" : "black";
   return (
      <svg
         xmlns='http://www.w3.org/2000/svg'
         width='24'
         height='24'
         viewBox='0 0 24 24'
         fill='none'
         stroke='currentColor'
         strokeWidth='2'
         strokeLinecap='round'
         strokeLinejoin='round'
         className={`lucide lucide-x ${className}`}
      >
         <path
            d='M18 6 6 18'
            stroke={contrastColor}
            strokeWidth='4'
            opacity='0.5'
         />
         <path d='M18 6 6 18' />
         <path
            d='m6 6 12 12'
            stroke={contrastColor}
            strokeWidth='4'
            opacity='0.5'
         />
         <path d='m6 6 12 12' />
      </svg>
   );
};

IconX.propTypes = {
   bgColor: PropTypes.string,
   className: PropTypes.string
};

export default IconX;
/*
<svg
   xmlns='http://www.w3.org/2000/svg'
   width='24'
   height='24'
   viewBox='0 0 24 24'
   fill='none'
   stroke='currentColor'
   strokeWidth='2'
   strokeLinecap='round'
   strokeLinejoin='round'
   className={`lucide lucide-x ${
      bgColors[obj.asset_id] === "black" ? "text-black " : "text-white"
   } hover:text-red-600`}
>
   <path
      d='M18 6 6 18'
      stroke={bgColors[obj.asset_id] === "black" ? "white" : "black"}
      strokeWidth='4'
      opacity='0.5'
   />
   <path d='M18 6 6 18' />
   <path
      d='m6 6 12 12'
      stroke={bgColors[obj.asset_id] === "black" ? "white" : "black"}
      strokeWidth='4'
      opacity='0.5'
   />
   <path d='m6 6 12 12' />
</svg>
*/

//perent→ TableListProducts.jsx

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useEcomStore from "../../store/ecom-store";

function ImgProdInTableList({ images, rowIndex }) {
   const [hoveredImageIndex, setHoveredImageIndex] = useState({});
   //when the state of a component changes, the component will automatically re-render itself and its children.
   const handleMouseEnter = (rowIndex, imgIndex) => {
      setHoveredImageIndex({ rowIndex, imgIndex });
   };

   const handleMouseLeave = () => {
      setHoveredImageIndex({}); //reset key:value
   };

   return (
      <div>
         {images && images[0] && images[0].url ? (
            <div className='relative w-20 h-10 '>
               {images.slice(0, 5).map((obj, imgIndex) => (
                  <img
                     key={imgIndex}
                     src={obj.url}
                     className={`border-2 border-gray-100 h-10 w-10 object-cover rounded-full absolute top-0 left-${
                        imgIndex * 2
                     } hover:scale-110 transition-transform duration-300 ease-in-out`}
                     //tailwaind not support z-${images.length - imgIndex}, even edited tailwind.config.js
                     style={{
                        zIndex:
                           hoveredImageIndex.rowIndex === rowIndex &&
                           hoveredImageIndex.imgIndex === imgIndex
                              ? 22 //is this when hovered → on top of all img
                              : images.length - imgIndex //is this when not hovered
                     }}
                     //when this component is re-render → Come back to check in style={{..}} again.
                     onMouseEnter={() => handleMouseEnter(rowIndex, imgIndex)}
                     onMouseLeave={handleMouseLeave}
                     alt='product-image'
                  />
               ))}
               {images.length > 5 && (
                  <div className='absolute top-10 text-xs justify-center align-bottom text-gray-500'>
                     +{images.length - 5} more
                  </div>
               )}
            </div>
         ) : (
            "-"
         )}
      </div>
   );
}

ImgProdInTableList.propTypes = {
   images: PropTypes.array,
   rowIndex: PropTypes.number,
   
};

export default ImgProdInTableList;

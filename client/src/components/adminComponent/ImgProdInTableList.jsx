//perent→ TableListProducts.jsx

import React, { useState } from "react";
import PropTypes from "prop-types";

function ImgProdInTableList({ images, rowIndex }) {
   const [hoveredImageIndex, setHoveredImageIndex] = useState({});
   const handleMouseEnter = (rowIndex, imgIndex) => {
      setHoveredImageIndex({ rowIndex, imgIndex });
   };

   const handleMouseLeave = () => {
      setHoveredImageIndex({});
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
                     style={{
                        zIndex:
                           hoveredImageIndex.rowIndex === rowIndex &&
                           hoveredImageIndex.imgIndex === imgIndex
                              ? 22
                              : images.length - imgIndex
                     }}
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
   rowIndex: PropTypes.number
};

export default ImgProdInTableList;

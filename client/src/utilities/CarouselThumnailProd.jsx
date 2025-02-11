import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

import "./CarouselThumnailProd.css";

// import required modules
import { Autoplay, Pagination, Navigation, FreeMode, Thumbs } from "swiper/modules";

function CarouselThumnailProd({ children, thumbsSwiper, setThumbsSwiper }) {
   return (
      <div className='w-full h-[95%] mt-auto p-4 space-y-4  '>
         <Swiper
            spaceBetween={10}
            centeredSlides={true}
            observer={true} // Enable dynamic updates
            observeParents={true}
            autoplay={{
               delay: 4500,
               disableOnInteraction: false,
               pauseOnMouseEnter: false,
               reverseDirection: false,
               stopOnLastSlide: false,
               waitForTransition: false
            }}
            //for thumbnail
            thumbs={{ swiper: thumbsSwiper }}
            // loop={true}
            // navigation={true}
            // speed={800}
            modules={[Autoplay, Pagination, FreeMode, Navigation, Thumbs]}
            pagination={{ clickable: false, dynamicBullets: true }}
            className='main-swiper h-5/6 object-cover rounded-xl cursor-grab active:cursor-grabbing '
         >
            {children}
         </Swiper>
         {/*  */}
         
         <Swiper
            slidesPerView={5}
            spaceBetween={10}
            centeredSlides={false}
            navigation={true}
            observer={true}
            observeParents={true}
            onSwiper={setThumbsSwiper}
            loop={true}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[Navigation, FreeMode, Thumbs]}
            className='thumb-swiper h-1/6 cursor-pointer'
         >
            {children}
         </Swiper>
      </div>
   );
}

export default CarouselThumnailProd;

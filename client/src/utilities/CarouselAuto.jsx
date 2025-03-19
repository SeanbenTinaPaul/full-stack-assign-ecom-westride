import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import './carouselAuto.css';
// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

function CarouselAuto({ children, maxlg_h = "24", w = "90dvw" }) {
   return (
      <Swiper
         slidesPerView={5}
         spaceBetween={10}
         centeredSlides={false}
         navigation={true}
         observer={true} // Enable dynamic updates
         observeParents={true}
         autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            reverseDirection: false,
            stopOnLastSlide: false,
            waitForTransition: false
         }}
         speed={800}
         modules={[Autoplay, Pagination, Navigation]}
         pagination={{ clickable: true, dynamicBullets: true }}
         breakpoints={{
            320: {
               slidesPerView: 2,
               spaceBetween: 10
            },
            640: {
               slidesPerView: 4,
               spaceBetween: 5
            },
            768: {
               slidesPerView: 5,
               spaceBetween: 5
            },
            1024: {
               slidesPerView: 4,
               spaceBetween: 8
            }
         }}
         className={`mySwiper h-auto max-lg:h-${maxlg_h} w-[${w}] object-cover rounded-lg`}
      >
         {children}
         {/* {imagArr?.map((img) => (
                   <SwiperSlide
                      key={img.id}
                      className=' '
                   >
                      <div className=' h-full w-full rounded-lg overflow-hidden'>
                         <img
                            src={img.download_url}
                            alt=''
                            className='w-full h-full object-cover '
                         />
                      </div>
                   </SwiperSlide>
                ))} */}
      </Swiper>
   );
}

CarouselAuto.propTypes = {
   children: PropTypes.node,
   maxlg_h: PropTypes.string,
   w: PropTypes.string
};

export default CarouselAuto;

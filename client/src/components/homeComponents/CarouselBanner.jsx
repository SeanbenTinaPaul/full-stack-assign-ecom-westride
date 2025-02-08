import React, { useEffect, useRef, useState } from "react";
//img banner from cloudinary
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const cloudAPIkey = import.meta.env.VITE_CLOUDINARY_API_KEY;
const cloudSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import axios from "axios";
import { getImgFromCloud,readProduct } from "@/api/ProductAuth";

function CarouselBanner(props) {
   const [imagArr, setImagArr] = useState([]);

   useEffect(() => {
      const fetchImg = async () => {
         try {
            //productId 46 ► Banner
            const res = await readProduct(46);
            // console.log(res.data.data.images);
            setImagArr(res.data.data.images);
         } catch (err) {
            console.log(err);
         }
      };
      fetchImg();
   }, []);

   return (
      <div className='w-full mt-10 ml-4 py-6 px-4 rounded-xl bg-gradient-to-r from-card to-slate-100 shadow-md '>
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
            // speed={800}
            modules={[Autoplay, Pagination]}
            pagination={{ clickable: false, dynamicBullets: true }}
            className='mySwiper h-auto w-[90dvw] object-cover rounded-lg mb-2 shadow-md'
         >
            {imagArr?.map((img) => (
               <SwiperSlide
                  key={img.id}
                  className=' '
               >
                  <div className=' h-full w-full rounded-lg '>
                     <img
                        src={img.url}
                        alt=''
                        className='w-full h-full object-cover '
                     />
                  </div>
               </SwiperSlide>
            ))}
         </Swiper>
         {/*  */}
         <Swiper
            slidesPerView={5}
            spaceBetween={10}
            centeredSlides={false}
            navigation={true}
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
            // speed={800}
            modules={[Autoplay, Pagination, Navigation]}
            pagination={{ clickable: true, dynamicBullets: true }}
            className='mySwiper h-24 w-[90dvw] object-cover rounded-lg '
         >
            {imagArr?.map((img) => (
               <SwiperSlide
                  key={img.id}
                  className=' '
               >
                  <div className=' h-full w-full rounded-lg '>
                     <img
                        src={img.url}
                        alt=''
                        className='w-full h-full object-cover rounded-lg shadow-md'
                     />
                  </div>
               </SwiperSlide>
            ))}
         </Swiper>
      </div>
   );
}

export default CarouselBanner;

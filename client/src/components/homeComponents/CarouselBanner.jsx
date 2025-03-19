import React, { useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';

// import required modules
import { Autoplay, Pagination, Navigation,FreeMode,Thumbs } from "swiper/modules";

import { readProduct } from "@/api/ProductAuth";

function CarouselBanner(props) {
   const [imagArr, setImagArr] = useState([]);
   const [thumbsSwiper, setThumbsSwiper] = useState(null);

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

   // dup slide if less
   const slides = imagArr.length < 5 ? [...imagArr, ...imagArr] : imagArr;

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
            //for thumbnail
            thumbs={{ swiper: thumbsSwiper }}
            // loop={true}
            // navigation={true}
            // speed={800}
            modules={[Autoplay, Pagination,FreeMode,Navigation,Thumbs]}
            pagination={{ clickable: false, dynamicBullets: true }}
            className='mySwiper h-auto w-[90dvw] object-cover rounded-lg mb-2 shadow-md cursor-grab active:cursor-grabbing'
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
            //for thumbnail
            onSwiper={setThumbsSwiper}
            loop={slides.length >= 5}
            freeMode={true}
            watchSlidesProgress={true}
            // speed={800}
            modules={[Autoplay, Pagination, Navigation,FreeMode,Thumbs]}
            pagination={{ clickable: true, dynamicBullets: true }}
            className='mySwiper h-24 w-[90dvw] object-cover rounded-lg cursor-pointer'
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

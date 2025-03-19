import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { displayProdBy } from "@/api/ProductAuth";
import CardProd from "../prodCart/CardProd";
import CarouselAuto from "@/utilities/CarouselAuto";
import { SwiperSlide } from "swiper/react";

function NewProd(props) {
   const [prodArr, setProdArr] = useState([]);

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            const res = await displayProdBy("updatedAt", "desc", 10);
            // console.log("res displayProdBy->", res.data.data);
            setProdArr(res.data.data);
         } catch (err) {
            console.error("Error fetching products:", err);
         }
      };
      fetchProducts();
   }, [setProdArr]);
   return (
      <div className='w-full mt-6 ml-4 py-6 px-4 rounded-xl shadow-md bg-gradient-to-r from-card to-slate-100'>
         <p className='mb-10 mt-4 text-xl font-medium text-slate-700 text-center drop-shadow'>
            New Arrivals: Just In!
         </p>
         <CarouselAuto
            maxlg_h={"52"}
            w={"90dvw"}
         >
            {prodArr.map((prodObj) => (
               <SwiperSlide key={prodObj.id}>
                  <CardProd prodObj={prodObj} className='hover:z-50 hover:scale-125'/>
               </SwiperSlide>
            ))}
         </CarouselAuto>
      </div>
   );
}

NewProd.propTypes = {};

export default NewProd;

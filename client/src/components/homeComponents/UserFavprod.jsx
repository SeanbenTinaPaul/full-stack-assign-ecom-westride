import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { displayProdByUser } from "@/api/ProductAuth";
import CardProd from "../prodCart/CardProd";
import CarouselAuto from "@/utilities/CarouselAuto";
import { SwiperSlide } from "swiper/react";
import useEcomStore from "@/store/ecom-store";
import { Link } from "react-router-dom";

function UserFavprod(props) {
   const { user, token } = useEcomStore((state) => state);
   const [prodArr, setProdArr] = useState([]);

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            const res = await displayProdByUser(token);
            // console.log("res displayProdByUser->", res.data.data);
            setProdArr(res.data.data.recomProdArr);
         } catch (err) {
            console.error("Error fetching products:", err);
         }
      };
      fetchProducts();
   }, [setProdArr]);
   return (
      <>
         {user && prodArr?.length > 0 ? (
            <div className='w-full mt-6 ml-4 py-6 px-4 rounded-xl shadow-md bg-gradient-to-r from-card to-slate-100 '>
               <p className='mb-10 mt-4 text-xl font-medium text-slate-700 text-center drop-shadow'>
                  Recommended for You
               </p>
               <CarouselAuto
                  maxlg_h={"52"}
                  w={"90dvw"}
               >
                  {prodArr?.map((prodObj) => (
                     <SwiperSlide key={prodObj.id}>
                        <CardProd prodObj={prodObj} />
                     </SwiperSlide>
                  ))}
               </CarouselAuto>
            </div>
         ) : (
            <div className='w-full mt-6 ml-4 py-4 px-4 rounded-xl shadow-md bg-gradient-to-r from-card to-slate-100 '>
               <div className='mb-4 mt-4 text-xl font-medium text-slate-700 text-center drop-shadow'>
                  {" "}
                  Ready to make your first purchase? Enjoy our signature discounts and exclusive deals!
                  <Link to='/user/shop' className='text-slate-500 text-2xl font-semibold ml-4 hover:text-fuchsia-600'>
                     {" "}
                     Start Shopping
                  </Link>
               </div>
            </div>
         )}
      </>
   );
}

UserFavprod.propTypes = {};

export default UserFavprod;

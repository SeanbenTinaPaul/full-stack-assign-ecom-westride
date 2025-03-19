import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useEcomStore from "../../store/ecom-store";
import CardProd from "@/components/prodCart/CardProd";
import { ScanHeart, BookDashed } from "lucide-react";

function FavoriteUser(props) {
   const { user, token, products, getProduct } = useEcomStore((state) => state);
   const [favProdArr, setFavProdArr] = useState([]);
   useEffect(() => {
      getProduct(100, 1);
   }, [getProduct]);

   useEffect(() => {
      if (!products || !user?.id || !token) return;
      const filterFav = () => {
         let favProdarr = [];
         for (const prodObj of products) {
            for (const favObj of prodObj.favorites) {
               if (favObj?.userId == user.id && prodObj.id == favObj?.productId && token) {
                  favProdarr.push(prodObj);
               }
            }
         }
         setFavProdArr(favProdarr);
      };

      filterFav();
   }, [products, user?.id, token]);

   return (
      <div>
         <section className='flex p-4 mt-6 mb-4 bg-gradient-to-r from-slate-700 to-slate-500 gap-2 items-center rounded-xl shadow-md'>
            <ScanHeart
               size={24}
               className='text-card'
            />
            <p className='text-lg font-semibold text-card'>Your favorite products</p>
         </section>
         <main className='py-10 xl:py-16 h-full min-w-[350px] flex flex-wrap gap-4 justify-center md:px-1  lg:gap-6 xl:gap-8 xl:px-6 2xl:gap-16 3xl:gap-20 rounded-xl shadow-md bg-gradient-to-r from-slate-100 to-card'>
            {favProdArr.length > 0 ? (
               favProdArr.map((prodObj) => (
                  <div
                     key={prodObj.id}
                     className='mb-4'
                  >
                     <CardProd prodObj={prodObj} />
                  </div>
               ))
            ) : (
               <div className='flex flex-col items-center justify-center h-full'>
                  <BookDashed
                     size={100}
                     className='text-slate-500'
                  />
                  <p className='text-2xl font-semibold text-slate-500'>No favorites yet? Browse our products and start adding!</p>
               </div>
            )}
         </main>
      </div>
   );
}

FavoriteUser.propTypes = {};

export default FavoriteUser;

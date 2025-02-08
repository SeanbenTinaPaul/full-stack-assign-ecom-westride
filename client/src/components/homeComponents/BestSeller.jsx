import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { displayProdBy } from "@/api/ProductAuth";
import CardProd from "../prodCart/CardProd";

function BestSeller(props) {
   const [prodArr, setProdArr] = useState([]);

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            const res = await displayProdBy("sold", "desc", 5);
            console.log("res BestSeller->", res.data.data);
            setProdArr(res.data.data);
         } catch (err) {
            console.error("Error fetching products:", err);
         }
      };
      fetchProducts();
   }, [setProdArr]);

   const colorTag = (i) => {
      switch (i) {
         case 0: //  gold
            return "bg-gradient-to-b from-[#ecc440] via-[#FFFa8a] to-[#ddac17] drop-shadow-md text-yellow-400 ";
         case 1: //  silver
            return "bg-gradient-to-b from-gray-300 via-gray-100 to-gray-400 drop-shadow-md text-zinc-400";
         case 2: //  bronze
            return "bg-gradient-to-b from-[#cd7f32] via-[#e6b17e] to-[#b87333] drop-shadow-md text-amber-800";
         default:
            return "bg-gradient-to-b from-gray-200 to-gray-300 text-slate-500";
      }
   };
   return (
      <div className='w-full mt-6 ml-4 py-6 px-4 rounded-xl shadow-md bg-gradient-to-r from-card to-slate-100'>
         <p className='mb-8 mt-4 text-xl font-medium text-slate-700 text-center drop-shadow'>
            Our Customers' Favorites
         </p>

         <main className='flex flex-wrap justify-center gap-4'>
            {prodArr.map((prodObj, i) => (
               <section
                  key={prodObj.id}
                  className='flex flex-col items-start'
               >
                  <div
                     className={`flex items-center justify-center h-8 w-8 min-[1024px]:h-10 min-[1024px]:w-10 text-center  -mb-0 ml-3 rounded-t-md shadow  ${colorTag(
                        i
                     )}`}
                  >
                     <p className="font-bold text-sm drop-shadow">{i + 1}</p>
                  </div>
                  <CardProd prodObj={prodObj} />
               </section>
            ))}
         </main>
      </div>
   );
}

BestSeller.propTypes = {};

export default BestSeller;

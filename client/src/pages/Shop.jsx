import React, { useEffect, useState } from "react";
//component
import CardProd from "../components/prodCart/CardProd";
//Global state
import useEcomStore from "@/store/ecom-store";
import SearchForProd from "@/components/prodCart/SearchForProd";
//component ui

const Shop = () => {
   const { token, products, getProduct } = useEcomStore((state) => state);
   const [isFoundTextSearch, setIsFoundTextSearch] = useState(false);
   const [whatTextSearch, setWhatTextSearch] = useState("");
   useEffect(() => {
      const fetchProducts = async () => {
         try {
            await getProduct();
         } catch (err) {
            console.error("Error fetching products:", err);
         }
      };
      fetchProducts();
   }, [getProduct]);
   //products === [{<data from table Product>},{},..]
   return (
      <div className='flex '>
         {/* search bar */}
         <div className='w-1/5 p-4 h-screen bg-slate-200 '>
            <SearchForProd
               setIsFoundTextSearch={setIsFoundTextSearch}
               // isFoundTextSearch={isFoundTextSearch}
               setWhatTextSearch={setWhatTextSearch}
            />
         </div>

         <div className='w-3/5 p-4 h-screen overflow-y-auto'>
            <p className='text-2xl font-bold mb-4'>Products</p>
            {!isFoundTextSearch && whatTextSearch && (
               <div>
                  <p className='text-muted-foreground font-light mb-4'>
                     No Product found with "{whatTextSearch}"
                  </p>
                  <p className='text-accent-foreground from-accent-foreground font-semibold'>
                     We think you might like these products
                  </p>
               </div>
            )}
            <div className='flex flex-wrap justify-between gap-4 max-[1663px]:grid max-[1663px]:grid-cols-3 max-[1600px]:grid-cols-2 max-[1155px]:gap-2'>
               {/* display products */}
               {/* {console.log("products", products)} */}
               {Array.isArray(products) ? (
                  products.map((obj) => (
                     <CardProd
                        key={obj.id}
                        prodObj={obj}
                     />
                  ))
               ) : (
                  <p>No products available</p>
               )}
               {/* display products */}
            </div>
         </div>

         {/* cart */}
         <div className='w-1/5 p-4 h-screen overflow-y-auto bg-slate-200'>cart</div>
      </div>
   );
};

export default Shop;

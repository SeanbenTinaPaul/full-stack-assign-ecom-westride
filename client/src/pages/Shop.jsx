import React, { useEffect, useState } from "react";
//component
import CardProd from "../components/prodCart/CardProd";
import SearchForProd from "@/components/prodCart/SearchForProd";
import CartInfo from "@/components/prodCart/CartInfo";
//Global state
import useEcomStore from "@/store/ecom-store";
//component ui

const Shop = () => {
   const { user,token, products, getProduct } = useEcomStore((state) => state);
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
      // Added min-w-[...] to prevent sections from becoming too narrow
      //To make dev responsive → rm "min-w-[...px]" from all div
      <div className='flex min-h-screen w-full overflow-x-auto'>
         {/* search bar */}
         {/* To make dev responsive → rm "min-w-[...px]" from all div */}
         <div className='w-1/5 p-4 min-w-[200px] h-screen bg-slate-200 '>
            <SearchForProd
               setIsFoundTextSearch={setIsFoundTextSearch}
               // isFoundTextSearch={isFoundTextSearch}
               setWhatTextSearch={setWhatTextSearch}
            />
         </div>
         {/* display products */}
         <div className={`${user? 'w-3/5': 'w-4/5'} p-4 h-screen overflow-x-auto`}>
            <p className='text-xl font-normal mb-4'>Products</p>
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
            {/* //To make dev responsive → rm "min-w-[...px]" from all div */}
            <div className='flex flex-wrap min-w-[300px] justify-center gap-4 max-[1663px]:grid max-[1663px]:grid-cols-3 max-[1600px]:grid-flow-row max-[1366px]:grid-cols-2 max-[1366px]:justify-items-center max-[1155px]:gap-2'>
               
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
         {/* //To make dev responsive → rm "min-w-[...px]" from all div */}
         {user && (

         <div className='w-1/5 p-4 min-w-[250px] h-screen overflow-y-auto bg-slate-200'>
            <CartInfo />
         </div>
         )}
      </div>
   );
};

export default Shop;

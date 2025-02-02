import React, { useEffect, useState } from "react";
//component
import CardProd from "@/components/prodCart/CardProd";
import SearchForProd from "@/components/prodCart/SearchForProd";
// import CartInfo from "@/components/userComponent/CartInfo";
//Global state
import useEcomStore from "@/store/ecom-store";
//component ui
import { PackageSearch } from 'lucide-react';

const Shop = () => {
   const { user, token, products, getProduct } = useEcomStore((state) => state);
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
      <main className='flex min-h-screen w-full mt-2 overflow-x-auto'>
         {/* search bar */}
         {/* To make dev responsive → rm "min-w-[...px]" from all div */}
         <article className='w-1/5 min-w-[200px] h-screen flex flex-col bg-[#E5E5E5] '>
            <div className="rounded-xl mt-4 mb-4 p-2 gap-2 flex items-center bg-card  shadow-md ">
            <PackageSearch className="drop-shadow-sm"/>
               <h1 className='text-xl text-slate-700 font-sans font-semibold drop-shadow-sm'>Search product</h1>
            </div>
            <SearchForProd
               setIsFoundTextSearch={setIsFoundTextSearch}
               // isFoundTextSearch={isFoundTextSearch}
               setWhatTextSearch={setWhatTextSearch}
            />
         </article>
         {/* display products ${user? 'w-3/5': 'w-4/5'}*/}
         <article className={`w-4/5 p-4 h-screen overflow-auto `}>
            <div className='bg-slate-700 p-6 rounded-xl mb-4 flex items-center shadow-md'>
               <p className='text-2xl font-sans font-bold  text-slate-50'>Products</p>
            </div>
            {!isFoundTextSearch && whatTextSearch && (
               <section>
                  <p className='text-muted-foreground font-light mb-4'>
                     No Product found with "{whatTextSearch}"
                  </p>
                  <p className='text-accent-foreground from-accent-foreground font-semibold'>
                     We think you might like these products
                  </p>
               </section>
            )}
            {/* //To make dev responsive → rm "min-w-[...px]" from all div */}
            <section className='shadow-md bg-slate-50 pt-10 rounded-xl flex flex-wrap gap-4 justify-center min-w-[300px]   max-[1663px]:grid max-[1663px]:grid-cols-3 max-[1600px]:grid-flow-row max-[1366px]:grid-cols-2 max-[1366px]:justify-items-center max-[1155px]:gap-2'>
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
            </section>
         </article>

         {/* cart */}
         {/* //To make dev responsive → rm "min-w-[...px]" from all div */}
         {/* {user && (

         <div className='w-1/5 p-4 min-w-[250px] h-screen overflow-y-auto bg-slate-200'>
            <CartInfo />
         </div>
         )} */}
      </main>
   );
};

export default Shop;
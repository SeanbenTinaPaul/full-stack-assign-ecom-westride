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
   const [isFoundSearch, setIsFoundSearch] = useState(true);
   const [whatTextSearch, setWhatTextSearch] = useState("");

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            await getProduct(100,1);
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
      <main className='flex min-h-screen w-full my-2  '>
         {/* search bar */}
         {/* To make dev responsive → rm "min-w-[...px]" from all div */}
         <article className='w-1/5 min-w-[200px] h-screen pb-0 flex flex-col bg-[#E5E5E5]'>
            <div className="rounded-xl mt-4 mb-4 p-2 gap-2 flex items-center bg-card  shadow-md ">
            <PackageSearch className="drop-shadow-sm"/>
               <h1 className='text-xl text-slate-700 font-sans font-semibold drop-shadow-sm'>Search product</h1>
            </div>
            <SearchForProd
               setIsFoundSearch={setIsFoundSearch}
               // isFoundTextSearch={isFoundTextSearch}
               setWhatTextSearch={setWhatTextSearch}
            />
         </article>
         {/* display products ${user? 'w-3/5': 'w-4/5'}*/}
         <article className={`w-4/5 p-4 h-screen `}>
            <div className='bg-gradient-to-r from-slate-700 to-slate-500 p-6 rounded-xl mb-4 flex items-center shadow-md'>
               <p className='text-2xl font-sans font-bold  text-slate-50'>Products</p>
            </div>
            {!isFoundSearch &&  (
               <section>
                  <p className='text-muted-foreground font-light mb-4'>
                     {whatTextSearch? `No Product "${whatTextSearch}" matched your search ` : "No Product matched your search"}
                  </p>
                  <p className='text-accent-foreground from-accent-foreground font-semibold'>
                     We think you might like these products
                  </p>
               </section>
            )}
            {/* {!isFoundSearch && !whatTextSearch && (
               <section>
                  <p className='text-muted-foreground font-light mb-4'>
                     No Product matched your search
                  </p>
                  <p className='text-accent-foreground from-accent-foreground font-semibold'>
                     We think you might like these products
                  </p>
               </section>
            )} */}
            {/* //To make dev responsive → rm "min-w-[...px]" from all div */}
            <section className='overflow-y-scroll scrollbar-none hover:scrollbar-thin hover:-mr-1 transition-all duration-500 h-[88dvh] py-10 xl:py-16 shadow-md bg-slate-50 rounded-xl flex flex-wrap gap-4 justify-center min-w-[350px] md:px-1  lg:gap-6 xl:gap-16 2xl:gap-10' >
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
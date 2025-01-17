import React, { useEffect } from "react";
//component
import CardProd from "../components/prodCart/CardProd";
//Global state
import useEcomStore from "@/store/ecom-store";
//component ui

const Shop = () => {
   const { token, products, getProduct } = useEcomStore((state) => state);
   useEffect(() => {
      getProduct();
   }, [getProduct]);
   //products === [{<data from table Product>},{},..]
   return (
      <div className='flex '>
         {/* search bar */}
         <div className='w-1/5 p-4 h-screen bg-slate-200 '>search bar</div>
         {/* product */}
         <div className='w-3/5 p-4 h-screen overflow-y-auto'>
            <p className='text-2xl font-bold mb-4'>Products</p>
            <div className='flex flex-wrap justify-between gap-4 max-[1663px]:grid max-[1663px]:grid-cols-3 max-[1600px]:grid-cols-2 max-[1155px]:gap-2'>
               {/* display products */}
               {console.log("products", products)}
               {products.map((obj) => (
                  <CardProd
                     key={obj.id}
                     prodArr={obj}
                  />
               ))}
               {/* display products */}
            </div>
         </div>

         {/* cart */}
         <div className='w-1/5 p-4 h-screen overflow-y-auto bg-slate-200'>cart</div>
      </div>
   );
};

export default Shop;

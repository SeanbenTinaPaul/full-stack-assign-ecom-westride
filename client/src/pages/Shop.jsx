import React from "react";
//component
import CardProd from "../components/prodCart/CardProd";
import useEcomStore from "@/store/ecom-store";
//component ui

const Shop = () => {
   const { token, products, getProduct } = useEcomStore((state) => state);
   return (
      <div className='flex '>
         {/* search bar */}
         <div className='w-1/4 p-4 h-screen bg-slate-200 '>search bar</div>
         {/* product */}
         <div className='w-1/2 p-4 h-screen overflow-y-auto'>
            <p className='text-2xl font-bold mb-4'>Products</p>
            <div className='flex flex-wrap gap-4'>
               {/* display products */}
               <CardProd />
               {/* display products */}
            </div>
         </div>

         {/* cart */}
         <div className='w-1/4 p-4 h-screen overflow-y-auto bg-slate-200'>cart</div>
      </div>
   );
};

export default Shop;

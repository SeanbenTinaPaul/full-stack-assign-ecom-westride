//parent → AppRoutes.jsx
import React from "react";
import FormProduct from "../../components/adminComponent/FormProduct";

const ProductAdmin = () => {
   return (
      <div>
         <div className='max-w-3xl flex mt-6 mb-4  p-3 items-center rounded-xl gap-2 bg-gradient-to-r from-slate-700 to-slate-500 shadow-md'>
            <h1 className='text-xl font-medium text-card'>Product Management</h1>
         </div>
         <FormProduct />
      </div>
   );
};

export default ProductAdmin;

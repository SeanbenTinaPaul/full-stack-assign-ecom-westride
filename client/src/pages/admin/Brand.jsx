import FormBrandAdmin from "@/components/adminComponent/FormBrandAdmin";
import React from "react";

function BrandAdmin() {
   return (
      <div className=''>
         <div className='max-w-3xl flex mt-6 mb-4 p-3 items-center rounded-xl gap-2 bg-gradient-to-r from-slate-700 to-slate-500 shadow-md'>
            <h1 className='text-xl font-medium text-card'>Brand Management</h1>
         </div>
         <FormBrandAdmin />
      </div>
   );
}

export default BrandAdmin;

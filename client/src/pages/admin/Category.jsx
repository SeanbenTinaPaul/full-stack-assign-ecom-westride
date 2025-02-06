import React from "react";
import PropTypes from "prop-types";
import FormCategory from "../../components/adminComponent/FormCategory";

const CategoryAdmin = () => {
   return (
      <div className="">
         <div className='max-w-3xl flex mt-6 mb-4 p-3 items-center rounded-xl gap-2 bg-gradient-to-r from-slate-700 to-slate-500 shadow-md'>
            <h1 className='text-xl font-medium text-card'>Category Management</h1>
         </div>
         <FormCategory />
      </div>
   );
};

CategoryAdmin.propTypes = {};

export default CategoryAdmin;

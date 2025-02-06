//for listing users
import React from "react";
import TableUsersAdmin from "@/components/adminComponent/TableUersAdmin";

const ManageAdmin = () => {
   return (
      <div>
         <div className='flex mt-6 mb-4 p-3 items-center rounded-xl gap-2 bg-gradient-to-r from-slate-700 to-slate-500 shadow-md'>
            {/* <FileCheck size={20} className="text-card"/> */}
            <p className='text-xl font-medium text-card'>User Management</p>
         </div>
         <div><TableUsersAdmin /></div>
      </div>
   );
};

export default ManageAdmin;

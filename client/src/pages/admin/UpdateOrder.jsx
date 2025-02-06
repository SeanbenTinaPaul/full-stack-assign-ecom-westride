import React from "react";
import PropTypes from "prop-types";
import OrderTable from "@/components/adminComponent/OrderTable";
import {FileCheck} from 'lucide-react'

function UpdateOrder(props) {
   return (
      <div >
         <div className='flex mt-6 mb-4 p-3 items-center rounded-xl gap-2 bg-gradient-to-r from-slate-700 to-slate-500 shadow-md'>
            {/* <FileCheck size={20} className="text-card"/> */}
            <p className='text-xl font-medium text-card'>Update order status</p>
         </div>
         <OrderTable />
      </div>
   );
}

UpdateOrder.propTypes = {};

export default UpdateOrder;

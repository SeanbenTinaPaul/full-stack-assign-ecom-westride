import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { getOrdersAdmin, updateOrderStatAdmin } from "@/api/adminAuth";
import useEcomStore from "@/store/ecom-store";
import { Table } from "flowbite-react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatNumber } from "@/utilities/formatNumber";
import { FileCheck } from "lucide-react";

function OrderTable(props) {
   const { token } = useEcomStore((state) => state);
   //    const [orderArr, setOrderArr] = useState([]);
   //for flowbite table
   const [currentPage, setCurrentPage] = useState(1);
   const [searchTerm, setSearchTerm] = useState("");
   const [sortCol, setSortCol] = useState("");
   const [sortOrder, setSortOrder] = useState("asc");
   const [tableData, setTableData] = useState([]);
   const [selectedRows, setSelectedRows] = useState([]);
   const [selectedStatus, setSelectedStatus] = useState("Completed");
   const itemsPerPage = 10;
   const [isTriggerRender, setIsTriggerRender] = useState(false);

   useEffect(() => {
      const fetchOrders = async () => {
         try {
            const res = await getOrdersAdmin(token);
            console.log("OrderTable res.data", res.data.data);
            // setOrderArr(res.data.data);
            setTableData(res.data.data);
         } catch (err) {
            console.log(err);
            throw err;
         }
      };
      fetchOrders();
   }, [token,setSelectedRows,setIsTriggerRender,isTriggerRender]);


   // Sort fuction
   const sortData = (col) => {
      const sortedData = [...tableData].sort((a, b) => {
         if (col === "orderStatus") {
            const statusOrder = {
               Completed: 2,
               "Not Process": 1,
               Canceled: 0
            };

            // Get status values, default to "Not Process" if undefined
            const statusA = a[col] || "Not Process";
            const statusB = b[col] || "Not Process";

            // Compare based on priority
            return sortOrder === "asc"
               ? statusOrder[statusA] - statusOrder[statusB]
               : statusOrder[statusB] - statusOrder[statusA];
         } else if (col === "status") {
            const statusOrder = {
               succeeded: 1,
               "not process": 0
            };
            // Get status values, default to "Not Process" if undefined
            const statusA = a[col] || "not process";
            const statusB = b[col] || "not process";

            // Compare based on priority
            return sortOrder === "asc"
               ? statusOrder[statusA] - statusOrder[statusB]
               : statusOrder[statusB] - statusOrder[statusA];
         } else {
            //nornal sort
            if (a[col] < b[col]) return sortOrder === "asc" ? -1 : 1;
            if (a[col] > b[col]) return sortOrder === "asc" ? 1 : -1;
            return 0;
         }
      });
      setTableData(sortedData);
      setSortCol(col);
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
   };

   //checkbox selection
   const handleSelectRow = (id) => {
      setSelectedRows((prev) =>
         prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
      );
   };
   //checkbox select all
   const handleSelectAll = (e) => {
      if (e.target.checked) {
         const allIds = filteredData.map((item) => item.id);
         setSelectedRows(allIds);
      } else {
         setSelectedRows([]);
      }
   };

   // bulk status update API
   const handleBulkUpdate = async () => {
      if (selectedRows.length > 0) {
         console.log("id, status", selectedRows, selectedStatus);
        try {
            const res = await updateOrderStatAdmin(token, selectedRows, selectedStatus);
            console.log(res);
        } catch(err){
            console.log(err);
            throw err;
        }
         setSelectedRows([]); // Clear selection after update
         setIsTriggerRender(!isTriggerRender);
      }
   };

   // Filter data based on search term
   //tableData === [{key:value},{},{}]
   const filteredData = tableData?.filter((obj) =>
      Object.values(obj).some((value) =>
         value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
   );

   // Pagination
   const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);
   const startIndex = (currentPage - 1) * itemsPerPage;
   const paginatedData = filteredData?.slice(startIndex, startIndex + itemsPerPage);
   return (
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg bg-card'>
         <div className='flex mt-6 ml-6 mb-1 items-center gap-2'>
            <FileCheck />
            <p className='text-base font-medium'>Update order status</p>
         </div>

         <main className='flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-2 bg-card dark:bg-gray-900 p-4'>
            <div className='flex items-center gap-2'>
               <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-0 focus:ring-offset-0 focus:outline-none p-2'
               >
                  <option value='Completed'>Completed</option>
                  <option value='Not Process'>Not Process</option>
                  <option value='Canceled'>Canceled</option>
               </select>
               <Button
                  onClick={handleBulkUpdate}
                  className='text-white  hover:bg-fuchsia-700 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-slate-500 dark:hover:bg-slate-600 focus:outline-none dark:focus:ring-slate-700'
                  disabled={selectedRows.length === 0}
               >
                  Update order status ({selectedRows.length} selected)
               </Button>
            </div>

            <div className='relative'>
               <input
                  type='text'
                  className='block w-[350px] ps-6 text-sm overflow-hidden transition-all duration-300 shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent p-2 rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'
                  placeholder='Search...'
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </main>
         <main className='p-4 bg-card'>
            <div className='border rounded-xl overflow-hidden'>
               <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                  <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                     <tr>
                        <th
                           scope='col'
                           className='p-4'
                        >
                           <div className='flex items-center'>
                              <input
                                 type='checkbox'
                                 checked={selectedRows.length === filteredData?.length}
                                 onChange={(e)=>handleSelectAll(e)}
                                 className='w-4 h-4 text-slate-900 shadow bg-gray-100 border-gray-300 rounded focus:ring-0 focus:ring-offset-0 focus:outline-none'
                              />
                           </div>
                        </th>
                        <th
                           scope='col'
                           className='px-6 py-3 cursor-pointer'
                           onClick={() => sortData("id")}
                        >
                           <div className='flex items-center whitespace-nowrap'>
                              Order ID
                              <svg
                                 className={`w-4 h-4 ml-2  hover:text-fuchsia-700 hover:scale-125 transition-transform duration-300 ${
                                    sortCol === "id" && sortOrder === "asc" ? "rotate-180" : ""
                                 }`}
                                 xmlns='http://www.w3.org/2000/svg'
                                 fill='none'
                                 viewBox='0 0 24 24'
                                 stroke='currentColor'
                              >
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M8 9l4-4 4 4m0 6l-4 4-4-4'
                                 />
                              </svg>
                           </div>
                        </th>
                        <th
                           scope='col'
                           className='px-6 py-3'
                        >
                           User
                        </th>
                        <th
                           scope='col'
                           className='flex items-center px-6 py-3 cursor-pointer whitespace-nowrap'
                           onClick={() => sortData("orderedById")}
                        >
                           User Id
                           <svg
                              className={`w-4 h-4 ml-2  hover:text-fuchsia-700 hover:scale-125 transition-transform duration-300 ${
                                 sortCol === "orderedById" && sortOrder === "asc"
                                    ? "rotate-180"
                                    : ""
                              }`}
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                           >
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={2}
                                 d='M8 9l4-4 4 4m0 6l-4 4-4-4'
                              />
                           </svg>
                        </th>
                        <th
                           scope='col'
                           className='px-6 py-3'
                        >
                           Address
                        </th>
                        <th
                           scope='col'
                           className='px-6 py-3'
                        >
                           Products
                        </th>
                        <th
                           scope='col'
                           className='px-6 py-3 cursor-pointer'
                           onClick={() => sortData("cartTotal")}
                        >
                           <div className='flex items-center whitespace-nowrap'>
                              Net Total
                              <svg
                                 className={`w-4 h-4 ml-2 hover:text-fuchsia-700 hover:scale-125 transition-transform duration-300 ${
                                    sortCol === "cartTotal" && sortOrder === "asc"
                                       ? "rotate-180"
                                       : ""
                                 }`}
                                 xmlns='http://www.w3.org/2000/svg'
                                 fill='none'
                                 viewBox='0 0 24 24'
                                 stroke='currentColor'
                              >
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M8 9l4-4 4 4m0 6l-4 4-4-4'
                                 />
                              </svg>
                           </div>
                        </th>
                        <th
                           scope='col'
                           className='px-6 py-3 cursor-pointer'
                           onClick={() => sortData("createdAt")}
                        >
                           <div className='flex items-center whitespace-nowrap'>
                              Created At
                              <svg
                                 className={`w-4 h-4 ml-2 hover:text-fuchsia-700 hover:scale-125 transition-transform duration-300 ${
                                    sortCol === "createdAt" && sortOrder === "asc"
                                       ? "rotate-180"
                                       : ""
                                 }`}
                                 xmlns='http://www.w3.org/2000/svg'
                                 fill='none'
                                 viewBox='0 0 24 24'
                                 stroke='currentColor'
                              >
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M8 9l4-4 4 4m0 6l-4 4-4-4'
                                 />
                              </svg>
                           </div>
                        </th>
                        <th
                           scope='col'
                           className='px-6 py-3 cursor-pointer'
                           onClick={() => sortData("updatedAt")}
                        >
                           <div className='flex items-center whitespace-nowrap'>
                              Updated At
                              <svg
                                 className={`w-4 h-4 ml-2 hover:text-fuchsia-700 hover:scale-125 transition-transform duration-300 ${
                                    sortCol === "updatedAt" && sortOrder === "asc"
                                       ? "rotate-180"
                                       : ""
                                 }`}
                                 xmlns='http://www.w3.org/2000/svg'
                                 fill='none'
                                 viewBox='0 0 24 24'
                                 stroke='currentColor'
                              >
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M8 9l4-4 4 4m0 6l-4 4-4-4'
                                 />
                              </svg>
                           </div>
                        </th>
                        <th
                           scope='col'
                           className='flex items-center px-6 py-3 whitespace-nowrap'
                           onClick={() => sortData("status")}
                        >
                           Payment Status
                           <svg
                              className={`w-4 h-4 ml-2 hover:text-fuchsia-700 hover:scale-125 transition-transform duration-300 ${
                                 sortCol === "status" && sortOrder === "asc" ? "rotate-180" : ""
                              }`}
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                           >
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={2}
                                 d='M8 9l4-4 4 4m0 6l-4 4-4-4'
                              />
                           </svg>
                        </th>
                        <th
                           scope='col'
                           className='px-6 py-3 cursor-pointer'
                           onClick={() => sortData("orderStatus")}
                        >
                           <div className='flex items-center whitespace-nowrap'>
                              Order Status
                              <svg
                                 className={`w-4 h-4 ml-2 hover:text-fuchsia-700 hover:scale-125 transition-transform duration-300 ${
                                    sortCol === "orderStatus" && sortOrder === "asc"
                                       ? "rotate-180"
                                       : ""
                                 }`}
                                 xmlns='http://www.w3.org/2000/svg'
                                 fill='none'
                                 viewBox='0 0 24 24'
                                 stroke='currentColor'
                              >
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M8 9l4-4 4 4m0 6l-4 4-4-4'
                                 />
                              </svg>
                           </div>
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {paginatedData?.map((item) => (
                        <tr
                           key={item.id}
                           className='bg-card border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                        >
                           <td className='w-4 p-4'>
                              <div className='flex items-center'>
                                 <input
                                    type='checkbox'
                                    checked={selectedRows.includes(item.id)}
                                    onChange={() => handleSelectRow(item.id)}
                                    className='w-4 h-4 text-slate-900 shadow bg-gray-100 border-gray-300 rounded focus:ring-0 focus:ring-offset-0 focus:outline-none'
                                 />
                              </div>
                           </td>
                           <td className='px-6 py-4'>{item.id}</td>
                           <td className='px-6 py-4'>
                              <div className='text-base font-semibold'>{item.orderedBy?.name}</div>
                              <div className='font-normal text-gray-500'>
                                 {item.orderedBy?.email}
                              </div>
                           </td>
                           <td className='px-6 py-4'>{item.orderedById}</td>
                           <td className='px-6 py-4'>{item.orderedBy?.address}</td>
                           <td className='px-6 py-4'>
                              {item.products?.map((prod, i) => (
                                 <div
                                    key={i}
                                    className='whitespace-nowrap'
                                 >
                                    <div>{prod.product?.title}</div>
                                    <div className='pl-5'>
                                       {prod?.count}x ฿{prod?.price}
                                    </div>
                                 </div>
                              ))}
                           </td>
                           <td className='px-6 py-4'>฿{item.cartTotal}</td>
                           <td className='px-6 py-4'>
                              {new Date(item.createdAt).toLocaleString("en-us", {
                                 timeZone: "Asia/Bangkok"
                              })}
                           </td>
                           <td className='px-6 py-4'>
                              {new Date(item.updatedAt).toLocaleString("en-us", {
                                 timeZone: "Asia/Bangkok"
                              })}
                           </td>
                           <td className='px-6 py-4'>{item.status || "not process"}</td>
                           <td className='px-6 py-4'>
                              <span
                                 className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    item.orderStatus === "Completed"
                                       ? "bg-green-100 text-green-700"
                                       : item.orderStatus === "Not Process"
                                       ? "bg-yellow-100 text-yellow-700"
                                       : "bg-red-100 text-red-700"
                                 }`}
                              >
                                 {item.orderStatus}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </main>
         {/* Pagination */}
         <main className='flex items-center justify-end p-4 my-4 bg-card '>
            <div className='flex items-center space-x-2'>
               <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className='px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50'
               >
                  Previous
               </button>
               <span className='text-sm text-gray-700'>
                  Page {currentPage} of {totalPages}
               </span>
               <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className='px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50'
               >
                  Next
               </button>
            </div>
         </main>
      </div>
   );
}

OrderTable.propTypes = {};

export default OrderTable;

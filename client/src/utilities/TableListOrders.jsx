import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { data } from "react-router-dom";

function TableListOrders({ data }) {
   const [selectedOrders, setSelectedOrders] = useState([]);
   const tableRef = useRef(null); //to clear checkbox in table
   const [currentPage, setCurrentPage] = useState(1);
   const [searchTerm, setSearchTerm] = useState("");
   const [sortCol, setSortCol] = useState("");
   const [sortOrder, setSortOrder] = useState("asc");
   const [tableData, setTableData] = useState(data);
   const [selectedRows, setSelectedRows] = useState([]);
   const [selectedStatus, setSelectedStatus] = useState("Completed");
   const itemsPerPage = 5;

   useEffect(() => {
      setTableData(data);
   }, [data]);

   // Sort function
   const sortData = (col) => {
      const sortedData = [...tableData].sort((a, b) => {
         if (a[col] < b[col]) return sortOrder === "asc" ? -1 : 1;
         if (a[col] > b[col]) return sortOrder === "asc" ? 1 : -1;
         return 0;
      });
      setTableData(sortedData);
      setSortCol(col);
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
   };

   // Handle checkbox selection
   const handleSelectRow = (id) => {
      setSelectedRows((prev) =>
         prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
      );
   };

   const handleSelectAll = (e) => {
      if (e.target.checked) {
         const allIds = filteredData.map((item) => item.id);
         setSelectedRows(allIds);
      } else {
         setSelectedRows([]);
      }
   };

   // Handle bulk status update
   const handleBulkUpdate = () => {
      if (selectedRows.length > 0) {
        //API
        //  onUpdateStatuses(selectedRows, selectedStatus);
         setSelectedRows([]); // Clear selection after update
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
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
         <div className='flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900 p-4'>
            <div className='flex items-center gap-2'>
               <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'
               >
                  <option value='Completed'>Completed</option>
                  <option value='Not Process'>Not Process</option>
                  <option value='Canceled'>Canceled</option>
               </select>
               <button
                  onClick={handleBulkUpdate}
                  className='text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-700'
                  disabled={selectedRows.length === 0}
               >
                  Update order status ({selectedRows.length} selected)
               </button>
            </div>

            <div className='relative'>
               <div className='absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none'>
                  <svg
                     className='w-4 h-4 text-gray-500 dark:text-gray-400'
                     aria-hidden='true'
                     xmlns='http://www.w3.org/2000/svg'
                     fill='none'
                     viewBox='0 0 20 20'
                  >
                     <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                     />
                  </svg>
               </div>
               <input
                  type='text'
                  className='block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='Search'
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

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
                           onChange={handleSelectAll}
                           className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
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
                           className={`w-4 h-4 ml-2 ${
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
                     className='px-6 py-3'
                  >
                     User Id
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
                           className={`w-4 h-4 ml-2 ${
                              sortCol === "cartTotal" && sortOrder === "asc" ? "rotate-180" : ""
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
                           className={`w-4 h-4 ml-2 ${
                              sortCol === "createdAt" && sortOrder === "asc" ? "rotate-180" : ""
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
                           className={`w-4 h-4 ml-2 ${
                              sortCol === "updatedAt" && sortOrder === "asc" ? "rotate-180" : ""
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
                     Payment Status
                  </th>
                  <th
                     scope='col'
                     className='px-6 py-3 cursor-pointer'
                     onClick={() => sortData("orderStatus")}
                  >
                     <div className='flex items-center whitespace-nowrap'>
                        Order Status
                        <svg
                           className={`w-4 h-4 ml-2 ${
                              sortCol === "orderStatus" && sortOrder === "asc" ? "rotate-180" : ""
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
                     className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                  >
                     <td className='w-4 p-4'>
                        <div className='flex items-center'>
                           <input
                              type='checkbox'
                              checked={selectedRows.includes(item.id)}
                              onChange={() => handleSelectRow(item.id)}
                              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                           />
                        </div>
                     </td>
                     <td className='px-6 py-4'>{item.id}</td>
                     <td className='px-6 py-4'>
                        <div className='text-base font-semibold'>{item.orderedBy?.name}</div>
                        <div className='font-normal text-gray-500'>{item.orderedBy?.email}</div>
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

         {/* Pagination */}
         <div className='flex items-center justify-between p-4'>
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
         </div>
      </div>
   );
}

TableListOrders.propTypes = {
   data: PropTypes.array
};

export default TableListOrders;

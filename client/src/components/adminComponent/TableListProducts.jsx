//sortable table of all products
//parent→ FormProduct.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Table } from "flowbite-react";

//icon
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import ImgProdInTableList from "./ImgProdInTableList";

function TableListProducts({ products }) {
   //initialize the sort col and order
   const [tableData, setTableData] = useState(products);
   const [sortCol, setSortCol] = useState(null);
   const [sortOrder, setSortOrder] = useState("asc");
   console.log("prod in table", products); //===[{images:[{url:..}],...}, {}]
   // console.log('data',data)

   //function to sort table data
   const sortData = (col) => {
      const sortedData = [...tableData].sort((a, b) => {
         if (a[col] < b[col]) return sortOrder === "asc" ? -1 : 1;
         if (a[col] > b[col]) return sortOrder === "asc" ? 1 : -1;
         return 0;
      });
      setTableData(sortedData);
      setSortCol(col);
      setSortOrder(sortOrder === "asc" ? "desc" : "asc"); //toggle between asc and desc
   };

   return (
      <div>
         <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
            <Table>
               <Table.Head>
                  <Table.HeadCell
                     className='cursor-pointer'
                     onClick={() => sortData("id")}
                  >
                     <div className='flex items-center'>
                        ID
                        {sortCol === "id" && (
                           <svg
                              className={`w-4 h-4 ml-2 transition-transform ${
                                 sortOrder === "asc" ? "rotate-180" : ""
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
                        )}
                     </div>
                  </Table.HeadCell>
                  <Table.HeadCell>
                     <div className='text-center'>Image</div>
                  </Table.HeadCell>
                  <Table.HeadCell
                     className='cursor-pointer'
                     onClick={() => sortData("title")}
                  >
                     <div className='flex items-center'>
                        Title
                        {sortCol === "title" && (
                           <svg
                              className={`w-4 h-4 ml-2 transition-transform ${
                                 sortOrder === "asc" ? "rotate-180" : ""
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
                        )}
                     </div>
                  </Table.HeadCell>
                  <Table.HeadCell
                     className='cursor-pointer'
                     onClick={() => sortData("categoryId")}
                  >
                     <div className='flex items-center truncate'>
                        Category ID
                        {sortCol === "categoryId" && (
                           <svg
                              className={`w-4 h-4 ml-2 transition-transform ${
                                 sortOrder === "asc" ? "rotate-180" : ""
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
                        )}
                     </div>
                  </Table.HeadCell>

                  <Table.HeadCell
                     className='cursor-pointer'
                     onClick={() => sortData("price")}
                  >
                     <div className='flex items-center'>
                        Price
                        {sortCol === "price" && (
                           <svg
                              className={`w-4 h-4 ml-2 transition-transform ${
                                 sortOrder === "asc" ? "rotate-180" : ""
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
                        )}
                     </div>
                  </Table.HeadCell>

                  <Table.HeadCell
                     className='cursor-pointer'
                     onClick={() => sortData("quantity")}
                  >
                     <div className='flex items-center'>
                        Quantity
                        {sortCol === "quantity" && (
                           <svg
                              className={`w-4 h-4 ml-2 transition-transform ${
                                 sortOrder === "asc" ? "rotate-180" : ""
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
                        )}
                     </div>
                  </Table.HeadCell>

                  <Table.HeadCell
                     className='cursor-pointer'
                     onClick={() => sortData("sold")}
                  >
                     <div className='flex items-center'>
                        Sold
                        {sortCol === "sold" && (
                           <svg
                              className={`w-4 h-4 ml-2 transition-transform ${
                                 sortOrder === "asc" ? "rotate-180" : ""
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
                        )}
                     </div>
                  </Table.HeadCell>

                  <Table.HeadCell
                     className='cursor-pointer'
                     onClick={() => sortData("description")}
                  >
                     <div className='flex items-center'>
                        Description
                        {sortCol === "description" && (
                           <svg
                              className={`w-4 h-4 ml-2 transition-transform ${
                                 sortOrder === "asc" ? "rotate-180" : ""
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
                        )}
                     </div>
                  </Table.HeadCell>
                  <Table.HeadCell
                     className='cursor-pointer'
                     onClick={() => sortData("createdAt")}
                  >
                     <div className='flex items-center'>
                        Created At
                        {sortCol === "createdAt" && (
                           <svg
                              className={`w-4 h-4 ml-2 transition-transform ${
                                 sortOrder === "asc" ? "rotate-180" : ""
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
                        )}
                     </div>
                  </Table.HeadCell>

                  <Table.HeadCell
                     className='cursor-pointer'
                     onClick={() => sortData("updatedAt")}
                  >
                     <div className='flex items-center'>
                        Updated At
                        {sortCol === "updatedAt" && (
                           <svg
                              className={`w-4 h-4 ml-2 transition-transform ${
                                 sortOrder === "asc" ? "rotate-180" : ""
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
                        )}
                     </div>
                  </Table.HeadCell>
                  <Table.HeadCell>
                     <div className='flex items-center'>Edit</div>
                  </Table.HeadCell>
               </Table.Head>

               <Table.Body className='divide-y'>
                  {/* TableData === products */}
                  {tableData.map((row, rowIndex) => (
                     <Table.Row
                        key={rowIndex}
                        className='bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-600'
                     >
                        <Table.Cell className='font-medium text-gray-900 dark:text-white'>
                           {row.id}
                        </Table.Cell>
                        <Table.Cell className='text-center'>
                           <ImgProdInTableList
                              images={row.images}
                              rowIndex={rowIndex}
                           />
                        </Table.Cell>
                        <Table.Cell className='whitespace-nowrap'>{row.title}</Table.Cell>
                        <Table.Cell>{row.categoryId}</Table.Cell>
                        <Table.Cell>{row.price}</Table.Cell>
                        <Table.Cell>{row.quantity}</Table.Cell>
                        <Table.Cell>{row.sold}</Table.Cell>
                        <Table.Cell>{row.description}</Table.Cell>
                        <Table.Cell>{row.createdAt}</Table.Cell>
                        <Table.Cell>{row.updatedAt}</Table.Cell>
                        <Table.Cell>
                           <p
                              className='cursor-pointer'
                              title='Edit'
                           >
                              <Link to={"/admin/product/" + row.id}>
                                 <Pencil className='w-3 hover:text-Bg-warning' />
                              </Link>
                           </p>
                           <p
                              className='cursor-pointer'
                              title='Delete'
                           >
                              <Trash2 className='w-4 hover:text-rose-700' />
                           </p>
                        </Table.Cell>
                     </Table.Row>
                  ))}
               </Table.Body>
            </Table>
         </div>
      </div>
   );
}

TableListProducts.propTypes = {
   products: PropTypes.array
};

export default TableListProducts;

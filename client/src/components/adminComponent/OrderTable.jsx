import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { getOrdersAdmin } from "@/api/adminAuth";
import useEcomStore from "@/store/ecom-store";
import { Table } from "flowbite-react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import { formatNumber } from "@/utilities/formatNumber";

function OrderTable(props) {
   const { token } = useEcomStore((state) => state);
   //    const [orderArr, setOrderArr] = useState([]);
   //for flowbite table
   const [selectedOrders, setSelectedOrders] = useState([]);
   const [tableData, setTableData] = useState([]);
   const tableRef = useRef(null); //to clear checkbox in table
   const [sortCol, setSortCol] = useState("id");
   const [sortOrder, setSortOrder] = useState("asc");
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
   }, [token]);
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
         <main className='w-full'>
            <div className='relative sm:rounded-lg rounded-xl border bg-card text-card-foreground shadow '>
               <Table>
                  <Table.Head>
                     <Table.HeadCell
                        className='cursor-pointer'
                        onClick={() => sortData("id")}
                     >
                        <div className='flex items-center whitespace-nowrap'>
                           Order ID
                           <svg
                              className={`w-4 h-4 ml-2 hover:text-fuchsia-700 hover:scale-125 transition-transform duration-300 ${
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
                     </Table.HeadCell>
                     <Table.HeadCell
                        className='cursor-pointer'
                        onClick={() => sortData("orderedBy.name")}
                     >
                        <div className='flex items-center whitespace-nowrap'>User</div>
                     </Table.HeadCell>
                     <Table.HeadCell
                        className='cursor-pointer'
                        onClick={() => sortData("orderedById")}
                     >
                        <div className='flex items-center whitespace-nowrap'>
                           User Id
                           <svg
                              className={`w-4 h-4 ml-2 hover:text-fuchsia-700 hover:scale-125 transition-transform duration-300 ${
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
                     </Table.HeadCell>
                     <Table.HeadCell
                        className='cursor-pointer'
                     >
                        <div className='flex items-center whitespace-nowrap'>
                           address
                        </div>
                     </Table.HeadCell>
                     <Table.HeadCell
                        className='cursor-pointer'
                     >
                        <div className='flex items-center whitespace-nowrap'>
                           Products
                        </div>
                     </Table.HeadCell>
                     <Table.HeadCell
                        className='cursor-pointer'
                        onClick={() => sortData("cartTotal")}
                     >
                        <div className='flex items-center whitespace-nowrap'>
                           Net Total
                           <svg
                              className={`w-4 h-4 ml-2 hover:text-fuchsia-700 hover:scale-125 transition-transform duration-300 ${
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
                     </Table.HeadCell>
                     <Table.HeadCell
                        className='cursor-pointer'
                        onClick={() => sortData("createdAt")}
                     >
                        <div className='flex items-center whitespace-nowrap'>
                           created At
                           <svg
                              className={`w-4 h-4 ml-2 hover:text-fuchsia-700 hover:scale-125 transition-transform duration-300 ${
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
                     </Table.HeadCell>
                     <Table.HeadCell
                        className='cursor-pointer'
                        onClick={() => sortData("updatedAt")}
                     >
                        <div className='flex items-center whitespace-nowrap'>
                           updated At
                           <svg
                              className={`w-4 h-4 ml-2 hover:text-fuchsia-700 hover:scale-125 transition-transform duration-300 ${
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
                     </Table.HeadCell>
                     <Table.HeadCell
                        className='cursor-pointer'
                        onClick={() => sortData("status")}
                     >
                        <div className='flex items-center whitespace-nowrap'>
                           Payment status
                           <svg
                              className={`w-4 h-4 ml-2 hover:text-fuchsia-700 hover:scale-125 transition-transform duration-300 ${
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
                     </Table.HeadCell>
                     <Table.HeadCell
                        className='cursor-pointer'
                        onClick={() => sortData("orderStatus")}
                     >
                        <div className='flex items-center whitespace-nowrap'>
                           Order status
                           <svg
                              className={`w-4 h-4 ml-2 hover:text-fuchsia-700 hover:scale-125 transition-transform duration-300 ${
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
                     </Table.HeadCell>
                     <Table.HeadCell
                        className='cursor-pointer whitespace-nowrap'
                     >
                        <div className='flex items-center'>Update order status</div>
                     </Table.HeadCell>
                  </Table.Head>
                  {/* Body */}
                  <Table.Body className='divide-y'>
                     {tableData?.map((order) => {
                        return (
                           <Table.Row
                              key={order.id}
                              className='bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-600'
                           >
                              <Table.Cell>{order?.id}</Table.Cell>
                              <Table.Cell>
                                 <p>{order.orderedBy?.name}</p>
                                 <p>{order.orderedBy?.email}</p>
                              </Table.Cell>
                              <Table.Cell>{order.orderedById}</Table.Cell>
                              <Table.Cell>{order.orderedBy?.address}</Table.Cell>
                              <Table.Cell>
                                 {order.products?.map((prod, i) => (
                                    <div
                                       key={i}
                                       className='whitespace-nowrap'
                                    >
                                       <li>{prod.product?.title}</li>
                                       <p className='pl-5'>
                                          {prod?.count}x ฿{formatNumber(prod?.price)}
                                       </p>
                                    </div>
                                 ))}
                              </Table.Cell>
                              <Table.Cell>฿{formatNumber(order?.cartTotal)}</Table.Cell>
                              <Table.Cell>
                                 {new Date(order?.createdAt).toLocaleString("en-us", {
                                    timeZone: "Asia/Bangkok"
                                 })}
                              </Table.Cell>
                              <Table.Cell>
                                 {new Date(order?.updatedAt).toLocaleString("en-us", {
                                    timeZone: "Asia/Bangkok"
                                 })}
                              </Table.Cell>
                              <Table.Cell>{order?.status || "not process"}</Table.Cell>
                              {/* <Table.Cell>{order.orderStatus}</Table.Cell> */}
                              <Table.Cell className='whitespace-nowrap'>
                                 {
                                    <span
                                       className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          order?.orderStatus === "Completed"
                                             ? "bg-green-100 text-green-700"
                                             : order?.orderStatus === "Not Process"
                                             ? "bg-yellow-100 text-yellow-700"
                                             : "bg-red-100 text-red-700"
                                       }`}
                                    >
                                       {order?.orderStatus === "Completed"
                                          ? "Completed"
                                          : order?.orderStatus === "Not Process"
                                          ? "Not Process"
                                          : "Canceled"}
                                    </span>
                                 }
                              </Table.Cell>
                              <Table.Cell>dropdown</Table.Cell>
                           </Table.Row>
                        );
                     })}
                  </Table.Body>
               </Table>
            </div>
         </main>
      </div>
   );
}

OrderTable.propTypes = {};

export default OrderTable;

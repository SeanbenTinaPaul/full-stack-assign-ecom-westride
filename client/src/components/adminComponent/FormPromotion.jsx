//parent → PromotionAdmin.jsx
import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/hooks/use-toast";
import { CalendarIcon, Percent, Timer } from "lucide-react";
import useEcomStore from "@/store/ecom-store";
import { bulkDiscount } from "@/api/ProductAuth";

function FormPromotion(props) {
   const { getProduct, products, token } = useEcomStore();
   const { toast } = useToast();
   const tableRef = useRef(null); //for clear checkbox in table
   // const [products, setProducts] = useState([]); //for fetching all products from DB
   const [selectedProducts, setSelectedProducts] = useState([]);
   const [discountAmount, setDiscountAmount] = useState("");
   const [startDate, setStartDate] = useState(new Date());
   const [endDate, setEndDate] = useState(new Date());
   const [description, setDescription] = useState("");
   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
   const [isPromotion, setIsPromotion] = useState(false); //true = promotion, false = discount
   // products === [{ title:"test", discounts:[{ isActive:true, startDate:"2025-01-17T21:58:44.063Z" }] }, {}, ..]
   // สำหรับโหลดข้อมูลสินค้าทั้งหมด
   useEffect(() => {
      const fetchProducts = async () => {
         try {
            // const res = await getProduct(100);
            // setProducts(res.data);
            getProduct(100);
         } catch (error) {
            console.error(error);
            toast({
               variant: "destructive",
               title: "Error",
               description: "Failed to load products"
            });
         }
      };
      fetchProducts();
   }, []);

   //clear checkbox symbol in table when clicked 'Reset' button
   const handleReset = () => {
      setSelectedProducts([]);
      setDiscountAmount("");
      setDescription("");
      // Reset table selection state
      if (tableRef.current) {
         tableRef.current.toggleAllRowsSelected(false);
      }
   };

   // คอลัมน์สำหรับตารางสินค้า
   //table and row props are passed from useReactTable() → data-table.jsx
   const columns = [
      {
         //id === identifier to access data of col (i.e. coloumn name from DB)
         id: "select",
         //content to be displayed in the column header. This can be a string, a JSX element, or a function that returns a JSX element.
         header: ({ table }) => (
            <Checkbox
               checked={table.getIsAllPageRowsSelected()}
               //pass !!value to ensure value is always 1 type boolean and not switchable (truthy===true, falsy===false)
               //in this case, value itself is a boolean by default, but pass !!value just for more defensive555
               onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            />
         ),
         //content to be displayed in each cell of the column.
         cell: ({ row }) => (
            <Checkbox
               checked={row.getIsSelected()}
               onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
         )
      },
      {
         accessorKey: "id",
         header: ({ column }) => {
            return (
               <Button
                  variant='ghost'
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
               >
                  ID
                  <div className='w-full flex justify-center hover:text-fuchsia-700  hover:scale-125 active:rotate-180 transition-transform duration-200'>
                     <svg
                        className='w-4 h-4'
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
               </Button>
            );
         }
      },
      {
         accessorKey: "title",
         header: ({ column }) => {
            return (
               <Button
                  variant='ghost'
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
               >
                  Product Name
                  <div className='w-full flex justify-center hover:text-fuchsia-700  hover:scale-125 active:rotate-180 transition-transform duration-200'>
                     <svg
                        className='w-4 h-4'
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
               </Button>
            );
         }
      },
      {
         accessorKey: "price",
         header: ({ column }) => {
            return (
               <Button
                  variant='ghost'
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
               >
                  Price
                  <div className='w-full flex justify-center hover:text-fuchsia-700  hover:scale-125 active:rotate-180 transition-transform duration-200'>
                     <svg
                        className='w-4 h-4'
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
               </Button>
            );
         }
      },
      {
         accessorKey: "categoryId",
         header: ({ column }) => {
            return (
               <Button
                  variant='ghost'
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
               >
                  Category ID
                  <div className='w-full flex justify-center hover:text-fuchsia-700  hover:scale-125 active:rotate-180 transition-transform duration-200'>
                     <svg
                        className='w-4 h-4'
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
               </Button>
            );
         }
      },
      {
         accessorKey: "promotion",
         header: ({ column }) => {
            return (
               <Button
                  variant='ghost'
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
               >
                  Current Promotion
                  <div className='w-full flex justify-center hover:text-fuchsia-700  hover:scale-125 active:rotate-180 transition-transform duration-200'>
                     <svg
                        className='w-4 h-4'
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
               </Button>
            );
         },
         cell: ({ row }) => {
            //row.original === products[i]
            return row.original.promotion ? "-" + row.original.promotion + "%" : "-";
         }
      },
      {
         accessorKey: "discounts",
         header: ({ column }) => {
            return (
               <Button
                  variant='ghost'
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
               >
                  Current Discounts
                  <div className='w-full flex justify-center hover:text-fuchsia-700  hover:scale-125 active:rotate-180 transition-transform duration-200'>
                     <svg
                        className='w-4 h-4'
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
               </Button>
            );
         },
         cell: ({ row }) => {
            const discounts = row.original.discounts || [];
            return discounts.length > 0 ? discounts.map((d) => `-${d.amount}%`) : "-";
         }
      },
      {
         accessorKey: "startDate",
         header: ({ column }) => (
            <Button
               variant='ghost'
               onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
               startDate
               <div className='w-full flex justify-center hover:text-fuchsia-700  hover:scale-125 active:rotate-180 transition-transform duration-200'>
                  <svg
                     className='w-4 h-4'
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
            </Button>
         ),
         //to sort date
         sortingFn: (rowA, rowB) => {
            // Get the first discount's startDate from each row
            const dateA = rowA.original.discounts?.[0]?.startDate
               ? new Date(rowA.original.discounts[0].startDate)
               : new Date(0);
            const dateB = rowB.original.discounts?.[0]?.startDate
               ? new Date(rowB.original.discounts[0].startDate)
               : new Date(0);
            return dateA.getTime() - dateB.getTime();
         },
         //display table content
         cell: ({ row }) => {
            const discounts = row.original.discounts || [];
            return discounts.length > 0
               ? discounts
                    .map((d) => {
                       // แปลง string เป็น Date object
                       const date = new Date(d.startDate);
                       return date.toLocaleString("en-uk", {
                          timeZone: "Asia/Bangkok",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true
                       });
                    })
                    .join(", ") // เพิ่ม join เพื่อแสดงผลเป็น string เดียว
               : "-";
         }
      },
      {
         accessorKey: "endDate",
         header: ({ column }) => (
            <Button
               variant='ghost'
               onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
               endDate
               <div className='w-full flex justify-center hover:text-fuchsia-700  hover:scale-125 active:rotate-180 transition-transform duration-200'>
                  <svg
                     className='w-4 h-4'
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
            </Button>
         ),
         sortingFn: (rowA, rowB) => {
            // Get the first discount's endDate from each row
            const dateA = rowA.original.discounts?.[0]?.endDate
               ? new Date(rowA.original.discounts[0].endDate)
               : new Date(0);
            const dateB = rowB.original.discounts?.[0]?.endDate
               ? new Date(rowB.original.discounts[0].endDate)
               : new Date(0);
            return dateA.getTime() - dateB.getTime();
         },

         cell: ({ row }) => {
            const discounts = row.original.discounts || [];
            return discounts.length > 0
               ? discounts
                    .map((d) => {
                       // แปลง string เป็น Date object
                       const date = new Date(d.endDate);
                       return date.toLocaleString("en-uk", {
                          timeZone: "Asia/Bangkok",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true
                       });
                    })
                    .join(", ") // เพิ่ม join เพื่อแสดงผลเป็น string เดียว
               : "-";
         }
      },
      {
         accessorKey: "isActive",
         header: ({ column }) => (
            <Button
               variant='ghost'
               onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
               Status
               <div className='w-full flex justify-center hover:text-fuchsia-700 hover:scale-125 active:rotate-180 transition-transform duration-200'>
                  <svg
                     className='w-4 h-4'
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
            </Button>
         ),
         sortingFn: (rowA, rowB) => {
            // Get status for each row
            const getStatus = (row) => {
               const discount = row.original.discounts?.[0];
               if (!discount) return "no-discount";

               const now = new Date();
               const startDate = new Date(discount.startDate);

               if (now < startDate) return "pending";
               if (!discount.isActive) return "expired";
               return "active";
            };

            const statusA = getStatus(rowA);
            const statusB = getStatus(rowB);

            // Define sort order: active > pending > expired > no-discount
            const statusOrder = {
               active: 3,
               pending: 2,
               expired: 1,
               "no-discount": 0
            };

            return statusOrder[statusA] - statusOrder[statusB];
         },

         cell: ({ row }) => {
            const discounts = row.original.discounts || [];
            if (discounts.length === 0) return "-";
            //today
            const now = new Date();

            // Check discount status for each discount
            const getDiscountStatus = (discount) => {
               const startDate = new Date(discount.startDate);
               if (now < startDate) return "pending";
               if (!discount.isActive) return "expired";
               return "active";
            };
            //note: based on DB, products[i].discounts.length === 1 per product
            //discounts===[{amount:, startDate:, endDate:, isActive:, productId:}]
            const status = discounts.map((d) => getDiscountStatus(d))[0];
            //display status according to recent date
            return (
               <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                     status === "active"
                        ? "bg-green-100 text-green-700"
                        : status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
               >
                  {status === "active" ? "Active" : status === "pending" ? "Pending" : "Expired"}
               </span>
            );
         }
      }
      //   {
      //      accessorKey: "title",
      //      header: "Product Name"
      //   },
      //   {
      //      accessorKey: "price",
      //      header: "Price"
      //   },
      //   {
      //      accessorKey: "categoryId",
      //      header: "Category ID"
      //   },
      //   {
      //      accessorKey: "currentDiscount",
      //      header: "Current Discount"
      //   }
   ];

   // //// Apply ส่วนลด
   const handleApplyDiscount = async () => {
      console.log("selectedProducts", selectedProducts);
      if (!discountAmount || selectedProducts.length === 0) {
         toast({
            variant: "destructive",
            title: "Error",
            description: "Please select products and enter discount amount"
         });
         return;
      }

      try {
         const discountData = {
            products: selectedProducts,
            amount: parseFloat(discountAmount),
            startDate,
            endDate,
            description,
            isPromotion
         };
         console.log("discountData", discountData);

         const res = await bulkDiscount(token, discountData);
         if (res.data) {
            toast({
               title: "Success",
               description: res.data.message
            });
            setShowConfirmDialog(false);
            // รีเซ็ตฟอร์ม
            setSelectedProducts([]);
            setDiscountAmount("");
            setDescription("");
            getProduct(100);
         }
      } catch (error) {
         console.error(error);
         toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to apply discount"
         });
      }
   };
   return (
      <div className='pt-6 space-y-6'>
         <div className='w-full flex  mb-4 p-3 items-center rounded-xl gap-2 bg-card shadow-md'>
            <h1 className='text-xl font-medium text-slate-700'>Promotion Management</h1>
         </div>
         <Card>
            <CardHeader>
               <CardTitle className='flex items-center gap-2'>
                  <Percent className='w-5 h-5' />
                  Bulk Discount
               </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
               <div className='flex flex-col md:flex-row gap-4'>
                  <div className='flex-1 space-y-2'>
                     <label className='text-sm font-medium'>Discount Type</label>
                     <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-2'>
                           <Checkbox
                              checked={!isPromotion} //checked by default → !false === true
                              onCheckedChange={() => setIsPromotion(false)}
                           />
                           <span>Seasonal Discount</span>
                        </div>
                        <div className='flex items-center gap-2'>
                           <Checkbox
                              checked={isPromotion} //unchecked by default
                              onCheckedChange={() => setIsPromotion(true)}
                           />
                           <span>General Promotion</span>
                        </div>
                     </div>
                  </div>
                  <div className='flex-1'>
                     <label className='text-sm font-medium '>Discount Amount (%)</label>
                     <Input
                        type='number'
                        min='0'
                        max='100'
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(e.target.value)}
                        className='mt-1 shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent p-2 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'
                     />
                  </div>
               </div>
               {/* Calendar************* */}
               {!isPromotion && (
                  <div className='space-y-2'>
                     <label className='text-sm font-medium flex items-center gap-2'>
                        <Timer className='w-4 h-4' />
                        Discount Period
                     </label>
                     <div className='flex flex-col md:flex-row gap-4'>
                        <div className='flex-1'>
                           <div className='flex items-center gap-2 text-slate-500'>
                              <span className='font-medium text-sm'>Start Date</span>
                              <CalendarIcon className='w-4 h-4' />
                           </div>
                           <Calendar
                              mode='single' //can be single or range
                              selected={startDate}
                              onSelect={setStartDate}
                              className='flex shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] rounded-md border focus:ring-1 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'
                           />
                        </div>
                        <div className='flex-1'>
                           <div className='flex items-center gap-2 text-slate-500'>
                              <span className='font-medium text-sm'>End Date</span>
                              <CalendarIcon className='w-4 h-4' />
                           </div>
                           <Calendar
                              mode='single'
                              selected={endDate}
                              onSelect={setEndDate}
                              className='flex shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] rounded-md border focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'
                           />
                        </div>
                     </div>
                  </div>
               )}

               <div className='space-y-2'>
                  <label className='text-sm font-medium'>Description</label>
                  <Input
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     placeholder='e.g. New Year Sale, Summer Collection'
                     className='shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent p-2 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'
                  />
               </div>
            </CardContent>
         </Card>
         {/* Table*********** */}
         {/* {console.log("products to table", products)} */}
         <div className=''>
            <DataTable
               columns={columns}
               data={products}
               onRowSelection={setSelectedProducts}
               tableRef={tableRef} // Pass ref to DataTable
            />
         </div>
         {/* Button******** */}
         <div className='flex justify-end gap-4'>
            <Button
               variant='outline'
               onClick={handleReset}
            >
               Reset
            </Button>
            <Button
               onClick={() => setShowConfirmDialog(true)}
               disabled={!discountAmount || selectedProducts.length === 0}
            >
               Apply Discount
            </Button>
         </div>

         <AlertDialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
         >
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Discount Application</AlertDialogTitle>
                  <AlertDialogDescription>
                     Are you sure you want to apply a {discountAmount}% discount to{" "}
                     {selectedProducts.length} selected products?
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleApplyDiscount}>Apply</AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </div>
   );
}

FormPromotion.propTypes = {};

export default FormPromotion;

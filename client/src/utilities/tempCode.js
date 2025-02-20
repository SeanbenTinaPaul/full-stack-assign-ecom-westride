//3D inside input text : className='w-full p-2 rounded-xl overflow-hidden transition-all duration-300 shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent  focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'
//ลูกอมนูน : className='px-3 w-8 h-8 rounded-xl bg-gradient-to-b from-gray-200 to-gray-300  shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),0_4px_6px_rgba(0,0,0,0.15)] hover:from-gray-300 hover:to-gray-400 hover:shadow-[inset_0_-1px_2px_rgba(0,0,0,0.15),0_6px_8px_rgba(0,0,0,0.2)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] active:translate-y-0.5 transition-all duration-500'
//เงา svg 'text-slate-900 drop-shadow-sm '
//ปุมม่วง(gradient) className='w-full mt-4 bg-gradient-to-r from-fuchsia-800 to-fuchsia-600 hover:from-fuchsia-700 hover:to-fuchsia-500 text-white py-2 shadow-md rounded-xl '
//ปุ่มม่วง className='w-full mt-4 bg-fuchsia-800 text-white py-2 shadow-md rounded-xl hover:bg-fuchsia-700 transition-all duration-300'>
//topic 1 className=' bg-gradient-to-r from-slate-700 to-slate-500 p-6 rounded-xl mb-4 flex items-center shadow-md'>
//topic 2 className='rounded-xl mt-4 mb-4 p-2 gap-2 flex items-center bg-gradient-to-r from-slate-100 to-card  shadow-md '>
//font topic <h1 className='text-xl font-sans font-semibold drop-shadow-sm'>

//If don't set redirect: "if_required"→ need to handle the redirects manually▼ redirect: null
   if (payload.error) {
   setMessage(payload.error.message);
} else {
   const { paymentIntent, error } = payload;

   if (paymentIntent.status === "succeeded") {
      // Payment was successful
      // Redirect to your payment completion page
      window.location.href = "/complete";
   } else if (paymentIntent.status === "requires_action") {
      // Payment method requires action
      // Redirect to the appropriate URL to complete the authentication
      window.location.href = paymentIntent.next_action.url;
   } else {
      // Payment failed
      setMessage(error.message);
   }
  
//----------------------------------------------------------------------------

//----------------------------------------------------------------------------

   let diffArray = (arr1, arr2) => {
    let allArr = [...arr1, ...arr2];
    //1) นับจำนวนซ้ำ
    let allArrObj = allArr.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
  
    //2) กรองเอาเฉพาะ elements ที่ correspond to 'key':1
    allArr = Object.keys(allArrObj).filter((key) => allArrObj[key] === 1);
  
    //3) cast each elements to Number and sort
    return allArr.map((e) => Number(e)).sort((a, b) => a - b);
  };
  console.log(diffArray([1, 2, 3], [100, 2, 1, 10]));
/*
Make carts.map((cart) in CartCheckout.jsx won't display or update the items until users click "Place Order" in CartInfo.jsx
1. Create new state in ecom-store.jsx to track saved cart items
2. Only update this state when "Place Order" is clicked 
3. Use this state in CartCheckout.jsx instead of regular carts
4. Connect saved cart state to CartCheckout display

const ecomStore = (set, get) => ({
  // ... existing state
  carts: [], // For temporary cart
  savedCarts: [], // For saved/placed orders
  isSaveToCart: false,

  updateStatusSaveToCart: (value) => {
    if (value === true) {
      set({
        isSaveToCart: true,
        savedCarts: [...get().carts] // Save current cart items
      });
    }
  },
});

function CartCheckout(props) {
  // Change from carts to savedCarts
  const { savedCarts, adjustQuantity, removeCart, user, token, products, getProduct } = useEcomStore(
    (state) => state
  );

  // ... other code

  return (
    <div className='bg-card p-4 rounded-md shadow-md'>
    
      <div>
        <div>
          {savedCarts.map((cart) => ( // Use savedCarts instead of carts
            <div key={cart.id}>
              {/* ... existing cart item display code */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

*/

//flowbite for OrderTable.jsx
{/* ref table */}
<Table className=' bg-card' >
<Table.Head className=''>
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
   <Table.HeadCell className='cursor-pointer'>
      <div className='flex items-center whitespace-nowrap'>address</div>
   </Table.HeadCell>
   <Table.HeadCell className='cursor-pointer'>
      <div className='flex items-center whitespace-nowrap'>Products</div>
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
   <Table.HeadCell className='cursor-pointer whitespace-nowrap '>
      <div className='flex items-center'>Update order status</div>
   </Table.HeadCell>
</Table.Head>
{/* Body */}
<Table.Body className='divide-y border border-gray-100'>
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
            <Table.Cell>
               <select
                  onChange={(e) => handleUpdateStatus(order?.id, e.target.value)}
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2'
               >
                  <option value='Completed'>Completed</option>
                  <option value='Not Process'>Not Process</option>
                  <option value='Canceled'>Canceled</option>
               </select>
            </Table.Cell>
         </Table.Row>
      );
   })}
</Table.Body>
</Table>
//for shadcn table data OrderTable.jsx
const columns = [
  {
     id: "selects",
     header: ({ table }) => (
        <Checkbox
           checked={table.getIsAllPageRowsSelected()}
           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
     ),
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
              orderID
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
     accessorKey: "cartTotal",
     header: ({ column }) => {
        return (
           <Button
              variant='ghost'
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
           >
              Total(฿)
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
        return formatNumber(row.original.cartTotal);
     }
  },
  {
     accessorKey: "orderedById",
     header: ({ column }) => {
        return (
           <Button
              variant='ghost'
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
           >
              orderedById
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
     accessorKey: "email",
     header: ({ column }) => {
        return (
           <Button
              variant='ghost'
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
           >
              email
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
        return row.original.orderedBy.email;
     }
  },
  {
     accessorKey: "createdAt",
     header: ({ column }) => (
        <Button
           variant='ghost'
           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
           createdAt
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
        // Get the first discount's startDate from each row
        const dateA = rowA.original.createdAt ? new Date(rowA.original.createdAt) : new Date(0);
        const dateB = rowB.original.createdAt ? new Date(rowB.original.createdAt) : new Date(0);
        return dateA.getTime() - dateB.getTime();
     },
     cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return date.toLocaleString("en-us", {
           timeZone: "Asia/Bangkok"
        });
     }
  },
  {
     accessorKey: "updatedAt",
     header: ({ column }) => (
        <Button
           variant='ghost'
           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
           updatedAt
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
        // Get the first discount's startDate from each row
        const dateA = rowA.original.updatedAt ? new Date(rowA.original.updatedAt) : new Date(0);
        const dateB = rowB.original.updatedAt ? new Date(rowB.original.updatedAt) : new Date(0);
        return dateA.getTime() - dateB.getTime();
     },
     cell: ({ row }) => {
        const date = new Date(row.original.updatedAt);
        return date.toLocaleString("en-us", {
           timeZone: "Asia/Bangkok"
        });
     }
  },
  {
     accessorKey: "status",
     header: ({ column }) => {
        return (
           <Button
              variant='ghost'
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
           >
              Payment status
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
        return row.original.status || "-";
     }
  },
  {
     accessorKey: "orderStatus",
     header: ({ column }) => (
        <Button
           variant='ghost'
           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
           orderStatus
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
        const statusOrder = {
           Completed: 1,
           "Not Process": 0
        };
        const statusA = rowA.origianl.orderStatus || "Not Process";
        const statusB = rowB.origianl.orderStatus || "Not Process";
        return statusOrder[statusA] - statusOrder[statusB];
     },

     cell: ({ row }) => {
        const status = row.original.orderStatus;
        return (
           <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                 status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
              }`}
           >
              {status || "Not Process"}
           </span>
        );
     }
  }
];
//for syncing carts to DB
/*model Cart {
   id          Int             @id @default(autoincrement())
   cartTotal   Float
   orderedById Int
   orderedBy   User            @relation(fields: [orderedById], references: [id])
   products    ProductOnCart[]
   // Consider adding these fields
   lastSynced  DateTime        @updatedAt // Track last sync time
   status      String         @default("active") // Track cart status
 }
 
 model ProductOnCart {
   id        Int     @id @default(autoincrement())
   cartId    Int
   productId Int
   count     Int
   price     Float
   cart      Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
   product   Product @relation(fields: [productId], references: [id])
   // Consider adding these fields
   buyPriceNum Float  // Store discounted price at time of adding
   discount    Float? // Store applied discount
 }

 //add this in useEcomStore.jsx To properly sync with  global state
 addToCart: async (productObj) => {
   try {
     // 1. Update local state first (for UI responsiveness)
     const updatedCarts = [...get().carts, { ...productObj, countCart: 1 }];
     set({ carts: _.uniqWith(updatedCarts, _.isEqual) });
 
     // 2. Sync with backend
     if (get().user) {
       await axios.post("/api/cart", {
         cart: updatedCarts.map(item => ({
           productId: item.id,
           count: item.countCart,
           price: item.price,
           buyPriceNum: item.buyPriceNum
         }))
       });
     }
   } catch (err) {
     // Handle error, maybe revert local state
     console.error(err);
   }
 }
   */

// //for FormProduct
// const fileInputRef = useRef(null);
 
//  const handleButtonClick = () => {
//       fileInputRef.current?.click();
//    };

// <div className='p-6 space-y-6 max-w-3xl mx-auto'>
//             <h1 className='text-2xl font-bold mb-6'>Product Management</h1>
//             <Card className='shadow-lg'>
//                <CardHeader>
//                   <CardTitle className='flex items-center gap-2'>
//                      <Package className='w-5 h-5' />
//                      ข้อมูลพื้นฐาน
//                   </CardTitle>
//                </CardHeader>
//                <CardContent className='space-y-4'>
//                   <div className='space-y-2'>
//                      <label className='flex items-center gap-2 text-sm font-medium'>
//                         <Package2 className='w-4 h-4' />
//                         Product Name
//                      </label>
//                      <input
//                         type='text'
//                         placeholder='e.g. จานพลมเมลามีน, HP Laptop'
//                         className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
//                      />
//                   </div>

//                   <div className='space-y-2'>
//                      <label className='flex items-center gap-2 text-sm font-medium'>
//                         <FileText className='w-4 h-4' />
//                         Description
//                      </label>
//                      <textarea
//                         placeholder='e.g. มีสีฟ้าหวาน, อุปกรณ์'
//                         className='w-full p-2 border rounded-lg h-24 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
//                      />
//                   </div>
//                </CardContent>
//             </Card>

//             <Card className='shadow-lg'>
//                <CardHeader>
//                   <CardTitle className='flex items-center gap-2'>
//                      <FolderOpen className='w-5 h-5' />
//                      รายละเอียดสินค้า
//                   </CardTitle>
//                </CardHeader>
//                <CardContent className='space-y-4'>
//                   <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                      <div className='space-y-2'>
//                         <label className='flex items-center gap-2 text-sm font-medium'>
//                            <DollarSign className='w-4 h-4' />
//                            Price (฿)
//                         </label>
//                         <input
//                            type='number'
//                            placeholder='e.g. 5000, 99.50'
//                            className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
//                         />
//                      </div>

//                      <div className='space-y-2'>
//                         <label className='flex items-center gap-2 text-sm font-medium'>
//                            <Package2 className='w-4 h-4' />
//                            Quantity
//                         </label>
//                         <input
//                            type='number'
//                            placeholder='e.g. 150'
//                            className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
//                         />
//                      </div>
//                   </div>

//                   <div className='space-y-2'>
//                      <label className='flex items-center gap-2 text-sm font-medium'>
//                         <Image className='w-4 h-4' />
//                         Product Image
//                      </label>
//                      <div className='flex items-center gap-4'>
//                         <input
//                            type='file'
//                            ref={fileInputRef}
//                            className='hidden'
//                            onChange={(e) => console.log(e.target.files)}
//                         />
//                         <button
//                            onClick={handleButtonClick}
//                            className='px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
//                         >
//                            Choose Files
//                         </button>
//                         <span className='text-sm text-gray-500'>No file chosen</span>
//                      </div>
//                   </div>

//                   <div className='space-y-2'>
//                      <label className='flex items-center gap-2 text-sm font-medium'>
//                         <FolderOpen className='w-4 h-4' />
//                         Category
//                      </label>
//                      <Select className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'>
//                         <SelectTrigger>
//                            <SelectValue placeholder='Select category' />
//                         </SelectTrigger>
//                         <SelectContent>
//                            {/* <SelectGroup> */}
//                            {/* <SelectLabel>North America</SelectLabel> */}
//                            <SelectItem value='est'>Eastern Standard Time (EST)</SelectItem>
//                            <SelectItem value='cst'>Central Standard Time (CST)</SelectItem>
//                            <SelectItem value='mst'>Mountain Standard Time (MST)</SelectItem>
//                            <SelectItem value='pst'>Pacific Standard Time (PST)</SelectItem>
//                            <SelectItem value='akst'>Alaska Standard Time (AKST)</SelectItem>
//                            <SelectItem value='hst'>Hawaii Standard Time (HST)</SelectItem>
//                            {/* </SelectGroup> */}
//                            {/* <SelectGroup> */}
//                            {/* <SelectLabel>Europe & Africa</SelectLabel> */}
//                            <SelectItem value='gmt'>Greenwich Mean Time (GMT)</SelectItem>
//                            <SelectItem value='cet'>Central European Time (CET)</SelectItem>
//                            <SelectItem value='eet'>Eastern European Time (EET)</SelectItem>
//                            <SelectItem value='west'>Western European Summer Time (WEST)</SelectItem>
//                            <SelectItem value='cat'>Central Africa Time (CAT)</SelectItem>
//                            <SelectItem value='eat'>East Africa Time (EAT)</SelectItem>
//                            {/* </SelectGroup> */}
//                         </SelectContent>
//                      </Select>
//                   </div>
//                </CardContent>
//             </Card>

//             <Button className='w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'>
//                Add Product
//             </Button>
//          </div>

// FormCategory old
// import {
//    Select,
//    SelectContent,
//    SelectGroup,
//    SelectItem,
//    SelectLabel,
//    SelectTrigger,
//    SelectValue
// } from "@/components/ui/select";
{/*  Work example. Not gonna use this  */}
{/* <div className='container mx-auto p-4 bg-Dropdown-option-night shadow-md rounded-md'>
<h1 className='text-2xl font-bold mb-6'>Category Management</h1>
{alert}
<form
   onSubmit={handleSubmit}
   action=''
   className='my-4'
>
   <input
      //เปลี่ยนค่า name state ตามตัวอักษรที่พิมพ์ใน input
      onChange={(e) => setName(e.target.value)}
      value={name} //เพื่อทำให้ text หายไปหลังกด Add category
      type='text'
      placeholder='Enter a category name'
      className='border'
   />
   <button className='bg-fuchsia-800 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded shadow-md'>
      Add Category
   </button>
</form>
<ul className='list-none'>
   {categories.map((item) => (
      <li
         key={item.id}
         className='flex justify-between my-1 text-Text-white  hover:bg-gray-400 hover:font-semibold'
      >
         id:{item.id} {item.name}
         <button
            onClick={() => handleRemove(item.id, item.name)}
            className='text-Text-white hover:text-rose-700'
         >
            <Trash2 className='w-4 ' />
         </button>
      </li>
   ))}
</ul>
</div> */}

 //if user did not select category and click 'update Product' ► won't let to submit, using return to stop
      for (let key in inputForm) {
         if (!inputForm[key] || inputForm[key] === "") {
            if (
               key === "description" ||
               key === "sold" ||
               key === "images" ||
               key === "avgRating" ||
               key === "promotion"
            )
               continue; //empty description can be allowed
            if (key === "categoryId") {
               setAlert(
                  <Alert variant='destructive'>
                     <AlertCircle className='h-4 w-4' />
                     <AlertTitle>Warning!</AlertTitle>
                     <AlertDescription>Please select category.</AlertDescription>
                  </Alert>
               );
               setTimeout(() => setAlert(null), 3000);
               return;
            } else {
               setAlert(
                  <Alert variant='destructive'>
                     <AlertCircle className='h-4 w-4' />
                     <AlertTitle>Warning!</AlertTitle>
                     <AlertDescription>Please enter all fields.</AlertDescription>
                  </Alert>
               );
               setTimeout(() => setAlert(null), 3000);
               return;
            }
         }
      }
//parent → HistoryUser.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getOrderUser } from "@/api/userAuth";
import { reqRefund } from "@/api/PaymentAuth";
import useEcomStore from "@/store/ecom-store";
import { formatNumber } from "@/utilities/formatNumber";
import { FileClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
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

function HistoryList(props) {
   const { token } = useEcomStore((state) => state);
   const [orderList, setOrderList] = useState([]);
   const [selectedOrderId, setSelectedOrderId] = useState(null);
   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
   const { toast } = useToast();

   useEffect(() => {
      const fetchOrderList = async (token) => {
         try {
            const res = await getOrderUser(token);
            console.log("res.data orderList", res.data.data);
            setOrderList(res.data.data);
         } catch (err) {
            console.log(err);
            throw err;
         }
      };
      fetchOrderList(token);
   }, [token, setSelectedOrderId, setShowConfirmDialog, toast]);

   const handleRefund = async (orderId) => {
      try {
         const res = await reqRefund(token, orderId);
         console.log("res.data refund", res.data);
         if (res.data.success) {
            toast({
               title: "Refund requested successfully",
               description: "Your refund request has been processed"
            });
         }
         setShowConfirmDialog(false);
         setSelectedOrderId(null);
      } catch (err) {
         console.log(err);
         toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to process refund request"
         });
      }
   };

   return (
      <div>
         <div className='flex items-center mt-6 mb-4 gap-2 min-w-[500px] bg-card shadow-md p-4 rounded-xl'>
            <FileClock
               size={20}
               className='drop-shadow-sm'
            />
            <header className='text-lg font-semibold '>Purchase History</header>
         </div>
         {/* cover all */}
         <main>
            {/* card */}
            {orderList?.map((order) => (
               <article
                  className='flex flex-col gap-2 p-6 mb-4 bg-card rounded-xl shadow-md'
                  key={order.id}
               >
                  {/* header */}
                  <header className='flex justify-between'>
                     <div className='mb-2'>
                        <p className='text-sm font-semibold'>Order date</p>
                        <p className='font-light text-xs'>
                           {new Date(order.createdAt).toLocaleString("en-uk", {
                              timeZone: "Asia/Bangkok",
                              hour12: true
                           })}
                        </p>
                     </div>
                     <div
                        className={`h-fit w-fit px-2 py-1 rounded-full text-center text-xs font-medium ${
                           order.orderStatus === "Completed"
                              ? "text-green-700 bg-green-100"
                              : order.orderStatus === "Not Process"
                              ? "text-yellow-700 bg-yellow-100"
                              : "text-gray-500 bg-gray-200"
                        }`}
                     >
                        {order.orderStatus}
                     </div>
                  </header>
                  <div>
                     <table className='table-fixed w-full bg-card text-card-foreground rounded-lg'>
                        <thead className='border-b'>
                           <tr className='text-left text-sm'>
                              <th>Product title</th>
                              <th>Price</th>
                              <th>Quantity</th>
                              <th>Total</th>
                           </tr>
                        </thead>
                        <tbody>
                           {order?.products?.map((product) => (
                              <tr key={product.id}>
                                 <td>{product.product.title}</td>
                                 <td>฿{formatNumber(product.price)}</td>
                                 <td>{product.count}</td>
                                 <td>฿{formatNumber(product.price * product.count)}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
                  {/* total  */}
                  <footer className='flex justify-between items-end'>
                     {order.orderStatus === "Completed" ? (
                        <div className='w-full'>
                           {new Date().getTime() - new Date(order.createdAt).getTime() <=
                           3 * 24 * 60 * 60 * 1000 ? (
                              <div className="flex gap-2 items-center mt-4 ">
                                 <Button
                                    variant='secondary'
                                    type='button'
                                    className=' py-2 shadow-md rounded-xl bg-slate-50'
                                    onClick={() => {
                                       setSelectedOrderId(order.id);
                                       setShowConfirmDialog(true);
                                    }}
                                 >
                                    Refund My Order
                                 </Button>
                                 <p className="font-light text-xs text-gray-500">(3-day guarantee)</p>
                              </div>
                           ) : (
                              <div className='w-full text-sm text-gray-500'>Refunding expired</div>
                           )}
                        </div>
                     ) : order.orderStatus === "Refunded" ? (
                        <div className=' w-fit font-light text-sm text-gray-500 whitespace-nowrap'>
                           You got ฿{formatNumber(order?.refundAmount)} back (
                           {new Date(order?.updatedAt).toLocaleString("en-uk", {
                              timeZone: "Asia/Bangkok",
                              hour12: true
                           })}
                           )
                        </div>
                     ) : (
                        ""
                     )}
                     <div className='w-fit flex flex-col items-end'>
                        <p className='font-normal whitespace-nowrap'>Net Total</p>
                        <p className="font-medium">฿{formatNumber(order.cartTotal)}</p>
                     </div>
                  </footer>
               </article>
            ))}
            <AlertDialog
               open={showConfirmDialog}
               onOpenChange={setShowConfirmDialog}
            >
               <AlertDialogContent>
                  <AlertDialogHeader>
                     <AlertDialogTitle>Are you sure to refund your order ?</AlertDialogTitle>
                     <AlertDialogDescription className='space-y-3'>
                        <div>
                           Please note that a <strong>5%</strong> fee applies to refunds, and we
                           trust you to return the products to us.
                        </div>
                        <div>
                           ( We know that we don't have a delivery tracking. So, just pretend that
                           we have it. )
                        </div>
                        <div>If you're sure, we'll process your refund.</div>
                     </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                     <AlertDialogCancel onClick={() => handleRefund(selectedOrderId)}>
                        Yes, process my refund
                     </AlertDialogCancel>
                     <AlertDialogAction
                        onClick={() => {
                           setShowConfirmDialog(false);
                           setSelectedOrderId(null);
                        }}
                     >
                        No, keep my order
                     </AlertDialogAction>
                  </AlertDialogFooter>
               </AlertDialogContent>
            </AlertDialog>
         </main>
      </div>
   );
}

HistoryList.propTypes = {};

export default HistoryList;

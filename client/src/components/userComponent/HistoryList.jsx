//parent → HistoryUser.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { addRatingUser, getOrderUser } from "@/api/userAuth";
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
import StarRating from "./StarRating";
import { Star, ChevronUp, ChevronDown } from "lucide-react";

function HistoryList(props) {
   const { token } = useEcomStore((state) => state);
   const [orderList, setOrderList] = useState([]);
   const [selectedOrderId, setSelectedOrderId] = useState(null);
   const [showConfirmDialog, setShowConfirmDialog] = useState(false); //for AlertDialog
   const { toast } = useToast();
   // const [commentRateProd, setCommentRateProd] = useState([]);
   const [ratings, setRatings] = useState({}); //rating per prod
   const [isLoading, setIsLoading] = useState(false); //to prevent user click 'submit feedback'during call addRatingUser api
   const [isCollapsedByOrderId, setIsCollapsedByOrderId] = useState({});

   // move fetch fn outside useEffect for reuse
   const fetchOrderList = async () => {
      try {
         const res = await getOrderUser(token);
         console.log("res.data OrderList", res.data.data);
         setOrderList(res.data.data);
      } catch (err) {
         console.error("Error fetching orders:", err);
         toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load order history"
         });
      }
   };

   useEffect(() => {
      fetchOrderList();
   }, [token]);

   const handleRefund = async (orderId) => {
      try {
         setIsLoading(true);
         const res = await reqRefund(token, orderId);
         console.log("res.data refund", res.data);
         if (res.data.success) {
            await fetchOrderList();
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
      } finally {
         setIsLoading(false);
      }
   };
   /*
   req.body==={ "ratings": [ { "productId": 1, 
                               "orderId": 123, 
                               "rating": 4, 
                               "comment": "Good quality product!" },
                               { "productId": 2, 
                               "orderId": 123,..} ]

   ratings==={
         "123-1": {productId: 1,orderId: 123,rating: 4,comment: "Good product"},
         "123-2": {productId: 2,orderId: 123,rating: 5, comment: "Excellent service"}
             }                      
   */
   const handleRatingStar = (orderId, prodId, rating) => {
      console.log("handleRatingStar", orderId, prodId, rating);
      //add new obj or update old one But for only 1 prod
      //need to [`${orderId}-${prodId}`] bc not a single page per prod
      setRatings((prev) => ({
         ...prev,
         [`${orderId}-${prodId}`]: {
            orderId,
            productId: prodId,
            rating,
            comment: prev[`${orderId}-${prodId}`]?.comment || ""
         }
      }));
   };
   const handleComment = (orderId, prodId, comment) => {
      console.log("handleComment", orderId, prodId, comment);
      setRatings((prev) => ({
         ...prev,
         [`${orderId}-${prodId}`]: {
            orderId: orderId,
            productId: prodId,
            rating: prev[`${orderId}-${prodId}`]?.rating || 0,
            comment: comment
         }
      }));
   };
   //click submit feedback
   const handleFeedback = async (orderId) => {
      try {
         setIsLoading(true);
         //filter for only one orderId | orderRatings===[{orderId:1},{orderId:1}]
         const orderRatings = Object.values(ratings).filter((obj) => obj.orderId === orderId);
         // reject rating star ===0 || !rating
         const hasInvalidRating = orderRatings.some((obj) => obj.rating === 0 || !obj.rating);
         if (hasInvalidRating) {
            toast({
               variant: "destructive",
               title: "Error",
               description: "Please rate the product before submitting feedback"
            });
            return;
         }

         const payload = { ratings: orderRatings };
         console.log("orderId->", orderId);
         console.log("payload->", payload);
         const res = await addRatingUser(token, payload);
         console.log("res.data", res);
         //delete key:value from ratings obj after api addRating
         if (res.data.success) {
            setRatings((prev) => {
               const updatedRatings = { ...prev };
               orderRatings.forEach((rating) => {
                  delete updatedRatings[`${rating.orderId}-${rating.productId}`];
               });
               return updatedRatings; // ratings = updatedRatings
            });
         }

         await fetchOrderList();
         toast({
            title: "Success",
            description: "Thank you for your feedback!"
         });
      } catch (err) {
         console.log(err);
         toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to submit feedback"
         });
      } finally {
         setIsLoading(false);
      }
   };
   /*
   read from value → key 
   1. when first render → isCollapsedByOrderId[orderId]===undefinded | isCollapsedByOrderId[orderId]==={}
   2. when click toggleCollapse(12) 
   → take isCollapsedByOrderId[orderId] to build from 'value' to 'key'
   → { [12]:!undefinded }. So isCollapsedByOrderId[12] is truthy === true
   3. call toggleCollapse(12) again
   → { [12]:!true }. So isCollapsedByOrderId[12] is falsy === false

  const toggleCollapse = (orderId) => {
      // isCollapsedByOrderId==={1:false, 2:true,..} 
      setIsCollapsedByOrderId((prev) => ({
         ...prev,
         [orderId]: !prev[orderId]
      }));
   };
   */
   const toggleCollapse = (orderId) => {
      setIsCollapsedByOrderId((prevCollapseStates) => {
         const isCurrentlyCollapsed = prevCollapseStates[orderId] || false;
         return {
            ...prevCollapseStates,
            [orderId]: !isCurrentlyCollapsed
         };
      });
   };
   return (
      <div>
         <div className='flex items-center mt-6 mb-4 gap-2 min-w-[500px] bg-gradient-to-r from-card to-slate-100 shadow-md p-4 rounded-xl'>
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
               <div key={order.id}>
                  <article className='flex flex-col gap-2 p-6  bg-gradient-to-r from-card to-slate-100 rounded-t-xl shadow-md'>
                     {/* header */}
                     <header className='flex justify-between'>
                        <div className='mb-2'>
                           <p className='text-sm font-semibold'>Order date</p>
                           <p className='font-light text-xs'>
                              {new Date(order.createdAt).toLocaleString("en-uk", {
                                 timeZone: "Asia/Bangkok",
                                 day: "2-digit",
                                 month: "short",
                                 year: "numeric",
                                 hour: "2-digit",
                                 minute: "2-digit",
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
                        <table className='table-fixed w-full bg-gradient-to-r from-card to-slate-100 text-card-foreground rounded-lg'>
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
                                 <div className='flex gap-2 items-center mt-4 '>
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
                                    <p className='font-light text-xs text-gray-500'>
                                       (3-day guarantee)
                                    </p>
                                 </div>
                              ) : (
                                 <div className='w-full text-sm text-gray-500'>
                                    Refunding expired
                                 </div>
                              )}
                           </div>
                        ) : order.orderStatus === "Refunded" ? (
                           <div className=' w-fit font-light text-sm text-gray-500 whitespace-nowrap'>
                              You got ฿{formatNumber(order?.refundAmount)} back (
                              {new Date(order?.updatedAt).toLocaleString("en-uk", {
                                 timeZone: "Asia/Bangkok",
                                 day: "2-digit",
                                 month: "short",
                                 year: "numeric",
                                 hour: "2-digit",
                                 minute: "2-digit",
                                 hour12: true
                              })}
                              )
                           </div>
                        ) : (
                           ""
                        )}
                        <div className='w-fit flex flex-col items-end'>
                           <p className='font-normal whitespace-nowrap'>Net Total</p>
                           <p className='font-medium'>฿{formatNumber(order.cartTotal)}</p>
                        </div>
                     </footer>
                  </article>
                  <Button
                     variant='secondary'
                     type='button'
                     className={`w-full rounded-t-none shadow-md bg-slate-50 hover:bg-slate-100 transition-all duration-700 ${
                        isCollapsedByOrderId[order.id] ? "mb-0" : "mb-4"
                     }`}
                     onClick={() => toggleCollapse(order.id)}
                  >
                     {isCollapsedByOrderId[order.id] ? (
                        <ChevronUp />
                     ) : (
                        <div className='flex gap-1 items-center text-xs text-gray-500'>
                           Share your thoughts!
                           <ChevronDown />
                        </div>
                     )}
                  </Button>
                  {/* comment and rate */}

                  <section
                     className={`overflow-hidden w-full mb-4 -mt-3  rounded-xl shadow-md bg-gradient-to-r from-card to-slate-100 transition-all duration-300 ${
                        isCollapsedByOrderId[order.id]
                           ? "max-h-[1000px] h-auto p-6 "
                           : " max-h-0 h-0"
                     }`}
                  >
                     {order?.products?.map((obj) => (
                        <div
                           key={"rate" + obj.id}
                           className='mb-4'
                        >
                           <div className='font-semibold mt-3'>{obj.product.title}</div>
                           {obj.product.ratings.find((r) => r.orderId === obj.orderId) ? (
                              <div>
                                 <p className='text-sm text-gray-500'>You rated this product.</p>
                                 <p className='flex gap-1 items-center text-sm text-gray-500'>
                                    <strong>Score</strong>:{" "}
                                    {
                                       obj.product.ratings.find((r) => r.orderId === obj.orderId)
                                          .rating
                                    }{" "}
                                    <Star
                                       size={15}
                                       className='text-yellow-500 fill-current'
                                    />
                                 </p>
                                 <p className='text-sm text-gray-500'>
                                    <strong>Comment</strong>:{" "}
                                    <p className='w-full p-2 h-auto overflow-hidden transition-all duration-300 shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent  rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'>
                                       {
                                          obj.product.ratings.find((r) => r.orderId === obj.orderId)
                                             .comment
                                       }
                                    </p>
                                 </p>
                              </div>
                           ) : order.orderStatus !== "Completed" ? (
                              <div className='text-sm text-gray-500'>
                                 <p>Not available!</p>
                                 <p>
                                    Rate this product <strong>before</strong> requesting a{" "}
                                    <strong>refund</strong> or after your order is complete!
                                 </p>
                              </div>
                           ) : (
                              <div>
                                 <div>
                                    <StarRating
                                       onRatingChange={handleRatingStar}
                                       rating={ratings[`${order.id}-${obj.productId}`]?.rating || 0}
                                       prodId={obj.productId}
                                       orderId={order.id}
                                    />
                                 </div>
                                 <textarea
                                    value={
                                       ratings[`${obj.orderId}-${obj.productId}`]?.comment || ""
                                    }
                                    onChange={(e) =>
                                       handleComment(obj.orderId, obj.productId, e.target.value)
                                    }
                                    placeholder='Rate now and help others! This feature is only available before refunds or order completion'
                                    className='w-full p-2 h-12 overflow-hidden transition-all duration-300 shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent  rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'
                                 />
                              </div>
                           )}
                        </div>
                     ))}
                     <Button
                        type='button'
                        className={` rounded-xl hover:bg-slate-500 ${
                           order?.products
                              ?.map((obj) =>
                                 obj.product.ratings.find(
                                    (r) =>
                                       r.orderId === obj.orderId && r.productId === obj.productId
                                 )
                              )
                              .every((r) => r) || order.orderStatus !== "Completed"
                              ? "hidden"
                              : ""
                        }`}
                        onClick={() => handleFeedback(order.id)}
                        disabled={isLoading}
                     >
                        Submit feedback
                     </Button>
                  </section>
               </div>
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

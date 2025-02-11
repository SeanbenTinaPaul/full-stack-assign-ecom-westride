//parent → ViewProdUser.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Star, ChevronUp, ChevronDown } from "lucide-react";
import useEcomStore from "@/store/ecom-store";

function GlobalRating({ ratingCount, ratingInfo, rateAndComment, prodOnOrder, productData }) {
   // const { token } = useEcomStore((state) => state);
   // useEffect(() => {
   //    console.log("ratingCount", ratingCount);
   //    console.log("ratingInfo", ratingInfo);
   //    console.log("rateAndComment", rateAndComment);
   //    console.log("prodOnOrder", prodOnOrder);
   // }, [token]);
   return (
      <div>
         <main className='mb-4 py-6 px-4 w-[90dvw] h-auto min-w-[700px] bg-gradient-to-br from-card to-slate-100 shadow-md rounded-xl'>
            <p className='mb-4 font-medium drop-shadow'>Product Details</p>
            <article className='text-gray-500 text-sm w-full p-6 mb-6 overflow-hidden transition-all duration-300 shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent  rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'>
               {productData?.description}
            </article>
         </main>
         <main className=' p-6 w-[90dvw]  min-w-[700px] bg-gradient-to-br from-card to-slate-100 shadow-md rounded-xl'>
            <p className='mb-4 font-medium drop-shadow'>Global Ratings</p>
            <article>
               <section className='w-full p-6 mb-6 overflow-hidden transition-all duration-300 shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent  rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'>
                  {productData?.avgRating && (<div className='flex items-center mb-2'>
                     <svg
                        className='w-4 h-4 text-yellow-300 me-1'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        viewBox='0 0 22 20'
                     >
                        <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
                     </svg>

                     <p className='ms-1 text-sm font-medium text-gray-500 dark:text-gray-400'>
                        {productData?.avgRating?.toFixed(1)}
                     </p>
                     <p className='ms-1 text-sm font-medium text-gray-500 dark:text-gray-400'>
                        out of
                     </p>
                     <p className='ms-1 text-sm font-medium text-gray-500 dark:text-gray-400'>5</p>
                  </div>)}
                  <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                     {ratingCount} global ratings
                  </p>
                  <div className='flex items-center mt-4'>
                     <div className='text-sm font-medium text-blue-600 dark:text-blue-500 '>
                        5 star
                     </div>
                     <div className='w-2/4 h-5 mx-4 bg-gray-200 rounded-sm dark:bg-gray-700'>
                        <div
                           className='h-5 bg-yellow-300 rounded-sm'
                           style={{ width: `${ratingInfo?.percent5}%` }}
                        ></div>
                     </div>
                     <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                        {ratingInfo?.percent5?.toFixed(1)}% ({ratingInfo?.score5})
                     </span>
                  </div>
                  <div className='flex items-center mt-4'>
                     <div className='text-sm font-medium text-blue-600 dark:text-blue-500 '>
                        4 star
                     </div>
                     <div className='w-2/4 h-5 mx-4 bg-gray-200 rounded-sm dark:bg-gray-700'>
                        <div
                           className='h-5 bg-yellow-300 rounded-sm'
                           style={{ width: `${ratingInfo?.percent4}%` }}
                        ></div>
                     </div>
                     <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                        {ratingInfo?.percent4?.toFixed(1)}% ({ratingInfo?.score4})
                     </span>
                  </div>
                  <div className='flex items-center mt-4'>
                     <div className='text-sm font-medium text-blue-600 dark:text-blue-500 '>
                        3 star
                     </div>
                     <div className='w-2/4 h-5 mx-4 bg-gray-200 rounded-sm dark:bg-gray-700'>
                        <div
                           className='h-5 bg-yellow-300 rounded-sm'
                           style={{ width: `${ratingInfo?.percent3}%` }}
                        ></div>
                     </div>
                     <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                        {ratingInfo?.percent3?.toFixed(1)}% ({ratingInfo?.score3})
                     </span>
                  </div>
                  <div className='flex items-center mt-4'>
                     <div className='text-sm font-medium text-blue-600 dark:text-blue-500 '>
                        2 star
                     </div>
                     <div className='w-2/4 h-5 mx-4 bg-gray-200 rounded-sm dark:bg-gray-700'>
                        <div
                           className='h-5 bg-yellow-300 rounded-sm'
                           style={{ width: `${ratingInfo?.percent2}%` }}
                        ></div>
                     </div>
                     <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                        {ratingInfo?.percent2?.toFixed(1)}% ({ratingInfo?.score2})
                     </span>
                  </div>
                  <div className='flex items-center mt-4'>
                     <div className='text-sm font-medium text-blue-600 dark:text-blue-500 '>
                        1 star
                     </div>
                     <div className='w-2/4 h-5 mx-4 bg-gray-200 rounded-sm dark:bg-gray-700'>
                        <div
                           className='h-5 bg-yellow-300 rounded-sm'
                           style={{ width: `${ratingInfo.percent1}%` }}
                        ></div>
                     </div>
                     <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                        {ratingInfo?.percent1?.toFixed(1)}% ({ratingInfo.score1})
                     </span>
                  </div>
               </section>
            </article>
            {/* user rate+ comment */}
            <article>
               {rateAndComment?.map((obj, i) => (
                  <section
                     className='flex flex-col p-4 mb-2 rounded-lg shadow-md'
                     key={i}
                  >
                     <header className='flex gap-2 mb-2 items-center justify-start '>
                        <div className='w-10 h-10 rounded-full bg-slate-300 overflow-hidden'>
                           <img
                              src={obj?.user?.picture}
                              alt=''
                              className='object-cover bg-gradient-to-tr from-slate-100 to-slate-200'
                           />
                        </div>
                        <div>
                           <div className='font-semibold text-sm '>{obj?.user?.name}</div>
                           <div className='text-sm text-gray-500'>
                              Buy Date :{" "}
                              {new Date(
                                 prodOnOrder.find((p) => p.orderId === obj.orderId).order.createdAt
                              ).toLocaleString("en-uk", {
                                 timeZone: "Asia/Bangkok",
                                 day: "2-digit",
                                 month: "short",
                                 year: "numeric",
                                 hour: "2-digit",
                                 minute: "2-digit",
                                 hour12: true
                              })}
                           </div>
                        </div>
                     </header>

                     <div className='flex gap-1 items-center text-sm text-gray-500'>
                        <strong>Rate</strong>: {obj?.rating}
                        <Star
                           size={15}
                           className='text-yellow-500 fill-current'
                        />
                     </div>
                     {obj.comment && (
                        <div className='text-sm text-gray-500'>
                           <strong>Comment</strong>:{" "}
                           <p className='w-full p-2 h-auto overflow-hidden transition-all duration-300 shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent  rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'>
                              {obj.comment}
                           </p>
                        </div>
                     )}
                  </section>
               ))}
            </article>
         </main>
      </div>
   );
}

GlobalRating.propTypes = {
   ratingCount: PropTypes.number,
   ratingInfo: PropTypes.object,
   rateAndComment: PropTypes.array,
   prodOnOrder: PropTypes.array,
   productData: PropTypes.object
};

export default GlobalRating;

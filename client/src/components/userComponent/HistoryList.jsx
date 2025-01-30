import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getOrderUser } from "@/api/userAuth";
import useEcomStore from "@/store/ecom-store";
import { formatNumber } from "@/utilities/formatNumber";

function HistoryList(props) {
   const { token } = useEcomStore((state) => state);
   const [orderList, setOrderList] = useState([]);

   useEffect(() => {
      const fetchOrderList = async (token) => {
         try {
            const res = await getOrderUser(token);
            console.log("res.data orderList", res.data);
            setOrderList(res.data.data);
         } catch (err) {
            console.log(err);
            throw err;
         }
      };
      fetchOrderList(token);
   }, [token]);
   return (
      <div>
         <header>Purchase History</header>
         {/* cover all */}
         <main>
            {/* card */}
            {orderList?.map((order) => (
               <article
                  className='flex flex-col gap-2 p-4 mb-4 bg-card rounded-lg shadow-lg'
                  key={order.id}
               >
                  {/* header */}
                  <header className='flex justify-between'>
                     <div>
                        <p className='text-sm'>Order date</p>
                        <p className='text-xs'>{new Date(order.createdAt).toLocaleString('en-us',{timeZone: 'Asia/Bangkok'})}</p>
                     </div>
                     <div className='text-xs'>{order.orderStatus}</div>
                  </header>
                  <div>
                     <table className='table-fixed w-full bg-card text-card-foreground shadow-md rounded-lg'>
                        <thead>
                           <tr className='border-b text-left text-sm'>
                              <th>Title</th>
                              <th>Price</th>
                              <th>Quantity</th>
                              <th>Total</th>
                           </tr>
                        </thead>
                        <tbody>
                           {order?.products?.map((product) => (
                              <tr key={product.id}>
                                 <td>{product.product.title}</td>
                                 <td>{formatNumber(product.price)}</td>
                                 <td>{product.count}</td>
                                 <td>{formatNumber(product.price * product.count)}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
                  {/* total  */}
                  <footer>
                     <div className='w-full border flex flex-col items-end'>
                        <p>Net Total</p>
                        <p>{formatNumber(order.cartTotal)}</p>
                     </div>
                  </footer>
               </article>
            ))}
         </main>
      </div>
   );
}

HistoryList.propTypes = {};

export default HistoryList;

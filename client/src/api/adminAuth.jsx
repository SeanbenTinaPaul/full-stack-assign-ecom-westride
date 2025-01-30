import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
// PUT: /admin/order-status
// GET: /admin/orders
//res.json()
export const getOrdersAdmin = async (token) => {
   return await axios.get(`${apiUrl}/api/admin/orders`, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   });
};
//res.json()
export const updateOrderStatAdmin = async (token, orderInfo) => {
   return await axios.put(`${apiUrl}/api/admin/order-status`, orderInfo, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   });
};

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
export const updateOrderStatAdmin = async (token, orderIdArr, orderStatus) => {
   return await axios.put(
      `${apiUrl}/api/admin/order-status`,
      { orderIdArr, orderStatus },
      {
         headers: {
            Authorization: `Bearer ${token}`
         }
      }
   );
};

export const getAllUserAdmin = async (token) => {
   return await axios.get(`${apiUrl}/api/admin/all-users`, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   });
};
export const changeUserStatusAdmin = async (token, userIdArr, userEnabled, userRole) => {
   return await axios.put(
      `${apiUrl}/api/admin/change-status`,
      { userIdArr, userEnabled, userRole },
      {
         headers: {
            Authorization: `Bearer ${token}`
         }
      }
   );
};


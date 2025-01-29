import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
//res.json()
export const createCartUser = async (token, cart) => {
   // console.log("form to create prod", cart);
   return await axios.post(`${apiUrl}/api/user/cart`, cart, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   });
};
//res.json()
export const getCartUser = async (token) => {
   // console.log("getCartUser");
   return await axios.get(`${apiUrl}/api/user/cart`, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   });
};
//res.json()
export const saveAddressUser = async (token, addressObj) => {
   return await axios.post(`${apiUrl}/api/user/address`, addressObj, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   });
};
//res.json()
export const saveOrderUser = async (token, payload) => {
   return await axios.post(`${apiUrl}/api/user/order`, payload, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   });
};

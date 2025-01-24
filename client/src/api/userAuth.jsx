import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
//backend res.send()
export const createCartUser = async (token, cart) => {
   console.log("form to create prod", cart);
   return await axios.post(`${apiUrl}/api/user/cart`, cart, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   });
};

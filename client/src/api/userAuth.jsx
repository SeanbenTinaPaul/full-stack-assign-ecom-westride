import axios from "axios";

//backend res.send()
export const createCartUser = async (token, cart) => {
   console.log("form to create prod", cart);
   return await axios.post("http://localhost:5000/api/user/cart", cart, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   });
};

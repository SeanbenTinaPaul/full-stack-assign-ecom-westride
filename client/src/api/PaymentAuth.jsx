import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
//res.json()
//axios อย่าลืม return res ด้วย
export const createPaymentUser = async (token) => {
   return await axios.post(
      `${apiUrl}/api/user/create-payment-intent`,
      {},
      {
         headers: {
            Authorization: `Bearer ${token}`
         }
      }
   );
};

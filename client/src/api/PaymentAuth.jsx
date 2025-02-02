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
export const reqCancelPayment = async (token, paymentIntentData) => {
   return await axios.post(`${apiUrl}/api/user/cancel-payment-intent`, paymentIntentData, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   })
};
//pending...
export const reqRefund = async (token, orderId) => {
   return await axios.post(`${apiUrl}/api/user/refund-payment`, {orderId}, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   })
}
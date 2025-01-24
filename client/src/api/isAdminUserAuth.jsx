//เก็บคำสั่งติดต่อกับ backend
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
/*
Note: 2 ways to import ▼
- Named Export   ► import { currentUser } from "./auth";
- Default Export ► import currentUser from "./auth";
*/

//ส่งค่า token(ได้จาก localStorage ซึ่งได้มาจากการ login) ไปยัง backend
//โดยมี header Authorization ที่มีค่า Bearer token
//ไม่ได้รับเป็น {token} แสดงว่าถูกcalled ในฐานะฟังก์ชัน(ไม่ใช่ component) ► currentUser(token) เมื่อ token เป็นค่า string

/* Step from Login.jsx to LayoutAdmin.jsx:

1. login req.body with actionLogin(form) → recieve res.data : payload + token → set user, token in ecomStore
- Login.jsx → go to revieve 'payload + token' from login() authService.js 
- token, used to pass currentUser(token) → authCheck() → currUserProfile()
2. in Login.jsx, → *middleware block* → navigate("/admin") [to <LayoutAdmin />] or ("/user")[to <LayoutUser />] according to payload.role
3. in AppRoutes.jsx, go to ProtectRouteAdmin.jsx as *middleware block* 
- if currentAdmin(token) === true → go to LayoutAdmin.jsx <path: "/admin"> 
- if currentAdmin(token) === false → go to LoadingToRedirect.jsx → <Layout />.jsx <path: "/"> 

*/
//backend res.json()
// go check if 'email:' in 'decoded token' exist in DB ► currUserProfile() in authService.js  
export const currentUser = async (token) =>
   await axios.post(
      `${apiUrl}/api/profile-user`,
      {},
      {
         headers: {
            //req.headers for authCheck.js
            Authorization: `Bearer ${token}`
         }
      }
   );
//backend res.json()
export const currentAdmin = async (token) => {
   return await axios.post(
      `${apiUrl}/api/profile-admin`,
      {},
      {
         headers: {
            Authorization: `Bearer ${token}`
         }
      }
   );
};
/*
 **** ข้อควรระวัง ****
ในชีวิตจริงเราจะไม่ใช้แค่ jwt token ในการ authCheck อย่างเดียว
เพราะ user สามารถเข้าถึงและแก้ข้อมูลใน token ได้โดยกด F12 webpage 
► Application ► Local Storage ► ecom-store ► Value ► user และ token
ใน token จะมีคำว่า 'user' หรือ 'admin' อยู่ข้างใน → user แก้ไขได้โดยคลิกส่วน 'user'ภายใน token
แล้วเปลี่ยนเป็น admin จากนั้นกด refresh page ก็จะได้ admin token ไว้ท่องเว็บได้ตามสะดวก
*/

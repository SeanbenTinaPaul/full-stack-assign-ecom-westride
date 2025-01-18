//เก็บคำสั่งติดต่อกับ backend
import axios from "axios";
/*
Note: 2 ways to import ▼
- Named Export   ► import { currentUser } from "./auth";
- Default Export ► import currentUser from "./auth";
*/

//ส่งค่า token(ได้จาก localStorage ซึ่งได้มาจากการ login) ไปยัง backend
//โดยมี header Authorization ที่มีค่า Bearer token
//ไม่ได้รับเป็น {token} แสดงว่าถูกcalled ในฐานะฟังก์ชัน(ไม่ใช่ component) ► currentUser(token) เมื่อ token เป็นค่า string

export const currentUser = async (token) =>
   await axios.post(
      "http://localhost:5000/api/profile-user",
      {},
      {
         headers: {
            Authorization: `Bearer ${token}`
         }
      }
   );

export const currentAdmin = async (token) => {
   return await axios.post(
      "http://localhost:5000/api/profile-admin",
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

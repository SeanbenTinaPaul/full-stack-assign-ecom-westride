//animation loading during routing/redirect
//use this component when need to force redirect to '/' page
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export const LoadingToRedirect = () => {
   const [count, setCount] = useState(3);
   const [redirect, setRedirect] = useState(false);

   //countdown
   //useEffect() ทำงานเมื่อ Component ถูก render ครั้งแรก (เมื่อ component ถูกสร้างขึ้น)
   useEffect(() => {
      const interval = setInterval(() => {
         setCount((currentCount) => {
            if (currentCount === 1) {
               clearInterval(interval);
               setRedirect(true); //อนุญาตให้ redirect
            }
            return currentCount - 1;
         });
      }, 1000);

      return () => clearInterval(interval); // ให้ clearInterval เมื่อ component ถูก unmount
   }, []); //add [] to at end to avoid infinite loop

   if (redirect) {
      //redirect ไปที่หน้า home (หน้าแรก)
      return <Navigate to={"/"} />;
   }

   return <div>No Permission, Redirect in {count} seconds</div>;
};

/*
 * useEffect เป็น hook ที่ใช้ทำการดำเนินการใดๆ หลังจากที่ component ถูก render
 * useEffect รับค่า callback เป็น argument และ callback นี้จะถูกเรียกหลังจากที่ component ถูก render
 */
/*
 setInterval เป็น function ที่ไม่ return ค่าใดๆ และไม่มีการใช้ await 
 ในกรณีนี้ จึงไม่จำเป็นต้องมี await ใน callback
 */

/*
 Unmount component คือกระบวนการที่ React ใช้ทำการลบ component ออกจาก DOM 
 เมื่อ component นั้นไม่จำเป็นต้องแสดงผลบนหน้าเว็บอีกต่อไป

เมื่อ component ถูก unmount React จะทำการ:

ลบ element ของ component ออกจาก DOM
ทำการ cleanup ส่วนที่เกี่ยวข้องกับ component เช่น ลบ event listener, ลบ timer, ลบ interval
ทำการเรียก function componentWillUnmount ถ้า component มี function นี้

Unmount component เกิดขึ้นเมื่อ:

1.Component ถูกแทนที่ด้วย component อื่น
2.Component ถูกลบออกจาก DOM โดยตรง
3.Component ถูก hide โดยใช้ display: none หรือ visibility: hidden
4.Component ถูก unmount โดยใช้ ReactDOM.unmountComponentAtNode
ในกรณีที่คุณใช้ useEffect hook คุณจะต้องทำการ cleanup ส่วนที่เกี่ยวข้องกับ effect นั้น
เมื่อ component ถูก unmount โดยใช้ return function ใน useEffect hook เช่น:

useEffect(() => {
  // effect code
  return () => {
    // cleanup code
  };
}, []);

การ unmount component เป็นกระบวนการที่สำคัญในการรักษาความสะอาดและประสิทธิภาพของแอปพลิเคชัน React
 
 */

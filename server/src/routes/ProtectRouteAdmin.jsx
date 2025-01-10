//ให้ component ProtectRouteUser  เป็นทางผ่านของทุกๆ children ที่ผ่านมาทาง '/user'
import propTypes from "prop-types";
import React, { useEffect, useState } from "react";
import useEcomStore from "../store/ecom-store";
import { currentAdmin } from "../api/auth";
import { LoadingToRedirect } from "./LoadingToRedirect";

export const ProtectRouteAdmin = ({ element }) => {
   const [pass, setPass] = useState(false);

   const user = useEcomStore((state) => state.user);
   const token = useEcomStore((state) => state.token);
   //useEcomStore() ทำไว้ 3 property คือ user, token, actionLogin()

   //ใช้เช็คว่า user มีข้อมูลไหม และ token มีข้อมูลไหม
   //เมื่อเข้ามาที่ ProtecRouterAdmin จะใหเทำงานอัตโนมัติ
   useEffect(() => {
      if (user && token) {
         //send to backend
         currentAdmin(token)
            //we can use then and catch alternative to try and catch
            //if cuurentUser() works ► go to then()
            .then((res) => setPass(true))
            .catch((err) => setPass(false));
      }
   }, []);

   return pass ? element : <LoadingToRedirect />; // element ► <LayoutUser />
};

ProtectRouteAdmin.propTypes = {
   element: propTypes.element.isRequired,
};



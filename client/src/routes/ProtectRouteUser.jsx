//ให้ component ProtectRouteUser  เป็นทางผ่านของทุกๆ children ที่ผ่านมาทาง '/user'
import propTypes from "prop-types";
import React, { useEffect, useState } from "react";

import useEcomStore from "../store/ecom-store";
import { currentUser } from "../api/isAdminUserAuth";
import { LoadingToRedirect } from "./LoadingToRedirect";

export const ProtectRouteUser = ({ element }) => {
   const [pass, setPass] = useState(false);
   const [loading, setLoading] = useState(true);
   const user = useEcomStore((state) => state.user);
   const token = useEcomStore((state) => state.token);
   //useEcomStore() ทำไว้ 3 property คือ user, token, actionLogin()

   //ใช้เช็คว่า user มีข้อมูลไหม และ token มีข้อมูลไหม
   //เมื่อเข้ามาที่ ProtecRouterUser จะใหเทำงานอัตโนมัติ
   useEffect(() => {
      const checkAuth = async () => {
         try {
            const res = await currentUser(token);
            if (res.data.success) {
               setPass(true);
            } else {
               setPass(false);
            }
         } catch (err) {
            setPass(false);
         } finally {
            setLoading(false);
         }
      };
   
      checkAuth();
   }, [user, token]);

   if (loading) {
      return null; // Show nothing while checking auth
   }

   return pass ? element : <LoadingToRedirect />; // element ► <LayoutUser />
};

ProtectRouteUser.propTypes = {
   element: propTypes.element.isRequired
};

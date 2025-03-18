//ให้ component ProtectRouteUser  เป็นทางผ่านของทุกๆ children ที่ผ่านมาทาง '/user'
import propTypes from "prop-types";
import React, { useEffect, useState } from "react";
import useEcomStore from "../store/ecom-store";
import { currentAdmin } from "../api/isAdminUserAuth";
import { LoadingToRedirect } from "./LoadingToRedirect";

export const ProtectRouteAdmin = ({ element }) => {
   const [pass, setPass] = useState(false);
   const [loading, setLoading] = useState(true);

   const user = useEcomStore((state) => state.user);
   const token = useEcomStore((state) => state.token);
   //useEcomStore() ทำไว้ 3 property คือ user, token, actionLogin()

   //ใช้เช็คว่า user มีข้อมูลไหม และ token มีข้อมูลไหม
   //เมื่อเข้ามาที่ ProtecRouterAdmin จะใหเทำงานอัตโนมัติ
   useEffect(() => {
      const checkAuth = async () => {
         // if (!user || !token) return;

         try {
            //send to backend
            //we can use then and catch alternative to try and catch
            //if cuurentUser() works ► go to then()
            const res = await currentAdmin(token);
            //if currentAdmin() recieve res.status(200)
            if (res.data.success) {
               setPass(true);
            } else {
               setPass(false); //if currentAdmin() recieve res.status(401)
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

ProtectRouteAdmin.propTypes = {
   element: propTypes.element.isRequired
};

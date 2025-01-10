import React from "react";
import { Outlet } from "react-router-dom";
import MainNav from "../components/MainNav";

const Layout = () => {
   return (
      <div className="bg-Bg-night-700 h-screen">
         <MainNav />
         <main>
            {/* Outlet lib ใช้แสดง แสดงผลของ child routes หรือ sub-routes ภายใน route ที่กำหนดไว้ */}
            <Outlet />
         </main>
      </div>
   );
};

export default Layout;

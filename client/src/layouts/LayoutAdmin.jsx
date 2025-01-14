import React from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "../components/adminComponent/SidebarAdmin";
import HeaderAdmin from "../components/adminComponent/HeaderAdmin";

const LayoutAdmin = () => {
   return (
      <div className='min-h-screen flex'>
         <SidebarAdmin />
         <div className='flex-1 flex flex-col'>
            <HeaderAdmin />
            <main className='flex-1 p-6 bg-Bg-night-700 overflow-y-auto'>
               <Outlet />
            </main>
         </div>
      </div>
   );
};

export default LayoutAdmin;

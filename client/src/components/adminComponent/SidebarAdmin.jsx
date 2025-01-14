//parent→ LayoutAdmin.jsx
import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, ChartNoAxesGantt,ChartBarStacked,PackagePlus ,LogOut } from "lucide-react";

const SidebarAdmin = () => {
   return (
      <div className='bg-Header-footer-bar-night w-64 text-Text-white flex flex-col h-screen drop-shadow-xl'>
         <div className='h-24 bg-Header-bar-light flex items-center justify-center text-2xl font-bold'>
            Admin Panel
         </div>
         <nav className='flex-1 px-2 py-4 space-y-2'>
            <NavLink
               to={"/admin"} //path ต่างๆอยู่ใน AppRoutes.jsx
               end //end คือ path ต้องเป็น /admin และไม่ต้องเป็น /admin/ จึงจะแสดง isActive===true
               // {isActive} ใช้ตรวจว่าโดน "คลิก หรือ โดนเอาเมาส์ไปโดน"แล้วหรือยัง
               className={({ isActive }) =>
                  isActive
                     ? "bg-gray-900 text-white px-4 py-2 flex items-center rounded"
                     : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
               }
            >
               <LayoutDashboard className='mr-2' />
               Dashboard
            </NavLink>
            <NavLink
               to={"manage"} //จะเป็น '/admin/manage' (ต่อท้าย '/admin') | ถ้าใช้ {'/manage'} เมื่อคลิกจะเป็น path :'/manage' (แทนที่ '/admin')
               className={({ isActive }) =>
                  isActive
                     ? "bg-gray-900 text-white px-4 py-2 flex items-center rounded"
                     : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
               }
            >
               <ChartNoAxesGantt className='mr-2' />
               Manage
            </NavLink>
            <NavLink
               to={"category"}
               className={({ isActive }) =>
                  isActive
                     ? "bg-gray-900 text-white px-4 py-2 flex items-center rounded"
                     : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
               }
            >
               <ChartBarStacked className='mr-2' />
               Category
            </NavLink>
            <NavLink
               to={"product"}
               className={({ isActive }) =>
                  isActive
                     ? "bg-gray-900 text-white px-4 py-2 flex items-center rounded"
                     : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
               }
            >
               <PackagePlus className='mr-2' />
               Product
            </NavLink>
         </nav>
         <div>
            <NavLink
            //    to={"logout"}
               className={({ isActive }) =>
                  isActive
                     ? "bg-gray-900 text-white px-4 py-2 flex items-center rounded"
                     : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
               }
            >
               <LogOut className='mr-2' />
               Log out
            </NavLink>
         </div>
      </div>
   );
};

SidebarAdmin.propTypes = {};

export default SidebarAdmin;

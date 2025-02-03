//parent→ LayoutAdmin.jsx

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
   LayoutDashboard,
   ChartPie,
   ChartNoAxesGantt,
   ChartBarStacked,
   PackagePlus,
   LogOut,
   Gem,
   ArchiveRestore,
   Grid2x2Plus,
   ClipboardCopy
} from "lucide-react";
import useEcomStore from "@/store/ecom-store";
const navItems = [
   {
      title: "Dashboard",
      url: "/admin",
      icon: ChartPie,
      end: true
   },
   {
      title: "Manage users",
      url: "manage",
      icon: ChartNoAxesGantt
   },
   // {
   //    title: "Brand Store",
   //    url: "brand-store",
   //    icon: ArchiveRestore
   // },
   {
      title: "Category",
      url: "category",
      icon: Grid2x2Plus
   },
   {
      title: "Product",
      url: "product",
      icon: PackagePlus
   },
   {
      title: "Order status",
      url: "orders",
      icon: ClipboardCopy
   },
   {
      title: "Promotion",
      url: "promotion",
      icon: Gem
      //1. Create a new page: Promotion.jsx → pages/admin
      //2. Create a new component: FormPromotion.jsx → components/adminComponent
      //3. go to AppRoutes.jsx to add a new route
   }
];

const SidebarAdmin = ({ isCollapsed }) => {
   const { handleDirectLogout } = useEcomStore((state) => state);
   const navigate = useNavigate();
   const handleLogout = (e) => {
      e.preventDefault();
      handleDirectLogout();
      navigate('/', { replace: true });
   };
   const sidebarWidth = isCollapsed ? "w-16" : "w-56";
   //Added fixed top-0 left-0 to the sidebar's root div to make unscrollable along with Category.jsx content
   //Added h-[calc(100vh-8.5rem)] to the ScrollArea to account for the header height
   //▼go to LayoutAdmin.jsx to set more...
   //Added margin left (ml-64 or ml-16) to the main content to offset the fixed sidebar
   return (
      <div
         className={`${sidebarWidth} transition-all duration-300 bg-slate-800 text-white flex flex-col h-screen drop-shadow-xl fixed top-0 left-0 z-50`}
      >
         {/* Logo */}
         <div
            className={`mt-10 h-24 bg-slate-700 flex items-center justify-center ${
               isCollapsed ? "px-2" : "px-4"
            }`}
         >
            <h2
               className={`font-bold transition-all duration-300 ${
                  isCollapsed ? "text-sm" : "text-2xl"
               }`}
            >
               {isCollapsed ? "AP" : "Admin Panel"}
            </h2>
         </div>
         {/* menu Pages */}
         <ScrollArea className='flex-1 px-2 py-4 h-[calc(100vh-8.5rem)]'>
            <nav className='space-y-2'>
               {navItems.map((item) => (
                  <NavLink
                     key={item.title}
                     to={item.url}
                     end={item.end}
                     title={item.title}
                     //isActive ► built-in prop from NavLink → true when current browser URL === to={item.url}
                     className={({ isActive }) =>
                        `${
                           isActive ? "bg-slate-900 text-white" : "text-gray-300 hover:bg-slate-700"
                        } 
                        px-3 py-2 rounded flex items-center transition-all duration-300
                        ${isCollapsed ? "justify-center" : "justify-start"}`
                     }
                  >
                     <item.icon className={`${isCollapsed ? "mr-0" : "mr-2"} h-5 w-5`} />
                     <span
                        className={`transition-all duration-300 ${
                           isCollapsed ? "hidden" : "block"
                        }`}
                     >
                        {item.title}
                     </span>
                  </NavLink>
               ))}
            </nav>
         </ScrollArea>
         {/* ONLY for Log out  */}
         <div className='p-2'>
            <NavLink
               // redirect to 'http://localhost:5173/' when click
               to={"/"}
               end={true}
            >
               <button
                  onClick={(e) => handleLogout(e)}
                  className={`w-full text-gray-300 px-3 py-2 hover:bg-slate-700 rounded flex items-center transition-all duration-300
               ${isCollapsed ? "justify-center" : "justify-start"}`}
               >
                  <LogOut className={`${isCollapsed ? "mr-0" : "mr-2"} h-5 w-5`} />
                  <span
                     className={`transition-all duration-300 ${isCollapsed ? "hidden" : "block"}`}
                  >
                     Log out
                  </span>
               </button>
            </NavLink>
         </div>
      </div>
   );
};

export default SidebarAdmin;

// import React from "react";
// import {
//    Sidebar,
//    SidebarContent,
//    SidebarGroup,
//    SidebarGroupContent,
//    SidebarGroupLabel,
//    SidebarMenu,
//    SidebarMenuButton,
//    SidebarMenuItem,
// } from "@/components/ui/sidebar";
// import { LayoutDashboard, ChartBarStacked, PackagePlus, LogOut } from "lucide-react";

// // Menu items.
// const items = [
//    {
//       title: "Dashboard",
//       url: "/admin",
//       icon: LayoutDashboard,
//    },
//    {
//       title: "Category",
//       url: "/admin/category",
//       icon: ChartBarStacked,
//    },
//    {
//       title: "Products",
//       url: "/admin/product",
//       icon: PackagePlus,
//    },
//    {
//       title: "Logout",
//       url: "/logout",
//       icon: LogOut,
//    },
// ];

// const SidebarAdmin = () => {
//    return (
//       <Sidebar className="w-64 bg-secondary text-foreground border-r">
//          <SidebarContent>
//             <SidebarGroup>
//                <SidebarGroupLabel className="text-lg font-bold px-4 py-2">Admin Panel</SidebarGroupLabel>
//                <SidebarGroupContent>
//                   <SidebarMenu>
//                      {items.map((item) => (
//                         <SidebarMenuItem key={item.title}>
//                            <SidebarMenuButton asChild>
//                               <a href={item.url} className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded">
//                                  <item.icon className="h-5 w-5" />
//                                  <span>{item.title}</span>
//                               </a>
//                            </SidebarMenuButton>
//                         </SidebarMenuItem>
//                      ))}
//                   </SidebarMenu>

// import React from "react";
// import PropTypes from "prop-types";
// import { NavLink } from "react-router-dom";
// import { LayoutDashboard, ChartNoAxesGantt, ChartBarStacked, PackagePlus, LogOut } from "lucide-react";

// const SidebarAdmin = ({ isOpen }) => {
//    return (
//       <div
//          className={`fixed top-0 left-0 h-full w-64 bg-secondary text-foreground border-border transform transition-transform duration-300 ease-in-out ${
//             isOpen ? 'translate-x-0' : '-translate-x-full'
//          }`}
//       >
//          <div className="h-16 bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
//             Admin Panel
//          </div>
//          <nav className="flex-1 px-4 py-6 space-y-2">
//             <NavLink
//                to="/admin"
//                end
//                className={({ isActive }) =>
//                   isActive
//                      ? "bg-accent text-accent-foreground px-4 py-2 flex items-center rounded"
//                      : "text-foreground/80 hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded flex items-center"
//                }
//             >
//                <LayoutDashboard className="mr-2" />
//                Dashboard
//             </NavLink>
//             <NavLink
//                to="manage"
//                className={({ isActive }) =>
//                   isActive
//                      ? "bg-accent text-accent-foreground px-4 py-2 flex items-center rounded"
//                      : "text-foreground/80 hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded flex items-center"
//                }
//             >
//                <ChartNoAxesGantt className="mr-2" />
//                Manage
//             </NavLink>
//             <NavLink
//                to="category"
//                className={({ isActive }) =>
//                   isActive
//                      ? "bg-accent text-accent-foreground px-4 py-2 flex items-center rounded"
//                      : "text-foreground/80 hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded flex items-center"
//                }
//             >
//                <ChartBarStacked className="mr-2" />
//                Category
//             </NavLink>
//             <NavLink
//                to="product"
//                className={({ isActive }) =>
//                   isActive
//                      ? "bg-accent text-accent-foreground px-4 py-2 flex items-center rounded"
//                      : "text-foreground/80 hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded flex items-center"
//                }
//             >
//                <PackagePlus className="mr-2" />
//                Product
//             </NavLink>
//          </nav>
//          <div className="px-4 py-2">
//             <NavLink
//                to="logout"
//                className={({ isActive }) =>
//                   isActive
//                      ? "bg-accent text-accent-foreground px-4 py-2 flex items-center rounded"
//                      : "text-foreground/80 hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded flex items-center"
//                }
//             >
//                <LogOut className="mr-2" />
//                Log out
//             </NavLink>
//          </div>
//       </div>
//    );
// };

// SidebarAdmin.propTypes = {
//    isOpen: PropTypes.bool.isRequired,
// };

// export default SidebarAdmin;

// import React from "react";
// import PropTypes from "prop-types";
// import { NavLink } from "react-router-dom";
// import { LayoutDashboard, ChartNoAxesGantt,ChartBarStacked,PackagePlus ,LogOut } from "lucide-react";

// const SidebarAdmin = () => {
//    return (
//       <div className='bg-Header-footer-bar-night w-64 text-Text-white flex flex-col h-screen drop-shadow-xl'>
//          <div className='h-24 bg-Header-bar-light flex items-center justify-center text-2xl font-bold'>
//             Admin Panel
//          </div>
//          <nav className='flex-1 px-2 py-4 space-y-2'>
//             <NavLink
//                to={"/admin"} //path ต่างๆอยู่ใน AppRoutes.jsx
//                end //end คือ path ต้องเป็น /admin และไม่ต้องเป็น /admin/ จึงจะแสดง isActive===true
//                // {isActive} ใช้ตรวจว่าโดน "คลิก หรือ โดนเอาเมาส์ไปโดน"แล้วหรือยัง
//                className={({ isActive }) =>
//                   isActive
//                      ? "bg-gray-900 text-white px-4 py-2 flex items-center rounded"
//                      : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
//                }
//             >
//                <LayoutDashboard className='mr-2' />
//                Dashboard
//             </NavLink>
//             <NavLink
//                to={"manage"} //จะเป็น '/admin/manage' (ต่อท้าย '/admin') | ถ้าใช้ {'/manage'} เมื่อคลิกจะเป็น path :'/manage' (แทนที่ '/admin')
//                className={({ isActive }) =>
//                   isActive
//                      ? "bg-gray-900 text-white px-4 py-2 flex items-center rounded"
//                      : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
//                }
//             >
//                <ChartNoAxesGantt className='mr-2' />
//                Manage
//             </NavLink>
//             <NavLink
//                to={"category"}
//                className={({ isActive }) =>
//                   isActive
//                      ? "bg-gray-900 text-white px-4 py-2 flex items-center rounded"
//                      : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
//                }
//             >
//                <ChartBarStacked className='mr-2' />
//                Category
//             </NavLink>
//             <NavLink
//                to={"product"}
//                className={({ isActive }) =>
//                   isActive
//                      ? "bg-gray-900 text-white px-4 py-2 flex items-center rounded"
//                      : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
//                }
//             >
//                <PackagePlus className='mr-2' />
//                Product
//             </NavLink>
//          </nav>
//          <div>
//             <NavLink
//             //    to={"logout"}
//                className={({ isActive }) =>
//                   isActive
//                      ? "bg-gray-900 text-white px-4 py-2 flex items-center rounded"
//                      : "text-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
//                }
//             >
//                <LogOut className='mr-2' />
//                Log out
//             </NavLink>
//          </div>
//       </div>
//    );
// };

// SidebarAdmin.propTypes = {};

// export default SidebarAdmin;

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "../components/adminComponent/SidebarAdmin";
import HeaderAdmin from "../components/adminComponent/HeaderAdmin";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const LayoutAdmin = () => {
   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
   const contentMargin = isSidebarCollapsed ? "ml-16" : "ml-64"; //to maintain content margin when fixed sidebar
   /*
Add const contentMargin *in this file*
DO it ▼ in SidebarAdmin.jsx ...
Added h-[calc(100vh-8.5rem)] to the ScrollArea to account for the header height
Added margin left (ml-64 or ml-16) to the main content to offset the fixed sidebar
*/
   return (
      <div className='min-h-screen flex'>
         <SidebarAdmin isCollapsed={isSidebarCollapsed} />
         <div className={`flex-1 flex flex-col ${contentMargin} transition-all duration-300`}>
            <HeaderAdmin />
            <div className='fixed top-1 left-3 z-[60]'>
               <Button
                  className='bg-transparent border-none hover:bg-transparent '
                  variant='outline'
                  size='icon'
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
               >
                  <Menu className='h-4 w-4 text-white' />
               </Button>
            </div>
            <main className='flex-1 p-6 bg-slate-100 overflow-y-auto pt-14'>
               <Outlet />
            </main>
         </div>
      </div>
   );
};

export default LayoutAdmin;

// import React, { useState } from "react";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import SidebarAdmin from "../components/adminComponent/SidebarAdmin";
// import { Button } from "@/components/ui/button";
// import { Menu } from "lucide-react";

// const LayoutAdmin = ({ children }) => {
//    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//    return (
//       <SidebarProvider>
//          <div className='flex min-h-screen bg-background text-foreground'>
//             {/* Sidebar */}
//             <SidebarAdmin isOpen={isSidebarOpen} />

//             {/* Main Content */}
//             <div
//                className={`flex-1 transition-all duration-300 ease-in-out ${
//                   isSidebarOpen ? "ml-64" : "ml-16"
//                }`}
//             >
//                {/* Trigger Button */}

//                <div className='fixed top-4 left-4 z-50 mb-4'>
//                   <Button
//                      variant='outline'
//                      size='icon'
//                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                      className='border-border'
//                   >
//                      <Menu className='h-5 w-5' />
//                   </Button>
//                </div>

//                {/* Header */}
//                <div className='h-16 bg-primary text-primary-foreground shadow flex items-center px-4'>
//                   <h1 className='text-lg font-bold'>Admin Dashboard</h1>
//                </div>

//                {/* Content */}
//                <div className='p-6 pt-20 border-2'>{children}</div>
//             </div>
//          </div>
//       </SidebarProvider>
//    );
// };

// export default LayoutAdmin;

// import React from "react";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import SidebarAdmin from "../components/adminComponent/SidebarAdmin";

// const LayoutAdmin = ({ children }) => {
//    return (
//       <SidebarProvider>
//          {/* Sidebar */}
//          <SidebarAdmin />

//          {/* Main Content */}
//          <main className="relative min-h-screen bg-background text-foreground">
//             <div className="absolute top-0 left-0 w-full h-16 bg-primary z-10 flex items-center px-4 shadow">
//                <h1 className="text-lg font-bold">Admin Dashboard</h1>
//             </div>
//             <div className="pt-16 px-4">
//                {children}
//             </div>
//          </main>
//       </SidebarProvider>
//    );
// };

// export default LayoutAdmin;

// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
// import SidebarAdmin from "../components/adminComponent/SidebarAdmin";
// import HeaderAdmin from "../components/adminComponent/HeaderAdmin";
// import { Button } from "@/components/ui/button";
// import { Menu } from "lucide-react";

// const LayoutAdmin = () => {
//    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//    return (
//       <div className="min-h-screen flex bg-background text-foreground">
//          {/* Sidebar */}
//          <SidebarAdmin isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

//          {/* Main Content */}
//          <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
//             <div className={`fixed top-4 z-50 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'left-64' : 'left-16'}`}>
//                <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                   className="bg-transparent border-none"
//                >
//                   <Menu className="h-5 w-5" />
//                </Button>
//             </div>
//             <HeaderAdmin />
//             <main className="p-6 bg-background text-foreground overflow-y-auto">
//                <Outlet />
//             </main>
//          </div>
//       </div>
//    );
// };

// export default LayoutAdmin;

// import React from "react";
// import { Outlet } from "react-router-dom";
// import SidebarAdmin from "../components/adminComponent/SidebarAdmin";
// import HeaderAdmin from "../components/adminComponent/HeaderAdmin";

// const LayoutAdmin = () => {
//    return (
//       <div className='min-h-screen flex'>
//          <SidebarAdmin />
//          <div className='flex-1 flex flex-col'>
//             <HeaderAdmin />
//             <main className='flex-1 p-6 bg-Bg-night-700 overflow-y-auto'>
//                <Outlet />
//             </main>
//          </div>
//       </div>
//    );
// };

// export default LayoutAdmin;

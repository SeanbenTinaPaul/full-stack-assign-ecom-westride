// export default Layout;
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import MainNav from "../components/MainNav";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Layout = () => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   return (
      <div className="min-h-screen flex">
         {/* Sidebar */}
         <MainNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

         {/* Main Content */}
         <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
            {/* Trigger Button */}
            <div className="fixed top-4 left-4 z-50">
               <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               >
                  <Menu className="h-4 w-4" />
               </Button>
            </div>

            <main className="p-4 md:p-6 min-h-screen">
               <div className="pt-14">
                  <Outlet />
               </div>
            </main>
         </div>
      </div>
   );
};

export default Layout;

// import React from "react";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import { Outlet } from "react-router-dom";
// import MainNav from "../components/MainNav";

// const Layout = () => {
//    return (
//       <SidebarProvider>
//       <div className="min-h-screen flex">
//          <MainNav />
//          <main>
//          <SidebarTrigger />
//             {/* Outlet lib ใช้แสดง แสดงผลของ child routes หรือ sub-routes ภายใน route ที่กำหนดไว้ */}
//             <Outlet />
//          </main>
//       </div>
//    </SidebarProvider>
//    );
// };
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";

const LayoutUser = () => {
   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
   const contentMargin = isSidebarCollapsed ? "ml-16" : "ml-64";
   return (
      <div>
         <h1>Nav</h1>
         <Outlet />
      </div>
   );
};

export default LayoutUser;

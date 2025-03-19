//rafce
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
   return (
      <>
         <Toaster/>
         <AppRoutes />
      </>
   );
};

export default App;

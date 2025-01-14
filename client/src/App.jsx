//rafce
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
   return (
      <>
         <ToastContainer />
         <Toaster/>
         <AppRoutes />
      </>
   );
};

export default App;

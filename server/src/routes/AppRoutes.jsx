import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "../layouts/Layout";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import History from "../pages/History";
import Checkout from "../pages/Checkout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import LayoutAdmin from "../layouts/LayoutAdmin";
import Dashboard from "../pages/admin/Dashboard";
import Category from "../pages/admin/Category";
import Product from "../pages/admin/Product";
import Manage from "../pages/admin/Manage";
import EditProd from "../pages/admin/EditProd";

import LayoutUser from "../layouts/LayoutUser";
import HomeUser from "../pages/user/HomeUser";
import { ProtectRouteUser } from "./ProtectRouteUser";
import { ProtectRouteAdmin } from "./ProtectRouteAdmin";

//แบ่งหน้า: 1. public 2. private
//กลุ่มหน้า public ▼
//layout design webpage นี้: ให้มี nav 2 ที่ : Header nav และ Sidebar
//http://localhost:5173/history ► เข้าสู่หน้า History.jsx
// .jsx files in ../../src/pages folder 
const router = createBrowserRouter([
   {
      path: "/", // → path แม่ตั้งต้น
      element: <Layout />,
      children: [
         //ใช้ index: true เพราะใช้ path เดียวกับตัวแม่
         //path ลูกเอาไป + path แม่ → '/' + 'shop' = '/shop'
         { index: true, element: <Home /> },
         { path: "shop", element: <Shop /> },
         { path: "cart", element: <Cart /> },
         { path: "history", element: <History /> },
         { path: "checkout", element: <Checkout /> },
         { path: "login", element: <Login /> },
         { path: "register", element: <Register /> }
      ]
   },
   {
      path: "/admin",
      element: <ProtectRouteAdmin element={<LayoutAdmin />} />,
      children: [
         { index: true, element: <Dashboard /> },
         { path: "category", element: <Category /> },
         { path: "product", element: <Product /> },
         { path: "product/:id", element: <EditProd /> },
         { path: "manage", element: <Manage /> }
      ]
   },
   {
      path: "/user",
      //  element: <LayoutUser />,
      //ให้เรียก component ProtectRouteUser ก่อนถึงจะเรียก LayoutUserได ้
      element: <ProtectRouteUser element={<LayoutUser />} />,
      children: [{ index: true, element: <HomeUser /> }]
   }
]);

const AppRoutes = () => {
   return (
      <>
         <RouterProvider router={router} />
      </>
   );
};

export default AppRoutes;

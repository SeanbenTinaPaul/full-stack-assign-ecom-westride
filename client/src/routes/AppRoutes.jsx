import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "../layouts/Layout";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
// import Cart from "../pages/Cart";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import LayoutAdmin from "../layouts/LayoutAdmin";
import { ProtectRouteAdmin } from "./ProtectRouteAdmin";
import BrandAdmin from "../pages/admin/BrandStore";
import Dashboard from "../pages/admin/Dashboard";
import CategoryAdmin from "../pages/admin/Category";
import ProductAdmin from "../pages/admin/Product";
import ManageAdmin from "../pages/admin/Manage";
import EditProdAdmin from "../pages/admin/EditProd";
import PromotionAdmin from "../pages/admin/Promotion";

import LayoutUser from "../layouts/LayoutUser";
import { ProtectRouteUser } from "./ProtectRouteUser";
import HomeUser from "../pages/user/HomeUser";
import Payment from "../pages/user/PaymentUser";
import ShopUser from "@/pages/user/ShopUser";
import CartUser from "@/pages/user/CartUser";
import HistoryUser from "@/pages/user/HistoryUser";
import UpdateOrder from "@/pages/admin/UpdateOrder";
import EditProfileUser from "@/pages/user/EditProfileUser";
import ViewProdPageUser from "@/pages/user/ViewProdPageUser";
import ViewProdPage from "@/pages/ViewProdPage";

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
         { path: "login", element: <Login /> },
         { path: "register", element: <Register /> },
         { path: "view-product/:id", element: <ViewProdPage /> }
      ]
   },
   {
      path: "/admin",
      element: <ProtectRouteAdmin element={<LayoutAdmin />} />,
      children: [
         // { index: true, element: <Dashboard /> },
         { index: true, element: <ManageAdmin /> },
         // { path: "brand-store", element: <BrandAdmin /> },
         // { path: "manage", element: <ManageAdmin /> },
         { path: "category", element: <CategoryAdmin /> },
         { path: "product", element: <ProductAdmin /> },
         { path: "product/:id", element: <EditProdAdmin /> },
         { path: "orders", element: <UpdateOrder /> },
         { path: "promotion", element: <PromotionAdmin /> },
      ]
      //then go to LayoutAdmin > SidebarAdmin → add these children to pages
   },
   {
      path: "/user",
      //  element: <LayoutUser />,
      //ให้เรียก component ProtectRouteUser ก่อนถึงจะเรียก LayoutUserได ้
      element: <ProtectRouteUser element={<LayoutUser />} />,
      children: [
         { index: true, element: <HomeUser /> },
         { path: "shop", element: <ShopUser /> },
         { path: "cart", element: <CartUser /> },
         { path: "payment", element: <Payment /> },
         { path: "history", element: <HistoryUser /> },
         { path: "editprofile", element: <EditProfileUser /> },
         { path: "view-product/:id", element: <ViewProdPageUser /> }
      ]
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

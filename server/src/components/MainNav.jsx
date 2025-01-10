import React from "react";
import { Link } from "react-router-dom";

function MainNav() {
   return (
      <nav className='bg-Header-footer-bar-night text-Text-white shadow-md'>
         <div className='mx-auto px-2'>
            <div className='flex justify-between h-16'>
               <div className='flex items-center gap-4'>
                  {/* ฝั่งซ้าย */}
                  <Link
                     to={"/"}
                     className='text-2xl font-bold'
                  >
                     LOGO
                  </Link>
                  <Link to={"/"}>Home</Link>
                  <Link to={"shop"}>Shop</Link>
                  <Link to={"cart"}>Cart</Link>
               </div>
               <div className='flex items-center gap-4'>
                  {/* ฝั่งขวา */}
                  <Link to={"register"}>Register</Link>
                  <Link to={"login"}>Login</Link>
               </div>
            </div>
         </div>
      </nav>
   );
}

export default MainNav;

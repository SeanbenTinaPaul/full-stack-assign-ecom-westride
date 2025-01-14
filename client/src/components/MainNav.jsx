// //parent→ Layout.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Store, ShoppingCart, UserPlus, LogIn } from "lucide-react";

function MainNav({ isOpen }) {
  return (
    <div 
      className={`fixed top-0 left-0 h-full w-64 bg-background border-r transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <ScrollArea className="h-full px-2">
        <div className="flex flex-col gap-4 py-4 pt-16">
          {/* Logo section */}
          <div className="px-4 py-2">
            <h2 className="text-2xl font-bold">LOGO</h2>
          </div>
          
          {/* Navigation Links */}
          <div className="flex flex-col space-y-2">
            <Link to="/">
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            
            <Link to="shop">
              <Button variant="ghost" className="w-full justify-start">
                <Store className="mr-2 h-4 w-4" />
                Shop
              </Button>
            </Link>
            
            <Link to="cart">
              <Button variant="ghost" className="w-full justify-start">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart
              </Button>
            </Link>
          </div>

          {/* Auth Links */}
          <div className="flex flex-col space-y-2 mt-auto">
            <Link to="register">
              <Button variant="ghost" className="w-full justify-start">
                <UserPlus className="mr-2 h-4 w-4" />
                Register
              </Button>
            </Link>
            
            <Link to="login">
              <Button variant="ghost" className="w-full justify-start">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default MainNav;



// import React from "react";
// import { Link } from "react-router-dom";


// function MainNav() {
//    return (
//       <nav className=' shadow-md'>
//          <div className='mx-auto px-2'>
//             <div className='flex justify-between h-16'>
//                <div className='flex items-center gap-4'>
//                   {/* ฝั่งซ้าย */}
//                   <Link
//                      to={"/"}
//                      className='text-2xl font-bold'
//                   >
//                      LOGO
//                   </Link>
//                   <Link to={"/"}>Home</Link>
//                   <Link to={"shop"}>Shop</Link>
//                   <Link to={"cart"}>Cart</Link>
//                </div>
//                <div className='flex items-center gap-4'>
//                   {/* ฝั่งขวา */}
//                   <Link to={"register"}>Register</Link>
//                   <Link to={"login"}>Login</Link>
//                </div>
//             </div>
//          </div>
//       </nav>
//    );
// }

// export default MainNav;
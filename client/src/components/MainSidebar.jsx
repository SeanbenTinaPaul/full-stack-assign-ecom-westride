//parent→ Layout.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Store, ShoppingCart, UserPlus, LogIn, Slack } from "lucide-react";
import useEcomStore from "@/store/ecom-store";
import { Badge } from "./ui/badge";

const navItems = [
   {
      title: "Home",
      url: "/",
      icon: Home,
      end: true
   },
   {
      title: "Shop",
      url: "shop",
      icon: Store
   },
   // {
   //    title: "Cart",
   //    url: "cart",
   //    icon: ShoppingCart
   // }
];

const authItems = [
   {
      title: "Register",
      url: "register",
      icon: UserPlus
   },
   {
      title: "Login",
      url: "login",
      icon: LogIn
   }
];

const MainSidebar = ({ isCollapsed }) => {
   const sidebarWidth = isCollapsed ? "w-16" : "w-56";
   const {user,carts} = useEcomStore((state) => state);//for badge carts

   return (
      <div
         className={`${sidebarWidth} transition-all duration-300 bg-slate-800 text-white flex flex-col h-screen drop-shadow-xl fixed top-0 left-0 z-50`}
      >
         <div
            className={` mt-10 h-24 bg-slate-700 flex items-center justify-center ${
               isCollapsed ? "px-2" : "px-4"
            }`}
         >
            <h2
               className={`font-bold transition-all duration-300 ${
                  isCollapsed ? "text-sm" : "text-2xl"
               }`}
            >
               {isCollapsed ? (
                  <Slack />
               ) : (
                  <div className='flex items-center pr-4 gap-2'>
                     <Slack />
                     <span>Assignment</span>
                  </div>
               )}
            </h2>
         </div>

         <ScrollArea className='flex-1 px-2 py-4 h-[calc(100vh-8.5rem)]'>
            <nav className='space-y-2'>
               {navItems.map((item) => (
                  <NavLink
                     key={item.title}
                     //cant go to cart if not logged in
                     to={item.url==='cart' && !user ? 'login' : item.url} 
                     end={item.end}
                     title={item.title}
                     className={({ isActive }) =>
                        `${
                           isActive ? "bg-slate-900 text-white" : "text-gray-300 hover:bg-slate-700"
                        } 
                        px-3 py-2 rounded flex items-center transition-all duration-300 relative
                        ${isCollapsed ? "justify-center" : "justify-start"}`
                     }
                  >
                     <item.icon className={`${isCollapsed ? "mr-0" : "mr-2"} h-5 w-5 `} />
                     <span
                        className={`transition-all duration-300 ${
                           isCollapsed ? "hidden" : "block"
                        }`}
                     >
                        {item.title}
                     </span>
                     {item.title === "Cart" && carts.length > 0 && user && (
                        <Badge className='absolute right-1 z-50 ml-2 bg-red-500 text-white rounded-full px-2'>
                           {carts.length}
                        </Badge>
                     )}
                  </NavLink>
               ))}
            </nav>

            {/* Auth Links */}
            <div className='mt-8 pt-4 border-t border-slate-700'>
               {authItems.map((item) => (
                  <NavLink
                     key={item.title}
                     to={item.url}
                     title={item.title}
                     className={({ isActive }) =>
                        `${
                           isActive ? "bg-slate-900 text-white" : "text-gray-300 hover:bg-slate-700"
                        } 
                        px-3 py-2 rounded flex items-center transition-all duration-300 mb-2
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
            </div>
         </ScrollArea>
      </div>
   );
};

export default MainSidebar;

// import React from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//    Home,
//    Store,
//    ShoppingCart,
//    UserPlus,
//    LogIn
// } from "lucide-react";

// const navItems = [
//    {
//       title: "Home",
//       url: "/",
//       icon: Home,
//       end: true
//    },
//    {
//       title: "Shop",
//       url: "shop",
//       icon: Store
//    },
//    {
//       title: "Cart",
//       url: "cart",
//       icon: ShoppingCart
//    }
// ];

// const authItems = [
//    {
//       title: "Register",
//       url: "register",
//       icon: UserPlus
//    },
//    {
//       title: "Login",
//       url: "login",
//       icon: LogIn
//    }
// ];

// const MainNav = ({ isCollapsed }) => {
//    const sidebarWidth = isCollapsed ? "w-16" : "w-64";

//    return (
//       <div
//          className={`${sidebarWidth} transition-all duration-300 bg-slate-800 text-white flex flex-col h-screen drop-shadow-xl`}
//       >
//          <ScrollArea className="h-full">
//             <div className="flex flex-col gap-4 py-4 pt-16">
//                {/* Logo section */}
//                <div className={`px-4 py-2 transition-all duration-300
//                   ${isCollapsed ? 'flex justify-center' : ''}`}>
//                   <h2 className={`font-bold transition-all duration-300
//                      ${isCollapsed ? 'text-sm' : 'text-2xl'}`}>
//                      {isCollapsed ? 'L' : 'LOGO'}
//                   </h2>
//                </div>

//                {/* Navigation Links */}
//                <div className="flex flex-col space-y-2 px-2">
//                   {navItems.map((item) => (
//                      <Link key={item.title} to={item.url}>
//                         <Button
//                            variant="ghost"
//                            className={`w-full transition-all duration-300
//                               ${isCollapsed ? 'justify-center px-2' : 'justify-start'}`}
//                         >
//                            <item.icon className={`${isCollapsed ? 'mr-0' : 'mr-2'} h-4 w-4`} />
//                            <span className={`transition-all duration-300
//                               ${isCollapsed ? 'hidden' : 'block'}`}>
//                               {item.title}
//                            </span>
//                         </Button>
//                      </Link>
//                   ))}
//                </div>

//                {/* Auth Links */}
//                <div className="flex flex-col space-y-2 mt-auto px-2">
//                   {authItems.map((item) => (
//                      <Link key={item.title} to={item.url}>
//                         <Button
//                            variant="ghost"
//                            className={`w-full transition-all duration-300
//                               ${isCollapsed ? 'justify-center px-2' : 'justify-start'}`}
//                         >
//                            <item.icon className={`${isCollapsed ? 'mr-0' : 'mr-2'} h-4 w-4`} />
//                            <span className={`transition-all duration-300
//                               ${isCollapsed ? 'hidden' : 'block'}`}>
//                               {item.title}
//                            </span>
//                         </Button>
//                      </Link>
//                   ))}
//                </div>
//             </div>
//          </ScrollArea>
//       </div>
//    );
// };

// export default MainNav;
// import React from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Home, Store, ShoppingCart, UserPlus, LogIn } from "lucide-react";

// function MainNav({ isOpen }) {
//   return (
//     <div
//       className={`fixed border-red-400 border-4 top-0 left-0 h-full w-64 bg-background border-r transform transition-transform duration-300 ease-in-out ${
//         isOpen ? 'translate-x-0' : '-translate-x-full'
//       }`}
//     >
//       <ScrollArea className="h-full px-2">
//         <div className="flex flex-col gap-4 py-4 pt-16">
//           {/* Logo section */}
//           <div className="px-4 py-2">
//             <h2 className="text-2xl font-bold">LOGO</h2>
//           </div>

//           {/* Navigation Links */}
//           <div className="flex flex-col space-y-2">
//             <Link to="/">
//               <Button variant="ghost" className="w-full justify-start">
//                 <Home className="mr-2 h-4 w-4" />
//                 Home
//               </Button>
//             </Link>

//             <Link to="shop">
//               <Button variant="ghost" className="w-full justify-start">
//                 <Store className="mr-2 h-4 w-4" />
//                 Shop
//               </Button>
//             </Link>

//             <Link to="cart">
//               <Button variant="ghost" className="w-full justify-start">
//                 <ShoppingCart className="mr-2 h-4 w-4" />
//                 Cart
//               </Button>
//             </Link>
//           </div>

//           {/* Auth Links */}
//           <div className="flex flex-col space-y-2 mt-auto">
//             <Link to="register">
//               <Button variant="ghost" className="w-full justify-start">
//                 <UserPlus className="mr-2 h-4 w-4" />
//                 Register
//               </Button>
//             </Link>

//             <Link to="login">
//               <Button variant="ghost" className="w-full justify-start">
//                 <LogIn className="mr-2 h-4 w-4" />
//                 Login
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </ScrollArea>
//     </div>
//   );
// }

// export default MainNav;

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

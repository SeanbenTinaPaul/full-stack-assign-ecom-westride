//parent→ LayoutUser.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
   Home,
   Store,
   ShoppingCart,
   UserPlus,
   LogIn,
   LogOut,
   Wallet,
   History,
   UserPen,
   User,
   Slack,
   ChevronDown,
   ChevronUp,
   Heart 
} from "lucide-react";
import useEcomStore from "@/store/ecom-store";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { createCartUser } from "@/api/userAuth";
import { useToast } from "@/components/hooks/use-toast";

const navItems = [
   {
      title: "Home user",
      url: "/user",
      icon: Home,
      end: true
   },
   {
      title: "Shop",
      url: "shop",
      icon: Store
   },
   {
      title: "Cart",
      url: "cart",
      icon: ShoppingCart
   },
   {
      title: "Payment",
      url: "payment",
      icon: Wallet
   },
   {
      title: "History",
      url: "history",
      icon: History
   },
   {
      title: "Favorites",
      url: "favorite",
      icon: Heart 
   }
];

const authItems = [
   {
      title: "Edit profile",
      url: "editprofile",
      icon: UserPen
   }
   // {
   //    title: "Edit profile",
   //    url: "editprofile",
   //    icon: UserPen
   // }
];

function SidebarUser({ isCollapsed }) {
   const { toast } = useToast();
   const navigate = useNavigate();
   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

   const sidebarWidth = isCollapsed ? "w-16" : "w-56";
   const {
      user,
      token,
      carts,
      isSaveToCart,
      actionLogout,
      setShowLogoutConfirm,
      handleDirectLogout,
      showLogoutConfirm,
      updateStatusSaveToCart
   } = useEcomStore((state) => state); //for badge carts

   //for AlertDialog confirm logout
   const handleLogout = (e) => {
      e.preventDefault(); //add this to achieve local storage key deletion
      setShowLogoutConfirm(false);
      // actionLogout();
      handleDirectLogout();
      navigate("/", { replace: true });
   };

   //for validate when users try to logout but cart not empty
   const handleMainLogout = (e) => {
      e.preventDefault();
      if (carts.length > 0 && !isSaveToCart) {
         setShowLogoutConfirm(true); // Show confirmation if cart not empty and not saved
      } else {
         actionLogout(); // Zustand action handles state + localStorage
         navigate("/", { replace: true }); // Use React Router navigation
      }
   };
   /*
   e.preventDefault();
                  const state = useEcomStore.getState();
                  if (state.carts.length > 0 && !state.isSaveToCart) {
                     // Show confirmation if cart not empty and not saved
                     state.setShowLogoutConfirm(true);
                  } else {
                     // Regular logout process
                     state.actionLogout();
                     // Only navigate after proper logout
                     window.location.href = "/";
                  }
   */
   const handleCreateCart = async () => {
      try {
         const res = await createCartUser(token, { carts });
         // console.log("res.data.cart", res.data.cart);
         // console.log("res.data.productOnCart", res.data.productOnCart);
         if (res.data.success) {
            updateStatusSaveToCart(true);
            toast({
               title: "Your cart is now saved.",
               description: "Feel free to browse more or come back later to complete your purchase."
            });
         } else {
            console.log("error", res.data.message);
            toast({
               variant: "destructive",
               title: "error",
               description: "Adding to cart Not success"
            });
         }
      } catch (err) {
         console.log(err);
      }
   };
   return (
      <div
         className={`${sidebarWidth} transition-all duration-300 bg-gradient-to-r from-slate-700 to-slate-800 text-white flex flex-col h-screen drop-shadow-xl fixed top-0 left-0 z-50`}
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
                     <span>User Page</span>
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
                     to={item.url === "cart" && !user ? "login" : item.url}
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
            {/* Profile */}
            <nav>
               <div className='mt-8 pt-4 border-t border-slate-700'>
                  <button
                     onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                     className={`w-full ${
                        isProfileDropdownOpen
                           ? "bg-slate-900 text-white"
                           : "text-gray-300 hover:bg-slate-700"
                     } px-3 py-2 rounded flex items-center justify-between transition-all duration-300 mb-2
                   ${isCollapsed ? "justify-center" : "justify-between"}`}
                  >
                     <div
                        title='My profile'
                        className='flex flex-nowrap items-center'
                     >
                        <div
                           className={`bg-slate-200 rounded-full shadow-sm overflow-hidden ${
                              isCollapsed ? "mr-0" : "mr-2"
                           } h-6 w-6`}
                        >
                           <img
                              src={user.picture}
                              alt='user'
                              className='w-full object-cover'
                           />
                        </div>
                        <span
                           className={`transition-all duration-300 truncate text-ellipsis whitespace-nowrap overflow-hidden ${
                              isCollapsed ? "hidden" : "block"
                           }`}
                        >
                           {user.name ? user.name : "My profile"}
                        </span>
                     </div>
                     {!isCollapsed && (
                        <ChevronDown
                           className={`h-4 w-4 transition-transform duration-300 ${
                              isProfileDropdownOpen ? "rotate-180" : ""
                           }`}
                        />
                     )}
                  </button>
                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                     <div className={`pl-1 space-y-1 ${isCollapsed ? "pl-0" : ""}`}>
                        {authItems.map((item) => (
                           <NavLink
                              key={item.title}
                              to={item.url}
                              title={item.title}
                              className={({ isActive }) =>
                                 `${
                                    isActive
                                       ? "bg-slate-900 text-white"
                                       : "text-gray-300 hover:bg-slate-700"
                                 } px-3 py-2 rounded flex items-center transition-all duration-300
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
                  )}
               </div>
            </nav>
         </ScrollArea>
         {/* ONLY for Log out  */}
         <div className='p-2'>
            <button
               title='Log out user'
               onClick={(e) => handleMainLogout(e)}
               className={`w-full text-gray-300 px-3 py-2 hover:bg-slate-700 rounded flex items-center transition-all duration-300
      ${isCollapsed ? "justify-center" : "justify-start"}`}
            >
               <LogOut className={`${isCollapsed ? "mr-0" : "mr-2"} h-5 w-5`} />
               <span className={`transition-all duration-300 ${isCollapsed ? "hidden" : "block"}`}>
                  Log out
               </span>
            </button>

            {/* <NavLink
               // redirect to 'http://localhost:5173/' when click
               to={"/"}
               end={true}
            >
               <button
                  title='Log out user'
                  onClick={() => actionLogout()}
                  className={`w-full text-gray-300 px-3 py-2 hover:bg-slate-700 rounded flex items-center transition-all duration-300
               ${isCollapsed ? "justify-center" : "justify-start"}`}
               >
                  <LogOut className={`${isCollapsed ? "mr-0" : "mr-2"} h-5 w-5`} />
                  <span
                     className={`transition-all duration-300 ${isCollapsed ? "hidden" : "block"}`}
                  >
                     Log out
                  </span>
               </button>
            </NavLink> */}
         </div>
         <AlertDialog
            open={showLogoutConfirm}
            onOpenChange={setShowLogoutConfirm}
         >
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Don't Lose Your Cart Updated!</AlertDialogTitle>
                  <AlertDialogDescription>Place Order Before Logging Out</AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel onClick={(e) => handleLogout(e)}>
                     Lost them and log out
                  </AlertDialogCancel>
                  <AlertDialogAction
                     onClick={() => {
                        handleCreateCart();
                        setShowLogoutConfirm(false);
                     }}
                  >
                     Place order
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </div>
   );
}

SidebarUser.propTypes = {};

export default SidebarUser;

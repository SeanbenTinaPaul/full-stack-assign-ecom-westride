import BestSeller from "@/components/homeComponents/BestSeller";
import CarouselBanner from "@/components/homeComponents/CarouselBanner";
import NewProd from "@/components/homeComponents/NewProd";
import UserFavprod from "@/components/homeComponents/UserFavprod";
import React from "react";

const HomeUser = () => {
   return (
      <div className=' flex flex-col items-center'>
         <CarouselBanner />
         
         <BestSeller/>

         <NewProd/>

         <UserFavprod/>
      </div>
   );
};

export default HomeUser;

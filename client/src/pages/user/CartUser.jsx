//parent → LayoutUser.jsx
import React from "react";

import PropTypes from "prop-types";
import { useOutletContext } from 'react-router-dom';//to recieve props as context={} from parent
import CartCheckout from "@/components/userComponent/CartCheckout";

function CartUser() {
   const isCollapsedContext = useOutletContext();
   return (
      <div>
         <CartCheckout isCollapsedContext={isCollapsedContext} />
      </div>
   );
}

CartUser.propTypes = {
};

export default CartUser;

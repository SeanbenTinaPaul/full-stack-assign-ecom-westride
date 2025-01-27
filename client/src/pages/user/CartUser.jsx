import React from "react";
import PropTypes from "prop-types";
import CartCheckout from "@/components/userComponent/CartCheckout";

function CartUser(props) {
   return (
      <div>
         <CartCheckout />
      </div>
   );
}

CartUser.propTypes = {};

export default CartUser;

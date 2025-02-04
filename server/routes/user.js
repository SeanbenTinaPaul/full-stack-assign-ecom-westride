const express = require("express");
const router = express.Router();
//import service
const {
   createUserCart,
   getUserCart,
   emptyCart,
   saveAddress,
   saveOrder,
   getOrder,
   favoriteProduct
} = require("../service/userService");

const { authCheck } = require("../middlewares/authCheck.js");

router.post("/user/cart", authCheck, createUserCart); //add cart
router.get("/user/cart", authCheck, getUserCart);
//pending...
router.delete("/user/cart", authCheck, emptyCart); //ไม่มี id เพราะจะใช้ id จาก token user คนนั้น

router.post("/user/address", authCheck, saveAddress);

router.post("/user/order", authCheck, saveOrder);
router.get("/user/order", authCheck, getOrder);

router.post("/user/favorite-prod", favoriteProduct);//pending...

module.exports = router;

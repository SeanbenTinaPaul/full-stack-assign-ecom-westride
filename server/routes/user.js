const express = require("express");
const router = express.Router();
//import service
const {
   createUserCart,
   getUserCart,
   emptyCart,
   saveAddress,
   saveOrder,
   getOrder
} = require("../service/userService");

const { authCheck } = require("../middlewares/authCheck.js");

router.post("/user/cart", authCheck, createUserCart); //add cart
router.get("/user/cart", authCheck, getUserCart);
router.delete("/user/cart", authCheck, emptyCart); //ไม่มี id เพราะจะใช้ id จาก token user คนนั้น

router.post("/user/address", authCheck, saveAddress);

router.post("/user/order", authCheck, saveOrder);
router.get("/user/order", authCheck, getOrder);

module.exports = router;

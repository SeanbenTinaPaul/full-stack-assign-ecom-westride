const express = require("express");
const router = express.Router();
//import service
const {
   listUsers,
   changeStatus,
   changeRole,
   createUserCart,
   getUserCart,
   emptyCart,
   saveAddress,
   saveOrder,
   getOrder
} = require("../service/userService");

const { authCheck, adminCheck } = require("../middlewares/authCheck.js");

//only admin can access
router.get("/users", authCheck, adminCheck, listUsers);
router.post("/change-status", authCheck, adminCheck, changeStatus);
router.post("/change-role", authCheck, adminCheck, changeRole);

//user can access
router.post("/user/cart", authCheck, createUserCart); //add cart
router.get("/user/cart", authCheck, getUserCart);
router.delete("/user/cart", authCheck, emptyCart); //ไม่มี id เพราะจะใช้ id จาก token user คนนั้น

router.post("/user/address", authCheck, saveAddress);

router.post("/user/order", authCheck, saveOrder);
router.get("/user/order", authCheck, getOrder);

module.exports = router;

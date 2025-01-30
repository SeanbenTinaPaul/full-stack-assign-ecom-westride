const express = require("express");
const router = express.Router();
//import service
const { changeOrderStatus, getOrderAdmin } = require("../service/adminService");
const { authCheck, adminCheck } = require("../middlewares/authCheck");

//1. ดึงข้อมูลทั้งหมดไปแสดงที่หน้า admin
router.get("/admin/orders", authCheck, adminCheck, getOrderAdmin);
//2. หลังดึงข้อมูลจะ update สถานะ
router.put("/admin/order-status", authCheck, adminCheck, changeOrderStatus);

module.exports = router;

/*router.post('/register', (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    
    res.send('register user');
})*/

const express = require("express");
const router = express.Router();
//import service
const {createPayment} = require("../service/paymentService");
const { authCheck } = require("../middlewares/authCheck");


router.post("/user/create-payment-intent", authCheck, createPayment);



module.exports = router;
const express = require("express");
const router = express.Router();
//import service
const { createPayment, cancelPayment,reqRefund } = require("../service/paymentService");
const { userVerify } = require("../middlewares/authVerify");

router.post("/user/create-payment-intent", userVerify, createPayment);
router.post("/user/cancel-payment-intent", userVerify, cancelPayment);
router.post("/user/refund-payment", userVerify, reqRefund);

module.exports = router;

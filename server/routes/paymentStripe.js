const express = require("express");
const router = express.Router();
//import service
const { createPayment, cancelPayment,reqRefund } = require("../service/paymentService");
const { authCheck } = require("../middlewares/authCheck");

router.post("/user/create-payment-intent", authCheck, createPayment);
router.post("/user/cancel-payment-intent", authCheck, cancelPayment);
router.post("/user/refund-payment", authCheck, reqRefund);

module.exports = router;

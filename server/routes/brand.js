const express = require("express");
const router = express.Router();

const { listBrand, createBrand, updateBrand, removeBrand } = require("../service/brandService");
const { userVerify, adminVerify } = require("../middlewares/authVerify");

router.get("/brand", listBrand);
router.post("/brand", userVerify, adminVerify, createBrand);
router.patch("/brand", userVerify, adminVerify, updateBrand);
router.delete("/brand/:id", userVerify, adminVerify, removeBrand);

module.exports = router;

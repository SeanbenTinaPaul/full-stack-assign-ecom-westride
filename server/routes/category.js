const express = require("express");
const router = express.Router();
const { createCategory, listCategory, removeCategory } = require("../service/categService");
const { userVerify, adminVerify } = require("../middlewares/authVerify");

// @ENDPOINT http://localhost:5000/api/category
//read
router.get("/category", listCategory);
//write
router.post("/category", userVerify, adminVerify, createCategory);
router.delete("/category/:id", userVerify, adminVerify, removeCategory);

module.exports = router;

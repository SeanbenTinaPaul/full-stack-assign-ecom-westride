const express = require("express");
const router = express.Router();

//service
const {
   createProd,
   listProd,
   readAprod,
   updateProd,
   removeProd,
   displayProdBy,
   displayProdByUser,
   searchFilters,
   uploadImages,
   removeImage,
   bulkDiscount
} = require("../service/productService");
const { userVerify, adminVerify } = require("../middlewares/authVerify");

//ENDPOINT: http://localhost:5000/api/product
//read
router.post("/products/:count", listProd); //view product records according to count numbers
router.get("/product/:id", readAprod); //for FormEditProd.jsx → readProduct(token, id,)

//write
router.post("/product", userVerify, adminVerify, createProd);
router.patch("/product/:id", userVerify, adminVerify, updateProd);
router.delete("/product/:id", userVerify, adminVerify, removeProd); //delete only a single product
router.post("/bulk-discount", userVerify, adminVerify, bulkDiscount);

//read
router.post("/display-prod-by", displayProdBy);
router.get("/display-prod-by-user", userVerify, displayProdByUser);
router.post("/search-filters", searchFilters);

//image management in cloud ONLY
router.post("/images", userVerify, uploadImages); //upload image to cloudinary
router.post("/removeimage", userVerify, removeImage); //use .post to delete multiple images


module.exports = router;

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
const { authCheck, adminCheck } = require("../middlewares/authCheck");

//ENDPOINT: http://localhost:5000/api/product
//read
router.post("/products/:count", listProd); //view product records according to count numbers
router.get("/product/:id", readAprod); //for FormEditProd.jsx → readProduct(token, id,)

//write
router.post("/product", authCheck, adminCheck, createProd);
router.patch("/product/:id", authCheck, adminCheck, updateProd);
router.delete("/product/:id", authCheck, adminCheck, removeProd); //delete only a single product
router.post("/bulk-discount", authCheck, adminCheck, bulkDiscount);

//read
router.post("/display-prod-by", displayProdBy);
router.get("/display-prod-by-user", authCheck, displayProdByUser);
router.post("/search-filters", searchFilters);

//image management in cloud ONLY
router.post("/images", authCheck, uploadImages); //upload image to cloudinary
router.post("/removeimage", authCheck, removeImage); //use .post to delete multiple images


module.exports = router;

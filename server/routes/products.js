const express = require("express");
const router = express.Router();

//service
const {
   create,
   list,
   read,
   update,
   remove,
   listBy,
   searchFilters,
   uploadImages,
   removeImage,
   handleBulkDiscount,
   favoriteProduct
} = require("../service/productService");
const { authCheck, adminCheck } = require("../middlewares/authCheck");
const { favorite } = require("../config/prisma");

//ENDPOINT: http://localhost:5000/api/product
//read
router.get("/products/:count", list); //view product records according to count numbers
router.get("/product/:id", read); //for FormEditProd.jsx → readProduct(token, id,)

//write
router.post("/product", authCheck, adminCheck, create);
router.patch("/product/:id", authCheck, adminCheck, update);
router.delete("/product/:id", authCheck, adminCheck, remove); //delete only a single product
router.post("/bulk-discount", authCheck, adminCheck, handleBulkDiscount);
router.post("/favorite-prod", favoriteProduct);//pending...
//read
router.post("/productby", listBy);
router.post("/search/filters", searchFilters);

//image management in cloud ONLY
router.post("/images", authCheck, adminCheck, uploadImages); //upload image to cloudinary
router.post("/removeimage", authCheck, adminCheck, removeImage); //use .post to delete multiple images

module.exports = router;

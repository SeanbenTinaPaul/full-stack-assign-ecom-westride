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
   removeImage
} = require("../service/productService");
const { adminCheck, authCheck } = require("../middlewares/authCheck");

//ENDPOINT: http://localhost:5000/api/product
//write
router.post("/product", create);
//read
router.get("/products/:count", list); //view product records according to count numbers
router.get("/product/:id", read);//for FormEditProd.jsx → readProduct(token, id,)
//write
router.patch("/product/:id", update);
router.delete("/product/:id", remove);//delete only a single product
//read
router.post("/productby", listBy);
router.post("/search/filters", searchFilters);

//image management in cloud ONLY
router.post("/images",authCheck,adminCheck, uploadImages);//upload image to cloudinary
router.post("/removeimage",authCheck,adminCheck, removeImage);//use .post to delete multiple images

module.exports = router;

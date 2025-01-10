const express = require('express');
const router = express.Router();
//service
const { create, list, read, update, remove, listBy, searchFilters } = require('../service/productService');

//ENDPOINT: http://localhost:5000/api/product
router.post('/product', create)
router.get('/products/:count', list) //เอาไว้ดึงข้อมูลสินค้าตามจำนวนที่ต้องการรู้ (count)
router.get('/product/:id', read)
router.patch('/product/:id', update)
router.delete('/product/:id', remove)
router.post('/productby', listBy)
router.post('/search/filters', searchFilters)



module.exports = router;
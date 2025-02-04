const express  = require('express');
const router = express.Router();
const { createCategory, listCategory, removeCategory } = require('../service/categService');
const { authCheck, adminCheck } = require('../middlewares/authCheck');

// @ENDPOINT http://localhost:5000/api/category
//read
router.get('/category', listCategory)
//write
router.post('/category',authCheck, adminCheck, createCategory)
router.delete('/category/:id',authCheck, adminCheck, removeCategory)

module.exports = router;
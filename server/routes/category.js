const express  = require('express');
const router = express.Router();
const { create, list, remove } = require('../service/categService');
const { authCheck, adminCheck } = require('../middlewares/authCheck');

// @ENDPOINT http://localhost:5000/api/category
//read
router.get('/category', list)
//write
router.post('/category',authCheck, adminCheck, create)
router.delete('/category/:id',authCheck, adminCheck, remove)

module.exports = router;
const express = require("express");
const router = express.Router();
//import service
const { register, logIn, currentUser, currentAdmin } = require("../service/authService");
//import middleware
const { authCheck, adminCheck } = require("../middlewares/authCheck");

router.post("/register", register);
router.post("/login", logIn);
router.post("/current-user", authCheck, currentUser);
router.post("/current-admin", authCheck, adminCheck, currentAdmin);

/*router.post('/register', (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    
    res.send('register user');
})*/

module.exports = router;

const express = require("express");
const router = express.Router();
//import service
const { register, logIn, currUserProfile, currAdminProfile } = require("../service/authService");
//import middleware
const { userVerify, adminVerify } = require("../middlewares/authVerify");

router.post("/register", register);
router.post("/login", logIn);
router.post("/profile-user", userVerify, currUserProfile);
router.post("/profile-admin", userVerify, adminVerify, currAdminProfile);

/*router.post('/register', (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    
    res.send('register user');
})*/

module.exports = router;

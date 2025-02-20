const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs"); //ใช้ในการเข้ารหัส password
const jwt = require("jsonwebtoken"); //ใช้ในการสร้าง token

exports.register = async (req, res) => {
   try {
      const { email, name, password } = req.body;
      console.log(email, password);
      //1. validate body
      if (!email) res.status(400).json({ message: "Email is required" });
      if (!name) res.status(400).json({ message: "Name is required" });
      if (!password) res.status(400).json({ message: "Password is required" });

      //2. check if email exists in DB
      //ค้นหา เรกคอร์ดแรก (first record) จากตาราง User
      const user = await prisma.user.findFirst({
         where: {
            email: email
         }
      });

      if (user) return res.status(400).json({ message: "This email already exists" });

      //3. hash password
      const hashPassword = await bcrypt.hash(password, 10);

      //4. create Register into DBeaver
      await prisma.user.create({
         data: {
            email: email,
            name: name,
            password: hashPassword
         }
      });
      console.log("existing user", user);
      res.status(200).json({ success: true, message: "Register success ☻" });
      // res.send("Register success☻");
   } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Server Error" });
   }
};

exports.logIn = async (req, res) => {
   try {
      const { email, password } = req.body;
      console.log(email, password);
      //1. check email
      const user = await prisma.user.findFirst({
         where: {
            email: email
         }
      });

      //if (!user || !user.enabled)
      if (!user) return res.status(400).json({ message: "User not found" });

      //2. check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Password incorrect" });

      //3. create payload
      const payload = {
         id: user.id,
         email: user.email,
         role: user.role,
         name: user.name
      };

      //4. gen token
      jwt.sign(
         payload,
         process.env.JWT_SECRET,
         { expiresIn: process.env.JWT_EXPIRE },
         (err, token) => {
            if (err) {
               return res.status(500).json({ message: "Server Error" });
            } else {
               console.log("token login", token);
               console.log("paylod login", payload);
               //front need payload.role and token to access
               return res
                  .status(200)
                  .json({ message: "Login success ☻", payload, token, picture: user.picture, picturePub: user.picturePub });
            }
         }
      );

      // res.status(200).json({ success: true, message: "Login success☻", data: user });
      // res.send("login success ☻");
   } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: "Server Error ╬" });
   }
};

//req.user สร้าง key 'user' มาจาก authCheck()
//ถ้า decoded token แล้วได้ email: ที่ไม่ตรงกับใน DB จะ return 401
exports.currUserProfile = async (req, res) => {
   try {
      const user = await prisma.user.findFirst({
         where: { email: req.user.email },
         select: {
            id: true,
            email: true,
            role: true
         }
      });

      if (!user) {
         return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      res.status(200).json({ success: true, message: "Enter currUserProfile user" });
      // res.send("Enter current user");
   } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Server Error" });
   }
};

exports.currAdminProfile = async (req, res) => {
   try {
      const user = await prisma.user.findFirst({
         where: { email: req.user.email },
         select: {
            id: true,
            email: true,
            role: true
         }
      });
      if (!user) {
         return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      res.status(200).json({ success: true, message: "Enter currAdminProfile admin", data: user });
      // res.send("Enter current user");
   } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Server Error" });
   }
};

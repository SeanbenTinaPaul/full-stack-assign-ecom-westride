//imported by folder routes 
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

//handle req.headers → verify if token is valid
exports.userVerify = async (req, res, next) => {
   try {
      const bearerToken = req.headers.authorization;

      if (!bearerToken)
         return res.status(401).json({
            message: "No Token, Access Denied"
         });

      const token = bearerToken.split(" ")[1];
      //decoded ► payload info + expiration
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded-->", decoded); //{id:, email:, role:'admin', iat:, exp:}
      req.user = decoded; //สร้าง key 'user' ใน req และเก็บ decoded ไว้
      console.log("req.user-->", req.user);

      const user = await prisma.user.findFirst({
         where: {
            email: req.user.email
         }
      });
      console.log("user-->", user);

      if (!user.enabled) {
         return res.status(400).json({
            success: false,
            message: "† This User is Disabled by Admin †"
         });
      }

      next();
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "User Token Invalid"
      });
   }
};

exports.adminVerify = async (req, res, next) => {
   try {
      //req.user มาจาก authCheck()
      const { email } = req.user;
      const adminUser = await prisma.user.findFirst({
         where: {
            email: email
         }
      });

      if (!adminUser || adminUser.role !== "admin" || !adminUser.enabled) {
         return res.status(403).json({
            success: false,
            message: "Admin Resource! Access Denied"
         });
      }

      next();
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "Admin Token Invalid"
      });
   }
};

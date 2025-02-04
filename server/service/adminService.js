const prisma = require("../config/prisma");

//Feature/Button: "View All Users", "User Management", "Admin: View Users"
exports.listAllUsers = async (req, res) => {
   try {
      const users = await prisma.user.findMany({
         select: {
            id: true,
            name: true,
            email: true,
            role: true,
            enabled: true,
            address: true,
            createdAt: true,
            updatedAt: true
         }
      });

      res.status(200).json({
         success: true,
         message: "Get to All User Success",
         data: users
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "Error!!! Cannot get all user."
      });
   }
};

//Feature/Button: "Enable/Disable User", "Change User Status", "Admin: Update User Status"
exports.changeUserStatus = async (req, res) => {
   try {
      const { userIdArr, userEnabled, userRole } = req.body;
      const user = await prisma.user.updateMany({
         where: { id: { in: userIdArr.map((id) => parseInt(id)) } },
         data: { enabled: userEnabled, role: userRole }
      });

      res.status(200).json({
         success: true,
         message: `Updated ID: ${userIdArr.join(", ")} status to ${userRole}. Enabled: ${userEnabled? "enabled" : "disabled"}.`
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         success: false,
         message: "Error!!! Cannot change status."
      });
   }
};


exports.changeOrderStatus = async (req, res) => {
   try {
      const { orderIdArr, orderStatus } = req.body;
      const countOrderUpdate = await prisma.order.updateMany({
         where: { id: { in: orderIdArr } },
         data: { orderStatus: orderStatus }
      });

      res.status(200).json({
         success: true,
         message: `${countOrderUpdate.count} order(s) successfully updated to - ${orderStatus} -`,
         data: countOrderUpdate
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
   }
};

exports.getOrderAdmin = async (req, res) => {
   try {
      const orders = await prisma.order.findMany({
         include: {
            products: {
               include: { product: true }
            },
            orderedBy: {
               select: {
                  id: true,
                  name: true,
                  email: true,
                  address: true
               }
            }
         }
      });
      res.status(200).json({ success: true, message: "Get Order Admin Success", data: orders });
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
   }
};

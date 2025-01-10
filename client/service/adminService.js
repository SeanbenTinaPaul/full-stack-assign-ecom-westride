const prisma = require("../config/prisma");

exports.changeOrderStatus = async (req, res) => {
   try {
      const { orderId, orderStatus } = req.body;
      const orderUpdate = await prisma.order.update({
         where: { id: orderId },
         data: { orderStatus: orderStatus }
      });

      res.status(200).json({
         success: true,
         message: "Change Order Status Success",
         data: orderUpdate
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

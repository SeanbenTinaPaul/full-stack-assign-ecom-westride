const prisma = require("../config/prisma");
const { removeImage } = require("../service/productService"); //call api across files

/*req.body
 {
  "id": "1",           // id for existing brand (if updating)
  "title": "Nike",     // brand title
  "image": {url:"http://res.clou.jpg", public_id:"Ecom_fullstack_a"}, // img url
}
 */
exports.createBrand = async (req, res) => {
   try {
      const { email } = req.user;
      const { title, image, description } = req.body;
      //brand === {...}
      const existingBrand = await prisma.brand.findFirst({
         where: {
            title: title
         }
      });
      if (existingBrand) {
         return res
            .status(400)
            .json({ message: `Brand "${title}" already exists. Please, try another title.` });
      }
      const brand = await prisma.brand.create({
         data: {
            title: title,
            description: description || null,
            img_url: image?.url || null,
            public_id: image?.public_id || null,
            createdBy: email
         }
      });
      res.status(200).json(brand);
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
   }
};

exports.updateBrand = async (req, res) => {
   try {
      const { email } = req.user;
      const { id, title, image, description, image_url, public_id } = req.body;
      const updatedBrand = await prisma.brand.update({
         where: { id: parseInt(id) },
         data: {
            title: title,
            img_url: image?.url || image_url || null,
            public_id: image?.public_id || public_id || null,
            description: description,
            updatedBy: email
         }
      });
      res.status(200).json(updatedBrand);
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
   }
};
exports.listBrand = async (req, res) => {
   try {
      const brands = await prisma.brand.findMany({
         orderBy: {
            id: "asc"
         }
      });
      res.status(200).json(brands);
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
   }
};

exports.removeBrand = async (req, res) => {
   try {
      const { id } = req.params;
      if (isNaN(parseInt(id))) {
         return res.status(400).json({ message: "Invalid brand ID" });
      }
      const brandToDelete = await prisma.brand.findUnique({
         where: {
            id: parseInt(id)
         }
      });
      if (!brandToDelete) {
         return res.status(404).json({ message: "Brand not found" });
      }
      const result = await prisma.$transaction(async (prisma) => {
         if (brandToDelete.public_id) {
            //create mock req/res for removeImage()
            const imgReq = { body: { public_id: brandToDelete.public_id } };
            const imgRes = {
               status: (code) => {
                  return {
                     json: (data) => {
                        console.log("Image removal status:", code, data);
                     }
                  };
               }
            };
            await removeImage(imgReq, imgRes);
         }

         return await prisma.brand.delete({
            where: {
               id: parseInt(id)
            }
         });
      });
      res.status(200).json({ message: `Remove Id: ${brandToDelete.id} Brand: ${brandToDelete.title} success` });
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
   }
};

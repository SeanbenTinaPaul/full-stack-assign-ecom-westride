//ไฟล์ใช้ในการ connect prisma กับ DBeaver
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = prisma;

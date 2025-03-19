//ไฟล์ใช้ในการ connect prisma กับ DBeaver
require('dotenv/config');
const { PrismaClient } = require("@prisma/client");
const { PrismaNeon } = require('@prisma/adapter-neon');
const { Pool, neonConfig } = require('@neondatabase/serverless');

const ws = require('ws');

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
neonConfig.poolQueryViaFetch = true

// Type definitions
// declare global {
//   var prisma: PrismaClient | undefined
// }

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === 'development') global.prisma = prisma;



module.exports = prisma;


// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// module.exports = prisma;/
// 1. import express
const express = require('express');
const app = express();
const morgan = require('morgan');
const { readdirSync } = require('fs');//ใช้ในการอ่านทุกๆไฟล์ใน 1 โฟลเดอร์
const cors = require('cors');//อนุญาตให้ server และ client ติดต่อกันได้ผ่าน domain name
// const authRouter = require('./routes/auth.js');

//middleware
app.use(morgan('common'));
app.use(express.json({limit: '20mb'}));
app.use(cors());

//Routers
//เอา app.use('/api',...) เข้าไป map ทุกๆไฟล์ในโฟลเดอร์ routes
// r === 'auth.js', 'product.js',...
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));
/* 
เขียนแบบกระจายออก (manual routing) → app.use('/api',..) mount '/api' เสร็จก็หายไป

r==='product.js' ▼
app.post("/api/product", productService.create); // POST /api/product
app.delete("/api/product/:id", authCheck, productService.remove); // DELETE /api/product/:id
...
r==='auth.js' ▼
app.post("/api/login", authService.logIn); // POST /api/login
...
*/

// 2. start server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
// 1. import express
const express = require('express');
const app = express();
const morgan = require('morgan');
const { readdirSync } = require('fs');//ใช้ในการอ่านทุกๆไฟล์ใน 1 โฟลเดอร์
const cors = require('cors');//อนุญาตให้ server และ client ติดต่อกันได้ผ่าน domain name
// const authRouter = require('./routes/auth.js');

//middleware
app.use(morgan('dev'));
app.use(express.json({limit: '100kb'}));
app.use(cors());

//Routers
//เข้าไป map ทุกๆไฟล์ในโฟลเดอร์ routes
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));
// app.use('/api', authRouter);
/* app.post(`/api/register`, (req, res)=>{
     const { email, password } = req.body;
     console.log(email, password);
     res.send('Hello World');
});*/

// 2. start server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
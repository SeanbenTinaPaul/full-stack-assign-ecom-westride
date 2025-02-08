https://nodejs.org/en/download/package-manager/current
https://www.postman.com/downloads/
https://dev.mysql.com/downloads/workbench/
https://code.visualstudio.com/download


-----------Server---------------
>npm init -y
>npm install express morgan cors nodemon bcryptjs jsonwebtoken
>npm install dotenv


npm install prisma
npx prisma init
npm install @prisma/client
npm install -g prisma (ลง CLI ไว้ auto relate table ด้วย >prisma format)

// Doc ใช้ในการสร้างและอัพเดตฐานข้อมูล
npx prisma migrate dev --name ecom_weStride


// update Scheme
npx prisma db push   // no log
npx prisma migrate dev --create-only
npx prisma migrate dev --name ecom


//
อัพเดต Prisma schema
>npx prisma migrate dev --name WhateverYourUpdateName

**If you encounter an error, it might be due to an invalid schema or a conflict with existing data. To troubleshoot:
>npx prisma validate

ดูตารางความสัมพันธ์แบบละเอียด
>npx prisma studio

Payment
>npm install --save stripe

XXXXXX
------------Client--------------
npm create vite@latest
- client
- javascript

>cd client
>npm install
>npm run dev

npm install axios


-----------Server---------------
npm init -y
npm install express mongoose morgan body-parser cors nodemon socket.io
npm i cloudinary
npm install google-auth-library

****
------------Client(ตาม tutorial)--------------
npm create vite@latest
or
npm create vite@latest
- client
- javascript

>cd client
>npm install
>npm run dev

สำหรับลิงค์หน้าหากันโดยการเปลี่ยน path
>npm i react-router-dom

ลองเข้าไปเช็คไฟล์ใน vs code ดูก่อน
>code .
>npm run dev

จัดการสร้าง folders + files components สำหรับ webpage โดยรวมทั้งหมดก่อน
ไฟล์ที่ลบเนื้อหาออกได้ : index.css + App.jsx

break มาลง tailwind ก่อน
>npm install -D tailwindcss postcss autoprefixer
>npx tailwindcss init -p

วาง replaced ใน tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

วาง replaced ใน index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

ลง Flowbite เพื่อใช้ component tailwaind (additional) 
>npm install flowbite-react
- Import Flowbite React and add the plugin and the content path inside your tailwind.config.js file:
--------------------------------------------------------
import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ...
    flowbite.content(),
  ],
  plugins: [
    // ...
    flowbite.plugin(),
  ],
};
--------------------------------------------------------

ลง ShadCN UI เพื่อใช้ component(additional)
https://ui.shadcn.com/docs/installation/vite
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
สร้าง jsconfig.json
วาง 
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
    // ...
  }
}


npm install -D @types/node


เพิ่มใน vite.config.js
import path from "path"

resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },


npx shadcn@latest init
Would you like to use CSS variables for theming? Yes

เพิ่ม component 
npx shadcn@latest add <component> เช่น  
npx shadcn@latest add card
สร้าง card.jsx ใน src/components/ui/card.jsx

Payment -> Build a checkout page on the client
>npm install --save @stripe/react-stripe-js @stripe/stripe-js

motion 
>npm i framer-motion
>npm install motion
>npm i swiper

upload non-db img 
>npm i cloudinary
-----------------------------------------------------

ส่งข้อมูลไปยัง backend (เข้าไปเปิดไฟล์ของ backend แล้ว >npm start ก่อน)
>npm i axios

>npm i react-toastify
วางใน App.jsx
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ใช้แทน Redux
>npm i zustand axios

ใช้ลง icon ร่วมกับ <NavLink>
>npm install lucide-react

npm i react-use
npm i react-image-file-resizer
npm i react-toastify
npm i react-icons
npm i lucide-react
npm i lodash
npm i rc-slider
npm i numeral
npm install moment
--------------------------


XXXX
------------Client--------------
npm create vite@latest
- client
- javascript

>cd client
>npm install
>npm run dev

npm install @radix-ui/themes
npm i zustand axios
npm i react-router-dom
npm install @react-oauth/google@latest


npm i react-image-file-resizer
npm i react-toastify
npm i react-icons
npm i lucide-react
npm i lodash
npm i rc-slider
npm i numeral
npm install moment

npm install react-hook-form zod @hookform/resolvers zxcvbn

--------------------------
XXXXX



--------- Deploy DB to Supabase ------
1. Login Supabase
2. .env
        DATABASE_URL = ""
        DIRECT_URL = ""
3. schema.prisma
        datasource db {
        provider  = "postgresql"
        url       = env("DATABASE_URL")
        directUrl = env("DIRECT_URL")
        }

npx prisma db push
----When update ----
- DATABASE_URL : "?pgbouncer=true&connection_limit=1"
npx prisma db push


/* Enjoy */
--------- Deploy Server to Vercel ------
1. create vercel.json

{
    "version": 2,
    "name": "roitai",
    "builds": [
      {
        "src": "server.js",
        "use": "@vercel/node"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "server.js",
        "headers": {
          "Access-Control-Allow-Origin": "*"
        }
      }
    ]
  }

2. package.json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon server",
    "postinstall": "prisma generate"
  },
  

  git init
  git add . 
  git commit -m "init"
  git push..........

3. add project to vercel
3.1 in build command
npx prisma generate
3.2 add env
/* Enjoy */




--------- Deploy Client to Vercel ------
1. create vercel.json

{
    "routes":[
        {
            "src":"/[^.]+",
            "dest":"/"
        }
    ]
}

2. git init
3. git add .
4. git commit -m "init"

5. add project to vercel 
/* Enjoy */
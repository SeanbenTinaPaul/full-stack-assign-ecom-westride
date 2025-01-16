import axios from "axios";
import React, { useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
// import { toast } from "react-toastify";//ใช้แสดงข้อความแจ้งเตือน (toast message) บนเว็บไซต์
import useEcomStore from "../../store/ecom-store"; 
import { useNavigate } from "react-router-dom"; //ใช้เปลี่ยนหน้า (redirect)

function Login() {
   const navigate = useNavigate();
   const { toast } = useToast();
   const actionLogin = useEcomStore((state) => state.actionLogin); //ยังไม่ใช่การ call function actionLogin() นะ

   const user = useEcomStore((state) => state.user); //ลองดึงข้อมูล user(เดิมที่เก็บไว้) มาจาก hook (ไม่ใส่ก็ได้)
   console.log("user from zustand", user);

   //form สำหรับส่งไป backend ► const { email, password } = req.body
   const [form, setForm] = useState({
      email: "",
      password: ""
   });
   const handleOnchange = (event) => {
      console.log(event);
      console.log(event.target.name, event.target.value);
      setForm({
         ...form,
         [event.target.name]: event.target.value
      });
   };
   const handleSubmit = async (event) => {
      event.preventDefault(); //ป้องกันการ refresh
      //Send to backend
      try {
         const res = await actionLogin(form); //call actionLogin() โดยส่ง form ไป
         console.log("res-->", res);

         //redirect หน้าpage หลัง login ตาม payload.role
         const role = res.data.payload.role;
         console.log("role-->", role);
         roleRedirect(role);

         //toast → มี popup เด้งแจ้งเตือน
         toast({
            title: 'Welcome Back',
            description: res.data.message || "Login Success",
         })
         // toast.success(res.data.message || "Login Success");
      } catch (err) {
         console.log(err);
         const errMsg = err.response?.data?.message;
         toast({
            title: 'Error!',
            description: errMsg || "Login Failed",
         })
         // toast.error(errMsg || "Login Failed");
      }

      /*try {
         const res = await axios.post("http://localhost:5000/api/login", form);
         console.log(res.data);
         toast.success(res.data.message || "Login Success");
      } catch (err) {
         const errMsg = err.response?.data?.message;
         toast.error(errMsg || "Login Failed");
         console.log(err);
      }*/
   };

   //เรียกใช้เพื่อ redirect หน้าpage ตาม payload.role
   const roleRedirect = (role) => {
      if (role === "admin") {
         navigate("/admin");
      } else {
         navigate("/user");
      }
   };
   
   return (
      <div className="flex flex-col items-center">
         Login
         <form
            action=''
            onSubmit={handleSubmit}
         >
            Email
            <input
               type='email'
               name='email'
               onChange={handleOnchange}
               className='border text-gray-950'
            />
            Password
            <input
               type='text'
               name='password'
               onChange={handleOnchange}
               className='border text-gray-950'
            />
            <button className='bg-Primary-btn shadow-md rounded-md px-4 py-1 m-4'>Login</button>
         </form>
      </div>
   );
};

export default Login;

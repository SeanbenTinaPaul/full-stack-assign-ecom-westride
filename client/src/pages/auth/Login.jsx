import axios from "axios";
import React, { useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Store, ShoppingCart, UserPlus, LogIn, Slack } from "lucide-react";
// import { toast } from "react-toastify";//ใช้แสดงข้อความแจ้งเตือน (toast message) บนเว็บไซต์
import useEcomStore from "../../store/ecom-store";
import { useNavigate } from "react-router-dom"; //ใช้เปลี่ยนหน้า (redirect)

function Login() {
   const navigate = useNavigate();
   const { toast } = useToast();
   const actionLogin = useEcomStore((state) => state.actionLogin); //ยังไม่ใช่การ call function actionLogin() นะ

   const user = useEcomStore((state) => state.user); //ลองดึงข้อมูล user(เดิมที่เก็บไว้) มาจาก hook (ไม่ใส่ก็ได้)
   console.log("user->", user);

   //form สำหรับส่งไป backend ► const { email, password } = req.body
   const [form, setForm] = useState({
      email: "",
      password: ""
   });
   const handleOnchange = (event) => {
      // console.log(event);
      // console.log(event.target.name, event.target.value);
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
         // console.log("res-->", res);

         //redirect หน้าpage หลัง login ตาม payload.role
         const role = res.data.payload.role;
         console.log("role-->", role);
         roleRedirect(role);

         //toast → มี popup เด้งแจ้งเตือน
         toast({
            title: "Welcome Back",
            description: res.data.message || "Login Success"
         });
         // toast.success(res.data.message || "Login Success");
      } catch (err) {
         console.log(err);
         const errMsg = err.response?.data?.message;
         toast({
            variant: "destructive",
            title: "Error!",
            description: errMsg || "Login Failed"
         });
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
   /*
   in AppRoutes.jsx: go to..
   ProtectRouteAdmin.jsx → LoadingToRedirect.jsx  <No permis..> 
   → LayoutAdmin.jsx <path: "/admin">
   
   */
   const roleRedirect = (role) => {
      if (role === "admin") {
         navigate("/admin");
      } else if(role==="user"){
         navigate("/user");
         // navigate(-1); //กลับไป previous url
      }else{
         navigate(-1); //กลับไป previous url
      }
   };

   return (
      <div className='flex justify-center items-center min-h-screen bg-[#e5e5e5]'>
         <Card className='w-full max-w-md'>
            <CardHeader className='space-y-6'>
               <CardTitle>Login</CardTitle>
               <CardDescription>
                  {
                     <div className="flex gap-2 items-center">
                        <Slack className="w-8 h-8 drop-shadow-md"/> <span>Enter your email and password to access your account</span>
                     </div>
                  }
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form
                  onSubmit={handleSubmit}
                  className='space-y-4'
               >
                  <div className='space-y-2'>
                     <Label htmlFor='email'>Email</Label>
                     <Input
                        id='email'
                        type='email'
                        name='email'
                        placeholder='Enter your email'
                        onChange={handleOnchange}
                        required
                     />
                  </div>
                  <div className='space-y-2'>
                     <Label htmlFor='password'>Password</Label>
                     <Input
                        id='password'
                        type='password'
                        name='password'
                        placeholder='Enter your password'
                        onChange={handleOnchange}
                        required
                     />
                  </div>
                  <Button
                     type='submit'
                     className='w-full hover:bg-slate-500 transition-all duration-300'
                  >
                     Login
                  </Button>
               </form>
            </CardContent>
         </Card>
      </div>
   );
}

export default Login;

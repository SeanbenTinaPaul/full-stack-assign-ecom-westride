import axios from "axios";
import React, { useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Store, ShoppingCart, UserPlus, LogIn, Slack } from "lucide-react";
const apiUrl = import.meta.env.VITE_API_URL;
import useEcomStore from "../../store/ecom-store";
import { useNavigate } from "react-router-dom"; //ใช้เปลี่ยนหน้า (redirect)

const Register = () => {
   const navigate = useNavigate();
   const { toast } = useToast();
   const [form, setForm] = useState({
      email: "",
      name: "",
      password: "",
      confirmPassword: ""
   });
   const handleOnchange = (event) => {
      console.log(event.target.name, event.target.value);
      setForm({
         ...form,
         [event.target.name]: event.target.value
      });
   };
   const handleSubmit = async (event) => {
      event.preventDefault(); 
      if (form.password !== form.confirmPassword) {
         toast({
            variant: "destructive",
            title: "Error!",
            description: "Passwords do not match"
         });
         return;
      }

      //Send to backend
      try {
         const res = await axios.post(`${apiUrl}/api/register`, form);
         toast({
            title: "Success",
            description: res.data.message || "Register Success"
         });
         navigate("/login", { replace: true });
      } catch (err) {
         const errMsg = err.response?.data?.message;
         toast({
            variant: "destructive",
            title: "Error!",
            description: errMsg || "Register Failed"
         });
      }
   };
   return (
      <div className='flex justify-center items-center min-h-screen bg-[#e5e5e5]'>
         <Card className='w-full max-w-md'>
            <CardHeader className='space-y-6'>
               <CardTitle>Register</CardTitle>
               <CardDescription>
                  {
                     <div className='flex gap-2 items-center'>
                        <Slack className='w-8 h-8 drop-shadow-md' />{" "}
                        <span>Create a new account</span>
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
                     <Label htmlFor='email'>Name</Label>
                     <Input
                        id='name'
                        type='name'
                        name='name'
                        placeholder='Enter your name'
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
                  <div className='space-y-2'>
                     <Label htmlFor='confirmPassword'>Confirm Password</Label>
                     <Input
                        id='confirmPassword'
                        type='password'
                        name='confirmPassword'
                        placeholder='Confirm your password'
                        onChange={handleOnchange}
                        required
                     />
                  </div>
                  <Button
                     type='submit'
                     className='w-full hover:bg-slate-500 transition-all duration-300'
                  >
                     Register
                  </Button>
               </form>
            </CardContent>
         </Card>
      </div>
   );
};

export default Register;

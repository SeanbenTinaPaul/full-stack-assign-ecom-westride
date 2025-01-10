import axios from "axios";
import React, { useState } from "react";
import  { toast } from 'react-toastify'

const Register = () => {
   const [form, setForm] = useState({
      email: "",
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
      event.preventDefault(); //ป้องกันการ refresh
      if (form.password !== form.confirmPassword) return alert("Password not match");
      console.log(form);

      //Send to backend
      try {
        const res = await axios.post('http://localhost:5000/api/register', form) 
        console.log(res)
        toast.success(res.data.message || 'Register Success')
      } catch (err) {
        const errMsg = err.response?.data?.message 
        toast.error(errMsg || 'Register Fail')
        console.log(err);
      }
   };
   return (
      <div className="text-Text-white">
         Register
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
            Confirm password
            <input
               type='text'
               name='confirmPassword'
               onChange={handleOnchange}
               className='border text-gray-950'
            />
            <button className='bg-Primary-btn shadow-md rounded-md px-4 py-1 m-4'>Register</button>
         </form>
      </div>
   );
};

export default Register;

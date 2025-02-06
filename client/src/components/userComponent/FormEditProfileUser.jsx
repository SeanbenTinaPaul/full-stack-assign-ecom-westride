import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import useEcomStore from "@/store/ecom-store";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { HardDriveUpload } from "lucide-react";
import UploadPersonPic from "./UploadPersonPic";
import { use } from "react";
import { updateProfileUser } from "@/api/userAuth";
const inputUserinfo = {
   image: {},
   public_id: "",
   name: "",
   email: "",
   password: ""
};
function FormEditProfileUser(props) {
   const { user, token } = useEcomStore((state) => state);
   const navigate = useNavigate();
   const { toast } = useToast();
   const [loading, setLoading] = useState(false);
   const [inputForm, setInputForm] = useState(inputUserinfo);
   const [cancelImg, setCancelImg] = useState(false);
   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
   const [formEvent, setFormEvent] = useState(null); // Store the form event
   

   //useEffect fecth data from DB
   useEffect(() => {
      if (user) {
         setInputForm((prev) => ({
            ...prev,
            image: user.picture,
            public_id: user.public_id,
            name: user.name,
            email: user.email,
            password: user.password
         }));
      }
   }, [user]);

   const handleOnchange = (e) => {
        console.log(e.target.name, e.target.value);
      setInputForm({
         ...inputForm,
         [e.target.name]: e.target.value
      });
   };
   //handle form submission attempt
   const handleFormSubmit = (e) => {
      e.preventDefault();
      setFormEvent(e); // Store the event
      setShowConfirmDialog(true); // display confirm dialog
   };
   //handle actual submission after confirm
   const handleConfirmedSubmit = async () => {
      setLoading(true);
      console.log("Submitting form with data:", inputForm);
      try {
         const res = await updateProfileUser(token, inputForm);
         console.log("Profile updated res->", res);
         setShowConfirmDialog(false);
         if (res.data.success) {
            toast({
               title: "Success!",
               description: "Profile updated successfully"
            });
             navigate("/login");
         }else {
            toast({
               title: "Failed to update profile",
               description: res.data.message
            });
         }
      } catch (err) {
         console.error(err);
         toast({
            variant: "destructive",
            title: "Failed to update profile",
            description: "Failed to update profile"
         });
      } finally {
         setLoading(false);
      }
   };
   //if click 'Cancel' → Del all new added images in Cloudinary
   const handleCancel = () => {
      setCancelImg(true); // Trigger cleanup in UploadFile component
      navigate(-1);
   };
   return (
      <div>
         <div className='max-w-3xl flex mt-6 mb-4 ml-6 p-3 items-center rounded-xl gap-2 bg-card shadow-md'>
            <h1 className='text-xl font-medium text-slate-700'>Edit Profile</h1>
         </div>
         <form
            onSubmit={(e) => handleFormSubmit(e)}
            className='ml-6 space-y-6 max-w-3xl'
         >
            <Card className='shadow-lg'>
               <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                     {/* <Package className='w-5 h-5' /> */}
                     Basic Information
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className='space-y-2'>
                     <label className='flex items-center gap-2 text-sm font-medium'>
                        {/* <Image className='w-4 h-4' /> */}
                        User picture
                     </label>
                     <UploadPersonPic
                        inputForm={inputForm}
                        setInputForm={setInputForm}
                        cancelImg={cancelImg}
                        setCancelImg={setCancelImg}
                     />
                  </div>
               </CardContent>
               <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                     <label className='flex item-center gap-2 text-sm font-medium'>
                        {/* <Package2 className='w-4 h-4' /> */}
                        New user name
                     </label>
                     <input
                        type='text'
                        name='name'
                        value={inputForm.name}
                        onChange={handleOnchange}
                        className='w-full shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent p-2 rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'
                        required
                     />
                  </div>
                  <div className='space-y-2'>
                     <label className='flex item-center gap-2 text-sm font-medium'>
                        {/* <Package2 className='w-4 h-4' /> */}
                        New user email
                     </label>
                     <input
                        type='text'
                        name='email'
                        value={inputForm.email}
                        onChange={handleOnchange}
                        className='w-full shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent p-2 rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'
                        required
                     />
                  </div>
                  <div className='space-y-2'>
                     <label className='flex item-center gap-2 text-sm font-medium'>
                        {/* <Package2 className='w-4 h-4' /> */}
                        Verify password
                     </label>
                     <input
                        type='password'
                        name='password'
                        value={inputForm.password}
                        onChange={handleOnchange}
                        className='w-full shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent p-2 rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'
                        required
                     />
                  </div>
               </CardContent>
            </Card>
            <div className='flex items-center gap-2'>
               <Button
                  type='submit'
                  className=' rounded-xl hover:bg-slate-500 transition-all duration-300'
                  disabled={loading && inputForm.password.trim() === ""}
               >
                  {loading ? (
                     <div className='flex items-center gap-2'>
                        <HardDriveUpload className='w-4 animate-bounceScale' />
                        <span>Updating...</span>
                     </div>
                  ) : (
                     "Update Profile"
                  )}
               </Button>

               <Button
                  type='button'
                  variant='outline'
                  onClick={handleCancel}
                  className='rounded-xl'
               >
                  Cancel
               </Button>
            </div>
         </form>
         <AlertDialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
         >
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure to update your profile?</AlertDialogTitle>
                  <AlertDialogDescription>
                     This action will bring you back to the Login session again.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => handleConfirmedSubmit()}>
                     Confirm udpating
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={() => setShowConfirmDialog(false)}>
                     Cancel updating
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </div>
   );
}

FormEditProfileUser.propTypes = {};

export default FormEditProfileUser;

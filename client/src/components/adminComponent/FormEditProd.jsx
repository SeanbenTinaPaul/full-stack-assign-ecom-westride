//parent→ EditProdAdmin.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; //to get id from url | to redirect

//Global state
import useEcomStore from "../../store/ecom-store";
//API
import { createProduct, readProduct, updateProduct, delProduct } from "../../api/ProductAuth";
//icons
import {
   Package,
   Package2,
   FileText,
   DollarSign,
   Image,
   FolderOpen,
   HardDriveUpload,
   AlertCircle
} from "lucide-react";
//Component
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import UploadFile from "./UploadFile";

//everytime redirect to this page, inputProd will be reset to empty
const inputProd = {
   title: "",
   description: "",
   price: "",
   quantity: "",
   categoryId: "",
   images: [] //save url of images from Cloudinary→ [{url:..},{url:..}]
};

function FormEditProd() {
   const { id } = useParams(); //get '26' from 'http://localhost:5173/admin/product/26'
   const navigate = useNavigate();
   const { token, getCategory, categories } = useEcomStore((state) => state);
   const [inputForm, setInputForm] = useState(inputProd);
   const [loading, setLoading] = useState(false);
   //  console.log('inputForm bf edit->', inputForm);
   /// ShadCN toast section ////
   const { toast } = useToast();
   const [alert, setAlert] = useState(null);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);

   const [cancelImg, setCancelImg] = useState(false);

   //to display default value in input box → fetch from DB (Not cloud)
   useEffect(() => {
      const fetchProduct = async () => {
         try {
            const res = await readProduct(id);
            console.log("res edit prod->", res.data);
            // res.data = { data: res.data.data };//remove 'success: true' key from {}
            setInputForm(res.data.data); //ทำให้เติม value ในช่อง form by default เมื่อเข้ามาในหน้านี้
         } catch (err) {
            console.log(err);
            toast({
               variant: "destructive",
               title: "Error",
               description: "Failed to load product details"
            });
         }
      };
      getCategory(); //for dropdown select Category
      fetchProduct();
   }, [getCategory, id]);
   console.log("inputForm edit prod->", inputForm);

   //listen to keyboard event on input box(not on button) and update inputForm
   const handleOnchange = (e) => {
      console.log(e.target.name, e.target.value);
      setInputForm({
         ...inputForm,
         [e.target.name]: e.target.value
      });
   };

   const handleCategoryChange = (value) => {
      setInputForm({
         ...inputForm,
         categoryId: value
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("inputForm->", inputForm);

      //if user did not select category and click 'update Product' ► won't let to submit, using return to stop
      // for (let key in inputForm) {
      //    if (!inputForm[key] || inputForm[key] === "") {
      //       if (
      //          key === "description" ||
      //          key === "sold" ||
      //          key === "images" ||
      //          key === "avgRating" ||
      //          key === "promotion"
      //       )
      //          continue; //empty description can be allowed
      //       if (key === "categoryId") {
      //          setAlert(
      //             <Alert variant='destructive'>
      //                <AlertCircle className='h-4 w-4' />
      //                <AlertTitle>Warning!</AlertTitle>
      //                <AlertDescription>Please select category.</AlertDescription>
      //             </Alert>
      //          );
      //          setTimeout(() => setAlert(null), 3000);
      //          return;
      //       } else {
      //          setAlert(
      //             <Alert variant='destructive'>
      //                <AlertCircle className='h-4 w-4' />
      //                <AlertTitle>Warning!</AlertTitle>
      //                <AlertDescription>Please enter all fields.</AlertDescription>
      //             </Alert>
      //          );
      //          setTimeout(() => setAlert(null), 3000);
      //          return;
      //       }
      //    }
      // }

      try {
         setLoading(true);
         const res = await updateProduct(token, id, inputForm);
         toast({
            title: "Update Success!",
            description: `Product: ${res.data.data.title}`
         });
         // toast.success(`Update Product: ${res.data.data.title} Success.`);
         setTimeout(() => {
            navigate("/admin/product"); //after click 'update Product' → sredirect to '/admin/product'
         }, 200);
         // setTimeout(() => {
         //    window.location.reload();
         // }, 1000); //"/admin/product" page will be reloaded after 1 sec
         setLoading(false);
      } catch (err) {
         console.log(err);
         toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update product"
         });
         setLoading(false);
      } finally {
         setLoading(false);
      }
   };

   const handleDelProduct = async () => {
      try {
         const res = await delProduct(token, id);
         toast({
            title: "Product Deleted Successfully",
            description: `Product: ${res.data.data.title}`
         });
         setTimeout(() => {
            navigate("/admin/product"); //after click 'update Product' → sredirect to '/admin/product'
         }, 200);
      } catch (err) {
         console.log(err);
         toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete product"
         });
      }
   };

   //if click 'Cancel' → Del all new added images in Cloudinary
   const handleCancel = () => {
      setCancelImg(true); // trigger cleanup in UploadFile component
      navigate("/admin/product");
   };

   return (
      <div>
         <form
            onSubmit={handleSubmit}
            className='p-6 space-y-6 max-w-3xl'
         >
            <div className='max-w-3xl flex mt-6 mb-4 p-3 items-center rounded-xl gap-2 bg-card shadow-md'>
               <h1 className='text-xl font-medium text-slate-700'>Edit Product Details</h1>
            </div>
            <Card className='shadow-lg'>
               <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                     <Package className='w-5 h-5' />
                     Basic Information
                  </CardTitle>
               </CardHeader>
               <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                     <label className='flex item-center gap-2 text-sm font-medium'>
                        <Package2 className='w-4 h-4' />
                        Product Title
                     </label>
                     <input
                        type='text'
                        name='title'
                        value={inputForm.title}
                        onChange={handleOnchange}
                        className='w-full shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent p-2 rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'
                        required
                     />
                  </div>
                  <div className='space-y-2'>
                     <label className='flex items-center gap-2 text-sm font-medium'>
                        <FileText className='w-4 h-4' />
                        Description
                     </label>
                     <textarea
                        name='description'
                        value={inputForm.description}
                        onChange={handleOnchange}
                        className='w-full shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent p-2 rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'
                     />
                  </div>
               </CardContent>
            </Card>
            <Card className='shadow-lg'>
               <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                     <FolderOpen className='w-5 h-5' />
                     Product Details
                  </CardTitle>
               </CardHeader>
               <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                     <div className='space-y-2'>
                        <label className='flex items-center gap-2 text-sm font-medium'>
                           <DollarSign className='w-4 h-4' />
                           Price (฿)
                        </label>
                        <input
                           type='number'
                           step='0.01'
                           name='price'
                           value={inputForm.price}
                           onChange={handleOnchange}
                           className='w-full shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent p-2 rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'
                           required
                        />
                     </div>

                     <div className='space-y-2'>
                        <label className='flex items-center gap-2 text-sm font-medium'>
                           <Package2 className='w-4 h-4' />
                           Quantity
                        </label>
                        <input
                           type='number'
                           name='quantity'
                           value={inputForm.quantity}
                           onChange={handleOnchange}
                           className='w-full shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.1)] border-transparent p-2 rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-transparent hover:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.15)]'
                           required
                        />
                     </div>
                  </div>

                  <div className='space-y-2'>
                     <label className='flex items-center gap-2 text-sm font-medium'>
                        <FolderOpen className='w-4 h-4' />
                        Category
                     </label>
                     {alert}
                     <Select
                        value={inputForm.categoryId.toString()}
                        onValueChange={handleCategoryChange}
                     >
                        <SelectTrigger className='w-full rounded-xl'>
                           <SelectValue placeholder='Select category'>
                              {
                                 categories.find(
                                    (cat) => cat.id.toString() === inputForm.categoryId.toString()
                                 )?.name
                              }
                           </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                           {categories.map((item) => (
                              <SelectItem
                                 key={item.id}
                                 value={item.id.toString()}
                              >
                                 {item.name}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>

                  <div className='space-y-2'>
                     <label className='flex items-center gap-2 text-sm font-medium'>
                        <Image className='w-4 h-4' />
                        Product Image
                     </label>
                     <UploadFile
                        inputForm={inputForm}
                        setInputForm={setInputForm}
                        cancelImg={cancelImg}
                        setCancelImg={setCancelImg}
                     />
                  </div>
               </CardContent>
            </Card>

            <div className='flex gap-4'>
               <Button
                  type='submit'
                  className='bg-fuchsia-800 rounded-xl hover:bg-fuchsia-700 transition-all duration-300'
                  disabled={loading}
               >
                  {loading ? (
                     <div className='flex items-center gap-2'>
                        <HardDriveUpload className='w-4 animate-bounceScale' />
                        <span>Updating...</span>
                     </div>
                  ) : (
                     "Update Product"
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

               <Button
                  type='button'
                  variant='destructive'
                  onClick={() => setShowDeleteDialog(true)}
                  className='rounded-xl'
               >
                  Delete Product
               </Button>
            </div>
         </form>

         <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
         >
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                     This action cannot be undone. This will permanently delete the product and
                     remove its data from our servers.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
                     Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelProduct}>Yes, delete</AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </div>
   );
}
//UploadFile is called first, then FormProduct
export default FormEditProd;

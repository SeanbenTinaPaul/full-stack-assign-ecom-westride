//parent→ EditProdAdmin.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; //to get id from url | to redirect

//Global state
import useEcomStore from "../../store/ecom-store";
//API
import { readProduct, updateProduct, delProduct } from "../../api/ProductAuth";
//icons
import {
   Package,
   Package2,
   FileText,
   DollarSign,
   Image,
   FolderOpen,
   HardDriveUpload,
   BadgeCheck,
   Slack
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
import { Badge } from "../ui/badge";

//everytime redirect to this page, inputProd will be reset to empty
const inputProd = {
   title: "",
   description: "",
   price: "",
   quantity: "",
   categoryId: "",
   brandId: "",
   images: [] //save url of images from Cloudinary→ [{url:..},{url:..}]
};

function FormEditProd() {
   const { id } = useParams(); //get '26' from 'http://localhost:5173/admin/product/26'
   const navigate = useNavigate();
   const { token, getCategory, categories, brands, getBrand } = useEcomStore((state) => state);
   const [inputForm, setInputForm] = useState(inputProd);
   const [loading, setLoading] = useState(false);
   //  console.log('inputForm bf edit->', inputForm);
   /// ShadCN toast section ////
   const { toast } = useToast();
   const [alert, setAlert] = useState(null);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);

   const [cancelImg, setCancelImg] = useState(false);
   const [isSubmitImg, setIsSubmitImg] = useState(false);

   //to display default value in input box → fetch from DB (Not cloud)
   useEffect(() => {
      const fetchProduct = async () => {
         try {
            const res = await readProduct(id);
            // console.log("res edit prod->", res.data);
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
      getBrand(); //for dropdown select Brand
      fetchProduct();
   }, [getCategory, id, getBrand]);
   // console.log("inputForm edit prod->", inputForm);

   //listen to keyboard event on input box(not on button) and update inputForm
   const handleOnchange = (e) => {
      // console.log(e.target.name, e.target.value);
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
   const handleBrandChange = (value) => {
      setInputForm({
         ...inputForm,
         brandId: value
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      // console.log("inputForm->", inputForm);
      try {
         setLoading(true);
         const res = await updateProduct(token, id, inputForm);
         if (res.data.success === true) {
            toast({
               title: "Update Success!",
               description: `Product: ${res.data.data.title}`
            });
            setInputForm(prev=>({
               ...prev,
               images: []
            }))
            setTimeout(() => {
               navigate("/admin/product"); //after click 'update Product' → sredirect to '/admin/product'
            }, 200);
            // setTimeout(() => {
            //    window.location.reload();
            // }, 1000); //"/admin/product" page will be reloaded after 1 sec
            setLoading(false);
            setIsSubmitImg(true);
         }
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
         // setInputForm(prev=>({
         //    ...prev,
         //    images: []
         // }))
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
                        className='w-full p-2 rounded-xl Input-3Dshadow'
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
                        className='w-full p-2 rounded-xl Input-3Dshadow overflow-auto'
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
                           className='w-full p-2 rounded-xl Input-3Dshadow'
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
                           className='w-full p-2 rounded-xl Input-3Dshadow'
                           required
                        />
                     </div>
                  </div>

                  <div className='space-y-2'>
                     <label className='flex items-center gap-2 text-sm font-medium'>
                        <BadgeCheck className='w-4 h-4' />
                        Brand
                     </label>
                     {alert}
                     {/* แก้ปัญหาเลือก selectValue แล้วไม่แสดงชื่อ category ในช่อง
                        1. ส่ง props ที่เป็น string ไปยัง Select()  
                        2.เพิ่ม categories.find()
                        */}
                     <Select
                        value={inputForm.brandId.toString()}
                        onValueChange={handleBrandChange}
                     >
                        <SelectTrigger className='w-full rounded-xl'>
                           <SelectValue placeholder='Select brand'>
                              {brands.find((b) => b.id == inputForm.brandId.toString())?.name}
                           </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                           {brands.map((item) => (
                              <SelectItem
                                 key={item.id}
                                 value={item.id.toString()}
                              >
                                 <div className='flex items-center gap-2'>
                                    <Badge
                                       className='py-0 px-0 w-8 h-5 bg-card flex items-center drop-shadow'
                                       title={item.title}
                                    >
                                       {item.img_url ? (
                                          <img
                                             src={item.img_url}
                                             alt=''
                                             className='w-full h-full rounded-md mx-auto object-center object-contain'
                                          />
                                       ) : (
                                          <Slack className='w-4 h-4 mx-auto fill-current text-slate-500 font-thin' />
                                       )}
                                    </Badge>
                                    {item.title} {item.description ? `(${item.description})` : ""}
                                 </div>
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
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
                        isSubmitImg={isSubmitImg}
                        setIsSubmitImg={setIsSubmitImg}
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
                     <div>
                        This action <strong>cannot be undone</strong>. This will{" "}
                        <strong>permanently</strong> delete the product and remove its{" "}
                        <strong>related data</strong> from our servers.
                     </div>
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel onClick={handleDelProduct}>Yes, delete</AlertDialogCancel>
                  <AlertDialogAction onClick={() => setShowDeleteDialog(false)}>
                     Cancel
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </div>
   );
}
//UploadFile is called first, then FormProduct
export default FormEditProd;

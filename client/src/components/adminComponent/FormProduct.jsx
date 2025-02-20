//parent → ProductAdmin.jsx
import React, { useState, useEffect, useRef } from "react";
// import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//(optional) provides the default styles for the toast notifications
//Global state
import useEcomStore from "../../store/ecom-store";
//API
import { createProduct, delProduct } from "../../api/ProductAuth";
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
   AlertDialogTitle,
   AlertDialogTrigger
} from "@/components/ui/alert-dialog";
//Component
import TableListProducts from "./TableListProducts";
import UploadFile from "./UploadFile";

const inputProd = {
   title: "",
   description: "",
   price: "",
   quantity: "",
   categoryId: "",
   images: [] //save url of images from Cloudinary
};

function FormProduct() {
   // const token = useEcomStore((state)=> state.token)
   // const getCategory = useEcomStore((state)=> state.getCategory)
   // const categories = useEcomStore((state)=> state.categories)
   const { token, getCategory, categories, getProduct, products } = useEcomStore((state) => state);
   const [inputForm, setInputForm] = useState(inputProd);
   const [loading, setLoading] = useState(false); //for Btn loading animation
   const [isRerender, setIsRerender] = useState(false); //for TableListProducts.jsx re-render
   const fileInputRef = useRef(null);
   //// ShadCN toast section ////
   const { toast } = useToast();
   const [alert, setAlert] = useState(null); //for alert Warning!
   const [showDialog, setShowDialog] = useState(false); //for alert Confirm
   const [productToRemove, setProductToRemove] = useState(null);
   // console.log('categories->',categories)
   // console.log('products->',products);

   //separate to avoid calling unnessary fn in useEffect()
   /*
   useEffect(() => {
      async function getCategoryData() {
         const result = await getCategory(token);
         console.log('category->', result);
      }
      getCategoryData();
   }, [token, getCategory]);
   */
   useEffect(() => {
      getCategory().then((result) => {
         console.log("category->", result);
      });
   }, [getCategory]);

   useEffect(() => {
      getProduct(1000, 0);
   }, [getProduct]);

   //when filling each key in input box
   const handleOnchange = (e) => {
      console.log(e.target.name, e.target.value);
      setInputForm({
         ...inputForm,
         [e.target.name]: e.target.value
      });
   };
   //when select category from dropdown
   const handleCategoryChange = (value) => {
      setInputForm({
         ...inputForm,
         categoryId: value
      });
   };

   //when click 'Add Product' → record in DB
   const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("inputForm->", inputForm);
      /* 
        const titleInput = inputForm.title;
        const priceInput = inputForm.price;
        const quantityInput = inputForm.quantity;
        const catIdSelect = inputForm.categoryId;
        if (!catIdSelect || catIdSelect === "") return toast.warning("Please select category.");
        if (!titleInput || !priceInput || !quantityInput)
           return toast.warning("Please enter all fields.");
      */
      //if user did not select category and click 'Add Product' ► won't let to submit, using return to stop
      for (let key in inputForm) {
         if (!inputForm[key] || inputForm[key] === "") {
            if (key === "description") continue; //empty description can be allowed
            if (key === "categoryId") {
               setAlert(
                  <Alert variant='destructive'>
                     <AlertCircle className='h-4 w-4' />
                     <AlertTitle>Warning!</AlertTitle>
                     <AlertDescription>Please select category.</AlertDescription>
                  </Alert>
               );
               //hide this alert after 3 seconds
               setTimeout(() => {
                  setAlert(null);
               }, 3000);
               return;
               // toast.dismiss(); //***** */
               // return toast.warning("Please select category.");
            } else {
               setAlert(
                  <Alert variant='destructive'>
                     <AlertCircle className='h-4 w-4' />
                     <AlertTitle>Warning!</AlertTitle>
                     <AlertDescription>Please enter all fields.</AlertDescription>
                  </Alert>
               );
               //hide this alert after 3 seconds
               setTimeout(() => {
                  setAlert(null);
               }, 3000);
               return;
               // toast.dismiss(); /***** */
               // return toast.warning("Please enter all fields.");
            }
         }
      }
      try {
         setLoading(true);
         const res = await createProduct(token, inputForm);
         console.log("res FormProduct->", res);
         //****** */
         //not (res.data.data.title) bc backend use res.send()
         toast({
            title: "Add Product Success!",
            description: `Product: ${res.data.title}`
         });
         // toast.success(`Add Product: ${res.data.title} Success.`);
         //refresh the list after click 'Add Product'
         getProduct(1000,0);
         setInputForm({
            title: "",
            description: "",
            price: "",
            quantity: "",
            categoryId: "",
            images: []
         });

         setLoading(false);
         setIsRerender(!isRerender); //rerender TableListProducts if click 'Add Product'
      } catch (err) {
         console.log(err);
      }
   };

   //click in TableListProducts.jsx to delete a product + Toastify confirm box
   const handleDel = async (id) => {
      const productToDel = products.find((obj) => obj.id === id);
      setProductToRemove(productToDel);
      setShowDialog(true);
      
   };
   //if user click 'Yes' in Toastify confirm box
   const confirmDelete = async () => {
      try {
         const res = await delProduct(token, productToRemove.id);
         console.log("res del product->", res);
         /***** */
         toast({
            title: "Product Deleted Successfully",
            description: `Product: ${res.data.data.title}`
         });
         getProduct(1000,0);
         setShowDialog(false);
         setProductToRemove(null);
         // toast.success(`Delete Product: ${res.data.data.title} Success.`);
         //rerender TableListProducts if click 'Delete Product' ► click <Trash2/> in TableListProducts.jsx
         setIsRerender(!isRerender);
         /****** */
         // closeToast();
      } catch (err) {
         console.log(err);
         toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete product"
         });
      }
   };

   return (
      <div>
         <div>
            <form
               onSubmit={handleSubmit}
               className=' space-y-6 max-w-3xl'
            >
               <Card className='shadow-md max-w-3xl'>
                  <CardHeader>
                     <CardTitle className='flex items-center gap-2'>
                        <Package className='w-5 h-5' />
                        Basic Information
                     </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                     <div className='space-y-2'>
                        <label className='flex items-center gap-2 text-sm font-medium'>
                           <Package2 className='w-4 h-4' />
                           Product Title
                        </label>
                        <input
                           type='text'
                           name='title'
                           value={inputForm.title}
                           placeholder='e.g. จานเมลามีน, HP Laptop'
                           onChange={handleOnchange}
                           className='w-full p-2 rounded-xl Input-3Dshadow'
                           // className='w-full shadow-[0_0_10px_0_rgba(0,0,0,0.1)] border-transparent p-2 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-transparent'
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
                           placeholder='e.g. มีสีฟ้าหวาน, อุปกรณ์'
                           onChange={handleOnchange}
                           className='w-full p-2 rounded-xl Input-3Dshadow overflow-auto'
                        />
                     </div>
                  </CardContent>
               </Card>

               <Card className='shadow-md max-w-3xl'>
                  <CardHeader>
                     <CardTitle className='flex items-center gap-2'>
                        <FolderOpen className='w-5 h-5' />
                        Product details
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
                              placeholder='e.g. 5000, 99.50'
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
                              placeholder='e.g. 150'
                              onChange={handleOnchange}
                              className='w-full p-2 rounded-xl Input-3Dshadow'
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
                        {/* แก้ปัญหาเลือก selectValue แล้วไม่แสดงชื่อ category ในช่อง
                        1. ส่ง props ที่เป็น string ไปยัง Select()  
                        2.เพิ่ม categories.find()
                        */}
                        <Select
                           value={inputForm.categoryId.toString()}
                           onValueChange={handleCategoryChange}
                        >
                           <SelectTrigger className='w-full rounded-xl'>
                              <SelectValue placeholder='Select category'>
                                 {
                                    categories.find(
                                       (cat) =>
                                          cat.id.toString() === inputForm.categoryId.toString()
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
                        />
                     </div>
                  </CardContent>
               </Card>

               <Button
                  type='submit'
                  className='w-52 mt-4 py-2 shadow-md rounded-xl Btn-gradientFuchsia'
                  disabled={loading}
               >
                  {loading ? (
                     <div className='flex items-center gap-2'>
                        <HardDriveUpload className='w-4 animate-bounceScale' />
                        <span>Adding...</span>
                     </div>
                  ) : (
                     "Add Product"
                  )}
               </Button>
            </form>
            <AlertDialog
               open={showDialog}
               onOpenChange={setShowDialog}
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
                     <AlertDialogCancel onClick={() => setShowDialog(false)}>
                        Cancel
                     </AlertDialogCancel>
                     <AlertDialogAction onClick={confirmDelete}>
                        Yes, delete
                     </AlertDialogAction>
                  </AlertDialogFooter>
               </AlertDialogContent>
            </AlertDialog>
            {/* Table */}
            <div className='mt-4 pt-6 max-w-full max-h-[80vh] mx-auto overflow-hidden overflow-y-auto overflow-x-auto'>
               <TableListProducts
                  products={products}
                  handleDel={handleDel}
                  isRerender={isRerender}
               />
            </div>
         </div>
      </div>
   );
}
//UploadFile is called first, then FormProduct
export default FormProduct;

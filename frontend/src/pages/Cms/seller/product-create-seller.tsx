import { CancelButton, ImageUpload, InputLabel, SelectComponent, StatusSelectComponent, SubmitButton, TextAreaInputComponent, TextInputComponent } from "../../../components/common/form/input-component.";
import { Heading2, Heading3 } from "../../../components/common/title"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import authSvc from "../../auth/auth.service";
import { toast } from "react-toastify";
import { SearchParams } from "../../../config/constants";
import ProductSvc from "../product/product-service";

const SellerCreateProduct = () => {

    const schema = yup.object({
        title: yup.string().required(),
        image: yup
          .mixed()
          .required(),
          description: yup.string().required(),
          price: yup.number().required(),
          category: yup.object({
            label: yup.string().required(),
            value: yup
              .string()
              .required()
          }).required(),
          brand: yup.object({
            label: yup.string().required(),
            value: yup
              .string()
              .required()
             
          }).required(),
          quantity: yup.number().required(),
          features:yup.string(),
    //       status: yup.object({ label: yup.string().matches(/^(Publish|Unpublish)$/).required(),
    //         value: yup.string().matches(/^(active|inactive)$/).required() }).required(),
      });
      const navigate = useNavigate();
      const [loading, setLoading] = useState(false);
      const [category, setCategory] = useState<any[]>([]);
      const [brands, setBrands] = useState<any[]>([]);
    //   const [pagination, setPagination] = useState({
    //     currentPage : 1,
    //     totalPage: 1,
    //     limit: 10
    // })
    const getBrand = async () => {
      try{
        // setLoading(true)
        const response: any = await authSvc.getRequest("/brand/getall" )
        console.log(response)
        setBrands(response.result);
        console.log(brands)       
      }catch(exception){
        toast.error("Error while fetching brand list")
        console.log(exception)
      }     
    }
      const getCategory = async () => {
        try{
          // setLoading(true)
          const response: any = await authSvc.getRequest("/category/getall" )
          console.log(response)
          setCategory(response.result);
          console.log(category)
          
        }catch(exception){
          toast.error("Error while fetching category list")
          console.log(exception)
        }
        
      }
      useEffect(()=>{
        getCategory(),
        getBrand()
      },[])
    const {
        control,
        handleSubmit,
        setError,
        setValue,                                                                                                                                                                            
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema),
      });

      const onSubmit = async (data:any) => {
        try{
            setLoading(true);
            const submitData = {
                ...data,
                category: data.category.value,
                brand: data.brand.value,
                features: data.features.split(',').map((tag: string) => tag.trim())

            }
            console.log(submitData)
            await authSvc.postRequest('/product/createProduct',submitData,{auth:true,file:true});
    
              toast.success("Product Created successfully. ")
              navigate('/admin/Product')
          } catch(exception : any){
            if(+exception.status === 400){
              Object.keys(exception.data.result).map((field:any) =>{
               setError(field, {message: exception.data.result[field]})
              })
            }
            toast.error(exception.data.message)
          }finally{
            setLoading(false)
          }
    
      };
    return (
        <>
        <div className="overflow-x-auto mt-5 mb-5">
          <Heading3><>Create Product</></Heading3>
          <hr/>
          </div>
<div className="overflow-x-auto">
    <div className="py-3 px-5 lg:py-4">
<form onSubmit={handleSubmit(onSubmit)}>
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
    <div className="sm:col-span-2">
    <InputLabel htmlFor="name">Product Name</InputLabel>
  
    <TextInputComponent
            name= "title"
            errMsg={errors.title?.message as string}
            defaultValue=""
            control = {control}
            />
            </div>
            <div className="sm:col-span-2">
            <InputLabel htmlFor="description">Description</InputLabel>
            <TextAreaInputComponent
                control={control}
                name="description"
                errMsg={errors?.description?.message as string}
                />
            </div>
            <div className="">
            <InputLabel htmlFor="category">Category</InputLabel>
  
            <SelectComponent
          name="category"
          control={control}
          options={category.map((item) => ({ label: item.title, value: item._id }))}
          errMsg={errors.category?.message as string}
        />
          </div>
            <div className="">
            <InputLabel htmlFor="brand">Brand</InputLabel>

  
            <SelectComponent
          name="brand"
          control={control}
          options={brands.map((item) => ({ label: item.title, value: item._id }))}
          errMsg={errors.brand?.message as string}
        />
        </div>
            <div className="">
            <InputLabel htmlFor="name">Features</InputLabel>
  
            <TextInputComponent
          name= "features"
          errMsg={errors.features?.message as string}
          defaultValue=""
          control = {control}
          />
          </div>
         
            <div className="">
            <InputLabel htmlFor="name">Price</InputLabel>
  
            <TextInputComponent
          name= "price"
          errMsg={errors.price?.message as string}
          defaultValue=""
          control = {control}
          />
          </div>
            

          <div className="">
            <InputLabel htmlFor="quantity">Quantity</InputLabel>
  
          <TextInputComponent
          name= "quantity"
          errMsg={errors.quantity?.message as string}
          defaultValue=""
          control = {control}
          />
          </div>
            <div className="sm:col-span-2">

            <InputLabel htmlFor="Image">Image</InputLabel>
            
                <input
                    type="file"
                    name="image"
                    onChange={(e:any) => {
                      const image = e.target.files['0'];
                      // console.log("Selected file:", image);
                      setValue("image", image); 
                    }}
                     />
            </div>
            <div className="sm:col-span-2">
                {/* <CancelButton loading={loading}>Cancel</CancelButton> */}
            <SubmitButton
            loading={loading}
            >Create</SubmitButton>
            </div>
    </div>  
        
        </form>
        </div>
</div>  
              {/* <div className="w-full">
                  <label htmlFor="Product" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product</label>
                  <input type="text" name="Product" id="Product" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500" placeholder="Product Product" required />
              </div>
              <div className="w-full">
                  <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                  <input type="number" name="price" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500" placeholder="$2999" required />
              </div>
              <div>
                  <label htmlFor="Product" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product</label>
                  <select id="Product" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500">
                      <option value="">Select Product</option>
                      <option value="TV">TV/Monitors</option>
                      <option value="PC">PC</option>
                      <option value="GA">Gaming/Console</option>
                      <option value="PH">Phones</option>
                  </select>
              </div>
              <div>
                  <label htmlFor="item-weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Item Weight (kg)</label>
                  <input type="number" name="item-weight" id="item-weight" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500" placeholder="12" required/>
              </div> 
              <div className="sm:col-span-2">
                  <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                  <textarea id="description" rows={8} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500" placeholder="Your description here"></textarea>
              </div> */}
              
        </>
    )
}

export default SellerCreateProduct;
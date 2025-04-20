import { CancelButton, ImageUpload, InputLabel, StatusSelectComponent, SubmitButton, TextInputComponent } from "../../../components/common/form/input-component.";
import { Heading2, Heading3 } from "../../../components/common/title"
import { get, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import authSvc from "../../auth/auth.service";
import { toast } from "react-toastify";
import ProductSvc from "./product-service";


const EditProduct = () => {

    const schema = yup.object({
        title: yup.string().required(),
        image: yup
          .mixed()
          .required(),
    //       status: yup.object({ label: yup.string().matches(/^(Publish|Unpublish)$/).required(),
    //         value: yup.string().matches(/^(active|inactive)$/).required() }).required(),
      });
      const navigate = useNavigate();
      const [loading, setLoading] = useState(false);
      const [detail, setDetail] = useState<any>();
      const params = useParams();
      const getDetail = async () => {
        try{
            const detail:any = await ProductSvc.getRequest(`/Product/${params.id}`, {auth:true});
            const data = {
              title:detail.result.title,
              image:detail.result.image,
            }
            setDetail(detail.result);
           
        }catch(exception){
          toast.error("Error while fetching Product list")
          navigate('/admin/Product')
          console.log(exception)
        }
      }
      useEffect(() => {
        getDetail();
      }, []);
      
      useEffect(() => {
        if (detail) {
          setValue("title", detail.title);
          setValue("image", detail.image);
        }
      }, [detail]);
      
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
                // status:data.status.value
            }
            console.log(submitData)
            await authSvc.patchRequest(`/Product/${params.id}`,data,{auth:true,file:true});
    
              toast.success("Product Editd successfully. ")
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
          <Heading3><>Edit Product</></Heading3>
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
            {/* <InputLabel htmlFor="Status">Status</InputLabel> */}
            {/* <StatusSelectComponent
                control={control}
                name="status"
                errMsg={errors?.status?.message as string}
                /> */}
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
            >Edit</SubmitButton>
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

export default EditProduct;
import { InputLabel, SubmitButton, TextInputComponent } from "../../../components/common/form/input-component.";
import { Heading3 } from "../../../components/common/title"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { categorySvc } from '../../../services/category.service';
import authSvc from "../../auth/auth.service";

const CreateCategory = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const schema = yup.object({
        title: yup.string().required(),
        image: yup
          .mixed()
          .required(),
        parentId: yup.string().nullable(),
    });

    const fetchCategories = async () => {
        try {
            const response:any = await authSvc.getRequest('/category/getall');
            setCategories(response.result);
        } catch (error) {
            toast.error('Error fetching categories');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

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
            // console.log('kagsjs')
            setLoading(true);
            const submitData = {
                ...data,
            }
            console.log(submitData)
            await authSvc.postRequest('/category/', submitData, { auth: true,file:true });
    
              toast.success("Category Created successfully. ")
              navigate('/admin/category')
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
          <Heading3><>Create Category</></Heading3>
          <hr/>
          </div>
<div className="overflow-x-auto">
    <div className="py-3 px-5 lg:py-4">
<form onSubmit={handleSubmit(onSubmit)}>
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
    <div className="sm:col-span-2">
    <InputLabel htmlFor="name">Category Name</InputLabel>
  
    <TextInputComponent
            name= "title"
            errMsg={errors.title?.message as string}
            defaultValue=""
            control = {control}
            />
            </div>
            <div className="sm:col-span-2">
                <InputLabel htmlFor="parentCategory">Parent Category</InputLabel>
                <select
                    id="parentCategory"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500"
                    {...control.register('parentId')}
                >
                    <option value="">Select parent category (optional)</option>
                    {categories.map((category: any) => (
                        <option key={category._id} value={category._id}>
                            {category.title}
                        </option>
                    ))}
                </select>
            </div>
            <div className="sm:col-span-2">
            <InputLabel htmlFor="Image">Image</InputLabel>
            {/* <ImageUpload
             name="image"
             type={"file"}
              control={control}
                errMsg={errors?.image?.message as string}   
                /> */}
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
                  <label htmlFor="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Brand</label>
                  <input type="text" name="brand" id="brand" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500" placeholder="Product brand" required />
              </div>
              <div className="w-full">
                  <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                  <input type="number" name="price" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500" placeholder="$2999" required />
              </div>
              <div>
                  <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                  <select id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500">
                      <option value="">Select category</option>
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

export default CreateCategory;
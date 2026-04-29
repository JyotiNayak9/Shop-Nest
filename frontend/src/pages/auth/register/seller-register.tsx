import { yupResolver } from "@hookform/resolvers/yup";
import { InputLabel, TextInputComponent } from "../../../components/common/form/input-component.";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import authSvc from "../auth.service";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import { useState ,useEffect, useContext} from "react";
import { LoadingComponent } from "../../../components/common/loading/loading-component";
import AuthContext from "../../../context/auth.context";


const SellerRegister = () => {

  const registerDTO = Yup.object({
    
    name: Yup.string().required().matches(/^[A-Z][a-z]+(?: [A-Z][a-z]+)+$/,"Invalid name format").min(2).max(50),
    email: Yup.string().email().required(),
    password: Yup.string().matches(/^(?=.*[\d])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,25}$/,"password must contain small letter, capital letter, number and special character").required(),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], "Password and confirm password must match"),
    role: Yup.string().default('seller'),
//    phone: Yup.number().required(),
   storeName: Yup.string().required(),
   storeAddress: Yup.string().required(),
   panNumber: Yup.string().required(),
  })

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {control, handleSubmit,setError, formState: {errors}} = useForm({
    resolver: yupResolver(registerDTO)
  });

  const {LoggedInUser} = useContext(AuthContext)
  useEffect(() => {
    if(LoggedInUser){
      toast.info("You are already logged in.")
      navigate("/"+LoggedInUser.role)
    }
  },[LoggedInUser])
 
  const submitForm = async (data: any) => {
      try{
        setLoading(true);
        await authSvc.postRequest('/auth/seller/register',data,{file:true});

          toast.success("Your account has been created successfully. ")
          navigate('/')
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
  }

  console.log(errors)
    return(
        <>
       
<section className="bg-white">
  <div className="lg:grid  ">
    
    <main
      className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
    >
      <div className="max-w-xl lg:max-w-3xl">
        
        <h1 className=" text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
          Welcome to <strong className="text-violet-700">ShopNest</strong>
        </h1>
        <p className="mt-4 leading-relaxed text-gray-500">
          Become a vendor and start selling your products to a wider audience.
        </p>

        <form onSubmit={handleSubmit(submitForm)} className="mt-8 grid grid-cols-6 gap-6">
       

          <div className="col-span-6">
          <InputLabel htmlFor="name">Name</InputLabel>
            
            <TextInputComponent
            name= "name"
            errMsg={errors.name?.message as string}
         
            control = {control}
            />
          </div>

          <div className="col-span-6">
          <InputLabel htmlFor="email">Email</InputLabel>
            
           <TextInputComponent
           name="email"
           type="email"
           errMsg={errors?.email?.message as string}
      
           control={control}
           />
          </div>
          <div className="col-span-6 sm:col-span-3">
          <InputLabel htmlFor="password">Password</InputLabel>
            
            <TextInputComponent
            name= "password"
            type="password"
            errMsg={errors?.password?.message as string}
         
           control={control}
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label htmlFor="PasswordConfirmation" className="block text-sm font-medium text-gray-700">
              Password Confirmation
            </label>

            <TextInputComponent
            name= "confirmPassword"
            type="password"
            errMsg={errors?.confirmPassword?.message as string}
         
           control={control}
            />
          </div>
 
           <div className="col-span-6 sm:col-span-3">
            <label htmlFor="StoreName" className="block text-sm font-medium text-gray-700">
             Store Name
            </label>

            <TextInputComponent
            name= "storeName"
            errMsg={errors?.storeName?.message as string}
         
           control={control}
            />
          </div>
 <div className="col-span-6 sm:col-span-3">
            <label htmlFor="PanNumber" className="block text-sm font-medium text-gray-700">
                PAN Number
            </label>

            <TextInputComponent
            name= "panNumber"
            errMsg={errors?.panNumber?.message as string}
         
           control={control}
            />
          </div>
        
          <div className="col-span-6">
          <InputLabel htmlFor="storeAddress">Store Address</InputLabel>
            
           <TextInputComponent
           name="storeAddress"
           errMsg={errors?.storeAddress?.message as string}
      
           control={control}
           />
          </div>
          {/* <div className="col-span-6">
          <InputLabel htmlFor="role">Role</InputLabel>

            <RoleSelectComponent
             name="role"
             errMsg={errors?.role?.message as string}
           
             control={control}
            />
          </div> */}
         

          
        

          <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
            <button disabled = {loading}
              className="inline-block shrink-0 rounded-md border border-violet-600 bg-violet-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-violet-800  "
            >
             
              {loading? <LoadingComponent/> : ' Register as Vendor'}
            </button>

            <p className="mt-4 text-sm text-gray-500 sm:mt-0">
              Already have an account?
             <NavLink
                           className={"text-sm text-gray-900 hover:text-violet-800"}
                           to={"/login"}
                         >
                           {" "}
                          Login
                         </NavLink>
            </p>
          </div>
        </form>
      </div>
    </main>
  </div>
</section>
        </>
    )
}

export default SellerRegister;
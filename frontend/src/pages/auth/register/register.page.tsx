import { yupResolver } from "@hookform/resolvers/yup";
import RegisterImage from "../../../assets/images/registration.png"
import { InputLabel, RoleSelectComponent, TextAreaInputComponent, TextInputComponent } from "../../../components/common/form/input-component.";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import authSvc from "../auth.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState ,useEffect, useContext} from "react";
import { LoadingComponent } from "../../../components/common/loading/loading-component";
import AuthContext from "../../../context/auth.context";


const RegisterPage = () => {

  const registerDTO = Yup.object({
    name: Yup.string().required().min(2).max(50),
    email: Yup.string().email().required(),
    address: Yup.string(),
    password: Yup.string().matches(/^(?=.*[\d])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,25}$/).required(),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], "Password and confirm password must match"),
    role: Yup.string().matches(/^(seller|customer)$/).default('customer').required(),
    phone: Yup.string().nullable(),
    image: Yup.string()
  })

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {control, handleSubmit,setError, setValue, formState: {errors}} = useForm({
    resolver: yupResolver(registerDTO)
  });

  
 
  const submitForm = async (data: any) => {
      try{
        setLoading(true);
       await authSvc.postRequest('auth/register', data,{file:true})
          toast.success("Your account has been created successfully. Please check your email for futher processing")
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
  const LoggedInUser = useContext(AuthContext)
  useEffect(() => {
    if(LoggedInUser){
      toast.info("You are already logged in.")
      navigate("/"+LoggedInUser.role)
    }
  },[LoggedInUser])
  console.log(errors)
    return(
        <>
       
<section className="bg-white">
  <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
    <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
      <img
        alt=""
        src={RegisterImage}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </aside>

    <main
      className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
    >
      <div className="max-w-xl lg:max-w-3xl">
        
        <h1 className=" text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
          Welcome to <strong className="text-violet-700">ShopNest</strong>
        </h1>
        <p className="mt-4 leading-relaxed text-gray-500">
        Create your account to enjoy a personalized shopping experience, track your orders, and stay updated with our latest deals and offers.
        Sign Up Today!
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

          <div className="col-span-6">
            <InputLabel htmlFor="address">Address</InputLabel>
            <TextAreaInputComponent
              name="address"
              errMsg={errors?.address?.message as string}
          
              control={control}
            />
            </div>
          <div className="col-span-6">
          <InputLabel htmlFor="phone">Phone</InputLabel>
           
            <TextInputComponent
           name="phone"
           errMsg={errors?.phone?.message as string}
    
           control={control}
           />
          </div>
          <div className="col-span-6">
          <InputLabel htmlFor="role">Role</InputLabel>

            <RoleSelectComponent
             name="role"
             errMsg={errors?.role?.message as string}
           
             control={control}
            />
          </div>
          <div className="col-span-6">
          <InputLabel htmlFor="image">Image</InputLabel>

            <input 
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"  
             type="file"
             onChange={(e: any) =>{
              const image = e.target.files['0']
              setValue('image', image);
             }}
             ></input>
           
          </div>

          
          <div className="col-span-6">
            <p className="text-sm text-gray-500">
              By creating an account, you agree to our
              <a href="#" className="text-gray-700 underline mx-1" > terms and conditions </a>
              and
              <a href="#" className="text-gray-700 underline mx-1">privacy policy</a>.
            </p>
          </div>

          <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
            <button disabled = {loading}
              className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
            >
             
              {loading? <LoadingComponent/> : ' Create an account'}
            </button>

            <p className="mt-4 text-sm text-gray-500 sm:mt-0">
              Already have an account?
              <a href="#" className="text-gray-700 underline">Log in</a>.
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

export default RegisterPage;
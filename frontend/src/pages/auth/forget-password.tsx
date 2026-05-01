// ResetPassword.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { toast } from "react-toastify";
import authSvc from "./auth.service";
import { InputLabel, SubmitButton, TextInputComponent } from "../../components/common/form/input-component.";
import { Heading3 } from "../../components/common/title";

const schema = yup.object({
    password: yup.string().matches(/^(?=.*[\d])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,25}$/,"password must contain small letter, capital letter, number and special character").required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

const ResetPassword = () => {
  const Params = useParams();
  const navigate = useNavigate();
  const token = Params.token;

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      navigate("/"); 
    }
  }, [token, navigate]);

  const onSubmit = async (data:any) => {
    try {
        console.log(data)
      await authSvc.patchRequest("/user/resetpassword/" + token, data);
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (err) {
      toast.error("Token may be expired or invalid.");
    }
  };

  return (
    <>
          <section className="flex flex-col items-center justify-center space-y-4 my-4">
 <Heading3>
          <>Reset Password</>
        </Heading3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
            <InputLabel htmlFor="password">New Password</InputLabel> 
            <TextInputComponent
             type="password" 
             control={control}
             name="password"
             errMsg={errors.password?.message as string}/>

            <InputLabel htmlFor="Confirm Password">Confirm Password</InputLabel> 

               <TextInputComponent
             type="password" 
             control={control}
             name="confirmPassword"
             errMsg={errors.confirmPassword?.message as string}/>
         <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
        <SubmitButton
          loading={false}>Reset Password</SubmitButton>
          </div>
        </div>
      </form>
    
    </section>
    </>
  );
};


export default ResetPassword;

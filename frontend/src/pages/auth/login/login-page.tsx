import { useForm } from "react-hook-form";
import { InputLabel,TextInputComponent,} from "../../../components/common/form/input-component.";
import { Heading3 } from "../../../components/common/title";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { NavLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import authSvc from "../auth.service";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../context/auth.context";

const LoginPage = () => {
  const loginDTO = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  let [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginDTO),
  });
  const navigate = useNavigate();

  let {LoggedInUser, setLoggedInUser} = useContext(AuthContext)
  useEffect(() => {
    if(LoggedInUser){
      console.log(LoggedInUser)
      toast.info("You are already logged in.")
      navigate("/"+LoggedInUser.role)
    }
  },[LoggedInUser])

  const login = async (data: any) => {
    try {
      setLoading(true);
      const response: any = await authSvc.postRequest("/auth/login", data);
      localStorage.setItem("_at", response.result.token.token);
      localStorage.setItem("_rt", response.result.token.refreshToken);
      toast.success(`Welcome to ${response.result.UserDetail.role} panel`);
      setLoggedInUser(response.result.UserDetail);
      navigate("/" + response.result.UserDetail.role);
    } catch (exception: any) {
      toast.error(exception.data.message);
    } finally {
      setLoading(false);
    }
  };

 return(
    <>
      <section className="flex  flex-col items-center justify-center min-h-screen">
        <Heading3>
          <>Login Page</>
        </Heading3>
        <form
          className="flex w-96 flex-col bg-slate-100 p-5 rounded-lg"
          onSubmit={handleSubmit(login)}
        >
          <div className="mb-2">
            <div className="my-2 block">
              <InputLabel htmlFor="email"> Email</InputLabel>
            </div>
            <TextInputComponent
              name="email"
              type="email"
              control={control}
              errMsg={errors?.email?.message as string}
            />
          </div>
          <div className="my-2">
            <div className="my-2 block">
              <InputLabel htmlFor="password"> Password</InputLabel>
            </div>
            <TextInputComponent
              name="password"
              type="password"
              control={control}
              errMsg={errors?.password?.message as string}
            />
          </div>

          <div className="my-2">
            <NavLink
              className={"text-sm text-gray-900 hover:text-violet-800"}
              to={"/forget-password"}
            >
              {" "}
              Forgot Password?
            </NavLink>
          </div>
          <Button
            className="bg-violet-600 my-2 enabled:hover:bg-violet-800"
            disabled={loading}
            type="submit"
          >
            Submit
          </Button>
        </form>
      </section>
    </>
 );
};

export default LoginPage;

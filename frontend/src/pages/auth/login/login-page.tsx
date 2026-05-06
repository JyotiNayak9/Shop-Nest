import { useForm } from "react-hook-form";
import {
  InputLabel,
  TextInputComponent,
} from "../../../components/common/form/input-component.";
import { Heading3 } from "../../../components/common/title";
import { Button } from "flowbite-react";
import { NavLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import authSvc from "../auth.service";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../context/auth.context";
import Swal from "sweetalert2";

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

  let { LoggedInUser, setLoggedInUser } = useContext(AuthContext);

  useEffect(() => {
    if (LoggedInUser) {
      toast.info("You are already logged in.");
      navigate("/" + LoggedInUser.role);
    }
  }, [LoggedInUser]);

  const handleUnverifiedAccount = async (email: string) => {
    const result = await Swal.fire({
      title: "Account Not Verified",
      text: "Your account is not verified yet. Would you like us to send a new OTP to your email?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, send OTP",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await authSvc.postRequest("/auth/resend-otp", { email });
        toast.success("OTP sent! Please check your email.");
        navigate("/verify-otp", { state: { email } });
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to send OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const login = async (data: any) => {
    try {
      setLoading(true);
      const response: any = await authSvc.postRequest("/auth/login", data);
      localStorage.setItem("_at", response.result.token.token);
      localStorage.setItem("_rt", response.result.token.refreshToken);
      toast.success(`Welcome to ${response.result.UserDetail.role} panel`);
      setLoggedInUser(response.result.UserDetail);
      if (response.result.UserDetail.role === "customer") {
        navigate("/");
      } else {
        navigate("/" + response.result.UserDetail.role);
      }
    } catch (exception: any) {
      // Handle unverified account specifically
      if (exception?.data?.code === "UNVERIFIED_ACCOUNT") {
        await handleUnverifiedAccount(data.email);
      } else {
        toast.error(exception?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="flex flex-col items-center justify-center min-h-screen px-4">
        <Heading3>
          <>Login Page</>
        </Heading3>
        <form
          className="flex w-full max-w-md flex-col bg-slate-100 p-5 rounded-lg"
          onSubmit={handleSubmit(login)}
        >
          <div className="mb-2">
            <div className="my-2 block">
              <InputLabel htmlFor="email">Email</InputLabel>
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
              <InputLabel htmlFor="password">Password</InputLabel>
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
              to={"#"}
              onClick={async (e) => {
                e.preventDefault();
                const email = control._formValues.email;

                if (!email) {
                  toast.error("Please enter your email address first");
                  return;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                  toast.error("Please enter a valid email address");
                  return;
                }

                const result = await Swal.fire({
                  title: "Reset Password?",
                  text: `We will send a password reset link to: ${email}`,
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonColor: "#7c3aed",
                  cancelButtonColor: "#6b7280",
                  confirmButtonText: "Yes, send it!",
                  cancelButtonText: "Cancel",
                });

                if (result.isConfirmed) {
                  try {
                    setLoading(true);
                    const response: any = await authSvc.postRequest(
                      "/user/forgot-password-token",
                      { email }
                    );
                    toast.success(
                      response.message || "Password reset link has been sent to your email"
                    );
                  } catch (exception: any) {
                    toast.error(
                      exception?.data?.message || "Failed to send reset link"
                    );
                  } finally {
                    setLoading(false);
                  }
                }
              }}
            >
              Forgot Password?
            </NavLink>
          </div>

          <Button
            className="bg-violet-600 my-2 enabled:hover:bg-violet-800"
            disabled={loading}
            type="submit"
          >
            {loading ? "Please wait..." : "Login"}
          </Button>
        </form>
      </section>
    </>
  );
};

export default LoginPage;
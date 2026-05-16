import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  InputLabel,
  TextInputComponent,
  SubmitButton,
  OTPInputComponent,
} from "../../../components/common/form/input-component.";
import { Heading3 } from "../../../components/common/title";
import { toast } from "react-toastify";
import authSvc from "../auth.service";

const otpSchema = yup.object({
  email: yup.string().email().required("Email is required"),
  otp: yup.string().length(6, "OTP must be 6 digits").required("OTP is required"),
});

const RESEND_COOLDOWN = 60; 

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [emailFromState, setEmailFromState] = useState("");
  const [cooldown, setCooldown] = useState(0);


  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    const email = location.state?.email || localStorage.getItem("pendingVerificationEmail");
    if (email) {
      setEmailFromState(email);
      setValue("email", email);
    }
    // Start with a cooldown since OTP was just sent on registration
    setCooldown(RESEND_COOLDOWN);
  }, [location.state]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: {
      email: emailFromState,
      otp: "",
    },
  });

  const watchedEmail = watch("email");

  const verifyOTP = async (data: any) => {
    try {
      setLoading(true);
      await authSvc.postRequest("/users/verify-email", data);
      toast.success("Email verified successfully! You can now login.");
      localStorage.removeItem("pendingVerificationEmail");
      setTimeout(() => navigate("/login"), 2000);
    } catch (exception: any) {
      toast.error(exception?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!watchedEmail) {
      toast.error("Please enter your email address");
      return;
    }
    if (cooldown > 0) return; 

    try {
      setResendLoading(true);
      await authSvc.postRequest("/users/resend-otp", { email: watchedEmail });
      toast.success("OTP has been resent to your email");
      setCooldown(RESEND_COOLDOWN); // restart 60s cooldown
    } catch (exception: any) {
      toast.error(exception?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setValue("otp", value);
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4">
      <Heading3>
        <>Verify Your Email</>
      </Heading3>
      <p className="text-center text-gray-600 mb-6 max-w-md">
        We've sent a 6-digit OTP to your email. Please enter it below to verify your account.
      </p>

      <form
        className="flex w-full max-w-md flex-col bg-slate-100 p-6 rounded-lg"
        onSubmit={handleSubmit(verifyOTP)}
      >
        <div className="mb-4">
          <div className="my-2 block">
            <InputLabel htmlFor="email">Email Address</InputLabel>
          </div>
          <TextInputComponent
            name="email"
            type="email"
            control={control}
            errMsg={errors?.email?.message as string}
          />
        </div>

        <div className="mb-6">
          <div className="my-2 block">
            <InputLabel htmlFor="otp">6-Digit OTP</InputLabel>
          </div>
          <OTPInputComponent
            name="otp"
            type="text"
            control={control}
            errMsg={errors?.otp?.message as string}
            onChange={handleOTPChange}
          />
        </div>

        {/* Resend OTP with cooldown */}
        <div className="mb-4 text-center">
          {cooldown > 0 ? (
            <p className="text-sm text-gray-500">
              Resend OTP in{" "}
              <span className="text-violet-600 font-semibold">{cooldown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={resendOTP}
              disabled={resendLoading}
              className="text-sm text-violet-600 hover:text-violet-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>

        <SubmitButton loading={loading}>
          Verify Email
        </SubmitButton>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already verified?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-violet-600 hover:text-violet-800 font-medium"
            >
              Login here
            </button>
          </p>
        </div>
      </form>
    </section>
  );
};

export default OTPVerificationPage;
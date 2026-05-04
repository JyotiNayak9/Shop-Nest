import httpService from "./http.service";

class OTPService extends httpService {
  // Verify OTP
  async verifyOTP(email: string, otp: string) {
    return this.postRequest("/users/verify-email", { email, otp });
  }

  // Resend OTP
  async resendOTP(email: string) {
    return this.postRequest("/users/resend-otp", { email });
  }
}

const otpSvc = new OTPService();
export default otpSvc;

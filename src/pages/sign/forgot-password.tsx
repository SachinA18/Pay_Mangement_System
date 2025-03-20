import React, { useState, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import animationImage from "../../assets/images/signup/Animation.png";

import "../../styles/styles.css";

import "../../../public/themes/light.css";
import "../../../public/themes/custom-light.css";

const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<"email" | "otp" | "resetPassword">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (step === "email") {
      if (!email.trim()) {
        setErrors({ email: "Email is required." });
        return;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        setErrors({ email: "Please enter a valid email address." });
        return;
      }
      setErrors({});
      // TODO: Call your API to send OTP to the provided email
      setStep("otp");
    } else if (step === "otp") {
      if (!otp.trim()) {
        setErrors({ otp: "OTP is required." });
        return;
      }
      setErrors({});
      // TODO: Verify the OTP with your backend
      setStep("resetPassword");
    } else if (step === "resetPassword") {
      if (!newPassword.trim() || !confirmPassword.trim()) {
        setErrors({
          newPassword: "New password is required.",
          confirmPassword: "Please confirm your password.",
        });
        return;
      } else if (newPassword !== confirmPassword) {
        setErrors({ confirmPassword: "Passwords do not match." });
        return;
      }
      setErrors({});
      // TODO: Call your API to reset the password
      // e.g. await apiService.resetPassword(email, newPassword);

      navigate("/login"); // Redirect to login after success
    }
  };

  return (
    <div className="h-screen surface-section flex overflow-auto">
      <div style={{ width: "30%" }} className="flex flex-column pt-8 px-8">
        <div className="text-5xl font-semibold text-primary">calculx</div>
        <div className="mt-7 dashed-divider"></div>
        <div className="mb-5 mt-5">
          <div className="mt-4 text-600 text-base">
            Having Problems with your Account?
          </div>
          <div className="text-600 text-2xl font-medium">
            Contact our 24/7 support team.
          </div>
        </div>
        <div className="flex align-items-center justify-content-center mb-6">
          <img
            src={animationImage}
            alt="animation"
            style={{ width: "250px" }}
          />
        </div>
        <div className="mb-4 text-center">
          <Link to="/login" className="text-sm text-blue-500 no-underline">
            Back to login
          </Link>
        </div>
        <div className="text-500 text-sm text-justify">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </div>
        <div className="text-center mt-6 text-sm text-500">
          Calculx | All Rights Reserved ©2025 Version 1.0
        </div>
      </div>
      <div style={{ width: "70%" }} className="pt-4 relative">
        <div
          className="surface-card p-8"
          style={{
            borderTopLeftRadius: "55px",
            minHeight: "calc(100vh - 21px)",
          }}
        >
          <div className="text-4xl font-medium mb-2 text-600">
            Forgot Password
          </div>
          <div className="flex align-items-center gap-2 mb-4">
            <span className="text-600 text-sm">
              Don't worry, we’ll help you reset it.
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            {step === "email" && (
              <div className="flex flex-column mt-6 w-800">
                <label htmlFor="email" className="block text-600 mb-2">
                  Enter your registered email address
                </label>
                <InputText
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Email"
                  className="p-3 surface-50 border-none"
                />
                {errors.email && (
                  <small className="p-error block">{errors.email}</small>
                )}
                <div className="mt-4">
                  <Button
                    label="Send OTP"
                    className="p-button-primary"
                    type="submit"
                    style={{ width: "220px" }}
                  />
                </div>
              </div>
            )}

            {step === "otp" && (
              <div className="flex flex-column mt-6 w-800">
                <label htmlFor="otp" className="block text-600 mb-2">
                  Enter the OTP sent to your email
                </label>
                <InputText
                  id="otp"
                  value={otp}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setOtp(e.target.value)
                  }
                  placeholder="OTP"
                  className="p-3 surface-50 border-none"
                />
                {errors.otp && (
                  <small className="p-error block">{errors.otp}</small>
                )}
                <div className="mt-4 flex gap-3 align-items-center">
                  <Button
                    label="Verify OTP"
                    className="p-button-primary"
                    type="submit"
                    style={{ width: "220px" }}
                  />
                  <Link to="#" className="text-sm text-blue-500 no-underline">
                    Didn't receive OTP? Resend
                  </Link>
                </div>
              </div>
            )}

            {step === "resetPassword" && (
              <div className="flex flex-column mt-6 w-800">
                <label htmlFor="newPassword" className="block text-600 mb-2">
                  New Password
                </label>
                <InputText
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="New Password"
                  className="p-3 surface-50 border-none"
                />
                {errors.newPassword && (
                  <small className="p-error block">{errors.newPassword}</small>
                )}
                <label
                  htmlFor="confirmPassword"
                  className="block text-600 mb-2 mt-4"
                >
                  Confirm Password
                </label>
                <InputText
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm Password"
                  className="p-3 surface-50 border-none"
                />
                {errors.confirmPassword && (
                  <small className="p-error block">
                    {errors.confirmPassword}
                  </small>
                )}
                <div className="mt-4">
                  <Button
                    label="Submit"
                    className="p-button-primary"
                    type="submit"
                    style={{ width: "220px" }}
                  />
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

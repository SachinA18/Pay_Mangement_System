import React, { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

import TermsAndConditions from "./terms";
import PrivacyPolicy from "./privacy-policy";

import ApiService from "../../services/api.service";

import creditImage from "../../assets/images/signup/credit.png";
import customerService from "../../assets/images/signup/customer-service.png";
import handShake from "../../assets/images/signup/handshake.png";

import animationImage from "../../assets/images/signup/Animation.png";

import "../../styles/styles.css";

import "../../../public/themes/light.css";
import "../../../public/themes/custom-light.css";

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    location: "",
    password: "",
    rePassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(<TermsAndConditions />);

  const navigate = useNavigate();
  const apiService = new ApiService("sign");

  const locations = [
    { label: "Ireland", value: "Ireland" },
    { label: "United States", value: "United States" },
    { label: "United Kingdom", value: "United Kingdom" },
    { label: "Australia", value: "Australia" },
    { label: "Canada", value: "Canada" },
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const validationErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      validationErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      validationErrors.lastName = "Last name is required.";
    }

    if (!formData.email.trim()) {
      validationErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/u.test(formData.email)) {
      validationErrors.email = "Please enter a valid email address.";
    }

    if (!formData.location) {
      validationErrors.location = "Country is required.";
    }

    if (!formData.phoneNumber.trim()) {
      validationErrors.phoneNumber = "Phone number is required.";
    }

    if (!formData.password.trim()) {
      validationErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.rePassword.trim()) {
      validationErrors.rePassword = "Please confirm your password.";
    } else if (formData.password !== formData.rePassword) {
      validationErrors.rePassword = "Passwords do not match.";
    }

    if (!termsAccepted) {
      validationErrors.terms = "You must accept the terms and conditions.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (validateForm()) {
      const response: any = await apiService.post({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      });

      if (response.result) {
        setSuccess(true);
        setErrors({});
      } else {
        setSuccess(false);
        const message =
          "A record with these values already exists. Please use different values.";
        let error = "Registration failed. Please try again.";

        if (response?.message === message)
          error = "Username already exists please login to contine.";

        setErrors({ submit: error });
      }
    }
  };

  return (
    <div className="h-screen surface-section flex overflow-auto">
      <div style={{ width: "30%" }} className="flex flex-column pt-8 px-8">
        <div className="text-5xl font-semibold text-primary">calculx</div>
        <div className="mt-7 dashed-divider"></div>
        <div className="mb-5 mt-5">
          <div className="mt-4 text-600 text-base">Get onboard with</div>
          <div className="text-600 text-2xl font-medium">
            30 Days of Free Trial.
          </div>
        </div>
        <div className="flex flex-column gap-3 mt-3 mb-6">
          <div className="flex align-items-center">
            <img
              src={creditImage}
              alt="credit card"
              style={{ width: "30px" }}
            />
            <div className="text-900 text-sm ml-3">No Credit Card required</div>
          </div>
          <div className="flex align-items-center">
            <img
              src={customerService}
              alt="customer service"
              style={{ width: "30px" }}
            />
            <div className="text-900 text-sm ml-3">24/7 Online Support</div>
          </div>
          <div className="flex align-items-center">
            <img src={handShake} alt="cancel" style={{ width: "30px" }} />
            <div className="text-900 text-sm ml-3">Cancel Anytime</div>
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
            Already registered? Login to continue
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
            Your Personal Details
          </div>
          <div className="flex align-items-center gap-2 mb-4">
            <span className="text-600 text-sm">
              Don't worry we don't share your details with anyone.
            </span>
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                setDialogContent(<PrivacyPolicy />);
                setDialog(true);
              }}
              className="text-sm text-primary noUnderline"
            >
              Privacy Policy
            </Link>
          </div>
          <form onSubmit={handleSubmit} className="flex ">
            <div className="grid p-fluid w-800 mt-4 px-6">
              <div className="col-6 p-3">
                <InputText
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="p-3 surface-50 border-none"
                />
                {errors.firstName && (
                  <small className="p-error">{errors.firstName}</small>
                )}
              </div>
              <div className="col-6 p-3">
                <Dropdown
                  name="country"
                  value={formData.location}
                  options={locations}
                  optionValue="value"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, location: e.value }))
                  }
                  placeholder="Country"
                  className="surface-50 border-none"
                  style={{ padding: "0.3rem" }}
                />
                {errors.location && (
                  <small className="p-error">{errors.location}</small>
                )}
              </div>
              <div className="col-6 p-3">
                <InputText
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="p-3 surface-50 border-none "
                />
                {errors.lastName && (
                  <small className="p-error">{errors.lastName}</small>
                )}
              </div>
              <div className="col-6 p-3">
                <Password
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  toggleMask
                  inputClassName="p-3 surface-50 border-none"
                />
                {errors.password && (
                  <small className="p-error">{errors.password}</small>
                )}
              </div>
              <div className="col-6 p-3">
                <InputText
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="p-3 surface-50 border-none "
                />
                {errors.email && (
                  <small className="p-error">{errors.email}</small>
                )}
              </div>
              <div className="col-6 p-3">
                <Password
                  name="rePassword"
                  value={formData.rePassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter Password"
                  toggleMask
                  feedback={false}
                  inputClassName="p-3 surface-50 border-none "
                />
                {errors.rePassword && (
                  <small className="p-error">{errors.rePassword}</small>
                )}
              </div>
              <div className="col-6 p-3">
                <InputText
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="p-3 surface-50 border-none "
                />
                {errors.phoneNumber && (
                  <small className="p-error">{errors.phoneNumber}</small>
                )}
              </div>
              <div className="mx-3 mt-4 mb-4 dashed-divider w-full"></div>
              <div className="col-6 p-3 mb-4">
                <div className="flex align-items-center gap-2 my-3 text-sm text-600">
                  <Checkbox
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.checked || false)}
                  />
                  I've read and agreed to the{" "}
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setDialogContent(<TermsAndConditions />);
                      setDialog(true);
                    }}
                    className="text-sm text-primary noUnderline"
                  >
                    terms and conditions
                  </Link>
                </div>
                <div className="flex align-items-center gap-2 mb-4">
                  <Checkbox
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.checked || false)}
                  />
                  <label className="text-600 text-sm">
                    Please don't send me marketing communications.
                  </label>
                </div>
                {errors.terms && (
                  <small className="p-error block mb-4">{errors.terms}</small>
                )}
                {errors.submit && (
                  <div className="p-error text-center mb-4">
                    {errors.submit}
                  </div>
                )}
                {success && (
                  <div className="p-success text-lg text-center mb-4">
                    Registration successful. Please login to continue.
                  </div>
                )}
                <div className="flex justify-content-start">
                  <Button
                    label="Create Account"
                    className="p-3 p-button-primary"
                    type="submit"
                    style={{
                      width: "220px",
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Dialog
        visible={dialog}
        style={{ width: "70vw" }}
        onHide={() => {
          setDialog(false);
        }}
      >
        {dialogContent}
      </Dialog>
    </div>
  );
};

export default SignupPage;

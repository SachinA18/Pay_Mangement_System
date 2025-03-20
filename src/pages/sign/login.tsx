import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { RadioButton } from 'primereact/radiobutton';

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import ApiService from "../../services/api.service";
import { setAuthorizationToken, setSession } from "../../services/auth.service";

import loginImage from "../../assets/images/login.png";
import loginImage1 from "../../assets/images/login1.png";

import "../../styles/styles.css";

import "../../../public/themes/light.css";
import "../../../public/themes/custom-light.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    common?: string;
  }>({});
  const [currentImage, setCurrentImage] = useState(loginImage);

  const navigate = useNavigate();
  const apiService = new ApiService("sign", true);

  const validateForm = (): boolean => {
    const validationErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      validationErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/u.test(email)) {
      validationErrors.email = "Please enter a valid email address.";
    }

    if (!password.trim()) {
      validationErrors.password = "Password is required.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleLogin = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (validateForm()) {
      const response: any = await apiService.post(
        { email, password },
        "sign-in"
      );

      if (response.result) {
        setSession(response.result);
        setAuthorizationToken();
        localStorage.setItem("tenants", response.tenantList);
        localStorage.setItem(
          "profilePicture",
          "https://images.pexels.com/photos/1081685/pexels-photo-1081685.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        );
        navigate("/");
      } else {
        setErrors({ common: "Invalid email or password." });
      }
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    if (errors.email || errors.common)
      setErrors({ ...errors, email: "", common: "" });
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    if (errors.password || errors.common)
      setErrors({ ...errors, password: "", common: "" });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => {
        return prevImage === loginImage ? loginImage1 : loginImage;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen surface-section flex overflow-auto">
      <div style={{ width: "30%" }} className="flex flex-column pt-8 px-8">
        <div className="text-5xl font-semibold text-primary">calculx</div>
        <div className="mt-7 dashed-divider"></div>
        <div className="mb-5 mt-5">
          <div className="mt-4 text-600 text-base">Sign in to your</div>
          <div className="text-600 text-2xl font-medium">Calculx Account.</div>
        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-column p-fluid"
          noValidate
        >
          <div className="mb-4">
            <InputText
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your username or email"
              className="w-full p-3 border-0"
            />
            {errors.email && <small className="p-error">{errors.email}</small>}
          </div>

          <div className="mb-5">
            <Password
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
              className="w-full"
              toggleMask
              feedback={false}
              inputClassName="p-3 border-0"
            />
            {errors.password && (
              <small className="p-error">{errors.password}</small>
            )}
          </div>
          {errors.common && <div className="p-error mb-5">{errors.common}</div>}

          <div className="mb-4 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 no-underline"
            >
              Forgot Password
            </Link>
          </div>
          <div className="text-center">
            <Button
              style={{ width: "250px" }}
              label="Login"
              type="submit"
              className="p-3 text-white border-none mb-4 p-button-primary"
            />
          </div>
        </form>
        <div className="text-500 text-sm mt-5 text-justify">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </div>
        <div className="text-center mt-6 text-sm text-500">
          Calculx | All Rights Reserved ©2025 Version 1.0
        </div>
      </div>

      <div
        style={{ width: "70%", height: "fit-content" }}
        className="pt-4 relative min-h-screen"
      >
        <div
          className="w-full"
          style={{
            borderTop: "1.5rem solid #fff",
            borderLeft: "1.5rem solid #fff",
            borderTopLeftRadius: "55px",
            overflow: "hidden",
          }}
        >
          <img
            src={currentImage}
            alt="Background"
            className="w-full"
            style={{
              objectFit: "cover",
              objectPosition: "center 30%",
              minHeight: "calc(100vh - 46px)",
            }}
          />
        </div>
        <div className="absolute justify-content-end pl-4 bottom-0 w-full">
          <div
            className="p-6 flex align-items-end justify-content-end "
            style={{
              background:
                "linear-gradient(to bottom, rgba(9, 165, 219, 0) 0%, rgba(13, 160, 216, 0.4) 50%, #122960 100%)",
              height: "50%",
            }}
          >
            <div>
              <div className="text-right mb-8">
                <div className="text-white text-5xl font-medium mb-4">
                  calculx
                </div>
                <h1 className="-mt-3 text-white text-6xl font-bold mb-2">
                  Simplify Your Finances and
                </h1>
                <h1 className="-mt-3 text-white text-7xl font-bold mb-4">
                  Boost Growth.
                </h1>
                <p className="-mb-7 mt-5 text-white text-xl">
                  Start Managing Your Finances, Create an Account Today.
                </p>
              </div>
              <div className="flex justify-content-start">
                <div className="flex col-6 justify-content-start">
                  {[loginImage, loginImage1].map((img, index) => (
                    <div className="flex align-items-center ml-2" key={index}>
                      <RadioButton
                        inputId={`img-${index}`}
                        name="imageSelection"
                        value={img}
                        checked={currentImage === img}
                        onChange={() => setCurrentImage(img)}
                        className="p-button-text text-xl"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex col-6 justify-content-end">
                  <Button
                    label="Create Account"
                    className="border-white p-button-lg px-6 p-button-primary"
                    onClick={() => navigate("/signup")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
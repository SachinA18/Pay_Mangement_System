import { useState, useEffect, useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import ApiService from "../services/api.service";
import { Toast } from "primereact/toast";
import { useRef } from "react";

interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface FormValues {
  profilePhoto: string | ArrayBuffer | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string | null;
  nationality: string | null;
  town: string;
  postalCode: string;
  province: string;
  address: string;
  currency: string | null;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  nationality?: string;
  town?: string;
  postalCode?: string;
  province?: string;
  address?: string;
  currency?: string;
}

const ProfilePage = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    profilePhoto: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: null,
    nationality: null,
    town: "",
    postalCode: "",
    province: "",
    address: "",
    currency: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const toast = useRef<Toast>(null);
  const apiService = useMemo(() => new ApiService("User"), []);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "User ID not found",
          life: 3000,
        });
        return;
      }

      const response = (await apiService.get(userId)) as UserResponse;
      if (response) {
        setFormValues((prev) => ({
          ...prev,
          firstName: response.firstName || "",
          lastName: response.lastName || "",
          email: response.email || "",
          phone: response.phoneNumber || "",
          // Set other fields as they become available in the backend
        }));
      }
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to load user data",
        life: 3000,
      });
    }
  };

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  const nationalityOptions = [
    { label: "United States", value: "us" },
    { label: "Canada", value: "ca" },
    { label: "United Kingdom", value: "uk" },
    { label: "Australia", value: "au" },
    { label: "India", value: "in" },
    { label: "Other", value: "other" },
  ];

  const currencyOptions = [
    { label: "USD", value: "usd" },
    { label: "EUR", value: "eur" },
    { label: "GBP", value: "gbp" },
    { label: "INR", value: "inr" },
    { label: "AUD", value: "aud" },
    { label: "Other", value: "other" },
  ];

  // Generic onChange handler for text inputs and dropdowns
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Specific handler for file input (profile photo)
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormValues((prev) => ({
          ...prev,
          profilePhoto: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/u;
    return phoneRegex.test(phone);
  };

  const handleSaveProfile = async () => {
    const newErrors: FormErrors = {};

    // Validation checks
    if (!formValues.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!formValues.lastName.trim())
      newErrors.lastName = "Last name is required.";
    if (!formValues.email.trim()) newErrors.email = "Email is required.";
    else if (!validateEmail(formValues.email))
      newErrors.email = "Enter a valid email address.";

    if (!formValues.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!validatePhone(formValues.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }

    if (!formValues.gender) newErrors.gender = "Gender is required.";
    if (!formValues.nationality)
      newErrors.nationality = "Nationality is required.";
    if (!formValues.town.trim()) newErrors.town = "Town/City is required.";
    if (!formValues.postalCode.trim())
      newErrors.postalCode = "Postal/ZIP Code is required.";
    if (!formValues.province.trim())
      newErrors.province = "Province/State is required.";
    if (!formValues.address.trim()) newErrors.address = "Address is required.";
    if (!formValues.currency) newErrors.currency = "Currency is required.";

    setErrors(newErrors);

    // If no errors, proceed
    if (Object.keys(newErrors).length === 0) {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "User ID not found",
            life: 3000,
          });
          return;
        }

        const userData = {
          id: userId,
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          phoneNumber: formValues.phone,
          // Add other fields as they become available in the backend
        };

        await apiService.put(userData);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Profile updated successfully",
          life: 3000,
        });
      } catch (error: any) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: error.message || "Failed to update profile",
          life: 3000,
        });
      }
    }
  };

  return (
    <div className="p-3 h-full surface-0">
      <Toast ref={toast} />
      <div className="p-2 text-color">
        <div className="mb-2 text-2xl">My Profile</div>
        <div className="text-color-secondary">
          Manage your profile settings and personal information.
        </div>
      </div>
      <Divider className="mb-1" />

      <form className="p-4 text-700" style={{ maxWidth: "800px" }}>
        {/* Example for Profile Photo */}
        <div className="mb-3">
          <label className="block mb-2">Profile Photo</label>
          <input type="file" onChange={handlePhotoChange} />
          {formValues.profilePhoto && (
            <div className="mt-2">
              <img
                src={
                  typeof formValues.profilePhoto === "string"
                    ? formValues.profilePhoto
                    : ""
                }
                alt="Profile"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </div>
          )}
        </div>

        <div className="grid">
          {/* First Name */}
          <div className="col-6 field">
            <label htmlFor="firstName">First name</label>
            <InputText
              id="firstName"
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              className={`w-full ${errors.firstName ? "p-invalid" : ""}`}
            />
            {errors.firstName && (
              <small className="p-error">{errors.firstName}</small>
            )}
          </div>

          {/* Last Name */}
          <div className="col-6 field">
            <label htmlFor="lastName">Last name</label>
            <InputText
              id="lastName"
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
              className={`w-full ${errors.lastName ? "p-invalid" : ""}`}
            />
            {errors.lastName && (
              <small className="p-error">{errors.lastName}</small>
            )}
          </div>

          {/* Email */}
          <div className="col-6 field">
            <label htmlFor="email">E-mail address</label>
            <InputText
              id="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              className={`w-full ${errors.email ? "p-invalid" : ""}`}
            />
            {errors.email && <small className="p-error">{errors.email}</small>}
          </div>

          {/* Phone */}
          <div className="col-6 field">
            <label htmlFor="phone">Phone number</label>
            <InputText
              id="phone"
              name="phone"
              value={formValues.phone}
              onChange={handleChange}
              className={`w-full ${errors.phone ? "p-invalid" : ""}`}
            />
            {errors.phone && <small className="p-error">{errors.phone}</small>}
          </div>

          {/* Gender */}
          <div className="col-6 field">
            <label htmlFor="gender">Gender</label>
            <Dropdown
              id="gender"
              name="gender"
              value={formValues.gender}
              options={genderOptions}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, gender: e.value }))
              }
              placeholder="Select Gender"
              className={`w-full ${errors.gender ? "p-invalid" : ""}`}
            />
            {errors.gender && (
              <small className="p-error">{errors.gender}</small>
            )}
          </div>

          {/* Nationality */}
          <div className="col-6 field">
            <label htmlFor="nationality">Nationality</label>
            <Dropdown
              id="nationality"
              name="nationality"
              value={formValues.nationality}
              options={nationalityOptions}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, nationality: e.value }))
              }
              placeholder="Select Nationality"
              className={`w-full ${errors.nationality ? "p-invalid" : ""}`}
            />
            {errors.nationality && (
              <small className="p-error">{errors.nationality}</small>
            )}
          </div>

          {/* Town */}
          <div className="col-6 field">
            <label htmlFor="town">Town/City</label>
            <InputText
              id="town"
              name="town"
              value={formValues.town}
              onChange={handleChange}
              className={`w-full ${errors.town ? "p-invalid" : ""}`}
            />
            {errors.town && <small className="p-error">{errors.town}</small>}
          </div>

          {/* Postal Code */}
          <div className="col-6 field">
            <label htmlFor="postalCode">Postal/ZIP Code</label>
            <InputText
              id="postalCode"
              name="postalCode"
              value={formValues.postalCode}
              onChange={handleChange}
              className={`w-full ${errors.postalCode ? "p-invalid" : ""}`}
            />
            {errors.postalCode && (
              <small className="p-error">{errors.postalCode}</small>
            )}
          </div>

          {/* Province */}
          <div className="col-6 field">
            <label htmlFor="province">Province/State</label>
            <InputText
              id="province"
              name="province"
              value={formValues.province}
              onChange={handleChange}
              className={`w-full ${errors.province ? "p-invalid" : ""}`}
            />
            {errors.province && (
              <small className="p-error">{errors.province}</small>
            )}
          </div>

          {/* Address */}
          <div className="col-6 field">
            <label htmlFor="address">Address</label>
            <InputText
              id="address"
              name="address"
              value={formValues.address}
              onChange={handleChange}
              className={`w-full ${errors.address ? "p-invalid" : ""}`}
            />
            {errors.address && (
              <small className="p-error">{errors.address}</small>
            )}
          </div>

          {/* Currency */}
          <div className="col-6 field">
            <label htmlFor="currency">Currency</label>
            <Dropdown
              id="currency"
              name="currency"
              value={formValues.currency}
              options={currencyOptions}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, currency: e.value }))
              }
              placeholder="Select Currency"
              className={`w-full ${errors.currency ? "p-invalid" : ""}`}
            />
            {errors.currency && (
              <small className="p-error">{errors.currency}</small>
            )}
          </div>
        </div>

        <div className="mt-4">
          <Button
            label="Save Profile"
            onClick={(e) => {
              e.preventDefault();
              handleSaveProfile();
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;

"use client";

import { AuthPanelLeft } from "@/components/auth/AuthPanelLeft";
import { useState } from "react";
import Link from "next/link";
import { RoleSelector } from "./RoleSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Loader2,
  MapPin,
  Building2,
  Hash,
  Mail,
  Lock,
  User,
  Phone,
} from "lucide-react";
import { authService } from "@/services/auth.service";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"admin" | "worker">("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [farmCode, setFarmCode] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    farmName: "",
    farmLocation: "",
    farmCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFarmCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.toUpperCase();
    setFormData((prev) => ({ ...prev, farmCode: code }));
    if (fieldErrors.farmCode) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.farmCode;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!formData.name) {
      errors.name = "Full name is required";
    }
    if (role === "admin") {
      if (!formData.farmName) errors.farmName = "Farm name is required";
      if (!formData.farmLocation)
        errors.farmLocation = "Farm location is required";
    } else {
      if (!formData.farmCode) {
        errors.farmCode = "Farm code is required";
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setFieldErrors({});
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let response;
      if (role === "admin") {
        response = await authService.registerAdmin({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          farmName: formData.farmName,
          farmLocation: formData.farmLocation,
        });
        setFarmCode(
          response.data?.joinCode ||
            response.data?.farmCode ||
            response.data?.code ||
            null
        );
        setSuccess(true);
        setIsLoading(false);
        return; // Show join code
      } else {
        response = await authService.registerWorker({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          farmCode: formData.farmCode,
        });
        authService.saveAuthData?.(response.data.token, response.data.userId);

        setSuccess(true);
        setIsLoading(false);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500); // Show success msg for 1.5 sec then dashboard
        return;
      }
    } catch (error: any) {
      setIsLoading(false);
      setError(
        error?.response?.data?.error ||
          error?.error ||
          error?.message ||
          "Registration failed"
      );
      if (error?.response?.data?.details) {
        setFieldErrors(error.response.data.details);
      }
    }
  };

  const handleContinue = () => {
    window.location.href = "/dashboard";
  };

  // Only show form and login link when not showing success/join code
  const showForm = !(
    (farmCode && role === "admin") ||
    (success && role === "worker")
  );

  return (
    <div className="flex min-h-screen">
      <AuthPanelLeft mode="register" />

      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#333333] mb-2">
              Create Your Account
            </h2>
            <p className="text-[#666666]">Join FarmHub today</p>
          </div>

          {/* Success message for worker */}
          {success && role === "worker" && (
            <Alert variant="success" className="mb-6">
              <AlertDescription>
                <div className="flex flex-col items-center gap-3">
                  <span className="font-semibold text-lg text-[#333]">
                    Account Created Successfully!
                  </span>
                  <span className="text-sm text-[#666]">
                    Redirecting to dashboard...
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Success message and farm code for admin */}
          {farmCode && role === "admin" && (
            <Alert variant="success" className="mb-6">
              <AlertDescription>
                <div className="flex flex-col items-center gap-3">
                  <span className="font-semibold text-lg text-[#333]">
                    Account Created Successfully!
                  </span>
                  <span className="font-semibold text-lg text-[#333]">
                    Your Farm Join Code:
                  </span>
                  <span className="font-mono text-2xl bg-gray-100 rounded p-2">
                    {farmCode}
                  </span>
                  <span className="text-sm text-[#666]">
                    Share this code with your workers so they can join your
                    farm.
                  </span>
                  <Button className="mt-3" onClick={handleContinue}>
                    Continue to Dashboard
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Error alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Registration Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <RoleSelector selectedRole={role} onRoleChange={setRole} />

              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-[#333333] font-medium">
                  Full Name
                </Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="pl-12 h-14 bg-[#f8f8f8] border-[#e0e0e0] rounded-xl"
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-sm text-[#dc3545] mt-1">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-[#333333] font-medium">
                  Email Address
                </Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="pl-12 h-14 bg-[#f8f8f8] border-[#e0e0e0] rounded-xl"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-sm text-[#dc3545] mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-[#333333] font-medium">
                  Phone Number{" "}
                  <span className="text-[#999999] text-xs font-normal">
                    (optional)
                  </span>
                </Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="pl-12 h-14 bg-[#f8f8f8] border-[#e0e0e0] rounded-xl"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <Label
                  htmlFor="password"
                  className="text-[#333333] font-medium"
                >
                  Password
                </Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="pl-12 pr-12 h-14 bg-[#f8f8f8] border-[#e0e0e0] rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#333333]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-sm text-[#dc3545] mt-1">
                    {fieldErrors.password}
                  </p>
                )}
                <p className="text-xs text-[#999999] mt-1">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-[#333333] font-medium"
                >
                  Confirm Password
                </Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="pl-12 pr-12 h-14 bg-[#f8f8f8] border-[#e0e0e0] rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#333333]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-sm text-[#dc3545] mt-1">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Admin fields */}
              {role === "admin" ? (
                <>
                  <div>
                    <Label
                      htmlFor="farmName"
                      className="text-[#333333] font-medium"
                    >
                      Farm Name
                    </Label>
                    <div className="relative mt-1.5">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                      <Input
                        id="farmName"
                        name="farmName"
                        type="text"
                        value={formData.farmName}
                        onChange={handleChange}
                        placeholder="Enter your farm name"
                        className="pl-12 h-14 bg-[#f8f8f8] border-[#e0e0e0] rounded-xl"
                      />
                    </div>
                    {fieldErrors.farmName && (
                      <p className="text-sm text-[#dc3545] mt-1">
                        {fieldErrors.farmName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="farmLocation"
                      className="text-[#333333] font-medium"
                    >
                      Farm Location
                    </Label>
                    <div className="relative mt-1.5">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                      <Input
                        id="farmLocation"
                        name="farmLocation"
                        type="text"
                        value={formData.farmLocation}
                        onChange={handleChange}
                        placeholder="Enter farm location"
                        className="pl-12 h-14 bg-[#f8f8f8] border-[#e0e0e0] rounded-xl"
                      />
                    </div>
                    {fieldErrors.farmLocation && (
                      <p className="text-sm text-[#dc3545] mt-1">
                        {fieldErrors.farmLocation}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                // Worker fields
                <div>
                  <Label
                    htmlFor="farmCode"
                    className="text-[#333333] font-medium"
                  >
                    Farm Code
                  </Label>
                  <div className="relative mt-1.5">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                    <Input
                      id="farmCode"
                      name="farmCode"
                      type="text"
                      value={formData.farmCode}
                      onChange={handleFarmCodeChange}
                      placeholder="Enter farm code (e.g., FARM-ABC123)"
                      className="pl-12 h-14 bg-[#f8f8f8] border-[#e0e0e0] rounded-xl uppercase"
                      maxLength={11}
                    />
                  </div>
                  {fieldErrors.farmCode && (
                    <p className="text-sm text-[#dc3545] mt-1">
                      {fieldErrors.farmCode}
                    </p>
                  )}
                  <p className="text-xs text-[#999999] mt-1">
                    Get this code from your farm admin
                  </p>
                </div>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-[#5cb85c] hover:bg-[#4ca74c] text-white font-semibold rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          )}

          {/* Log in message only visible when form is visible */}
          {showForm && (
            <div className="mt-6 text-center">
              <p className="text-sm text-[#666666]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#5cb85c] font-semibold hover:text-[#4ca74c]"
                >
                  Log in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

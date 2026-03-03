"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { toast } from "@iamqitmeer/toster";

// UI Components (adjust imports based on your project structure)
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Alert from "../ui/alert/Alert";

// Types
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function AdminSignInForm() {
  // State management
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();

  // Clear error when form data changes
  useEffect(() => {
    if (error) setError("");
  }, [formData.email, formData.password]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.email) {
      toast.error("Email is required");
      return false;
    }

    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  // Handle login submission with toast.promise
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    const loginPromise = async () => {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        remember: formData.rememberMe,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (!result?.ok) {
        throw new Error("Authentication failed");
      }

      return result;
    };

    toast.promise(loginPromise(), {   // ✅ FIX HERE
      loading: "Authenticating... Please wait",
      success: () => {
        setTimeout(() => {
          router.push("/");
        }, 1000);
        return "Welcome back! Redirecting to dashboard...";
      },
      error: (err) => {
        setError(err.message);
        setIsLoading(false);
        return err.message || "Login failed. Please try again.";
      },
    });
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    toast.info("Redirecting to password reset page...");
    setTimeout(() => {
      router.push("/admin/forgot-password");
    }, 1000);
  };

  // Handle SSO login with toast.promise
  const handleSSOLogin = async (provider: "google" | "microsoft") => {
    const ssoPromise = signIn(provider, {
      callbackUrl: "/",
      redirect: false,
    });

    toast.promise(ssoPromise, {
      loading: `Redirecting to ${provider}...`,
      success: () => {
        return "Authentication successful!";
      },
      error: (err) => {
        return `Could not authenticate with ${provider}`;
      },
    });
  };

  // Demo credentials helper
  const fillDemoCredentials = () => {
    setFormData({
      email: "admin@flaticons.com",
      password: "Password@1",
      rememberMe: false,
    });

    toast.success("Demo credentials loaded!");
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full justify-center">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        {/* Header Section */}
        <div>
          <div className="flex justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Secure Administrative Access
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-4 flex justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              🔒 Enterprise Grade Security
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4">
            <Alert
              variant="error"
              title="Authentication Failed"
              message={error}
            />
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <Label htmlFor="email">
                Admin Email <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@company.com"
                  disabled={isLoading}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeCloseIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
                >
                  Forgot password?
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <Button
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </div>
              ) : (
                "Sign in to Admin Panel"
              )}
            </Button>
          </div>

          {/* Demo Credentials Helper */}
          {/* {process.env.NODE_ENV === "development" && ( */}
            <div className="text-center">
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline"
              >
                Use Demo Credentials
              </button>
            </div>
          {/* )} */}
        </form>

        {/* Security Notice */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
            🔐 This is a restricted area. All access attempts are logged and monitored.
            Unauthorized access is prohibited.
          </p>
        </div>

        {/* Test Toast Buttons - Using correct Toster API */}
        {/* {process.env.NODE_ENV === "development" && (
          <div className="mt-4 flex gap-2 justify-center flex-wrap">
            <button
              type="button"
              onClick={() => toast.success("Operation completed successfully!")}
              className="text-xs px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Test Success
            </button>
            <button
              type="button"
              onClick={() => toast.error("Something went wrong")}
              className="text-xs px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Test Error
            </button>
            <button
              type="button"
              onClick={() => toast.info("New message received")}
              className="text-xs px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Test Info
            </button>
            <button
              type="button"
              onClick={() => toast.warning("Your session will expire soon")}
              className="text-xs px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              Test Warning
            </button>
            <button
              type="button"
              onClick={() => {
                const promise = new Promise((resolve) => setTimeout(resolve, 2000));
                toast.promise(promise, {
                  loading: "Loading...",
                  success: "Loaded!",
                  error: "Failed",
                });
              }}
              className="text-xs px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600"
            >
              Test Promise
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
}
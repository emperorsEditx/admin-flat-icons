"use client";
import { useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Alert from "../ui/alert/Alert";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) setError(res.error);
    else router.push("/");
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      {error && <Alert variant="error" title='Login Error' message={error}></Alert>}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-25 flex justify-center">
            <svg width="300" height="50" viewBox="0 0 126 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M62.8442 1.90735e-06H65.57L66.8802 5.92285L68.4396 1.90735e-06H70.5231L72.0824 5.92285L73.3927 1.90735e-06H76.1052L73.6156 9.38204H70.8898L69.4745 4.16684L68.0726 9.38204H65.3339L62.8442 1.90735e-06Z" fill="black" />
              <path d="M77.1404 9.38225V0.000213623H79.6433V3.56445H82.9978V0.000213623H85.4873V9.38225H82.9978V5.8048H79.6433V9.38225H77.1404Z" fill="black" />
              <path d="M86.4829 9.38225L89.9029 0.000213623H92.4709L95.8909 9.38225H93.2442L92.7984 8.05879H89.5752L89.1294 9.38225H86.4827H86.4829ZM90.1255 6.0669H91.9996L91.0693 3.1711L90.1255 6.0669Z" fill="black" />
              <path d="M94.8953 2.24078V0H103.019V2.24078H100.202V9.38204H97.7126V2.24078H94.8953Z" fill="black" />
              <path d="M106.384 9.38225L109.803 0.000213623H112.372L115.792 9.38225H113.145L112.699 8.05879H109.476L109.03 9.38225H106.384ZM110.026 6.0669H111.9L110.97 3.1711L110.026 6.0669Z" fill="black" />
              <path d="M116.774 9.38225V0.000213623H118.989L122.619 5.17621V0.000213623H125.121V9.38225H122.92L119.277 4.20626V9.38225H116.774Z" fill="black" />
              <path d="M62.8442 31.5437V13.5634H67.6407V31.5437H62.8442Z" fill="black" />
              <path d="M79.0661 31.8452C77.3589 31.8452 75.8268 31.4647 74.471 30.7027C73.1147 29.9411 72.0478 28.8653 71.2692 27.4758C70.4906 26.0865 70.1011 24.4457 70.1011 22.5535C70.1011 20.6614 70.4906 19.0213 71.2692 17.6318C72.0478 16.2425 73.1147 15.1666 74.471 14.4048C75.8268 13.6431 77.3589 13.2621 79.0661 13.2621C81.4433 13.2621 83.3685 13.8566 84.842 15.0454C86.315 16.2341 87.2362 17.8578 87.6041 19.9173L84.2749 20.4114C83.3632 20.5467 82.501 20.0984 81.9741 19.342C81.7812 19.0652 81.5485 18.8299 81.2762 18.6364C80.6397 18.1843 79.9033 17.958 79.0661 17.958C77.8776 17.958 76.9193 18.385 76.1908 19.2386C75.4629 20.0929 75.0989 21.1979 75.0989 22.5535C75.0989 23.9092 75.4629 25.0144 76.1908 25.8685C76.9193 26.7221 77.8776 27.1491 79.0661 27.1491C79.9204 27.1491 80.6694 26.9062 81.3137 26.4206C81.6244 26.1866 81.8835 25.8885 82.0913 25.526C82.5585 24.7104 83.4501 24.2328 84.3845 24.3377L87.7301 24.7129C87.3616 26.9735 86.3947 28.7274 84.8296 29.9739C83.2639 31.2218 81.3429 31.845 79.0663 31.845L79.0661 31.8452Z" fill="black" />
              <path d="M97.6489 31.8452C95.9417 31.8452 94.4096 31.4647 93.0537 30.7027C91.6975 29.9411 90.6305 28.8653 89.8519 27.4758C89.0733 26.0865 88.6838 24.4457 88.6838 22.5535C88.6838 20.6614 89.0733 19.0213 89.8519 17.6318C90.6305 16.2425 91.6975 15.1666 93.0537 14.4048C94.4096 13.6431 95.9417 13.2621 97.6489 13.2621C99.3731 13.2621 100.914 13.6431 102.27 14.4048C103.625 15.1666 104.697 16.2422 105.484 17.6318C106.27 19.0215 106.664 20.6622 106.664 22.5535C106.664 24.4449 106.27 26.0865 105.484 27.4758C104.697 28.8651 103.625 29.9411 102.27 30.7027C100.914 31.4647 99.3731 31.8452 97.6489 31.8452ZM97.6489 27.1493C98.8545 27.1493 99.8212 26.7223 100.549 25.8687C101.278 25.0144 101.642 23.9094 101.642 22.5538C101.642 21.1981 101.278 20.0929 100.549 19.2388C99.8215 18.3852 98.8547 17.9582 97.6489 17.9582C96.4603 17.9582 95.5021 18.3852 94.7735 19.2388C94.0456 20.0931 93.6817 21.1981 93.6817 22.5538C93.6817 23.9094 94.0456 25.0147 94.7735 25.8687C95.5021 26.7223 96.4603 27.1493 97.6489 27.1493Z" fill="black" />
              <path d="M109.125 31.5437V13.5634H113.369L120.326 23.4828V13.5634H125.121V31.5437H120.903L113.922 21.6243V31.5437H109.125Z" fill="black" />
              <path d="M42.501 1.90735e-06L28.0403 25.0468L32.7408 32.8964H41.6362L56.0969 7.84954L51.3964 1.90735e-06H42.501Z" fill="#00A654" />
              <path d="M13.5959 3.8147e-06L28.0566 25.0468L23.3561 32.8964H14.4607L0 7.84954L4.70051 3.8147e-06H13.5959Z" fill="#00A654" />
              <path d="M18.4861 8.4701L23.1866 1.90735e-06H32.6677L37.3687 8.88946L28.0566 25.0468L18.4861 8.4701Z" fill="#00A654" />
              <path d="M49.5215 13.287L52.1157 8.79361L49.2277 3.97063H43.7622L41.3677 8.11781L49.5215 13.287Z" fill="white" />
              <path d="M39.8607 10.728L32.168 24.0521L35.0561 28.8751H40.5217L48.0145 15.8972L39.8607 10.728Z" fill="white" />
            </svg>
          </div>
          <div>
            <p className="text-xl my-7 text-gray-500 dark:text-gray-400">
              Sign in to your newicon account!
            </p>
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              <button onClick={() => signIn("google", { callbackUrl: "/" })} className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                    fill="#EB4335"
                  />
                </svg>
                Sign in with Google
              </button>
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <svg
                  width="21"
                  className="fill-current"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15.6705 1.875H18.4272L12.4047 8.75833L19.4897 18.125H13.9422L9.59717 12.4442L4.62554 18.125H1.86721L8.30887 10.7625L1.51221 1.875H7.20054L11.128 7.0675L15.6705 1.875ZM14.703 16.475H16.2305L6.37054 3.43833H4.73137L14.703 16.475Z" />
                </svg>
                Sign in with X
              </button>
            </div>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

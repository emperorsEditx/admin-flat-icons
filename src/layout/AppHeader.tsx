"use client";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
// import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const pathname = usePathname();
  const API_URL = process.env.NEXT_PUBLIC_NEST_API_URL || "https://cloudflare-workers-openapi-production.up.railway.app";
  const [stats, setStats] = useState({ draft: 0, underReview: 0, approved: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}icons/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch global stats", err);
      }
    };
    fetchStats();

    window.addEventListener("iconsUpdated", fetchStats);
    return () => window.removeEventListener("iconsUpdated", fetchStats);
  }, [API_URL]);

  const isMyIconsRoute = pathname === "/upload" || pathname === "/all" || pathname === "/draft" || pathname === "/under-review";
  const tabs = [
    { name: "All", path: "/all", count: stats.draft + stats.underReview + stats.approved },
    { name: "Upload", path: "/upload" },
    { name: "Draft", path: "/draft", count: stats.draft },
    { name: "Under Review", path: "/under-review", count: stats.underReview },
  ];

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>

          <Link href="/" className="lg:hidden">
            <svg className="dark:hidden" width="126" height="33" viewBox="0 0 126 33" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <svg className="hidden dark:block" width="126" height="33" viewBox="0 0 126 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M62.8442 1.90735e-06H65.57L66.8802 5.92285L68.4396 1.90735e-06H70.5231L72.0824 5.92285L73.3927 1.90735e-06H76.1052L73.6156 9.38204H70.8898L69.4745 4.16684L68.0726 9.38204H65.3339L62.8442 1.90735e-06Z" fill="white" />
              <path d="M77.1404 9.38225V0.000213623H79.6433V3.56445H82.9978V0.000213623H85.4873V9.38225H82.9978V5.8048H79.6433V9.38225H77.1404Z" fill="white" />
              <path d="M86.4829 9.38225L89.9029 0.000213623H92.4709L95.8909 9.38225H93.2442L92.7984 8.05879H89.5752L89.1294 9.38225H86.4827H86.4829ZM90.1255 6.0669H91.9996L91.0693 3.1711L90.1255 6.0669Z" fill="white" />
              <path d="M94.8953 2.24078V0H103.019V2.24078H100.202V9.38204H97.7126V2.24078H94.8953Z" fill="white" />
              <path d="M106.384 9.38225L109.803 0.000213623H112.372L115.792 9.38225H113.145L112.699 8.05879H109.476L109.03 9.38225H106.384ZM110.026 6.0669H111.9L110.97 3.1711L110.026 6.0669Z" fill="white" />
              <path d="M116.774 9.38225V0.000213623H118.989L122.619 5.17621V0.000213623H125.121V9.38225H122.92L119.277 4.20626V9.38225H116.774Z" fill="white" />
              <path d="M62.8442 31.5437V13.5634H67.6407V31.5437H62.8442Z" fill="white" />
              <path d="M79.0661 31.8452C77.3589 31.8452 75.8268 31.4647 74.471 30.7027C73.1147 29.9411 72.0478 28.8653 71.2692 27.4758C70.4906 26.0865 70.1011 24.4457 70.1011 22.5535C70.1011 20.6614 70.4906 19.0213 71.2692 17.6318C72.0478 16.2425 73.1147 15.1666 74.471 14.4048C75.8268 13.6431 77.3589 13.2621 79.0661 13.2621C81.4433 13.2621 83.3685 13.8566 84.842 15.0454C86.315 16.2341 87.2362 17.8578 87.6041 19.9173L84.2749 20.4114C83.3632 20.5467 82.501 20.0984 81.9741 19.342C81.7812 19.0652 81.5485 18.8299 81.2762 18.6364C80.6397 18.1843 79.9033 17.958 79.0661 17.958C77.8776 17.958 76.9193 18.385 76.1908 19.2386C75.4629 20.0929 75.0989 21.1979 75.0989 22.5535C75.0989 23.9092 75.4629 25.0144 76.1908 25.8685C76.9193 26.7221 77.8776 27.1491 79.0661 27.1491C79.9204 27.1491 80.6694 26.9062 81.3137 26.4206C81.6244 26.1866 81.8835 25.8885 82.0913 25.526C82.5585 24.7104 83.4501 24.2328 84.3845 24.3377L87.7301 24.7129C87.3616 26.9735 86.3947 28.7274 84.8296 29.9739C83.2639 31.2218 81.3429 31.845 79.0663 31.845L79.0661 31.8452Z" fill="white" />
              <path d="M97.6489 31.8452C95.9417 31.8452 94.4096 31.4647 93.0537 30.7027C91.6975 29.9411 90.6305 28.8653 89.8519 27.4758C89.0733 26.0865 88.6838 24.4457 88.6838 22.5535C88.6838 20.6614 89.0733 19.0213 89.8519 17.6318C90.6305 16.2425 91.6975 15.1666 93.0537 14.4048C94.4096 13.6431 95.9417 13.2621 97.6489 13.2621C99.3731 13.2621 100.914 13.6431 102.27 14.4048C103.625 15.1666 104.697 16.2422 105.484 17.6318C106.27 19.0215 106.664 20.6622 106.664 22.5535C106.664 24.4449 106.27 26.0865 105.484 27.4758C104.697 28.8651 103.625 29.9411 102.27 30.7027C100.914 31.4647 99.3731 31.8452 97.6489 31.8452ZM97.6489 27.1493C98.8545 27.1493 99.8212 26.7223 100.549 25.8687C101.278 25.0144 101.642 23.9094 101.642 22.5538C101.642 21.1981 101.278 20.0929 100.549 19.2388C99.8215 18.3852 98.8547 17.9582 97.6489 17.9582C96.4603 17.9582 95.5021 18.3852 94.7735 19.2388C94.0456 20.0931 93.6817 21.1981 93.6817 22.5538C93.6817 23.9094 94.0456 25.0147 94.7735 25.8687C95.5021 26.7223 96.4603 27.1493 97.6489 27.1493Z" fill="white" />
              <path d="M109.125 31.5437V13.5634H113.369L120.326 23.4828V13.5634H125.121V31.5437H120.903L113.922 21.6243V31.5437H109.125Z" fill="white" />
              <path d="M42.501 1.90735e-06L28.0403 25.0468L32.7408 32.8964H41.6362L56.0969 7.84954L51.3964 1.90735e-06H42.501Z" fill="#00A654" />
              <path d="M13.5959 3.8147e-06L28.0566 25.0468L23.3561 32.8964H14.4607L0 7.84954L4.70051 3.8147e-06H13.5959Z" fill="#00A654" />
              <path d="M18.4861 8.4701L23.1866 1.90735e-06H32.6677L37.3687 8.88946L28.0566 25.0468L18.4861 8.4701Z" fill="#00A654" />
              <path d="M49.5215 13.287L52.1157 8.79361L49.2277 3.97063H43.7622L41.3677 8.11781L49.5215 13.287Z" fill="white" />
              <path d="M39.8607 10.728L32.168 24.0521L35.0561 28.8751H40.5217L48.0145 15.8972L39.8607 10.728Z" fill="white" />
            </svg>
          </Link>

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {isMyIconsRoute && (
            <div className="hidden lg:flex items-center gap-2 -mb-10">
              {tabs.map((tab) => {
                const isActive = pathname === tab.path;
                return (
                  <Link
                    key={tab.path}
                    href={tab.path}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 ${isActive
                      ? "text-[#2CB88B] border-b-2 border-[#2CB88B]"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                      }`}
                  >
                    {tab.name}
                    {tab.count !== undefined && tab.count > 0 && (
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${isActive
                          ? "bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300"
                          : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        <div
          className={`${isApplicationMenuOpen ? "flex" : "hidden"
            } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            {/* <!-- Dark Mode Toggler --> */}
            <ThemeToggleButton />
            {/* <!-- Dark Mode Toggler --> */}

            <NotificationDropdown />
            {/* <!-- Notification Menu Area --> */}
          </div>
          {/* <!-- User Area --> */}
          <UserDropdown />

        </div>
      </div>
    </header>
  );
};

export default AppHeader;

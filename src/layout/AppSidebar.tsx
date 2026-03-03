"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
// import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  UserCircleIcon,
} from "../icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; count?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
    // subItems: [{ name: "Ecommerce", path: "/", count: false }],
  },
  {
    icon: <CalenderIcon />,
    name: "My Icons",
    path: "/calendar",
    subItems: [
      { name: "Upload", path: "/upload", count: true },
      { name: "Draft", path: "/draft", count: true },
      { name: "Under Review", path: "/under-review", count: true },
      { name: "Not Approved", path: "/calendar", count: true },
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: "Store Profile",
    path: "/profile",
  },

  {
    name: "Stats",
    icon: <ListIcon />,
    path: '/form-elements',
  },
  // {
  //   name: "Invoices",
  //   icon: <TableIcon />,
  //   path: "/basic-tables",
  // },
  // {
  //   name: "Contact",
  //   icon: <PageIcon />,
  //   subItems: [
  //     { name: "Blank Page", path: "/blank", count: false },
  //     { name: "404 Error", path: "/error-404", count: false },
  //   ],
  // },
  {
    name: "Settings",
    icon: <PageIcon />,
    subItems: [
      { name: "Categories", path: "/settings/categories", count: false },
      { name: "Sub Categories", path: "/settings/sub-categories", count: false },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", count: false },
      { name: "Bar Chart", path: "/bar-chart", count: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", count: false },
      { name: "Avatar", path: "/avatars", count: false },
      { name: "Badge", path: "/badge", count: false },
      { name: "Buttons", path: "/buttons", count: false },
      { name: "Images", path: "/images", count: false },
      { name: "Videos", path: "/videos", count: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", count: false },
      { name: "Sign Up", path: "/signup", count: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const API_URL = process.env.NEXT_PUBLIC_NEST_API_URL || "https://api-flat-icons.vercel.app/";

  const [stats, setStats] = useState({ draft: 0, underReview: 0, approved: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/icons/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch global stats", err);
      }
    };
    fetchStats();
  }, [API_URL]);

  const getCountForMenu = (name: string) => {
    switch (name) {
      case "Draft":
        return stats.draft;
      case "Under Review":
        return stats.underReview;
      case "Not Approved": // or "Approved" depending on your menu
        return stats.approved;
      default:
        return 0;
    }
  };

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${openSubmenu?.type === menuType && openSubmenu?.index === index && !nav.subItems?.some(subItem => isActive(subItem.path))
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={` ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.count && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            {getCountForMenu(subItem.name)}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 pl-5 left-0 bg-[#1B252E] border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50
        ${isExpanded || isMobileOpen
          ? "w-50"
          : isHovered
            ? "w-50"
            : "w-22.5"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <svg width="226" height="40" viewBox="0 0 200 33" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            </>
          ) : (
            <svg width="80" height="50" viewBox="20 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.501 1.90735e-06L28.0403 25.0468L32.7408 32.8964H41.6362L56.0969 7.84954L51.3964 1.90735e-06H42.501Z" fill="#00A654" />
              <path d="M13.5959 3.8147e-06L28.0566 25.0468L23.3561 32.8964H14.4607L0 7.84954L4.70051 3.8147e-06H13.5959Z" fill="#00A654" />
              <path d="M18.4861 8.4701L23.1866 1.90735e-06H32.6677L37.3687 8.88946L28.0566 25.0468L18.4861 8.4701Z" fill="#00A654" />
              <path d="M49.5215 13.287L52.1157 8.79361L49.2277 3.97063H43.7622L41.3677 8.11781L49.5215 13.287Z" fill="white" />
              <path d="M39.8607 10.728L32.168 24.0521L35.0561 28.8751H40.5217L48.0145 15.8972L39.8607 10.728Z" fill="white" />
            </svg>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            {/* <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div> */}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;

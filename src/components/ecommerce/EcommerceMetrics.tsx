"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const EcommerceMetrics = () => {
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
        console.error("Failed to fetch global stats for dashboard", err);
      }
    };
    fetchStats();
  }, [API_URL]);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <Link href="/draft">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
          <div className="flex items-center justify-start gap-0">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl">
              <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.75551 20.6111H15.534C17.052 20.6111 18.2876 19.3763 18.2876 17.8575V16.8249H19.1838C20.7018 16.8249 21.9374 15.5902 21.9374 14.0713L21.9355 4.63856C21.9355 3.12062 20.7008 1.885 19.1819 1.885H13.0548L12.0003 0.617836C11.6761 0.226904 11.1946 0 10.6874 0H6.40339C4.88545 0 3.64983 1.23474 3.64983 2.75356V5.67017H2.75356C1.23562 5.67017 0 6.90491 0 8.42373V17.8602C0 19.3781 1.23474 20.6137 2.75356 20.6137L2.75551 20.6111ZM5.35945 2.75358C5.35945 2.17768 5.82856 1.70859 6.40444 1.70859H10.6884L12.2559 3.59266H19.1859C19.4032 3.59266 19.6035 3.65845 19.7694 3.77096C19.9353 3.88347 20.0697 4.04175 20.1479 4.22958C20.2013 4.35448 20.2309 4.49083 20.2309 4.63481V14.0713C20.2309 14.4326 20.0478 14.7501 19.7694 14.938C19.6035 15.0505 19.4004 15.1163 19.1859 15.1163L6.40467 15.1172C5.82877 15.1172 5.35968 14.6481 5.35968 14.0722L5.35945 2.75358ZM1.71057 8.42375C1.71057 7.84785 2.17969 7.37876 2.75556 7.37876H3.65183V14.0722C3.65183 15.5901 4.88658 16.8257 6.40539 16.8257H16.579V17.8583C16.579 18.4342 16.1099 18.9033 15.534 18.9033L2.75549 18.9024C2.17959 18.9024 1.7105 18.4332 1.7105 17.8574V8.42092L1.71057 8.42375Z" fill="#00A654" />
              </svg>
            </div>
            <h2 className="text-title-sm dark:text-white/90">Drafts</h2>
          </div>
          <div className="flex items-end justify-between mt-5">
            <p className="mt-2 text-gray-800 font-light text-title-sm dark:text-white/90">
              Total Icons
            </p>
            <p className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {stats.draft}
            </p>
          </div>
          <hr className="my-3 border-gray-100 dark:border-gray-800" />
          <div className="flex items-end justify-between mt-0">
            <p className="text-gray-500 font-light text-sm dark:text-gray-400">
              Awaiting Submission
            </p>
            <p className="font-medium text-gray-500 text-sm dark:text-gray-400">
              -
            </p>
          </div>
        </div>
      </Link>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <Link href="/under-review">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
          <div className="flex items-center justify-start gap-0">
            <div className="flex items-center justify-center w-12 h-12">
              <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M15.3693 12.1998C15.8254 11.7437 16.5649 11.7437 17.021 12.1998C17.4772 12.6559 17.4772 13.3954 17.021 13.8515L13.6654 17.2072C12.1196 18.753 9.60311 18.753 8.05735 17.2072L4.70169 13.8515C4.24559 13.3954 4.24559 12.6559 4.70169 12.1998C5.1578 11.7437 5.89731 11.7437 6.35341 12.1998L9.6933 15.5397V1.16806C9.6933 0.522963 10.2163 0 10.8614 0C11.5065 0 12.0294 0.522963 12.0294 1.16806V15.5397L15.3693 12.1998ZM19.3866 16.5189V21.0462C19.3866 21.227 19.2365 21.3771 19.0557 21.3771H2.66702C2.48625 21.3771 2.33614 21.227 2.33614 21.0462V16.5189C2.33614 15.8738 1.81317 15.3508 1.16808 15.3508C0.522959 15.3508 0 15.8738 0 16.5189V21.0462C0 22.5167 1.19659 23.7133 2.66702 23.7133H19.0557C20.5261 23.7133 21.7227 22.5167 21.7227 21.0462V16.5189C21.7227 15.8738 21.1998 15.3508 20.5547 15.3508C19.9096 15.3508 19.3866 15.8738 19.3866 16.5189Z" fill="#00A654" />
              </svg>
            </div>
            <h2 className="text-title-sm dark:text-white/90">Under Review</h2>
          </div>
          <div className="flex items-end justify-between mt-5">
            <p className="mt-2 text-gray-800 font-light text-title-sm dark:text-white/90">
              Total Icons
            </p>
            <p className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {stats.underReview}
            </p>
          </div>
          <hr className="my-3 border-gray-100 dark:border-gray-800" />
          <div className="flex items-end justify-between mt-0">
            <p className="text-gray-500 font-light text-sm dark:text-gray-400">
              Pending Approval
            </p>
            <p className="font-medium text-gray-500 text-sm dark:text-gray-400">
              -
            </p>
          </div>
        </div>
      </Link>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
        <div className="flex items-center justify-start gap-3">
          {/* <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div> */}
          <h2 className="text-title-sm dark:text-white/90">Approved</h2>
        </div>
        <div className="flex items-end justify-between mt-5">
          <p className="mt-2 text-gray-800 font-light text-title-sm dark:text-white/90">
            Total Icons
          </p>
          <p className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {stats.approved}
          </p>
        </div>
        <hr className="my-3 border-gray-100 dark:border-gray-800" />
        <div className="flex items-end justify-between mt-0">
          <p className="text-gray-500 font-light text-sm dark:text-gray-400">
            Active on Platform
          </p>
          <p className="font-medium text-gray-500 text-sm dark:text-gray-400">
            -
          </p>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};

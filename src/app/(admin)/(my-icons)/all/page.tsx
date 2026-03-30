"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useSession } from "next-auth/react";

interface IconItem {
  id: number;
  title: string;
  path: string;
  status: string;
  created_at?: string;
  created_by?: number;
  userName?: string;
}

interface PendingGroup {
  userId: number;
  userName?: string;
  icons: IconItem[];
}

const statusStyles: Record<string, string> = {
  DRAFT: "bg-yellow-100 text-yellow-800",
  PENDING: "bg-orange-100 text-orange-800",
  ACTIVE: "bg-green-100 text-green-800",
};

export default function AllIconsPage() {
  const { data: session, status } = useSession();
  const [icons, setIcons] = useState<IconItem[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_NEST_API_URL || "https://cloudflare-workers-openapi-production.up.railway.app";

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [draftRes, pendingRes, approvedRes] = await Promise.all([
          fetch(`${API_URL}icons/drafts/${session.user.id}`),
          fetch(`${API_URL}icons/pending`),
          fetch(`${API_URL}icons/approved`),
        ]);

        const drafts: IconItem[] = draftRes.ok ? await draftRes.json() : [];
        const pendingGroups: PendingGroup[] = pendingRes.ok ? await pendingRes.json() : [];
        const approved: IconItem[] = approvedRes.ok ? await approvedRes.json() : [];

        const pendingIcons: IconItem[] = pendingGroups.flatMap((grp) =>
          grp.icons.map((icon) => ({
            ...icon,
            status: "PENDING",
            userName: grp.userName || `User ${grp.userId}`,
          }))
        );

        const allIcons: IconItem[] = [
          ...drafts.map((icon) => ({ ...icon, status: "DRAFT", userName: "Me" })),
          ...pendingIcons,
          ...approved.map((icon) => ({
            ...icon,
            status: "ACTIVE",
            userName: icon.created_by ? String(icon.created_by) : "Unknown",
          })),
        ];

        const sorted = allIcons.sort((a, b) => {
          const da = a.created_at ? new Date(a.created_at).getTime() : 0;
          const db = b.created_at ? new Date(b.created_at).getTime() : 0;
          return db - da;
        });

        setIcons(sorted);
      } catch (error) {
        console.error("Failed to load all icons", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL, session, status]);

  if (status === "loading") return <div className="p-10">Loading session...</div>;
  if (!session) return <div className="p-10">Please sign in to view icons.</div>;

  return (
    <div>
      <PageBreadcrumb pageTitle={`All Icons (${icons.length})`} />
      <div className="min-h-screen px-5 py-7 xl:px-10 xl:py-12">
        {loading && <div>Loading all icons...</div>}

        {!loading && icons.length === 0 && (
          <div className="text-center text-gray-500 py-10">No icons found yet.</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {!loading && icons.map((icon) => (
            <div key={`${icon.id}-${icon.status}`} className="group relative aspect-square bg-gray-50 dark:bg-gray-900 rounded-lg p-2 flex flex-col border border-gray-100 dark:border-gray-800 hover:border-brand-200 dark:hover:border-brand-800 transition-all">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">{icon.userName || "Unknown"}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${statusStyles[icon.status] || "bg-gray-200 text-gray-800"}`}>
                  {icon.status}
                </span>
              </div>

              <div className="flex-1 w-full flex items-center justify-center mt-1 mb-2">
                <img
                  src={`https://pub-e598b9aaee344c728dd117b85cd19c87.r2.dev/${icon.path}`}
                  alt={icon.title}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>

              <div className="text-xs text-left text-gray-600 dark:text-gray-300 truncate" title={icon.title}>
                {icon.title || `Icon #${icon.id}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState, useMemo } from "react";
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

const statusStyles: Record<string, { card: string; badge: string; header: string }> = {
  DRAFT: {
    card: "border-yellow-200 dark:border-yellow-900/40 hover:border-yellow-400 dark:hover:border-yellow-700",
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
    header: "text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/40",
  },
  PENDING: {
    card: "border-orange-200 dark:border-orange-900/40 hover:border-orange-400 dark:hover:border-orange-700",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
    header: "text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900/40",
  },
  ACTIVE: {
    card: "border-green-200 dark:border-green-900/40 hover:border-green-400 dark:hover:border-green-700",
    badge: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
    header: "text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/40",
  },
};

const statusConfig = [
  { key: "DRAFT", label: "Draft", description: "Your work in progress" },
  { key: "PENDING", label: "Pending Review", description: "Awaiting moderator approval" },
  { key: "ACTIVE", label: "Published", description: "Live and available" },
];

function IconCard({ icon }: { icon: IconItem }) {
  const styles = statusStyles[icon.status] || statusStyles.DRAFT;

  return (
    <div
      className={`group relative aspect-square bg-gray-50 dark:bg-gray-900 rounded-lg p-2 flex flex-col border transition-all ${styles.card}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 flex-1 truncate">
          {icon.userName || "Unknown"}
        </span>
        <span className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${styles.badge}`}>
          {icon.status}
        </span>
      </div>

      <div className="flex-1 w-full flex items-center justify-center">
        <img
          src={`https://pub-e598b9aaee344c728dd117b85cd19c87.r2.dev/${icon.path}`}
          alt={icon.title}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      <div className="text-xs text-left text-gray-600 dark:text-gray-300 truncate mt-2" title={icon.title}>
        {icon.title || `Icon #${icon.id}`}
      </div>
    </div>
  );
}

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

  // Group icons by status
  const groupedIcons = useMemo(() => {
    const groups: Record<string, IconItem[]> = {
      DRAFT: [],
      PENDING: [],
      ACTIVE: [],
    };

    icons.forEach((icon) => {
      const status = icon.status as keyof typeof groups;
      if (status in groups) {
        groups[status].push(icon);
      }
    });

    return groups;
  }, [icons]);

  const totalIcons = icons.length;

  if (status === "loading") return <div className="p-10">Loading session...</div>;
  if (!session) return <div className="p-10">Please sign in to view icons.</div>;

  return (
    <div>
      <PageBreadcrumb pageTitle={`All Icons (${totalIcons})`} />
      <div className="min-h-screen px-5 py-7 xl:px-10 xl:py-12">
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading all icons...</p>
          </div>
        )}

        {!loading && totalIcons === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">No icons found yet.</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Start by creating or uploading some icons.</p>
          </div>
        )}

        {!loading && totalIcons > 0 && (
          <div className="space-y-12">
            {statusConfig.map(({ key, label, description }) => {
              const sectionIcons = groupedIcons[key as keyof typeof groupedIcons] || [];
              const styles = statusStyles[key] || statusStyles.DRAFT;

              return (
                <section key={key}>
                  {/* Section Header */}
                  <div
                    className={`pb-4 mb-6 border-b-2 flex items-start justify-between ${styles.header}`}
                  >
                    <div>
                      <h2 className="text-2xl font-bold">{label}</h2>
                      <p className="text-sm opacity-75 mt-1">{description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-4 py-2 rounded-full font-semibold text-lg ${styles.badge}`}>
                        {sectionIcons.length}
                      </span>
                    </div>
                  </div>

                  {/* Empty State */}
                  {sectionIcons.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400">
                        {key === "DRAFT" && "No draft icons yet. Start creating!"}
                        {key === "PENDING" && "No icons pending review."}
                        {key === "ACTIVE" && "No published icons yet."}
                      </p>
                    </div>
                  )}

                  {/* Icons Grid */}
                  {sectionIcons.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                      {sectionIcons.map((icon) => (
                        <IconCard key={`${icon.id}-${icon.status}`} icon={icon} />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import { useSession } from "next-auth/react";
import Image from "next/image";

interface Icon {
    id: number;
    title: string;
    path: string;
    status: string;
    created_at: string;
}

interface PendingGroup {
    userId: number;
    icons: Icon[];
}

export default function UnderReviewPage() {
    // const { data: session } = useSession();
    const [groups, setGroups] = useState<PendingGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const API_URL = process.env.NEXT_PUBLIC_NEST_API_URL || "https://api-flat-icons.vercel.app/";

    const fetchPending = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/icons/pending`);
            if (res.ok) {
                const data = await res.json();
                setGroups(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = async (userId: number, iconIds: number[]) => {
        if (!confirm(`Approve ${iconIds.length} icons for this user?`)) return;

        try {
            const res = await fetch(`${API_URL}/icons/approve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: iconIds }),
            });

            if (res.ok) {
                alert("Icons approved successfully");
                // Refresh list
                fetchPending();
            } else {
                alert("Failed to approve icons");
            }
        } catch (error) {
            console.error(error);
            alert("Error approving icons");
        }
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Under Review" />

            <div className="min-h-screen px-5 py-7 xl:px-10 xl:py-12">
                {loading && <div>Loading pending icons...</div>}

                {!loading && groups.length === 0 && (
                    <div className="text-center text-gray-500 py-10">
                        No icons under review.
                    </div>
                )}

                <div className="space-y-8">
                    {groups.map((group) => (
                        <div key={group.userId} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                        User ID: {group.userId}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Submitted {group.icons.length} icons • {new Date(group.icons[0].created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
                                        Reject All
                                    </button>
                                    <button
                                        onClick={() => handleApprove(group.userId, group.icons.map(i => i.id))}
                                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Approve All
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                                {group.icons.map((icon) => (
                                    <div key={icon.id} className="group relative aspect-square bg-gray-50 dark:bg-gray-900 rounded-lg p-4 flex items-center justify-center border border-gray-100 dark:border-gray-800 hover:border-brand-200 dark:hover:border-brand-800 transition-colors">
                                        <Image
                                            src={`https://pub-e598b9aaee344c728dd117b85cd19c87.r2.dev/${icon.path}`}
                                            alt={icon.title}
                                            className="w-full h-full object-contain"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                            <span className="text-white text-xs font-medium px-2 py-1 bg-black/50 rounded backdrop-blur-sm">
                                                {icon.title}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

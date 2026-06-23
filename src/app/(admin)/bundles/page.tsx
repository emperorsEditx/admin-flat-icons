"use client";

import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { toast } from "@iamqitmeer/toster";
import Image from "next/image";
import { proxyApiUrl } from "@/lib/api";

interface Bundle {
  id: number;
  title: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  thumbnail?: string;
  category_id?: number;
  is_paid: boolean;
  price: number;
  status: "ACTIVE" | "INACTIVE";
  iconBundles?: Array<{ icon_id: number }>;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

export default function BundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    category_id: "",
    is_paid: false,
    price: 0,
    status: "ACTIVE" as const,
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  /* FETCH BUNDLES & CATEGORIES */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bundlesRes, catsRes] = await Promise.all([
          fetch(proxyApiUrl("bundles")),
          fetch(proxyApiUrl("categories")),
        ]);

        const bundlesData = await bundlesRes.json();
        const catsData = await catsRes.json();

        setBundles(bundlesData || []);
        setCategories(catsData || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load bundles");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* HANDLE THUMBNAIL UPLOAD */
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /* CREATE BUNDLE */
  const handleCreateBundle = async () => {
    if (!formData.title.trim()) {
      toast.error("Bundle title is required");
      return;
    }

    setIsCreating(true);
    try {
      // Create bundle
      const bundleRes = await fetch(proxyApiUrl("bundles"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          category_id: formData.category_id ? Number(formData.category_id) : undefined,
          is_paid: formData.is_paid,
          price: formData.price,
          status: formData.status,
        }),
      });

      if (!bundleRes.ok) throw new Error("Failed to create bundle");
      const newBundle = await bundleRes.json();

      // Upload thumbnail if provided
      if (thumbnail) {
        const formDataWithFile = new FormData();
        formDataWithFile.append("file", thumbnail);

        const thumbRes = await fetch(
          proxyApiUrl(`bundles/${newBundle.id}/thumbnail`),
          {
            method: "POST",
            body: formDataWithFile,
          }
        );

        if (!thumbRes.ok) {
          console.warn("Thumbnail upload failed, but bundle was created");
        }
      }

      // Reset form and refresh
      setBundles([newBundle, ...bundles]);
      setFormData({
        title: "",
        description: "",
        metaTitle: "",
        metaDescription: "",
        category_id: "",
        is_paid: false,
        price: 0,
        status: "ACTIVE",
      });
      setThumbnail(null);
      setThumbnailPreview("");
      toast.success("Bundle created successfully!");
    } catch (error) {
      console.error("Error creating bundle:", error);
      toast.error("Failed to create bundle");
    } finally {
      setIsCreating(false);
    }
  };

  /* DELETE BUNDLE */
  const handleDeleteBundle = async (id: number) => {
    if (!confirm("Are you sure you want to delete this bundle?")) return;

    try {
      const res = await fetch(proxyApiUrl(`bundles/${id}`), {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete bundle");

      setBundles(bundles.filter((b) => b.id !== id));
      toast.success("Bundle deleted successfully!");
    } catch (error) {
      console.error("Error deleting bundle:", error);
      toast.error("Failed to delete bundle");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageBreadcrumb title="Bundles" description="Manage icon bundles" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CREATE BUNDLE FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-lg font-semibold mb-6 text-gray-800 dark:text-white">
              Create New Bundle
            </h2>

            <div className="space-y-4">
              {/* TITLE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Bundle title"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Bundle description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              {/* META TITLE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta Title (SEO)
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="Meta title for search engines"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* META DESCRIPTION */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta Description (SEO)
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="Meta description for search engines"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRICING */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <input
                      type="checkbox"
                      checked={formData.is_paid}
                      onChange={(e) => setFormData({ ...formData, is_paid: e.target.checked })}
                      className="mr-2 accent-green-600"
                    />
                    Paid Bundle
                  </label>
                </div>
                {formData.is_paid && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: Number(e.target.value) || 0 })
                      }
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                )}
              </div>

              {/* STATUS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              {/* THUMBNAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thumbnail Image
                </label>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 text-center cursor-pointer hover:border-green-500 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {thumbnailPreview ? (
                    <div className="relative w-full h-32">
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="py-4">
                      <svg
                        className="mx-auto h-8 w-8 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-14-12l6.83 6.83a4 4 0 005.66 0L44 12"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Click to upload thumbnail
                      </p>
                    </div>
                  )}
                </div>
                {thumbnail && (
                  <button
                    onClick={() => {
                      setThumbnail(null);
                      setThumbnailPreview("");
                    }}
                    className="text-xs text-red-600 mt-2 hover:text-red-700"
                  >
                    Remove thumbnail
                  </button>
                )}
              </div>

              {/* CREATE BUTTON */}
              <button
                onClick={handleCreateBundle}
                disabled={isCreating}
                className="w-full bg-green-600 text-white font-medium py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
              >
                {isCreating ? "Creating..." : "Create Bundle"}
              </button>
            </div>
          </div>
        </div>

        {/* BUNDLES LIST */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                All Bundles ({bundles.length})
              </h2>
            </div>

            {bundles.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">No bundles created yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {bundles.map((bundle) => (
                  <div
                    key={bundle.id}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <div className="flex gap-4">
                      {/* THUMBNAIL */}
                      {bundle.thumbnail && (
                        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                          <Image
                            src={`https://your-bucket.r2.cloudflarestorage.com/${bundle.thumbnail}`}
                            alt={bundle.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* CONTENT */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {bundle.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {bundle.description || "No description"}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                            {bundle.iconBundles?.length || 0} icons
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              bundle.status === "ACTIVE"
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {bundle.status}
                          </span>
                          {bundle.is_paid && (
                            <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded">
                              ${bundle.price}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex-shrink-0 flex gap-2">
                        <button
                          onClick={() => handleDeleteBundle(bundle.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

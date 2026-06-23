"use client";

import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { toast } from "@iamqitmeer/toster";
import { proxyApiUrl } from "@/lib/api";

interface Icon {
  id: number;
  title: string;
  path: string;
  style: "OUTLINE" | "FILL";
  status: string;
}

interface Bundle {
  id: number;
  title: string;
  category_id?: number;
  description?: string;
  iconBundles?: Array<{ icon_id: number }>;
}

export default function LinkIconsToBundlePage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [icons, setIcons] = useState<Icon[]>([]);
  const [selectedIcons, setSelectedIcons] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /* FETCH DATA */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bundlesRes, iconsRes] = await Promise.all([
          fetch(proxyApiUrl("bundles")),
          fetch(proxyApiUrl("icons?status=ACTIVE")),
        ]);

        const bundlesData = await bundlesRes.json();
        const iconsData = await iconsRes.json();

        setBundles(bundlesData || []);
        setIcons(iconsData || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load bundles and icons");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* WHEN BUNDLE SELECTED, LOAD ITS ICONS */
  useEffect(() => {
    if (selectedBundle) {
      const linkedIds = selectedBundle.iconBundles?.map((ib) => ib.icon_id) || [];
      setSelectedIcons(new Set(linkedIds));
    }
  }, [selectedBundle]);

  /* TOGGLE ICON SELECTION */
  const toggleIcon = (iconId: number) => {
    const newSelected = new Set(selectedIcons);
    if (newSelected.has(iconId)) {
      newSelected.delete(iconId);
    } else {
      newSelected.add(iconId);
    }
    setSelectedIcons(newSelected);
  };

  /* LINK/UNLINK ICONS */
  const handleLinkIcons = async () => {
    if (!selectedBundle) return;

    setLinking(true);
    try {
      const currentLinked = new Set(selectedBundle.iconBundles?.map((ib) => ib.icon_id) || []);
      const toLink = Array.from(selectedIcons).filter((id) => !currentLinked.has(id));
      const toUnlink = Array.from(currentLinked).filter((id) => !selectedIcons.has(id));

      // Link new icons
      for (const iconId of toLink) {
        await fetch(proxyApiUrl(`bundles/${selectedBundle.id}/icons`), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ iconId }),
        });
      }

      // Unlink removed icons
      for (const iconId of toUnlink) {
        await fetch(proxyApiUrl(`bundles/${selectedBundle.id}/icons/${iconId}`), {
          method: "DELETE",
        });
      }

      toast.success(`Bundle updated with ${selectedIcons.size} icon(s)!`);

      // Refresh bundles
      const bundlesRes = await fetch(proxyApiUrl("bundles"));
      const bundlesData = await bundlesRes.json();
      setBundles(bundlesData || []);
      setSelectedBundle(null);
      setSelectedIcons(new Set());
    } catch (error) {
      console.error("Error linking icons:", error);
      toast.error("Failed to link icons to bundle");
    } finally {
      setLinking(false);
    }
  };

  /* FILTER ICONS */
  const filteredIcons = icons.filter((icon) =>
    icon.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageBreadcrumb
        title="Link Icons to Bundles"
        description="Add or remove icons from bundles"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* BUNDLES LIST */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                Bundles ({bundles.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
              {bundles.map((bundle) => (
                <button
                  key={bundle.id}
                  onClick={() => setSelectedBundle(bundle)}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition ${
                    selectedBundle?.id === bundle.id
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="truncate">{bundle.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {bundle.iconBundles?.length || 0} icons
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ICONS SELECTOR */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                {selectedBundle ? (
                  <>
                    Select Icons for "{selectedBundle.title}"
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-normal mt-1">
                      {selectedIcons.size} icon(s) selected
                    </p>
                  </>
                ) : (
                  "Select a bundle to manage its icons"
                )}
              </h3>

              {selectedBundle && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search icons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={() => {
                      if (selectedIcons.size === filteredIcons.length) {
                        setSelectedIcons(
                          new Set(
                            selectedBundle.iconBundles?.map((ib) => ib.icon_id) || []
                          )
                        );
                      } else {
                        setSelectedIcons(new Set(filteredIcons.map((i) => i.id)));
                      }
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    {selectedIcons.size === filteredIcons.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                </div>
              )}
            </div>

            {selectedBundle ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6 max-h-96 overflow-y-auto">
                  {filteredIcons.map((icon) => (
                    <label
                      key={icon.id}
                      className="flex flex-col items-center gap-2 p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-green-500 transition"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIcons.has(icon.id)}
                        onChange={() => toggleIcon(icon.id)}
                        className="accent-green-600 w-4 h-4"
                      />
                      <div className="text-xs text-center text-gray-700 dark:text-gray-300 line-clamp-2">
                        {icon.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {icon.style}
                      </div>
                    </label>
                  ))}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setSelectedBundle(null);
                      setSelectedIcons(new Set());
                      setSearchQuery("");
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLinkIcons}
                    disabled={linking}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium disabled:opacity-50"
                  >
                    {linking ? "Updating..." : "Update Bundle"}
                  </button>
                </div>
              </>
            ) : (
              <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                Select a bundle from the list to manage its icons
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState, useEffect, useRef } from "react";
import { TagsInput } from "react-tag-input-component";
import { useSession } from "next-auth/react";
import { toast } from "@iamqitmeer/toster";
import Image from "next/image";

interface IconDraft {
  id: number;
  title: string;
  path: string;
  saved?: boolean;
  selected?: boolean;
  category_id?: number | null;
  sub_category_id?: number | null;
  style?: "OUTLINE" | "FILL";
}

interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  name: string;
}

export default function MyDraftsPage() {
  const DRAWER_WIDTH = 400;
  const { data: session, status } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_NEST_API_URL || "https://cloudflare-workers-openapi-production.up.railway.app";

  const [icons, setIcons] = useState<IconDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  // Replace File State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [replacingId, setReplacingId] = useState<number | null>(null);

  // Form State
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [style, setStyle] = useState<"OUTLINE" | "FILL" | "">("");
  const [title, setTitle] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Metadata Choices
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [existingTags, setExistingTags] = useState<string[]>([]);

  const selectedIcons = icons.filter((i) => i.selected);
  const isDrawerOpen = selectedIcons.length > 0;

  /* -----------------------------------------------------
     FETCH DATA (DRAFTS + METADATA)
  ----------------------------------------------------- */
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [iconsRes, catsRes, subCatsRes, tagsRes] = await Promise.all([
          fetch(`${API_URL}icons/drafts/${session.user.id}`),
          fetch(`${API_URL}categories`),
          fetch(`${API_URL}sub-categories`),
          fetch(`${API_URL}tags`)
        ]);

        const iconsData = await iconsRes.json();
        const catsData = await catsRes.json();
        const subCatsData = await subCatsRes.json();
        const tagsData = await tagsRes.json();

        setIcons(iconsData);
        setCategories(catsData);
        setSubCategories(subCatsData);
        try {
          const normalized = Array.isArray(tagsData)
            ? tagsData.map((t: any) => (typeof t === 'string' ? t : t?.name ?? String(t)))
            : [];
          setExistingTags(normalized);
        } catch (error) {
          console.error("Failed to normalize tags", error);
          setExistingTags([]);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL, session, status]);

  /* -----------------------------------------------------
     BEFORE UNLOAD WARNING
  ----------------------------------------------------- */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasUnsubmitted = icons.some(i => i.saved);
      if (hasUnsubmitted) {
        e.preventDefault();
        e.returnValue = "You have saved icons that have not been submitted. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [icons]);

  /* -----------------------------------------------------
     FILTER SUB-CATEGORIES
  ----------------------------------------------------- */
  useEffect(() => {
    if (category) {
      const filtered = subCategories.filter(
        (sc: any) => sc.categoryId === Number(category) || sc.category?.id === Number(category)
      );
      setFilteredSubCategories(filtered);
    } else {
      setFilteredSubCategories([]);
    }
  }, [category, subCategories]);

  /* -----------------------------------------------------
     DRAWER HYDRATION LOGIC
  ----------------------------------------------------- */
  useEffect(() => {
    if (selectedIcons.length === 0) return;

    if (selectedIcons.length === 1) {
      const icon = selectedIcons[0];
      setTitle(icon.title);
      setCategory(icon.category_id ? String(icon.category_id) : "");
      setSubCategory(icon.sub_category_id ? String(icon.sub_category_id) : "");
      setStyle(icon.style || "");
      setTags(Array.from(new Set((icon as any).tags?.map((t: any) => typeof t === "string" ? t : t.name).filter(Boolean) || [])) as string[]);

      const nameTags = icon.title
        .toLowerCase()
        .split(/[\s-_]+/)
        .filter((word: string) => word.length > 2);
      setSuggestions(Array.from(new Set([...nameTags, "ui", "svg", "web", "icon", ...existingTags])));
    } else {
      setTitle("");
      setCategory("");
      setSubCategory("");
      setStyle("");
      setTags([]);
      setSuggestions(Array.from(new Set(["ui", "svg", "web", "icon", ...existingTags])));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [icons.filter(i => i.selected).map(i => i.id).join(","), existingTags]);

  /* -----------------------------------------------------
     UPDATE ICONS (PATCH)
  ----------------------------------------------------- */
  const updateIcons = async (data: Partial<IconDraft> & { tags?: string[] }) => {
    if (selectedIcons.length === 0) return;

    try {
      const promises = selectedIcons.map(icon => {
        const payload: any = {};
        if (selectedIcons.length === 1 && data.title) payload.title = data.title;
        if (data.category_id) payload.categoryId = data.category_id;
        if (data.sub_category_id) payload.subCategoryId = data.sub_category_id;
        if (data.style) payload.style = data.style;
        if (data.tags && data.tags.length > 0) payload.tags = data.tags;

        if (Object.keys(payload).length === 0) {
          return Promise.resolve({ ok: true });
        }

        return fetch(`${API_URL}icons/${icon.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      });

      const results = await Promise.all(promises);
      const failed = results.find(r => !(r as Response).ok && (r as any).ok !== true);
      if (failed) throw new Error("One or more icons failed to update");

      const updatedIcons = icons.map(icon => {
        if (icon.selected) {
          const normalizedTags = data.tags && data.tags.length > 0
            ? data.tags.map((t: string) => ({ name: t }))
            : (icon as any).tags || [];

          return {
            ...icon,
            ...(data.title && selectedIcons.length === 1 ? { title: data.title } : {}),
            ...(data.category_id ? { category_id: data.category_id } : {}),
            ...(data.sub_category_id ? { sub_category_id: data.sub_category_id } : {}),
            ...(data.style ? { style: data.style } : {}),
            ...(data.tags && data.tags.length > 0 ? { tags: normalizedTags } : {}),
            saved: true
          } as any;
        }
        return icon;
      });
      setIcons(updatedIcons);
    } catch (error) {
      console.error("Failed to update icons", error);
      throw error;
    }
  };

  /* -----------------------------------------------------
     SAVE DRAFT
  ----------------------------------------------------- */
  const handleSaveDraft = async () => {
    const savePromise = updateIcons({
      title: selectedIcons.length === 1 ? title : undefined,
      category_id: category ? Number(category) : undefined,
      sub_category_id: subCategory ? Number(subCategory) : undefined,
      style: style ? (style as "OUTLINE" | "FILL") : undefined,
      tags: tags.length > 0 ? tags : undefined
    });

    toast.promise(savePromise, {
      loading: `Saving ${selectedIcons.length} draft(s)...`,
      success: "Draft(s) saved!",
      error: "Failed to save draft(s)"
    });
  };

  /* -----------------------------------------------------
     SELECT HANDLER (Shift, Ctrl, Regular)
  ----------------------------------------------------- */
  const handleIconClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();

    if (e.shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      setIcons(prev => prev.map((icon, i) => ({
        ...icon,
        selected: i >= start && i <= end
      })));
    } else if (e.ctrlKey || e.metaKey) {
      setIcons(prev => prev.map((icon, i) => i === index ? { ...icon, selected: !icon.selected } : icon));
      setLastSelectedIndex(index);
    } else {
      setIcons(prev => prev.map((icon, i) => ({
        ...icon,
        selected: i === index
      })));
      setLastSelectedIndex(index);
    }
  };

  /* -----------------------------------------------------
     SUBMIT — publishes ALL selected icons
  ----------------------------------------------------- */
  const handleSubmit = async () => {
    if (selectedIcons.length === 0) return;

    const invalid = selectedIcons.some(i => {
      const cat = category ? Number(category) : i.category_id;
      const subCat = subCategory ? Number(subCategory) : i.sub_category_id;
      return !cat || !subCat;
    });

    if (invalid) {
      toast.error(
        "Some selected icons are missing Category or Sub-Category. Please assign them.",
        { duration: 4000 }
      );
      return;
    }

    const publishMultiple = async () => {
      await updateIcons({
        title: selectedIcons.length === 1 ? title : undefined,
        category_id: category ? Number(category) : undefined,
        sub_category_id: subCategory ? Number(subCategory) : undefined,
        style: style ? (style as "OUTLINE" | "FILL") : undefined,
        tags: tags.length > 0 ? tags : undefined
      });

      const publishPromises = selectedIcons.map(i =>
        fetch(`${API_URL}icons/${i.id}/publish`, { method: 'POST' })
      );
      const results = await Promise.all(publishPromises);
      const successfulIds: number[] = [];
      results.forEach((r, idx) => {
        if (r.ok) successfulIds.push(selectedIcons[idx].id);
      });

      if (successfulIds.length > 0) {
        setIcons(prev => prev.filter(i => !successfulIds.includes(i.id)));
        window.dispatchEvent(new Event("iconsUpdated"));
      }

      if (successfulIds.length < selectedIcons.length) {
        const failedCount = selectedIcons.length - successfulIds.length;
        throw new Error(`${failedCount} icon${failedCount > 1 ? "s" : ""} failed to submit`);
      }

      return `${successfulIds.length} icon${successfulIds.length > 1 ? "s" : ""} submitted successfully!`;
    };

    toast.promise(publishMultiple(), {
      loading: `Submitting ${selectedIcons.length} icon(s)...`,
      success: (msg) => String(msg),
      error: (err) => err?.message || "An error occurred while submitting icons"
    });
  };

  /* -----------------------------------------------------
     DELETE DRAFT
  ----------------------------------------------------- */
  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm("Delete draft?")) return;
    try {
      await fetch(`${API_URL}icons/drafts/${id}`, { method: 'DELETE' });
      setIcons(icons.filter(i => i.id !== id));
      window.dispatchEvent(new Event("iconsUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  /* -----------------------------------------------------
     REPLACE FILE
  ----------------------------------------------------- */
  const handleReplaceClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setReplacingId(id);
    setOpenMenuIndex(null);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || replacingId === null) return;
    const file = e.target.files[0];
    
    // reset input
    e.target.value = '';

    const formData = new FormData();
    formData.append("files", file);

    const promise = fetch(`${API_URL}icons/${replacingId}/replace`, {
      method: "PATCH",
      body: formData,
    }).then(async res => {
      if (!res.ok) throw new Error("Replace failed");
      const updated = await res.json();
      setIcons(prev => prev.map(icon => icon.id === replacingId ? { ...icon, title: updated.title, path: updated.path } : icon));
    });

    toast.promise(promise, {
      loading: "Replacing icon...",
      success: "Icon replaced successfully",
      error: "Failed to replace icon",
    });
  };

  if (status === "loading") return <div className="p-10">Loading session...</div>;
  if (!session) return <div className="p-10">Please log in.</div>;

  return (
    <>
      <PageBreadcrumb pageTitle={`My Drafts (${icons.length})`} />

      <div className="min-h-screen relative" onClick={() => setOpenMenuIndex(null)}>
        {/* GRID */}
        <div
          className="grid gap-3 justify-center transition-all duration-300"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(200px, 200px))`,
            maxWidth: isDrawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
          }}
        >
          {loading && (
            <div className="col-span-full text-center text-gray-500">Loading draft icons...</div>
          )}

          {!loading && icons.length === 0 && (
            <div className="col-span-full text-center text-gray-500">No draft icons found</div>
          )}

          {!loading &&
            icons.map((icon, index) => (
              <div
                key={icon.id}
                onClick={(e) => handleIconClick(e, index)}
                className={`bg-white dark:bg-gray-700 rounded-lg shadow-md p-3 flex flex-col justify-between w-50 h-40 hover:shadow-md transition-shadow cursor-pointer relative group ${icon.selected ? "ring-2 ring-green-500" : ""
                  }`}
              >
                <div className="w-full flex justify-between items-start mb-2 px-2 relative">
                  <div
                    className="font-normal text-gray-800 dark:text-gray-200 text-sm truncate"
                    title={icon.title}
                  >
                    {icon.title}
                  </div>

                  <div className="relative">
                    <button
                      className="flex items-center justify-center text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuIndex(openMenuIndex === index ? null : index);
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z" fill="currentColor" />
                      </svg>
                    </button>

                    {openMenuIndex === index && (
                      <div
                        className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={(e) => handleReplaceClick(e, icon.id)}
                        >
                          Replace
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={(e) => { handleDelete(e, icon.id); setOpenMenuIndex(null); }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-3">
                  <Image
                    src={`https://pub-e598b9aaee344c728dd117b85cd19c87.r2.dev/${icon.path}`}
                    alt="icon preview"
                    className="w-20 h-20 object-cover"
                    width={20}
                    height={20}
                    loading="lazy"
                  />
                </div>
                {/* Checking Icon — only shown after icon has been saved */}
                {icon.saved && (
                  <div
                    className="absolute bottom-2 left-2 rounded-full p-1 bg-green-500 text-white shadow-sm pointer-events-none"
                    title="Saved Draft"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* HIDDEN FILE INPUT FOR REPLACE */}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/svg+xml,image/png" 
          onChange={handleFileChange} 
        />

        {/* DRAWER */}
        <div
          className={`fixed top-0 right-0 h-full pt-20 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl z-50 transform transition-transform duration-300 ${isDrawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
          style={{ width: `${DRAWER_WIDTH}px` }}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:border-gray-100">
              {selectedIcons.length > 1 ? "Bulk Edit Selected" : "Icon Details"}
            </h2>
            {selectedIcons.length > 0 && (
              <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5 font-medium border border-green-200 shadow-sm">
                {selectedIcons.length} selected
              </span>
            )}
          </div>

          {isDrawerOpen && (
            <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(100%-80px)]">
              {/* TITLE */}
              <div className="space-y-1">
                <label className="text-sm font-normal">Title</label>
                {selectedIcons.length > 1 ? (
                  <div className="w-full border-b-2 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/50 outline-none py-1 px-2 cursor-not-allowed">
                    [Multiple Selected] Name cannot be bulk edited
                  </div>
                ) : (
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add title"
                    className="w-full border-b-2 text-sm focus:border-green-600 outline-none py-1 px-1"
                  />
                )}
              </div>

              {/* CATEGORY */}
              <div className="space-y-1">
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubCategory("");
                  }}
                  className="w-full border-b-2 focus:border-green-600 outline-none py-1 px-1 bg-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* SUB CATEGORY */}
              <div className="space-y-1">
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  disabled={!category}
                  className="w-full border-b-2 focus:border-green-600 outline-none py-1 px-1 bg-transparent disabled:opacity-50"
                >
                  <option value="">Select sub-category</option>
                  {filteredSubCategories.map(sc => (
                    <option key={sc.id} value={sc.id}>{sc.name}</option>
                  ))}
                </select>
              </div>

              {/* STYLE */}
              <div className="space-y-1">
                <label className="text-sm font-normal">Style</label>
                <div className="flex gap-6">
                  {(['OUTLINE', 'FILL'] as const).map((s, i) => (
                    <label key={`style-${i}-${s}`} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="style"
                        value={s}
                        checked={style === s}
                        onChange={() => setStyle(s)}
                        className="accent-green-600 w-4 h-4"
                      />
                      <span className="text-sm capitalize">{s.toLowerCase()}</span>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* KEYWORDS */}
              <div className="space-y-1">
                <label className="text-sm font-normal">Keywords</label>
                <TagsInput
                  value={tags}
                  onChange={setTags}
                  name="keywords"
                  placeHolder="Add keywords"
                  classNames={{
                    input: "w-full focus:border-green-600 outline-none bg-transparent",
                    tag: "bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-sm font-medium border border-green-200 shadow-sm"
                  }}
                />
                <label className="text-base block mt-10">Keyword Suggestions</label>
                <div className="mt-2 flex flex-wrap gap-1">
                  {suggestions.slice(0, 10).map((s, i) => (
                    <span
                      key={`suggestion-${i}-${s}`}
                      onClick={() => !tags.includes(s) && setTags([...tags, s])}
                      className="text-xs bg-gray-200 px-2 py-1 rounded-sm cursor-pointer hover:bg-green-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3">
                <button
                  onClick={handleSaveDraft}
                  className="flex-1 py-2 rounded-full bg-[#0A2F3E] text-gray-200 font-semibold hover:bg-gray-900 transition"
                >
                  {selectedIcons.length > 1 ? "Save Multiple" : "Save"}
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-2 rounded-full bg-[#00A654] text-white font-semibold hover:bg-green-700 transition shadow-sm"
                >
                  {selectedIcons.length > 0 ? (selectedIcons.length > 1 ? `Submit Selected (${selectedIcons.length})` : "Submit Selected") : "Submit"}
                </button>
              </div>

              {selectedIcons.length > 0 && (
                <p className="text-xs text-gray-400 text-center">
                  Clicking Submit will publish {selectedIcons.length} selected icon{selectedIcons.length > 1 ? "s" : ""}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
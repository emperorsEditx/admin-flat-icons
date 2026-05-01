"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Badge from "@/components/ui/badge/Badge";
import { proxyApiUrl } from "@/lib/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Category {
    id: number;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: "", status: "ACTIVE" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(proxyApiUrl("categories"), {
                // headers: { Authorization: `Bearer ${session?.user?.accessToken}` } // Uncomment when backend protects it
            });
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
            setFeedback({
                type: "error",
                message: "Unable to load categories right now. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFeedback(null);
        try {
            const method = currentCategory ? "PATCH" : "POST";
            const url = currentCategory
                ? proxyApiUrl(`categories/${currentCategory.id}`)
                : proxyApiUrl("categories");

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${session?.user?.accessToken}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setFeedback({
                    type: "success",
                    message: currentCategory ? "Category updated successfully." : "Category created successfully.",
                });
                setIsModalOpen(false);
                resetForm();
                fetchCategories();
                return;
            }

            const errorData = await res.json().catch(() => null);
            throw new Error(errorData?.message || "Failed to save category.");
        } catch (error) {
            console.error("Failed to save category", error);
            setFeedback({
                type: "error",
                message: error instanceof Error ? error.message : "Failed to save category.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        setFeedback(null);
        try {
            const res = await fetch(proxyApiUrl(`categories/${id}`), {
                method: "DELETE",
                // headers: { Authorization: `Bearer ${session?.user?.accessToken}` }
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                throw new Error(errorData?.message || "Failed to delete category.");
            }

            setFeedback({ type: "success", message: "Category deleted successfully." });
            fetchCategories();
        } catch (error) {
            console.error("Failed to delete category", error);
            setFeedback({
                type: "error",
                message: error instanceof Error ? error.message : "Failed to delete category.",
            });
        }
    };

    const openModal = (category?: Category) => {
        setFeedback(null);
        if (category) {
            setCurrentCategory(category);
            setFormData({ name: category.name, status: category.status });
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setCurrentCategory(null);
        setFormData({ name: "", status: "ACTIVE" });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Categories</h1>
                <button
                    onClick={() => openModal()}
                    type="button"
                    className="px-4 py-2 text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition"
                >
                    Add Category
                </button>
            </div>

            {feedback && (
                <div
                    className={`mb-4 rounded-xl border px-4 py-3 text-sm ${feedback.type === "success"
                        ? "border-success-200 bg-success-50 text-success-700 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400"
                        : "border-error-200 bg-error-50 text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400"
                        }`}
                >
                    {feedback.message}
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[500px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">ID</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Name</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Status</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {isLoading && Array.from({ length: 4 }).map((_, index) => (
                                    <TableRow key={`category-skeleton-${index}`}>
                                        <TableCell className="px-5 py-4">
                                            <div className="h-4 w-10 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!isLoading && categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="px-5 py-4 text-gray-500">{category.id}</TableCell>
                                        <TableCell className="px-5 py-4 text-gray-800 dark:text-white font-medium">{category.name}</TableCell>
                                        <TableCell className="px-5 py-4">
                                            <Badge size="sm" color={category.status === "ACTIVE" ? "success" : "error"}>
                                                {category.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => openModal(category)} className="text-gray-500 hover:text-brand-500">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(category.id)} className="text-gray-500 hover:text-red-500">
                                                    Delete
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!isLoading && categories.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="px-5 py-10 text-center text-gray-500">
                                            No categories found. Create the first one to get started.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-lg p-6">
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                    {currentCategory ? "Edit Category" : "Add Category"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Category Name"
                            autoFocus
                        />
                    </div>
                    <div>
                        <Label>Status</Label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full h-11 px-4 py-2 border rounded-lg bg-transparent text-gray-800 dark:text-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 outline-none focus:border-brand-500 transition"
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-white/10 dark:hover:bg-white/20"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

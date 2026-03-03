"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Badge from "@/components/ui/badge/Badge";
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

interface SubCategory {
    id: number;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
    categoryId: number;
    category: Category;
}

export default function SubCategoriesPage() {
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSubCategory, setCurrentSubCategory] = useState<SubCategory | null>(null);
    const [formData, setFormData] = useState({ name: "", status: "ACTIVE", categoryId: "" });

    const API_URL = process.env.NEXT_PUBLIC_NEST_API_URL || 'https://api-flat-icons.vercel.app/';

    useEffect(() => {
        fetchSubCategories();
        fetchCategories();
    }, []);

    const fetchSubCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/sub-categories`);
            const data = await res.json();
            setSubCategories(data);
        } catch (error) {
            console.error("Failed to fetch sub-categories", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/categories`);
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.categoryId) {
            alert("Please select a category");
            return;
        }

        try {
            const method = currentSubCategory ? "PATCH" : "POST";
            const url = currentSubCategory
                ? `${API_URL}/sub-categories/${currentSubCategory.id}`
                : `${API_URL}/sub-categories`;

            const payload = {
                ...formData,
                categoryId: Number(formData.categoryId)
            };

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchSubCategories();
                resetForm();
            } else {
                console.error("Failed to save sub-category");
            }
        } catch (error) {
            console.error("Failed to save sub-category", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this sub-category?")) return;
        try {
            await fetch(`${API_URL}/sub-categories/${id}`, {
                method: "DELETE",
            });
            fetchSubCategories();
        } catch (error) {
            console.error("Failed to delete sub-category", error);
        }
    };

    const openModal = (subCategory?: SubCategory) => {
        if (subCategory) {
            setCurrentSubCategory(subCategory);
            setFormData({
                name: subCategory.name,
                status: subCategory.status,
                categoryId: subCategory.categoryId.toString()
            });
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setCurrentSubCategory(null);
        setFormData({ name: "", status: "ACTIVE", categoryId: "" });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sub Categories</h1>
                <button
                    onClick={() => openModal()}
                    className="px-4 py-2 text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition"
                >
                    Add Sub Category
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[500px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">ID</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Name</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Category</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Status</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {subCategories.map((subCategory) => (
                                    <TableRow key={subCategory.id}>
                                        <TableCell className="px-5 py-4 text-gray-500">{subCategory.id}</TableCell>
                                        <TableCell className="px-5 py-4 text-gray-800 dark:text-white font-medium">{subCategory.name}</TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500">{subCategory.category?.name || 'N/A'}</TableCell>
                                        <TableCell className="px-5 py-4">
                                            <Badge size="sm" color={subCategory.status === "ACTIVE" ? "success" : "error"}>
                                                {subCategory.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => openModal(subCategory)} className="text-gray-500 hover:text-brand-500">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(subCategory.id)} className="text-gray-500 hover:text-red-500">
                                                    Delete
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {subCategories.length === 0 && !isLoading && (
                                    <TableRow>
                                        <TableCell className="px-5 py-4 text-center text-gray-500" colSpan={5}>
                                            No sub-categories found.
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
                    {currentSubCategory ? "Edit Sub Category" : "Add Sub Category"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Sub Category Name"
                        />
                    </div>
                    <div>
                        <Label>Category</Label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full h-11 px-4 py-2 border rounded-lg bg-transparent text-gray-800 dark:text-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 outline-none focus:border-brand-500 transition"
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
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
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-brand-500 rounded-lg hover:bg-brand-600"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

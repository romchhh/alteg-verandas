"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getUploadImageSrc, isServerUploadUrl } from "@/lib/utils/image";

interface Category {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  image: string;
  isCustom?: boolean;
}

interface ProductWithCategory {
  id: string;
  category: string;
}

export default function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCountByCategory, setProductCountByCategory] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/products"),
      ]);
      if (!catRes.ok) throw new Error("Failed to fetch categories");
      const catData = await catRes.json();
      setCategories(Array.isArray(catData) ? catData : []);

      const counts: Record<string, number> = {};
      if (prodRes.ok) {
        const products: ProductWithCategory[] = await prodRes.json();
        (Array.isArray(products) ? products : []).forEach((p) => {
          const c = p.category ?? "";
          counts[c] = (counts[c] ?? 0) + 1;
        });
      }
      setProductCountByCategory(counts);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleDelete(categoryId: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to delete");
      }
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(error instanceof Error ? error.message : "Failed to delete");
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Categories
          </h2>
          <div className="flex gap-2">
            <button
              onClick={fetchCategories}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
            >
              Refresh
            </button>
            <Link
              href="/admin/categories/add"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              + Add category
            </Link>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-sm font-semibold text-gray-700"
              >
                ID
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-sm font-semibold text-gray-700"
              >
                Name (EN)
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-sm font-semibold text-gray-700"
              >
                Description
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-center text-sm font-semibold text-gray-700 w-24"
              >
                Products
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-sm font-semibold text-gray-700 w-20"
              >
                Image
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-sm font-semibold text-gray-700"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100">
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-5 py-8 text-center text-gray-500"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-gray-500">No categories yet. Add your first category to organize products.</p>
                    <Link
                      href="/admin/categories/add"
                      className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Add category
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow
                  key={cat.id}
                  className="hover:bg-gray-50"
                >
                  <TableCell className="px-5 py-4 text-sm font-mono text-gray-600">
                    {cat.id}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-900">
                    {cat.nameEn}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {cat.description}
                  </TableCell>
                  <TableCell className="px-5 py-4 w-24 text-center text-sm text-gray-700 tabular-nums">
                    {productCountByCategory[cat.id] ?? 0}
                  </TableCell>
                  <TableCell className="px-5 py-4 w-20">
                    {cat.image ? (
                      <div className="relative h-10 w-10 rounded overflow-hidden bg-gray-100">
                        <Image
                          src={isServerUploadUrl(cat.image) ? getUploadImageSrc(cat.image) : cat.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="px-5 py-4 space-x-2">
                    <Link
                      href={`/admin/categories/${cat.id}/edit`}
                      className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

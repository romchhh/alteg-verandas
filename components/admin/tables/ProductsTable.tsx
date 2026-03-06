"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import { Product } from "@/lib/types/product";
import { PRODUCT_CATEGORIES } from "@/lib/constants/catalog";
import { getUploadImageSrc, isServerUploadUrl } from "@/lib/utils/image";

function useProductsListUrl() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryFromUrl = searchParams.get("category") ?? "";
  const pageFromUrl = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const setUrl = (category: string, page: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (page > 1) params.set("page", String(page));
    const q = params.toString();
    router.replace(q ? `/admin/products?${q}` : "/admin/products", { scroll: false });
  };

  return { categoryFromUrl, pageFromUrl, setUrl };
}

export default function ProductsTable() {
  const { categoryFromUrl, pageFromUrl, setUrl } = useProductsListUrl();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [categoryFilter, setCategoryFilter] = useState<string>(categoryFromUrl);
  const [searchQuery, setSearchQuery] = useState("");
  type SortKey = "nameEn" | "dimensions" | "category" | "pricePerMeter" | "";
  const [sortKey, setSortKey] = useState<SortKey>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const productsPerPage = 10;

  // Restore filter and page from URL when returning to the page (e.g. back from product edit)
  useEffect(() => {
    setCategoryFilter(categoryFromUrl);
    setCurrentPage(pageFromUrl);
  }, [categoryFromUrl, pageFromUrl]);

  const ADMIN_MARKETING_CATEGORIES = [
    { id: "verandas", label: "Verandas & Canopies" },
    { id: "fencing", label: "Aluminium Fencing" },
    { id: "profiles", label: "Profile Systems" },
    { id: "accessories", label: "Accessories & Guttering" },
  ] as const;

  const filteredProducts = useMemo(() => {
    let list = products;

    if (categoryFilter) {
      const selected = ADMIN_MARKETING_CATEGORIES.find((c) => c.id === categoryFilter);
      if (selected) {
        list = list.filter((p) => (p.applications ?? []).includes(selected.label));
      }
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          (p.nameEn || "").toLowerCase().includes(q) ||
          (p.dimensions || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, categoryFilter, searchQuery]);

  const sortedProducts = useMemo(() => {
    if (!sortKey) return filteredProducts;
    const copy = [...filteredProducts];
    copy.sort((a, b) => {
      const aVal = a[sortKey as keyof Product];
      const bVal = b[sortKey as keyof Product];
      const aNum = typeof aVal === "number" ? aVal : 0;
      const bNum = typeof bVal === "number" ? bVal : 0;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aNum - bNum : bNum - aNum;
      }
      const aStr = String(aVal ?? "").toLowerCase();
      const bStr = String(bVal ?? "").toLowerCase();
      const cmp = aStr.localeCompare(bStr);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filteredProducts, sortKey, sortDir]);

  const totalPages = useMemo(
    () => Math.ceil(sortedProducts.length / productsPerPage),
    [sortedProducts.length]
  );

  const paginatedProducts = useMemo(
    () =>
      sortedProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      ),
    [sortedProducts, currentPage]
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredProducts.length, currentPage, totalPages]);

  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setFetchError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleDelete(productId: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Products
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="search"
              placeholder="Search by name or dimensions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm w-48 sm:w-56"
            />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <span className="whitespace-nowrap">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  const v = e.target.value;
                  setCategoryFilter(v);
                  setCurrentPage(1);
                  setUrl(v, 1);
                }}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm bg-white min-w-[140px]"
              >
                <option value="">All</option>
                {ADMIN_MARKETING_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label} (
                    {
                      products.filter((p) =>
                        (p.applications ?? []).includes(cat.label)
                      ).length
                    }
                    )
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={fetchProducts}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
            >
              Refresh
            </button>
            <Link
              href="/admin/products/add"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              + Add product
            </Link>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
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
                <button
                  type="button"
                  onClick={() => handleSort("nameEn")}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  Name
                  {sortKey === "nameEn" && (sortDir === "asc" ? " ↑" : " ↓")}
                </button>
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-sm font-semibold text-gray-700"
              >
                <button
                  type="button"
                  onClick={() => handleSort("category")}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  Category
                  {sortKey === "category" && (sortDir === "asc" ? " ↑" : " ↓")}
                </button>
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-sm font-semibold text-gray-700"
              >
                <button
                  type="button"
                  onClick={() => handleSort("dimensions")}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  Dimensions
                  {sortKey === "dimensions" && (sortDir === "asc" ? " ↑" : " ↓")}
                </button>
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-sm font-semibold text-gray-700"
              >
                <button
                  type="button"
                  onClick={() => handleSort("pricePerMeter")}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  Price/m
                  {sortKey === "pricePerMeter" && (sortDir === "asc" ? " ↑" : " ↓")}
                </button>
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-sm font-semibold text-gray-700"
              >
                In stock
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
            {fetchError ? (
              <TableRow>
                <TableCell colSpan={7} className="px-5 py-8 text-center">
                  <p className="text-red-600 mb-2">{fetchError}</p>
                  <button
                    type="button"
                    onClick={fetchProducts}
                    className="rounded bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Retry
                  </button>
                </TableCell>
              </TableRow>
            ) : loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-5 py-8 text-center text-gray-500"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-gray-500">
                      {categoryFilter
                        ? "No products in this category. Change the filter or add a product."
                        : "No products yet. Add your first product to get started."}
                    </p>
                    <Link
                      href="/admin/products/add"
                      className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Add product
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => {
                const imageSrc = product.image;
                const isServer = imageSrc && isServerUploadUrl(imageSrc);
                const src = imageSrc
                  ? isServer
                    ? getUploadImageSrc(imageSrc, true)
                    : imageSrc
                  : "";
                return (
                <TableRow
                  key={product.id}
                  className="hover:bg-gray-50"
                >
                  <TableCell className="px-5 py-4 w-20">
                    {src ? (
                      <div className="relative h-10 w-10 rounded overflow-hidden bg-gray-100">
                        {isServer ? (
                          <Image
                            src={src}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <img
                            src={src}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-900">
                    {product.nameEn || product.name}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-600">
                    {product.applications?.[0] ?? "Unassigned"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-600">
                    {product.dimensions}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-600">
                    {product.pricePerMeter != null
                      ? `£${product.pricePerMeter.toFixed(2)}`
                      : product.pricePerKg != null
                      ? `£${product.pricePerKg}/kg`
                      : "—"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm">
                    {product.inStock ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-red-500">—</span>
                    )}
                  </TableCell>
                  <TableCell className="px-5 py-4 space-x-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              );
              })
            )}
          </TableBody>
        </Table>

        {!loading && filteredProducts.length > productsPerPage && (
          <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
            <button
              onClick={() => {
                const p = Math.max(1, currentPage - 1);
                setCurrentPage(p);
                setUrl(categoryFilter, p);
              }}
              disabled={currentPage === 1}
              className="rounded px-3 py-1 text-sm disabled:opacity-50"
            >
              ←
            </button>
            <span className="py-1 text-sm">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => {
                const p = Math.min(totalPages, currentPage + 1);
                setCurrentPage(p);
                setUrl(categoryFilter, p);
              }}
              disabled={currentPage === totalPages}
              className="rounded px-3 py-1 text-sm disabled:opacity-50"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

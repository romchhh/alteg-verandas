"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/admin/PageBreadCrumb";
import ComponentCard from "@/components/admin/ComponentCard";
import Label from "@/components/admin/form/Label";
import Input from "@/components/admin/form/Input";
import TextArea from "@/components/admin/form/TextArea";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { adminCategorySchema } from "@/lib/utils/validators";

export default function AddCategoryPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);
    const slug =
      id.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") ||
      nameEn
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");
    const parsed = adminCategorySchema.safeParse({ id: slug || " ", nameEn: nameEn.trim() });
    if (!parsed.success) {
      const err: Record<string, string> = {};
      parsed.error.errors.forEach((e) => {
        const p = e.path[0];
        if (p && typeof p === "string") err[p] = e.message;
      });
      if (!slug) err.nameEn = "Enter name (EN) or ID so we can generate one.";
      setFieldErrors(err);
      return;
    }
    setLoading(true);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: slug,
          name: nameEn.trim() || slug,
          nameEn: nameEn.trim() || slug,
          description: description.trim() || undefined,
          image: image.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create");
        setLoading(false);
        return;
      }

      setSuccess("Category created!");
      setTimeout(() => router.push("/admin/categories"), 1500);
    } catch {
      setError("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Add category" segments={[{ label: "Categories", href: "/admin/categories" }, { label: "Add" }]} />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <ComponentCard title="New category" desc="ID will be generated from name (EN) if left empty. Image: upload or URL.">
          <div className="space-y-4">
            <div>
              <Label>ID (lowercase, no spaces, e.g. my_profile)</Label>
              <Input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="leave empty to auto-generate"
              />
              {fieldErrors.id && <p className="mt-1 text-sm text-red-600">{fieldErrors.id}</p>}
            </div>
            <div>
              <Label>Name (EN) *</Label>
              <Input
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Special Profile"
                required
              />
              {fieldErrors.nameEn && <p className="mt-1 text-sm text-red-600">{fieldErrors.nameEn}</p>}
            </div>
            <div>
              <Label>Description</Label>
              <TextArea
                value={description}
                onChange={setDescription}
                rows={4}
                placeholder="Short category description"
              />
            </div>
            <div>
              <ImageUpload
                label="Category image"
                value={image}
                onChange={setImage}
                hint="Drag and drop — saved as /uploads/..."
              />
            </div>
          </div>
        </ComponentCard>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-gray-800 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create category"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/categories")}
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm"
          >
            Cancel
          </button>
        </div>

        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}

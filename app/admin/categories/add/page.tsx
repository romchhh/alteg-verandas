"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/admin/PageBreadCrumb";
import ComponentCard from "@/components/admin/ComponentCard";
import Label from "@/components/admin/form/Label";
import Input from "@/components/admin/form/Input";
import TextArea from "@/components/admin/form/TextArea";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function AddCategoryPage() {
  const router = useRouter();
  const [nameEn, setNameEn] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Safety: in case the button is somehow enabled, block submission.
    setError("Creating new categories is disabled. Use existing categories only.");
    return;
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Add category (disabled)" segments={[{ label: "Categories", href: "/admin/categories" }, { label: "Add" }]} />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <ComponentCard title="New category" desc="Creating completely new categories is disabled. Use existing built-in categories only.">
          <div className="space-y-4">
            <div>
              <Label>Name (EN) *</Label>
              <Input
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Special Profile"
                required
                disabled
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
                disabled
              />
            </div>
            <div>
              <ImageUpload
                label="Category image"
                value={image}
                onChange={setImage}
                hint="Drag and drop — saved as /uploads/..."
                onUploadingChange={undefined}
              />
              <p className="mt-2 text-sm text-gray-600">
                Category creation is disabled. Use the existing categories and edit them instead.
              </p>
            </div>
          </div>
        </ComponentCard>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled
            className="rounded-lg bg-gray-800 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            Create category
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

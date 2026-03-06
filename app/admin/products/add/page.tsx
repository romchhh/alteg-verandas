"use client";

import React, { useState } from "react";
import PageBreadcrumb from "@/components/admin/PageBreadCrumb";
import ComponentCard from "@/components/admin/ComponentCard";
import Label from "@/components/admin/form/Label";
import Input from "@/components/admin/form/Input";
import ToggleSwitch from "@/components/admin/form/ToggleSwitch";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";

export default function AddProductPage() {
  const MARKETING_CATEGORIES = [
    { id: "verandas", label: "Verandas & Canopies" },
    { id: "fencing", label: "Aluminium Fencing" },
    { id: "profiles", label: "Profile Systems" },
    { id: "accessories", label: "Accessories & Guttering" },
  ] as const;

  const [category, setCategory] = useState<string>(MARKETING_CATEGORIES[0].id);
  const [nameEn, setNameEn] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState<"per m" | "per m²" | "per set" | "per item">("per m");
  const [weightPerMeter] = useState("1"); // internal default for schema
  const [images, setImages] = useState<string[]>([]);
  const [supplierPricePerMeter, setSupplierPricePerMeter] = useState("");
  const [supplierPricePerSquareMeterSet, setSupplierPricePerSquareMeterSet] = useState("");
  const [standardLengths, setStandardLengths] = useState("1, 3, 6");
  const [inStock, setInStock] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [material, setMaterial] = useState("");
  const [finish, setFinish] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const generateId = () => {
    const slug = dimensions.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    return `${category}-${slug || "new"}`.replace(/--+/g, "-");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);

    const nextErrors: Record<string, string> = {};
    if (!nameEn.trim()) nextErrors.nameEn = "Name is required";
    if (!dimensions.trim()) nextErrors.dimensions = "Dimensions are required";
    if (!standardLengths.trim()) nextErrors.standardLengths = "At least one length is required";
    const priceVal = parseFloat(price);
    if (!price.trim() || Number.isNaN(priceVal) || priceVal < 0) {
      nextErrors.price = "Enter a valid price (≥ 0)";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }
    setLoading(true);
    setSuccess(null);

    try {
      const id = generateId();
      const lengths = standardLengths
        .split(",")
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));
      if (lengths.length === 0) lengths.push(1, 3, 6);

      const unitPrice = parseFloat(price);
      const wpm = parseFloat(weightPerMeter) || 1;
      const spm = supplierPricePerMeter ? parseFloat(supplierPricePerMeter) : undefined;
      const spm2 = supplierPricePerSquareMeterSet ? parseFloat(supplierPricePerSquareMeterSet) : undefined;
      const body = {
        id,
        category: "custom_profile",
        name: nameEn || "",
        nameEn: nameEn || "",
        dimensions,
        pricePerKg: undefined,
        weightPerMeter: wpm,
        pricePerMeter: unitPrice,
        standardLengths: lengths,
        inStock,
        hidden,
        material: material || undefined,
        finish: finish || undefined,
        image: (images[0] || image || "").trim() || undefined,
        images: images.length ? images : undefined,
        priceUnit,
        supplierPricePerMeter: spm,
        supplierPricePerSquareMeterSet: spm2,
        applications: [MARKETING_CATEGORIES.find((c) => c.id === category)?.label ?? "Profile Systems"],
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create product");
      }

      setSuccess("Product created successfully!");
      setNameEn("");
      setDimensions("");
      setPrice("");
      setStandardLengths("1, 3, 6");
      setImage("");
      setSupplierPricePerMeter("");
      setSupplierPricePerSquareMeterSet("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Add product" segments={[{ label: "Products", href: "/admin/products" }, { label: "Add" }]} />
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <ComponentCard title="Product details">
          <div className="space-y-4">
            <div>
              <Label>Name (English)</Label>
              <Input
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="Angle 25x25x3mm"
                required
              />
              {fieldErrors.nameEn && <p className="mt-1 text-sm text-red-600">{fieldErrors.nameEn}</p>}
            </div>
            <div>
              <Label>Category</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white"
              >
                {MARKETING_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Dimensions (e.g. 25x25x3 or Ø20x2)</Label>
              <Input
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="25x25x3"
                required
              />
              {fieldErrors.dimensions && <p className="mt-1 text-sm text-red-600">{fieldErrors.dimensions}</p>}
            </div>
            <div>
              <Label>Price (£)</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="100.00"
                min={0}
                step={0.01}
              />
              {fieldErrors.price && <p className="mt-1 text-sm text-red-600">{fieldErrors.price}</p>}
            </div>
            <div>
              <Label>Price unit</Label>
              <select
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value as typeof priceUnit)}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white"
              >
                <option value="per m">per m</option>
                <option value="per m²">per m²</option>
                <option value="per set">per set</option>
                <option value="per item">per item</option>
              </select>
            </div>
            <div>
              <Label>Supplier price per m (reference)</Label>
              <Input
                type="number"
                value={supplierPricePerMeter}
                onChange={(e) => setSupplierPricePerMeter(e.target.value)}
                placeholder="e.g. 3.00"
                min={0}
                step={0.01}
              />
              <p className="mt-1 text-xs text-gray-500">
                Optional: original supplier price per running metre, for internal reference.
              </p>
            </div>
            <div>
              <Label>Supplier price per m² (per set, reference)</Label>
              <Input
                type="number"
                value={supplierPricePerSquareMeterSet}
                onChange={(e) => setSupplierPricePerSquareMeterSet(e.target.value)}
                placeholder="e.g. 146.55"
                min={0}
                step={0.01}
              />
              <p className="mt-1 text-xs text-gray-500">
                Optional: original supplier price per m² for a kit/set, for internal reference.
              </p>
            </div>
            <div>
              <Label>Standard lengths (comma-separated)</Label>
              <Input
                value={standardLengths}
                onChange={(e) => setStandardLengths(e.target.value)}
                placeholder="1, 3, 6"
              />
              {fieldErrors.standardLengths && <p className="mt-1 text-sm text-red-600">{fieldErrors.standardLengths}</p>}
            </div>
            <div>
              <Label>Material</Label>
              <Input
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="6063-T5"
              />
            </div>
            <div>
              <Label>Finish</Label>
              <Input
                value={finish}
                onChange={(e) => setFinish(e.target.value)}
                placeholder="Mill finish"
              />
            </div>
            <div>
              <MultiImageUpload
                values={images}
                onChange={setImages}
                label="Product images"
                hint="First image will be used as the main image. You can drag & drop multiple images or paste a list of URLs."
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="mb-0">In stock</Label>
              <ToggleSwitch enabled={inStock} setEnabled={setInStock} label="In stock" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label>Hidden from catalog</Label>
              <ToggleSwitch enabled={hidden} setEnabled={setHidden} label="Hidden (not shown on site)" />
            </div>
          </div>
        </ComponentCard>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create"}
          </button>
        </div>

        {success && (
          <p className="text-green-600">{success}</p>
        )}
        {error && (
          <p className="text-red-600">{error}</p>
        )}
      </form>
    </div>
  );
}

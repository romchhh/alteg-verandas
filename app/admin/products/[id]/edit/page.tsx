"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/admin/PageBreadCrumb";
import ComponentCard from "@/components/admin/ComponentCard";
import { useAdminToast } from "@/lib/AdminToastContext";
import Label from "@/components/admin/form/Label";
import Input from "@/components/admin/form/Input";
import ToggleSwitch from "@/components/admin/form/ToggleSwitch";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";
export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useAdminToast();
  const id = params.id as string;

  const MARKETING_CATEGORIES = [
    { id: "verandas", label: "Verandas & Canopies" },
    { id: "fencing", label: "Aluminium Fencing" },
    { id: "profiles", label: "Profile Systems" },
    { id: "accessories", label: "Accessories & Guttering" },
  ] as const;

  const [category, setCategory] = useState<string>(MARKETING_CATEGORIES[0].id);
  const [nameEn, setNameEn] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [pricePerKg, setPricePerKg] = useState("");
  const [weightPerMeter, setWeightPerMeter] = useState("");
  const [standardLengths, setStandardLengths] = useState("1, 3, 6");
  const [inStock, setInStock] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [material, setMaterial] = useState("");
  const [finish, setFinish] = useState("");
  const [image, setImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState<"per m" | "per m²" | "per set" | "per item">("per m");
  const [supplierPricePerMeter, setSupplierPricePerMeter] = useState("");
  const [supplierPricePerSquareMeterSet, setSupplierPricePerSquareMeterSet] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(null), 3000);
    return () => clearTimeout(t);
  }, [success]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Product not found");
            return;
          }
          throw new Error("Failed to fetch");
        }
        const p = await res.json();
        setNameEn(p.nameEn || p.name || "");
        const currentMarketing =
          (p.applications ?? []).find((a: string) =>
            MARKETING_CATEGORIES.some((c) => c.label === a)
          ) ?? MARKETING_CATEGORIES[0].label;
        const currentId =
          MARKETING_CATEGORIES.find((c) => c.label === currentMarketing)?.id ??
          MARKETING_CATEGORIES[0].id;
        setCategory(currentId);
        setDimensions(p.dimensions || "");
        const unitPrice = p.pricePerMeter ?? null;
        setPrice(unitPrice != null ? String(unitPrice) : "");
        setPriceUnit(
          (p.priceUnit as typeof priceUnit) ??
            (p.id.startsWith("LED-SET-") || p.id.startsWith("FENCE-SET-") || /set/i.test(p.nameEn)
              ? "per set"
              : "per m")
        );
        setWeightPerMeter(p.weightPerMeter != null ? String(p.weightPerMeter) : "");
        setStandardLengths(
          Array.isArray(p.standardLengths)
            ? p.standardLengths.join(", ")
            : "1, 3, 6"
        );
        setInStock(p.inStock ?? true);
        setHidden(p.hidden ?? false);
        setMaterial(p.material || "");
        setFinish(p.finish || "");
        setImage(p.image || "");
        setImages(
          Array.isArray(p.images) && p.images.length
            ? p.images
            : p.image
            ? [p.image]
            : []
        );
        setSupplierPricePerMeter(
          p.supplierPricePerMeter != null ? String(p.supplierPricePerMeter) : ""
        );
        setSupplierPricePerSquareMeterSet(
          p.supplierPricePerSquareMeterSet != null
            ? String(p.supplierPricePerSquareMeterSet)
            : ""
        );
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setFetchLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const lengths = standardLengths
        .split(",")
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));
      if (lengths.length === 0) lengths.push(1, 3, 6);

      const unitPrice = price ? parseFloat(price) : undefined;
      const wpm = parseFloat(weightPerMeter) || 0;
      const spm = supplierPricePerMeter ? parseFloat(supplierPricePerMeter) : undefined;
      const spm2 = supplierPricePerSquareMeterSet
        ? parseFloat(supplierPricePerSquareMeterSet)
        : undefined;
      const body = {
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
        image: (images[0] || image).trim(),
        images: images.length ? images : undefined,
        priceUnit,
        supplierPricePerMeter: spm,
        supplierPricePerSquareMeterSet: spm2,
        applications: [
          MARKETING_CATEGORIES.find((c) => c.id === category)?.label ?? "Profile Systems",
        ],
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update");
      }

      setSuccess("Product updated!");
      toast.show("Product updated!", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update";
      setError(msg);
      toast.show(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit product" segments={[{ label: "Products", href: "/admin/products" }, { label: "Edit" }]} />
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle={`Edit: ${nameEn || id}`} segments={[{ label: "Products", href: "/admin/products" }, { label: "Edit" }]} />
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div
            role="alert"
            className="flex items-center gap-3 rounded-xl border-2 border-green-500 bg-white px-6 py-5 shadow-xl"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <p className="text-xl font-semibold text-green-800">{success}</p>
          </div>
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-3 rounded-xl border-2 border-red-300 bg-red-50 px-5 py-4 shadow-sm"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
          <p className="text-lg font-semibold text-red-800">{error}</p>
        </div>
      )}
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
              <Label>Dimensions</Label>
              <Input
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                required
              />
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
                required
              />
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
                min={0}
                step={0.01}
              />
              <p className="mt-1 text-xs text-gray-500">
                Optional: original supplier price per m² for a kit/set, for internal reference.
              </p>
            </div>
            <div>
              <Label>Standard lengths</Label>
              <Input
                value={standardLengths}
                onChange={(e) => setStandardLengths(e.target.value)}
              />
            </div>
            <div>
              <Label>Material</Label>
              <Input value={material} onChange={(e) => setMaterial(e.target.value)} />
            </div>
            <div>
              <Label>Finish</Label>
              <Input value={finish} onChange={(e) => setFinish(e.target.value)} />
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
              <ToggleSwitch enabled={inStock} setEnabled={setInStock} label="" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label className="mb-0">Hidden from catalog</Label>
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
            {loading ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}

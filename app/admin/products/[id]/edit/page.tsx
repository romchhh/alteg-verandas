"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/admin/PageBreadCrumb";
import ComponentCard from "@/components/admin/ComponentCard";
import { useAdminToast } from "@/lib/AdminToastContext";
import Label from "@/components/admin/form/Label";
import Input from "@/components/admin/form/Input";
import ToggleSwitch from "@/components/admin/form/ToggleSwitch";
import { ImageUpload } from "@/components/admin/ImageUpload";
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
        setPricePerKg(
          p.pricePerKg != null
            ? String(p.pricePerKg)
            : p.pricePerMeter != null && p.weightPerMeter
            ? String((p.pricePerMeter / p.weightPerMeter).toFixed(2))
            : ""
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

      const pk = pricePerKg ? parseFloat(pricePerKg) : undefined;
      const wpm = parseFloat(weightPerMeter) || 0;
      const body = {
        category: "custom_profile",
        name: nameEn || "",
        nameEn: nameEn || "",
        dimensions,
        pricePerKg: pk,
        weightPerMeter: wpm,
        pricePerMeter: pk != null && wpm > 0 ? pk * wpm : undefined,
        standardLengths: lengths,
        inStock,
        hidden,
        material: material || undefined,
        finish: finish || undefined,
        image: image.trim(),
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
              <Label>Price per kg (£)</Label>
              <Input
                type="number"
                value={pricePerKg}
                onChange={(e) => setPricePerKg(e.target.value)}
                placeholder="4.20"
                min={0}
                step={0.01}
              />
              <p className="mt-1 text-xs text-gray-500">Price per m = price per kg × weight per m (kg/m)</p>
            </div>
            <div>
              <Label>Weight per m (kg/m)</Label>
              <Input
                type="number"
                value={weightPerMeter}
                onChange={(e) => setWeightPerMeter(e.target.value)}
                min={0}
                step={0.01}
                required
              />
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <Label className="text-gray-600">Price per m (calculated)</Label>
              <p className="text-lg font-semibold text-[#050544]">
                {pricePerKg && weightPerMeter && parseFloat(weightPerMeter) > 0
                  ? `£${(parseFloat(pricePerKg) * parseFloat(weightPerMeter)).toFixed(2)}`
                  : "—"}
              </p>
              <p className="text-xs text-gray-500">price per kg × weight per m</p>
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
              <ImageUpload
                label="Product image"
                value={image}
                onChange={setImage}
                hint="Drag and drop — saved as /uploads/..."
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

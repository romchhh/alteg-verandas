"use client";

import React, { useId, useState, useRef } from "react";
import { getUploadImageSrc, isServerUploadUrl } from "@/lib/utils/image";

interface MultiImageUploadProps {
  values: string[];
  onChange: (values: string[]) => void;
  label?: string;
  hint?: string;
}

export function MultiImageUpload({ values, onChange, label = "Images", hint }: MultiImageUploadProps) {
  const dropId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlList, setUrlList] = useState("");

  const addImages = (urls: string[]) => {
    const cleaned = urls
      .map((u) => u.trim())
      .filter((u) => u.length > 0);
    if (!cleaned.length) return;
    onChange([...values, ...cleaned]);
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    setError(null);
    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of list) {
        const formData = new FormData();
        formData.set("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok || !data?.url) {
          throw new Error(data?.error || "Upload failed");
        }
        newUrls.push(data.url as string);
      }
      addImages(newUrls);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
    e.target.value = "";
  };

  const handleAddUrls = () => {
    const urls = urlList
      .split(/\r?\n|,/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0);
    if (!urls.length) return;
    addImages(urls);
    setUrlList("");
  };

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      )}
      {hint && <p className="mb-1 text-xs text-gray-500">{hint}</p>}

      {values.length > 0 && (
        <div className="mb-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
          {values.map((url, index) => {
            const trimmed = url.trim();
            const isServer = isServerUploadUrl(trimmed);
            const src = isServer ? getUploadImageSrc(trimmed, true) : trimmed;
            return (
              <div key={url + index} className="relative group">
                <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                  {src ? (
                    // Use plain img here to allow external URLs without next/image domain config
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400 text-center px-1">
                      Invalid image
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onChange(values.filter((_, i) => i !== index))
                  }
                  className="absolute -top-1 -right-1 rounded-full bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center opacity-90 hover:opacity-100"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      <label
        htmlFor={dropId}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        className={`
          relative block border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${drag ? "border-gray-800 bg-gray-50" : "border-gray-300 hover:border-gray-400"}
          ${uploading ? "pointer-events-none opacity-70" : ""}
        `}
      >
        <input
          id={dropId}
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
        />
        {uploading ? (
          <p className="text-sm text-gray-500">Uploading images…</p>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              Drag &amp; drop multiple images here or click to select files
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPEG, PNG, GIF, WebP. You can upload several images at once.
            </p>
          </>
        )}
      </label>

      <div className="mt-3 space-y-1">
        <label className="block text-xs font-medium text-gray-700">
          Or paste image URLs (one per line)
        </label>
        <textarea
          value={urlList}
          onChange={(e) => setUrlList(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs shadow-sm focus:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-700"
          placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
        />
        <button
          type="button"
          onClick={handleAddUrls}
          className="mt-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
        >
          Add URLs
        </button>
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}


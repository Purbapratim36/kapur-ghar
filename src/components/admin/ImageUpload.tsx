"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, GripVertical } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  images: string[];
  onChange: (next: string[]) => void;
  max?: number;
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
}

export default function ImageUpload({ images, onChange, max = 8 }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);

  const uploadOne = useCallback(
    async (file: File) => {
      const id = crypto.randomUUID();
      setUploading((u) => [...u, { id, name: file.name, progress: 0 }]);

      try {
        const formData = new FormData();
        formData.append("file", file);

        // Use XMLHttpRequest so we can track upload progress
        const url = await new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/api/admin/upload");
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 100);
              setUploading((prev) =>
                prev.map((f) => (f.id === id ? { ...f, progress: pct } : f))
              );
            }
          };
          xhr.onload = () => {
            try {
              const json = JSON.parse(xhr.responseText);
              if (xhr.status >= 200 && xhr.status < 300 && json.url) {
                resolve(json.url);
              } else {
                reject(new Error(json.error || `Upload failed (${xhr.status})`));
              }
            } catch {
              reject(new Error("Invalid response from server"));
            }
          };
          xhr.onerror = () => reject(new Error("Network error"));
          xhr.send(formData);
        });

        return url;
      } finally {
        setUploading((prev) => prev.filter((f) => f.id !== id));
      }
    },
    []
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      const remaining = max - images.length - uploading.length;
      if (remaining <= 0) {
        toast.error(`Max ${max} images allowed`);
        return;
      }
      const toUpload = list.slice(0, remaining);
      if (list.length > remaining) {
        toast(`Only uploading first ${remaining} of ${list.length} files`);
      }

      const newUrls: string[] = [];
      for (const file of toUpload) {
        try {
          const url = await uploadOne(file);
          newUrls.push(url);
        } catch (err) {
          toast.error(`${file.name}: ${(err as Error).message}`);
        }
      }
      if (newUrls.length) {
        onChange([...images, ...newUrls]);
        toast.success(`${newUrls.length} image${newUrls.length === 1 ? "" : "s"} uploaded`);
      }
    },
    [images, max, uploading.length, uploadOne, onChange]
  );

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  };

  const removeAt = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  const totalSlots = images.length + uploading.length;

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      {totalSlots < max && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragOver
              ? "border-brand-red bg-brand-red/5"
              : "border-gray-300 hover:border-brand-red bg-gray-50/50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            onChange={onPick}
            className="hidden"
          />
          <UploadCloud className="h-10 w-10 text-brand-gold mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground">
            Drop images here or <span className="text-brand-red">click to browse</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1.5">
            JPEG, PNG, WebP, AVIF · max 5MB each · up to {max} images
          </p>
        </div>
      )}

      {/* Progress for in-flight uploads */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-3 p-3 bg-white border border-border rounded-lg"
            >
              <Loader2 className="h-4 w-4 text-brand-red animate-spin shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{f.name}</p>
                <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-red transition-all"
                    style={{ width: `${f.progress}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {f.progress}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">
            {images.length} image{images.length === 1 ? "" : "s"} · first one is the cover image · drag to reorder
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((url, idx) => (
              <div
                key={url + idx}
                className="relative group aspect-[3/4] rounded-lg overflow-hidden border border-border bg-muted"
              >
                <Image
                  src={url}
                  alt={`Product image ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 200px"
                />
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-brand-gold text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Cover
                  </span>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => move(idx, idx - 1)}
                    disabled={idx === 0}
                    className="bg-white/90 hover:bg-white text-foreground p-1.5 rounded-md disabled:opacity-30"
                    title="Move left"
                  >
                    <GripVertical className="h-3.5 w-3.5 rotate-90" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(idx, idx + 1)}
                    disabled={idx === images.length - 1}
                    className="bg-white/90 hover:bg-white text-foreground p-1.5 rounded-md disabled:opacity-30"
                    title="Move right"
                  >
                    <GripVertical className="h-3.5 w-3.5 -rotate-90" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(idx)}
                    className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-md"
                    title="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

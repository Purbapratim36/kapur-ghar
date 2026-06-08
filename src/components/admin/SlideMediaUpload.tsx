"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, Film, X } from "lucide-react";
import toast from "react-hot-toast";
import { uploadDirectToCloudinary } from "@/lib/upload-client";

interface SlideMediaUploadProps {
  type: "image" | "video";
  mediaUrl: string;
  posterUrl?: string | null;
  onChange: (data: { type: "image" | "video"; mediaUrl: string; posterUrl: string | null }) => void;
}

const MAX_IMAGE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO = 100 * 1024 * 1024; // 100 MB

export default function SlideMediaUpload({
  type: initialType,
  mediaUrl,
  posterUrl,
  onChange,
}: SlideMediaUploadProps) {
  const [type, setType] = useState<"image" | "video">(initialType);
  const [progress, setProgress] = useState<number | null>(null);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const switchType = (next: "image" | "video") => {
    setType(next);
    onChange({ type: next, mediaUrl: "", posterUrl: null });
  };

  const upload = async (file: File) => {
    const maxSize = type === "video" ? MAX_VIDEO : MAX_IMAGE;
    if (file.size > maxSize) {
      toast.error(`File too large. Max ${maxSize / 1024 / 1024}MB.`);
      return;
    }
    setProgress(0);
    try {
      const result = await uploadDirectToCloudinary(file, {
        resourceType: type,
        folder: type === "video" ? "kapur-ghar/hero-videos" : "kapur-ghar/hero",
        onProgress: setProgress,
      });
      onChange({
        type,
        mediaUrl: result.url,
        posterUrl: type === "image" ? null : posterUrl ?? null,
      });
      toast.success(`${type === "video" ? "Video" : "Image"} uploaded`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setProgress(null);
    }
  };

  const uploadPoster = async (file: File) => {
    if (file.size > MAX_IMAGE) {
      toast.error(`Poster too large. Max ${MAX_IMAGE / 1024 / 1024}MB.`);
      return;
    }
    setUploadingPoster(true);
    try {
      const result = await uploadDirectToCloudinary(file, {
        resourceType: "image",
        folder: "kapur-ghar/hero-posters",
      });
      onChange({ type, mediaUrl, posterUrl: result.url });
      toast.success("Poster uploaded");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploadingPoster(false);
    }
  };

  const clear = () => {
    onChange({ type, mediaUrl: "", posterUrl: null });
  };

  return (
    <div className="space-y-4">
      {/* Type toggle */}
      <div className="inline-flex rounded-lg border border-border bg-muted p-1">
        <button
          type="button"
          onClick={() => switchType("image")}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${
            type === "image"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          Image
        </button>
        <button
          type="button"
          onClick={() => switchType("video")}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${
            type === "video"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          Video
        </button>
      </div>

      {/* Current media preview */}
      {mediaUrl ? (
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black border border-border max-w-3xl">
          {type === "video" ? (
            <video
              src={mediaUrl}
              controls
              className="absolute inset-0 w-full h-full object-contain"
              poster={posterUrl || undefined}
            />
          ) : (
            <Image
              src={mediaUrl}
              alt="Slide preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          )}
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center"
            title="Remove"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          className="relative aspect-[16/9] max-w-3xl border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-brand-red bg-gray-50/50 flex flex-col items-center justify-center"
          onClick={() => fileInputRef.current?.click()}
        >
          {progress !== null ? (
            <div className="text-center w-2/3">
              <Loader2 className="h-8 w-8 text-brand-red animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium">Uploading… {progress}%</p>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-red transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              {type === "video" ? (
                <Film className="h-12 w-12 text-brand-gold mb-3" />
              ) : (
                <UploadCloud className="h-12 w-12 text-brand-gold mb-3" />
              )}
              <p className="text-sm font-semibold">
                Click to upload a {type}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {type === "video"
                  ? "MP4 / WebM / MOV · max 100 MB"
                  : "JPEG / PNG / WebP · max 10 MB"}
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={
              type === "video"
                ? "video/mp4,video/webm,video/quicktime,video/*"
                : "image/jpeg,image/png,image/webp,image/avif"
            }
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
            className="hidden"
          />
        </div>
      )}

      {/* Optional poster image for video */}
      {type === "video" && mediaUrl && (
        <div className="bg-gray-50 rounded-xl p-4 border border-border">
          <h4 className="text-sm font-semibold mb-1">
            Poster image{" "}
            <span className="text-muted-foreground font-normal text-xs">(optional)</span>
          </h4>
          <p className="text-xs text-muted-foreground mb-3">
            Shown before the video loads. If empty, the first frame of the video is used.
          </p>
          <div className="flex items-center gap-3">
            {posterUrl ? (
              <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-muted border">
                <Image src={posterUrl} alt="Poster" fill className="object-cover" sizes="128px" />
              </div>
            ) : (
              <div className="w-32 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-muted-foreground">
                No poster
              </div>
            )}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => posterInputRef.current?.click()}
                disabled={uploadingPoster}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-border rounded-md hover:bg-muted disabled:opacity-50"
              >
                {uploadingPoster ? "Uploading…" : posterUrl ? "Replace poster" : "Upload poster"}
              </button>
              {posterUrl && (
                <button
                  type="button"
                  onClick={() => onChange({ type, mediaUrl, posterUrl: null })}
                  className="px-3 py-1.5 text-xs font-medium text-red-500 hover:underline self-start"
                >
                  Remove poster
                </button>
              )}
              <input
                ref={posterInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadPoster(f);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

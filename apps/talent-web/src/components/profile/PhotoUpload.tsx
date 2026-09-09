import React, { useRef, useState } from "react";
import { Upload, X, User, Loader2, Camera } from "lucide-react";
import { Button, Alert } from "@blih/ui";

interface PhotoUploadProps {
  value?: string | null;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  value,
  onUpload,
  onDelete,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5 MB.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onUpload(file);
    } catch (err: any) {
      setError(err?.message || "Failed to upload photo.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await processFile(file);
  };

  const handleDelete = async () => {
    setError(null);
    setLoading(true);
    try {
      await onDelete();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setError(err?.message || "Failed to delete photo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 font-sans">
      <label className="block text-xs font-mono uppercase tracking-wider text-[#6E6678]">
        Profile Headshot
      </label>

      <div className="flex flex-col items-center gap-4 bg-[#EEF3FF]/40 border border-[#D9CEDF] rounded-3xl p-6">
        {/* Avatar Preview */}
        <div
          className={`relative h-28 w-28 rounded-full border-2 ${
            isDragging ? "border-[#1E5BFF] scale-105" : "border-[#1E5BFF]/20"
          } bg-[#EEF3FF] flex items-center justify-center overflow-hidden cursor-pointer group transition-all shadow-sm`}
          onClick={() => !loading && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Profile Photo"
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-12 w-12 text-[#1E5BFF]/50" />
          )}

          {/* Hover overlay */}
          {!loading && (
            <div className="absolute inset-0 bg-[#17131F]/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <Camera className="h-6 w-6 text-white" />
              <span className="text-[11px] font-mono text-white font-medium mt-1">
                {value ? "Change" : "Upload"}
              </span>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#1E5BFF]" />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            leftIcon={<Upload className="h-4 w-4" />}
            fullWidth
          >
            {value ? "Replace Photo" : "Upload Photo"}
          </Button>
          {value && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={loading}
              className="text-[#EF4444] border-[#EF4444]/30 hover:bg-[#EF4444]/10"
              leftIcon={<X className="h-4 w-4" />}
            >
              Remove
            </Button>
          )}
        </div>

        <p className="text-xs font-mono text-[#6E6678] text-center">
          JPG, PNG, or WebP · Max 5 MB
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <Alert variant="error" className="py-2 px-3 text-xs">
          {error}
        </Alert>
      )}
    </div>
  );
};
export default PhotoUpload;

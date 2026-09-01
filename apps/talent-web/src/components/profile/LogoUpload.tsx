import React, { useRef, useState } from "react";
import { Upload, X, Building, Loader2, ImageIcon } from "lucide-react";
import { Button, Alert } from "@blih/ui";

interface LogoUploadProps {
  value?: string | null;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
}

export const LogoUpload: React.FC<LogoUploadProps> = ({
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
      setError(err?.message || "Failed to upload company logo.");
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
      setError(err?.message || "Failed to delete company logo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 font-sans">
      <label className="block text-xs font-mono uppercase tracking-wider text-[#6E6678]">
        Brand Logo Image
      </label>

      {/* Logo Drop Zone */}
      <div
        className={`relative w-full aspect-video max-h-48 rounded-3xl border-2 border-dashed ${
          isDragging
            ? "border-[#1E5BFF] bg-[#EEF3FF]"
            : "border-[#D9CEDF] bg-[#EEF3FF]/40 hover:border-[#1E5BFF]/50 hover:bg-[#EEF3FF]/70"
        } flex flex-col items-center justify-center overflow-hidden cursor-pointer group transition-all`}
        onClick={() => !loading && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Company Logo"
              className="max-h-full max-w-full object-contain p-4"
            />
            {/* Hover overlay */}
            {!loading && (
              <div className="absolute inset-0 bg-[#17131F]/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ImageIcon className="h-6 w-6 text-white" />
                <span className="text-xs font-mono text-white font-medium mt-1">
                  Change Logo
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4 px-3 text-center pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#D9CEDF] flex items-center justify-center text-[#1E5BFF] shadow-sm">
              <Building className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold font-display text-[#17131F]">
              Upload Company Logo
            </p>
            <p className="text-xs text-[#6E6678] font-sans">
              Click or drag an image here
            </p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#1E5BFF]" />
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          leftIcon={<Upload className="h-4 w-4" />}
          fullWidth
        >
          {value ? "Replace Logo" : "Upload Logo"}
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
export default LogoUpload;

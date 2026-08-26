import React, { useRef, useState } from "react";
import { Upload, X, User, Loader2, Camera } from "lucide-react";
import { Button, Alert } from "@/components/ui";

interface PhotoUploadProps {
  value?: string | null;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ value, onUpload, onDelete }) => {
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
    <div className="space-y-3 font-sans">
      <label className="block w-full text-left text-xs font-semibold text-foreground uppercase tracking-widest pt-1.5">
        Profile Photo
      </label>

      <div className="flex flex-col items-center gap-4">
        {/* Avatar Preview */}
        <div
          className={`relative h-28 w-28 rounded-full border-2 ${isDragging ? "border-primary" : "border-border"} bg-muted flex items-center justify-center overflow-hidden cursor-pointer group transition-all`}
          onClick={() => !loading && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Profile Photo" className="h-full w-full object-cover" />
          ) : (
            <User className="h-12 w-12 text-muted-foreground/60" />
          )}

          {/* Hover overlay */}
          {!loading && (
            <div className="absolute inset-0 bg-foreground/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <Camera className="h-5 w-5 text-white" />
              <span className="text-[0.625rem] text-white font-medium mt-1">{value ? "Change" : "Upload"}</span>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
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
            leftIcon={<Upload className="h-3.5 w-3.5" />}
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
              className="text-destructive border-destructive/20 hover:bg-destructive/10"
              leftIcon={<X className="h-3.5 w-3.5" />}
            >
              Remove
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
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
        <Alert variant="error" className="mt-2 py-2 px-3 text-xs">
          {error}
        </Alert>
      )}
    </div>
  );
};
export default PhotoUpload;

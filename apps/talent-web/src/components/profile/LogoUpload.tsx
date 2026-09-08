import React, { useRef, useState } from "react";
import { Upload, Trash2, Building2, Loader2, ImagePlus, CheckCircle2 } from "lucide-react";
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
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Only PNG, JPG, WebP, and SVG logos are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be 5 MB or less.");
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

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div className="w-full space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 bg-gradient-to-br from-[#FAFBFF] via-white to-[#F4FAF6]/40 p-6 rounded-3xl border border-[#D9CEDF]/80 shadow-[0_4px_20px_rgba(30,91,255,0.03)]">
        {/* Left: Avatar Preview Frame */}
        <div
          onClick={() => !loading && fileInputRef.current?.click()}
          className="relative group shrink-0 self-center sm:self-auto cursor-pointer"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border-2 border-[#D9CEDF] group-hover:border-[#1E5BFF] transition-all duration-200 overflow-hidden flex items-center justify-center shadow-sm relative">
            {value ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="Company Brand Logo"
                className="w-full h-full object-contain p-2.5 transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#1E5BFF] bg-[#EEF3FF] w-full h-full">
                <Building2 className="w-10 h-10 stroke-[1.75]" />
              </div>
            )}

            {/* Hover overlay for quick click change */}
            {!loading && (
              <div className="absolute inset-0 bg-[#17131F]/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white gap-1 p-2 text-center">
                <ImagePlus className="w-5 h-5 text-white" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                  {value ? "Change" : "Upload"}
                </span>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-[#1E5BFF] animate-spin" />
              </div>
            )}
          </div>

          {value && (
            <div className="absolute -top-1.5 -right-1.5 bg-[#2E8F79] text-white p-1 rounded-full shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Right: Drag-and-Drop Area & Info */}
        <div className="flex-1 space-y-3.5 min-w-0">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-display font-bold text-base text-[#17131F] flex items-center justify-center sm:justify-start gap-2">
              <span>Brand Logo & Identity</span>
            </h3>
            <p className="text-xs text-[#6E6678] leading-relaxed">
              Upload your official high-resolution logo. Displayed on your public profile, company cards, and job listings.
            </p>
          </div>

          {/* Interactive Drag & Drop Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !loading && fileInputRef.current?.click()}
            className={`p-3.5 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-3 ${
              isDragging
                ? "border-[#1E5BFF] bg-[#EEF3FF]"
                : "border-[#D9CEDF] bg-white hover:border-[#1E5BFF]/60 hover:bg-[#EEF3FF]/30"
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs text-[#4E4656] pointer-events-none">
              <Upload className="w-4 h-4 text-[#1E5BFF] shrink-0" />
              <span className="font-medium">
                {isDragging ? "Drop your file here" : "Click to select or drag logo file here"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-center">
              {["PNG", "JPG", "WEBP", "SVG"].map((fmt) => (
                <span
                  key={fmt}
                  className="px-2 py-0.5 bg-[#EEF3FF] text-[#1E5BFF] text-[10px] font-mono font-bold rounded-md"
                >
                  {fmt}
                </span>
              ))}
              <span className="px-2 py-0.5 bg-[#F5F2F7] text-[#6E6678] text-[10px] font-mono font-semibold rounded-md">
                Max 5 MB
              </span>
            </div>
          </div>

          {/* Action buttons line */}
          <div className="flex items-center gap-2 pt-0.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              leftIcon={<Upload className="w-3.5 h-3.5 text-[#1E5BFF]" />}
              className="text-xs font-mono font-semibold"
            >
              {value ? "Choose New Logo" : "Upload File"}
            </Button>

            {value && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={loading}
                leftIcon={<Trash2 className="w-3.5 h-3.5 text-[#EF4444]" />}
                className="text-xs font-mono text-[#EF4444] border-[#F8C8C8] hover:bg-[#FDF2F2]"
              >
                Remove Logo
              </Button>
            )}
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <Alert variant="error" className="py-2.5 px-4 text-xs rounded-xl">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default LogoUpload;


import React, { useRef, useState } from "react";
import { Upload, FileText, X, Loader2, Download, CheckCircle2 } from "lucide-react";
import { Button, Alert, Badge } from "@blih/ui";

interface CvUploadProps {
  value?: string | null;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
}

export const CvUpload: React.FC<CvUploadProps> = ({ value, onUpload, onDelete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10 MB.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onUpload(file);
    } catch (err: any) {
      setError(err?.message || "Failed to upload CV.");
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
      setError(err?.message || "Failed to delete CV.");
    } finally {
      setLoading(false);
    }
  };

  const getFriendlyFileName = (url: string) => {
    try {
      const parts = url.split("/");
      return parts[parts.length - 1];
    } catch {
      return "curriculum_vitae.pdf";
    }
  };

  return (
    <div className="space-y-4 font-sans">
      <label className="block text-xs font-mono uppercase tracking-wider text-[#6E6678]">
        Curriculum Vitae (CV / Resume)
      </label>

      {value ? (
        /* Uploaded state — document card */
        <div className="border border-[#D9CEDF] rounded-3xl bg-white overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 p-5">
            <div className="h-12 w-12 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#17131F] truncate font-display">
                {getFriendlyFileName(value)}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge variant="verified" size="sm">
                  CV Verified & Ready
                </Badge>
              </div>
            </div>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 p-2 rounded-xl text-[#1E5BFF] hover:bg-[#EEF3FF] transition-colors"
              title="Download CV"
            >
              <Download className="h-5 w-5" />
            </a>
          </div>
          <div className="border-t border-[#D9CEDF] px-5 py-3 bg-[#EEF3FF]/30 flex items-center justify-between">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="text-xs font-mono text-[#1E5BFF] hover:underline cursor-pointer"
            >
              Replace Document
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={loading}
              className="text-[#EF4444] hover:bg-[#EF4444]/10 h-8 px-2.5"
              leftIcon={loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        /* Empty drop zone */
        <div
          onClick={() => !loading && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
            isDragging
              ? "border-[#1E5BFF] bg-[#EEF3FF]"
              : "border-[#D9CEDF] bg-[#EEF3FF]/40 hover:border-[#1E5BFF]/50 hover:bg-[#EEF3FF]/70"
          }`}
        >
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-[#1E5BFF] mb-3" />
          ) : (
            <div className="h-12 w-12 rounded-2xl bg-white border border-[#D9CEDF] flex items-center justify-center text-[#1E5BFF] mb-3 shadow-sm">
              <Upload className="h-6 w-6" />
            </div>
          )}
          <p className="text-sm font-bold text-[#17131F] font-display">
            {loading ? "Uploading CV…" : "Upload your CV / Resume"}
          </p>
          <p className="text-xs text-[#6E6678] font-sans mt-1">
            Click to browse or drag & drop a PDF document
          </p>
          <p className="text-xs font-mono text-[#6E6678]/70 mt-1">PDF format · Max 10 MB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
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
export default CvUpload;

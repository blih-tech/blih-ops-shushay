import React, { useRef, useState } from "react";
import { Upload, FileText, X, Loader2, Download, RefreshCw, Trash2 } from "lucide-react";
import { Button, Alert, Badge } from "@blih/ui";
import { getErrorMessage } from "@blih/api-client";

interface CvUploadProps {
  value?: string | null;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
}

export const CvUpload: React.FC<CvUploadProps> = ({
  value,
  onUpload,
  onDelete,
}) => {
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
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to upload CV.");
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
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to delete CV.");
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
    <div className="space-y-4 font-sans flex flex-col h-full">
      <label className="block text-xs font-mono uppercase tracking-wider text-[#6E6678]">
        Curriculum Vitae (CV / Resume)
      </label>

      {value ? (
        /* Uploaded state — document card */
        <div className="border border-[#D9CEDF] rounded-3xl bg-white overflow-hidden shadow-sm flex flex-col justify-between flex-1 min-h-[220px]">
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
          <div className="border-t border-[#D9CEDF] px-5 py-3.5 bg-[#EEF3FF]/30 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              leftIcon={<RefreshCw className="h-3.5 w-3.5 text-[#1E5BFF]" />}
              className="text-xs font-semibold hover:border-[#1E5BFF]/40 hover:bg-[#EEF3FF] transition-all"
            >
              Replace Document
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={loading}
              leftIcon={
                loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#EF4444]" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5 text-[#EF4444]" />
                )
              }
              className="text-[#EF4444] border-[#FCA5A5]/60 bg-[#FEF2F2]/60 hover:bg-[#FEE2E2] hover:border-[#F87171] text-xs font-semibold transition-all shrink-0"
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        /* Empty drop zone */
        <div
          onClick={() => !loading && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all flex-1 min-h-[220px] ${
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
          <p className="text-xs font-mono text-[#6E6678]/70 mt-1">
            PDF format · Max 10 MB
          </p>
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

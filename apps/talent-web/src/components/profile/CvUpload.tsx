import React, { useRef, useState } from "react";
import { Upload, FileText, X, Loader2, Download, CheckCircle2 } from "lucide-react";
import { Button, Alert } from "@/components/ui";

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
    <div className="space-y-3 font-sans">
      <label className="block w-full text-left text-xs font-semibold text-foreground uppercase tracking-widest pt-1.5">
        Curriculum Vitae (CV)
      </label>

      {value ? (
        /* Uploaded state — document card */
        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <div className="flex items-center gap-3 p-4">
            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">
                {getFriendlyFileName(value)}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">CV uploaded</span>
              </div>
            </div>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-primary hover:text-primary/70 transition-colors"
              title="Download CV"
            >
              <Download className="h-4 w-4" />
            </a>
          </div>
          <div className="border-t border-border px-4 py-2 bg-muted/30 flex items-center justify-between">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Replace file
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={loading}
              className="text-xs text-destructive hover:bg-destructive/10 h-7 px-2"
              leftIcon={loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
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
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${isDragging
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
            }`}
        >
          {loading ? (
            <Loader2 className="h-7 w-7 animate-spin text-primary mb-3" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <p className="text-sm font-semibold text-foreground">
            {loading ? "Uploading…" : "Upload your CV"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Click to browse or drag & drop a PDF
          </p>
          <p className="text-xs text-muted-foreground/70 mt-0.5">PDF format · Max 10 MB</p>
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
        <Alert variant="error" className="mt-2 py-2 px-3 text-xs">
          {error}
        </Alert>
      )}
    </div>
  );
};
export default CvUpload;

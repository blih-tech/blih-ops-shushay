import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Briefcase,
  Loader2,
  Check,
} from "lucide-react";
import { Experience } from "@/types/profile";
import {
  addExperience,
  updateExperience,
  deleteExperience,
} from "@/lib/talentApi";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Textarea,
  Checkbox,
  FormField,
  Alert,
  Badge,
  ConfirmDialog,
} from "@blih/ui";

interface ExperienceFormProps {
  entries: Experience[];
  onRefresh: () => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({
  entries,
  onRefresh,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [current, setCurrent] = useState(false);
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setTitle("");
    setCompany("");
    setStartDate("");
    setEndDate("");
    setCurrent(false);
    setDescription("");
    setError(null);
  };

  const handleEditInit = (exp: Experience) => {
    setEditingId(exp.id);
    setIsAdding(false);
    setTitle(exp.title);
    setCompany(exp.company);
    setStartDate(
      exp.startDate ? new Date(exp.startDate).toISOString().split("T")[0] : "",
    );
    setEndDate(
      exp.endDate ? new Date(exp.endDate).toISOString().split("T")[0] : "",
    );
    setCurrent(exp.current);
    setDescription(exp.description || "");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim() || !startDate) {
      setError("Job Title, Company, and Start Date are required.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      title,
      company,
      startDate: new Date(startDate).toISOString(),
      endDate: current ? null : endDate ? new Date(endDate).toISOString() : null,
      current,
      description: description.trim() || null,
    };

    try {
      if (editingId) {
        await updateExperience(editingId, payload);
      } else {
        await addExperience(payload);
      }
      onRefresh();
      setEditingId(null);
      setIsAdding(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || "Failed to save experience.");
    } finally {
      setLoading(false);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setLoading(true);
    try {
      await deleteExperience(deletingId);
      setDeletingId(null);
      onRefresh();
    } catch (err: any) {
      setError(err.message || "Failed to delete experience.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="border-[#D9CEDF] shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#1E5BFF]" /> Work Experience
          </CardTitle>
          <CardDescription>
            Highlight your career history and key contributions.
          </CardDescription>
        </div>
        {!isAdding && !editingId && (
          <Button
            size="sm"
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Experience
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {error && <Alert variant="error">{error}</Alert>}

        {(isAdding || editingId) && (
          <form onSubmit={handleSave} className="p-4 bg-[#F8F6F9] rounded-xl border border-[#D9CEDF] space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#D9CEDF]">
              <h4 className="font-semibold text-sm text-[#17131F]">
                {editingId ? "Edit Experience" : "New Experience Record"}
              </h4>
              <Badge variant="outline">{current ? "Current Role" : "Past Role"}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Job Title" required>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Frontend Engineer" />
              </FormField>
              <FormField label="Company" required>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Gebeya Tech" />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Start Date" required>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </FormField>
              <FormField label="End Date" helperText={current ? "Currently working here" : ""}>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={current} />
              </FormField>
            </div>

            <Checkbox label="I currently work in this role" checked={current} onChange={(e) => setCurrent(e.target.checked)} />

            <FormField label="Key Contributions / Description">
              <Textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe impact, tech stack, and achievements..."
                maxLength={1000}
                showCharCount
              />
            </FormField>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}>Cancel</Button>
              <Button type="submit" size="sm" disabled={loading} leftIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}>Save Record</Button>
            </div>
          </form>
        )}

        <div className="divide-y divide-[#D9CEDF]">
          {entries.length === 0 && !isAdding && !editingId ? (
            <p className="text-sm text-[#6E6678] py-4 text-center">No experience entries added yet.</p>
          ) : (
            entries.map((exp) => (
              <div key={exp.id} className="py-4 flex justify-between items-start group">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#17131F] text-base">{exp.title}</h4>
                    {exp.current && <Badge variant="primary" size="sm">Current</Badge>}
                  </div>
                  <p className="text-sm text-[#1E5BFF] font-medium">{exp.company}</p>
                  <p className="text-xs font-mono text-[#6E6678] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 inline" />
                    {formatDate(exp.startDate)} – {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                  </p>
                  {exp.description && <p className="text-sm text-[#6E6678] pt-1 whitespace-pre-line">{exp.description}</p>}
                </div>
                <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="sm" onClick={() => handleEditInit(exp)}><Edit2 className="w-3.5 h-3.5" /></Button>
                  <Button variant="outline" size="sm" onClick={() => setDeletingId(exp.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Experience"
        message="Are you sure you want to delete this experience record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={loading}
      />
    </Card>
  );
};

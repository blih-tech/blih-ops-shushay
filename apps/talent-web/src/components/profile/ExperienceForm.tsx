import React, { useState } from "react";
import { Plus, Trash2, Edit2, Calendar, Briefcase, Loader2, Check } from "lucide-react";
import { Experience } from "@/types/profile";
import { addExperience, updateExperience, deleteExperience } from "@/lib/talentApi";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Textarea, Checkbox, FormField, Alert, Badge } from "@/components/ui";

interface ExperienceFormProps {
  entries: Experience[];
  onRefresh: () => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ entries, onRefresh }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states
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
    setStartDate(exp.startDate ? new Date(exp.startDate).toISOString().split("T")[0] : "");
    setEndDate(exp.endDate ? new Date(exp.endDate).toISOString().split("T")[0] : "");
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
      resetForm();
      setIsAdding(false);
      setEditingId(null);
      onRefresh();
    } catch (err: any) {
      setError(err?.message || "Failed to save experience entry.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteExperience(id);
      onRefresh();
    } catch (err: any) {
      setError(err?.message || "Failed to delete experience entry.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    });
  };

  return (
    <Card className="border border-[#D9CEDF] rounded-3xl shadow-[0_4px_20px_rgba(23,19,31,0.03)] overflow-hidden font-sans bg-white">
      <CardHeader className="px-5 py-5 sm:px-8 sm:py-6 border-b border-[#D9CEDF] bg-gradient-to-r from-[#EEF3FF] via-[#F7F9FF] to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-[#D9CEDF] text-[#1E5BFF] flex items-center justify-center shadow-sm shrink-0">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-[#17131F] font-display">
              Work Experience
            </CardTitle>
            <CardDescription className="text-sm text-[#6E6678] font-sans">
              Your professional work history in reverse chronological order.
            </CardDescription>
          </div>
        </div>
        {!isAdding && !editingId && (
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Experience
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-0 divide-y divide-[#D9CEDF]/70 bg-white">
        {error && (
          <div className="p-6 pb-0">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {/* Add/Edit Form Box */}
        {(isAdding || editingId) && (
          <div className="p-6 sm:p-8 bg-[#EEF3FF]/30 border-b border-[#D9CEDF]">
            <form onSubmit={handleSave} className="space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-lg font-bold text-[#17131F]">
                  {editingId ? "Edit Experience Entry" : "New Experience Entry"}
                </h4>
                <Badge variant="primary" size="sm">
                  {editingId ? "Updating record" : "New record"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Job Title" required>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                    maxLength={100}
                    disabled={loading}
                  />
                </FormField>

                <FormField label="Company Name" required>
                  <Input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google"
                    maxLength={100}
                    disabled={loading}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Start Date" required>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={loading}
                  />
                </FormField>

                <FormField label="End Date">
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={loading || current}
                  />
                </FormField>
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="current-experience"
                  checked={current}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setCurrent(isChecked);
                    if (isChecked) setEndDate("");
                  }}
                  disabled={loading}
                  label={<span className="text-sm font-medium text-[#17131F] cursor-pointer select-none">I currently work here</span>}
                />
              </div>

              <FormField label="Job Description & Key Achievements">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline key systems delivered, technical stack used, and direct outcomes..."
                  rows={3}
                  maxLength={500}
                  disabled={loading}
                />
              </FormField>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={loading}
                  leftIcon={<Check className="h-4 w-4" />}
                >
                  Save Entry
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Existing List */}
        {entries.length === 0 && !isAdding && !editingId ? (
          <div className="p-8 text-center text-sm text-[#6E6678]">
            No experience records added yet. Click &quot;Add Experience&quot; to build your profile history.
          </div>
        ) : (
          entries.map((exp) => (
            <div
              key={exp.id}
              className="p-6 sm:p-8 transition-colors hover:bg-[#EEF3FF]/20 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="font-display font-bold text-lg text-[#17131F]">
                    {exp.title}
                  </h4>
                  {exp.current && (
                    <Badge variant="verified" size="sm">
                      Current Role
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-semibold text-[#1E5BFF]">{exp.company}</p>
                <div className="flex items-center gap-2 text-xs font-mono text-[#6E6678]">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {formatDate(exp.startDate)} – {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-sm text-[#6E6678] mt-2 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditInit(exp)}
                  disabled={loading || isAdding || editingId !== null}
                  leftIcon={<Edit2 className="h-3.5 w-3.5" />}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(exp.id)}
                  disabled={loading}
                  className="text-[#EF4444] hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
                  leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
export default ExperienceForm;

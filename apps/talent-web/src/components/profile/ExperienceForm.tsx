import React, { useState } from "react";
import { Plus, Trash2, Edit2, Calendar, Briefcase, Loader2, Check } from "lucide-react";
import { Experience } from "@/types/profile";
import { addExperience, updateExperience, deleteExperience } from "@/lib/talentApi";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Textarea, Checkbox, FormField, Alert } from "@/components/ui";

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

    // Format dates to YYYY-MM-DD for input[type="date"]
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
    <Card className="border border-border shadow-none rounded-xl overflow-hidden font-sans">
      <CardHeader className="px-6 py-5 border-b border-border bg-muted/40 flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base font-semibold text-foreground font-sans flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            Work Experience
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-0.5">
            Your professional work history in reverse chronological order.
          </CardDescription>
        </div>
        {!isAdding && !editingId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            Add Experience
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-0 divide-y divide-border">
        {error && (
          <div className="p-6 pb-0">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {/* Add/Edit Form Box */}
        {(isAdding || editingId) && (
          <div className="p-6 bg-muted/20 border-b border-border">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-base font-semibold text-foreground">
                  {editingId ? "Edit Experience Entry" : "New Experience Entry"}
                </h4>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  {editingId ? "Updating record" : "New record"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Job Title" required>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= 100) setTitle(val);
                    }}
                    placeholder="e.g. Senior Frontend Developer"
                    maxLength={100}
                    disabled={loading}
                  />
                </FormField>

                <FormField label="Company Name" required>
                  <Input
                    type="text"
                    value={company}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= 100) setCompany(val);
                    }}
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
                  label={<span className="text-sm font-medium text-body cursor-pointer select-none">I currently work here</span>}
                />
              </div>

              <FormField label="Job Description">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize your main responsibilities, technologies used, and key achievements..."
                  maxLength={1000}
                  disabled={loading}
                  rows={3}
                />
              </FormField>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button
                  variant="outline"
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
                  disabled={loading}
                  leftIcon={loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                >
                  {editingId ? "Save Changes" : "Save Experience"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Entries List */}
        {entries.length > 0 ? (
          entries.map((exp) => (
            <div
              key={exp.id}
              className="p-6 transition-colors hover:bg-muted/30 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h4 className="font-semibold text-foreground text-base">
                    {exp.title}
                  </h4>
                  <span className="text-muted-foreground text-sm">·</span>
                  <span className="text-sm font-medium text-primary">
                    {exp.company}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {formatDate(exp.startDate)} –{" "}
                    {exp.current ? (
                      <span className="text-green-600 font-semibold font-sans">Present</span>
                    ) : exp.endDate ? (
                      formatDate(exp.endDate)
                    ) : (
                      ""
                    )}
                  </span>
                </div>

                {exp.description && (
                  <p className="text-sm text-body leading-relaxed pt-1 whitespace-pre-line max-w-3xl">
                    {exp.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 self-start">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditInit(exp)}
                  disabled={loading}
                  className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                  leftIcon={<Edit2 className="h-3.5 w-3.5" />}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(exp.id)}
                  disabled={loading}
                  className="h-8 px-2.5 text-xs text-destructive hover:bg-destructive/10"
                  leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          !isAdding && !editingId && (
            <div className="p-8 text-center space-y-2">
              <Briefcase className="h-8 w-8 text-muted-foreground/40 mx-auto" />
              <p className="text-sm font-medium text-foreground">No work experience listed yet</p>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Add your previous positions to showcase your career journey to potential employers.
              </p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};
export default ExperienceForm;

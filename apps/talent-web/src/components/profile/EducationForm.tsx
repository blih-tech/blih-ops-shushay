import React, { useState } from "react";
import { Plus, Trash2, Edit2, Calendar, GraduationCap, Loader2, Check } from "lucide-react";
import { Education } from "@/types/profile";
import { addEducation, updateEducation, deleteEducation } from "@/lib/talentApi";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Input, FormField, Alert } from "@/components/ui";

interface EducationFormProps {
  entries: Education[];
  onRefresh: () => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ entries, onRefresh }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [field, setField] = useState("");
  const [startYear, setStartYear] = useState<number | "">("");
  const [endYear, setEndYear] = useState<number | "">("");

  const resetForm = () => {
    setInstitution("");
    setDegree("");
    setField("");
    setStartYear("");
    setEndYear("");
    setError(null);
  };

  const handleEditInit = (edu: Education) => {
    setEditingId(edu.id);
    setIsAdding(false);
    setInstitution(edu.institution);
    setDegree(edu.degree);
    setField(edu.field || "");
    setStartYear(edu.startYear);
    setEndYear(edu.endYear || "");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim() || !startYear) {
      setError("Institution, Degree, and Start Year are required.");
      return;
    }

    if (endYear && Number(endYear) < Number(startYear)) {
      setError("End Year cannot be earlier than Start Year.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      institution,
      degree,
      field: field.trim() || null,
      startYear: Number(startYear),
      endYear: endYear ? Number(endYear) : null,
    };

    try {
      if (editingId) {
        await updateEducation(editingId, payload);
      } else {
        await addEducation(payload);
      }
      resetForm();
      setIsAdding(false);
      setEditingId(null);
      onRefresh();
    } catch (err: any) {
      setError(err?.message || "Failed to save education entry.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteEducation(id);
      onRefresh();
    } catch (err: any) {
      setError(err?.message || "Failed to delete education entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-border shadow-none rounded-xl overflow-hidden font-sans">
      <CardHeader className="px-6 py-5 border-b border-border bg-muted/40 flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base font-semibold text-foreground font-sans flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            Education
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-0.5">
            Academic degrees, certifications, and programs attended.
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
            Add Education
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
                  {editingId ? "Edit Education Entry" : "New Education Entry"}
                </h4>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  {editingId ? "Updating record" : "New record"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="School / Institution" required>
                  <Input
                    type="text"
                    value={institution}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= 100) setInstitution(val);
                    }}
                    placeholder="e.g. Addis Ababa University"
                    maxLength={100}
                    disabled={loading}
                  />
                </FormField>

                <FormField label="Degree / Certificate" required>
                  <Input
                    type="text"
                    value={degree}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= 100) setDegree(val);
                    }}
                    placeholder="e.g. Bachelor of Science"
                    maxLength={100}
                    disabled={loading}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="Field of Study">
                  <Input
                    type="text"
                    value={field}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= 100) setField(val);
                    }}
                    placeholder="e.g. Computer Science"
                    maxLength={100}
                    disabled={loading}
                  />
                </FormField>

                <FormField label="Start Year" required>
                  <Input
                    type="number"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value ? parseInt(e.target.value, 10) : "")}
                    placeholder="e.g. 2018"
                    min={1900}
                    max={new Date().getFullYear() + 10}
                    disabled={loading}
                  />
                </FormField>

                <FormField label="End Year (or Expected)">
                  <Input
                    type="number"
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value ? parseInt(e.target.value, 10) : "")}
                    placeholder="e.g. 2022"
                    min={1900}
                    max={new Date().getFullYear() + 10}
                    disabled={loading}
                  />
                </FormField>
              </div>

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
                  {editingId ? "Save Changes" : "Save Education"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Entries List */}
        {entries.length > 0 ? (
          entries.map((edu) => (
            <div
              key={edu.id}
              className="p-6 transition-colors hover:bg-muted/30 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h4 className="font-semibold text-foreground text-base">
                    {edu.degree}
                  </h4>
                  <span className="text-muted-foreground text-sm">·</span>
                  <span className="text-sm font-medium text-body">
                    {edu.institution}
                    {edu.field ? ` (${edu.field})` : ""}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {edu.startYear} – {edu.endYear || "Present"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 self-start">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditInit(edu)}
                  disabled={loading}
                  className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                  leftIcon={<Edit2 className="h-3.5 w-3.5" />}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(edu.id)}
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
              <GraduationCap className="h-8 w-8 text-muted-foreground/40 mx-auto" />
              <p className="text-sm font-medium text-foreground">No education history listed yet</p>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Add your academic degrees and educational background.
              </p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};
export default EducationForm;

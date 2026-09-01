import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  GraduationCap,
  Loader2,
  Check,
} from "lucide-react";
import { Education } from "@/types/profile";
import {
  addEducation,
  updateEducation,
  deleteEducation,
} from "@/lib/talentApi";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  FormField,
  Alert,
  Badge,
} from "@blih/ui";

interface EducationFormProps {
  entries: Education[];
  onRefresh: () => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({
  entries,
  onRefresh,
}) => {
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
    if (!confirm("Are you sure you want to delete this education entry?"))
      return;
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
    <Card className="border border-[#D9CEDF] rounded-3xl shadow-[0_4px_20px_rgba(23,19,31,0.03)] overflow-hidden font-sans bg-white">
      <CardHeader className="px-5 py-5 sm:px-8 sm:py-6 border-b border-[#D9CEDF] bg-gradient-to-r from-[#EEF3FF] via-[#F7F9FF] to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-[#D9CEDF] text-[#1E5BFF] flex items-center justify-center shadow-sm shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-[#17131F] font-display">
              Education & Degrees
            </CardTitle>
            <CardDescription className="text-sm text-[#6E6678] font-sans">
              Your academic background, certifications, and institutions
              attended.
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
            Add Education
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
                  {editingId ? "Edit Education Entry" : "New Education Entry"}
                </h4>
                <Badge variant="primary" size="sm">
                  {editingId ? "Updating record" : "New record"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Institution / University" required>
                  <Input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. Addis Ababa University"
                    maxLength={100}
                    disabled={loading}
                  />
                </FormField>

                <FormField label="Degree Type" required>
                  <Input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. Bachelor of Science (B.Sc.)"
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
                    onChange={(e) => setField(e.target.value)}
                    placeholder="e.g. Computer Science"
                    maxLength={100}
                    disabled={loading}
                  />
                </FormField>

                <FormField label="Start Year" required>
                  <Input
                    type="number"
                    value={startYear}
                    onChange={(e) =>
                      setStartYear(e.target.value ? Number(e.target.value) : "")
                    }
                    placeholder="e.g. 2019"
                    min={1950}
                    max={2035}
                    disabled={loading}
                  />
                </FormField>

                <FormField label="End Year (or Expected)">
                  <Input
                    type="number"
                    value={endYear}
                    onChange={(e) =>
                      setEndYear(e.target.value ? Number(e.target.value) : "")
                    }
                    placeholder="e.g. 2023"
                    min={1950}
                    max={2035}
                    disabled={loading}
                  />
                </FormField>
              </div>

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
            No education records added yet. Click &quot;Add Education&quot; to
            list your degrees and certifications.
          </div>
        ) : (
          entries.map((edu) => (
            <div
              key={edu.id}
              className="p-6 sm:p-8 transition-colors hover:bg-[#EEF3FF]/20 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <h4 className="font-display font-bold text-lg text-[#17131F]">
                  {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                </h4>
                <p className="text-sm font-semibold text-[#1E5BFF]">
                  {edu.institution}
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-[#6E6678]">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {edu.startYear} – {edu.endYear || "Present"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditInit(edu)}
                  disabled={loading || isAdding || editingId !== null}
                  leftIcon={<Edit2 className="h-3.5 w-3.5" />}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(edu.id)}
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
export default EducationForm;

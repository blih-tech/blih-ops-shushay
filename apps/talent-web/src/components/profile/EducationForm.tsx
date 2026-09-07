import React, { useState } from "react";
import { Plus, Trash2, Edit2, GraduationCap, Loader2, Check } from "lucide-react";
import { Education } from "@/types/profile";
import { addEducation, updateEducation, deleteEducation } from "@/lib/talentApi";
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
  ConfirmDialog,
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
      onRefresh();
      setEditingId(null);
      setIsAdding(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || "Failed to save education record.");
    } finally {
      setLoading(false);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setLoading(true);
    try {
      await deleteEducation(deletingId);
      setDeletingId(null);
      onRefresh();
    } catch (err: any) {
      setError(err.message || "Failed to delete education record.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-[#D9CEDF] shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#1E5BFF]" /> Education & Qualifications
          </CardTitle>
          <CardDescription>
            Degrees, certifications, and academic background.
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
            Add Education
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {error && <Alert variant="error">{error}</Alert>}

        {(isAdding || editingId) && (
          <form onSubmit={handleSave} className="p-4 bg-[#F8F6F9] rounded-xl border border-[#D9CEDF] space-y-4">
            <h4 className="font-semibold text-sm text-[#17131F] pb-2 border-b border-[#D9CEDF]">
              {editingId ? "Edit Education Record" : "New Academic Record"}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Institution / University" required>
                <Input value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="e.g. Addis Ababa University" />
              </FormField>
              <FormField label="Degree / Qualification" required>
                <Input value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="e.g. Bachelor of Science" />
              </FormField>
            </div>

            <FormField label="Field of Study">
              <Input value={field} onChange={(e) => setField(e.target.value)} placeholder="e.g. Computer Science" />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Start Year" required>
                <Input type="number" min={1960} max={2100} value={startYear} onChange={(e) => setStartYear(e.target.value ? Number(e.target.value) : "")} placeholder="YYYY" />
              </FormField>
              <FormField label="End Year (or Expected)">
                <Input type="number" min={1960} max={2100} value={endYear} onChange={(e) => setEndYear(e.target.value ? Number(e.target.value) : "")} placeholder="YYYY" />
              </FormField>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}>Cancel</Button>
              <Button type="submit" size="sm" disabled={loading} leftIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}>Save Record</Button>
            </div>
          </form>
        )}

        <div className="divide-y divide-[#D9CEDF]">
          {entries.length === 0 && !isAdding && !editingId ? (
            <p className="text-sm text-[#6E6678] py-4 text-center">No education records added yet.</p>
          ) : (
            entries.map((edu) => (
              <div key={edu.id} className="py-4 flex justify-between items-start group">
                <div className="space-y-1">
                  <h4 className="font-bold text-[#17131F] text-base">{edu.degree} {edu.field ? `in ${edu.field}` : ""}</h4>
                  <p className="text-sm text-[#1E5BFF] font-medium">{edu.institution}</p>
                  <p className="text-xs font-mono text-[#6E6678]">{edu.startYear} – {edu.endYear || "Present"}</p>
                </div>
                <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="sm" onClick={() => handleEditInit(edu)}><Edit2 className="w-3.5 h-3.5" /></Button>
                  <Button variant="outline" size="sm" onClick={() => setDeletingId(edu.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-3.5 h-3.5" /></Button>
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
        title="Delete Education Record"
        message="Are you sure you want to delete this education record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={loading}
      />
    </Card>
  );
};

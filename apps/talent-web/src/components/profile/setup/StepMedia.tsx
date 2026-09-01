import React from "react";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@blih/ui";
import { PhotoUpload } from "../PhotoUpload";
import { CvUpload } from "../CvUpload";
import { StepMediaProps } from "@/types/setup";

export const StepMedia: React.FC<StepMediaProps> = ({
  photoUrl,
  onPhotoUpload,
  onPhotoDelete,
  cvUrl,
  onCvUpload,
  onCvDelete,
  saving,
  onBack,
  onComplete,
}) => {
  return (
    <div className="space-y-6">
      <PhotoUpload
        value={photoUrl}
        onUpload={onPhotoUpload}
        onDelete={onPhotoDelete}
      />

      <div className="border-t border-border my-6 pt-6" />

      <CvUpload value={cvUrl} onUpload={onCvUpload} onDelete={onCvDelete} />

      <div className="flex justify-between pt-4 border-t border-border mt-6">
        <Button
          variant="outline"
          onClick={onBack}
          leftIcon={<ChevronLeft className="h-4 w-4" />}
          disabled={saving}
        >
          Back
        </Button>
        <Button
          onClick={onComplete}
          className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white border-transparent"
          leftIcon={<CheckCircle2 className="h-4 w-4" />}
        >
          Finish Setup
        </Button>
      </div>
    </div>
  );
};
export default StepMedia;

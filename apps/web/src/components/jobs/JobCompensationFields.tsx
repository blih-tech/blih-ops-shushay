"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  FormField,
} from "@blih/ui";

interface JobCompensationFieldsProps {
  salaryMin: string;
  setSalaryMin: (val: string) => void;
  salaryMax: string;
  setSalaryMax: (val: string) => void;
  salaryCurrency: string;
  setSalaryCurrency: (val: string) => void;
  workingHours: string;
  setWorkingHours: (val: string) => void;
  timezone: string;
  setTimezone: (val: string) => void;
  applicationDeadline: string;
  setApplicationDeadline: (val: string) => void;
  disabled?: boolean;
}

export function JobCompensationFields({
  salaryMin,
  setSalaryMin,
  salaryMax,
  setSalaryMax,
  salaryCurrency,
  setSalaryCurrency,
  workingHours,
  setWorkingHours,
  timezone,
  setTimezone,
  applicationDeadline,
  setApplicationDeadline,
  disabled,
}: JobCompensationFieldsProps) {
  return (
    <Card className="border border-[#D9CEDF] rounded-xl shadow-[0_4px_20px_rgba(23,19,31,0.03)] p-0 overflow-visible bg-white">
      <CardHeader className="bg-white border-b border-[#D9CEDF] p-6 sm:p-8 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#D9CEDF] text-[#17131F] flex items-center justify-center shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-[#17131F] font-display">
              Compensation & Logistics
            </CardTitle>
            <CardDescription className="text-sm text-[#6E6678] font-sans">
              Salary ranges, timezone preferences, and scheduling details.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 sm:p-8 space-y-6 bg-white rounded-b-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <FormField label="Min Salary">
            <Input
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              placeholder="e.g. 2000"
              fullWidth
              disabled={disabled}
            />
          </FormField>

          <FormField label="Max Salary">
            <Input
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              placeholder="e.g. 4000"
              fullWidth
              disabled={disabled}
            />
          </FormField>

          <FormField label="Currency">
            <Input
              value={salaryCurrency}
              onChange={(e) => setSalaryCurrency(e.target.value)}
              placeholder="USD or ETB"
              fullWidth
              disabled={disabled}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <FormField label="Working Hours">
            <Input
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              placeholder="e.g. 40 hrs/week"
              fullWidth
              disabled={disabled}
            />
          </FormField>

          <FormField label="Timezone">
            <Input
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="e.g. GMT+3 / Remote"
              fullWidth
              disabled={disabled}
            />
          </FormField>

          <FormField label="Application Deadline">
            <Input
              type="date"
              value={applicationDeadline}
              onChange={(e) => setApplicationDeadline(e.target.value)}
              fullWidth
              disabled={disabled}
            />
          </FormField>
        </div>
      </CardContent>
    </Card>
  );
}

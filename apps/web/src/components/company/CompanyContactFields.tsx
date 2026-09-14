"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  FormField,
  Input,
} from "@blih/ui";
import { User } from "lucide-react";

interface CompanyContactFieldsProps {
  contactName: string;
  setContactName: (val: string) => void;
  contactEmail: string;
  setContactEmail: (val: string) => void;
  contactPhone: string;
  setContactPhone: (val: string) => void;
}

export function CompanyContactFields({
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  contactPhone,
  setContactPhone,
}: CompanyContactFieldsProps) {
  return (
    <Card className="border border-[#D9CEDF] shadow-sm rounded-3xl overflow-hidden">
      <CardHeader className="bg-[#EEF3FF]/40 border-b border-[#D9CEDF]/70">
        <CardTitle className="text-xl flex items-center gap-2">
          <User className="h-5 w-5 text-[#1E5BFF]" /> Primary Recruiter Contact
        </CardTitle>
        <CardDescription>
          Direct contact info for candidate inquiries and candidate
          notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-8 space-y-6">
        <FormField label="Contact Full Name" required>
          <Input
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="e.g. Sara Tekle"
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Contact Email" required>
            <Input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="recruiter@company.com"
            />
          </FormField>

          <FormField label="Contact Phone Number">
            <Input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+251 91 123 4567"
            />
          </FormField>
        </div>
      </CardContent>
    </Card>
  );
}

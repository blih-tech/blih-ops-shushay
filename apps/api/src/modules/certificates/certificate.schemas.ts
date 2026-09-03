import { z } from "zod";

export const certificateIdParamSchema = z.object({
  id: z.string().min(1, "Certificate ID is required"),
});

export type CertificateIdParam = z.infer<typeof certificateIdParamSchema>;

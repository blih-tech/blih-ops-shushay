export const swaggerSchemas = {
  ErrorResponse: {
    type: "object",
    properties: {
      error: { type: "string" },
      details: { type: "object" },
    },
  },
  User: {
    type: "object",
    properties: {
      id: { type: "string" },
      email: { type: "string", format: "email" },
      role: { type: "string", enum: ["TALENT", "COMPANY", "ADMIN"] },
      isVerified: { type: "boolean" },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  PaymentTransaction: {
    type: "object",
    properties: {
      id: { type: "string" },
      userId: { type: "string" },
      txRef: {
        type: "string",
        example: "blih_skills_1788330635551_4778",
      },
      amount: { type: "number", example: 1000 },
      currency: { type: "string", example: "ETB" },
      paymentType: { type: "string", example: "SKILLS_ACCESS" },
      status: {
        type: "string",
        enum: ["PENDING", "SUCCESSFUL", "FAILED"],
      },
      chapaRef: { type: "string", nullable: true },
      metadata: { type: "object", nullable: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  SkillsEntitlement: {
    type: "object",
    properties: {
      id: { type: "string" },
      userId: { type: "string" },
      paymentId: { type: "string" },
      grantedAt: { type: "string", format: "date-time" },
    },
  },
};

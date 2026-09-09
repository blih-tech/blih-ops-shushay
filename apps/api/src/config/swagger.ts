import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blih Operations API Documentation",
      version: "1.0.0",
      description:
        "API specifications for Blih Ecosystem (Auth, Skills, Talent, and Management)",
      contact: {
        name: "Blih Ops Engineering",
      },
    },
    servers: [
      {
        url: "http://localhost:4000/api/v1",
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "JWT session token set in HTTP-only cookie",
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
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
      },
    },

    paths: {
      "/health": {
        get: {
          summary: "API Health Check",
          tags: ["System"],
          responses: {
            "200": {
              description: "API is healthy",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      timestamp: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/auth/register": {
        post: {
          summary: "Register new user (Talent or Company)",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password", "role"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "user@example.com",
                    },
                    password: {
                      type: "string",
                      minimum: 6,
                      example: "Secret123!",
                    },
                    role: {
                      type: "string",
                      enum: ["TALENT", "COMPANY"],
                      example: "TALENT",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "User registered successfully",
            },
            "400": {
              description: "Validation error or Email already exists",
            },
          },
        },
      },
      "/auth/login": {
        post: {
          summary: "Authenticate user and set session cookie",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "user@example.com",
                    },
                    password: { type: "string", example: "Secret123!" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Login successful" },
            "401": { description: "Invalid credentials" },
          },
        },
      },
      "/auth/logout": {
        post: {
          summary: "Clear session token cookie",
          tags: ["Authentication"],
          responses: {
            "200": { description: "Logged out successfully" },
          },
        },
      },
      "/auth/me": {
        get: {
          summary: "Get current authenticated user profile",
          tags: ["Authentication"],
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          responses: {
            "200": {
              description: "Current user profile",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/auth/forgot-password": {
        post: {
          summary: "Request password reset email link",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "user@example.com",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Reset email dispatched" },
          },
        },
      },
      "/auth/reset-password": {
        post: {
          summary: "Reset password using token",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["token", "password"],
                  properties: {
                    token: { type: "string", example: "reset-token-uuid" },
                    password: {
                      type: "string",
                      minimum: 6,
                      example: "NewPassword123!",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Password reset successful" },
            "400": { description: "Invalid or expired token" },
          },
        },
      },
      "/auth/verify-email": {
        post: {
          summary: "Verify user email using token",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["token"],
                  properties: {
                    token: { type: "string", example: "verify-token-uuid" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Email verified successfully" },
            "400": { description: "Invalid or expired token" },
          },
        },
      },
      "/talents/profile": {
        get: {
          summary:
            "Get logged-in talent's profile with detailed completion metrics",
          tags: ["Talents"],
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          responses: {
            "200": {
              description: "Talent profile and profileCompletion score details",
            },
          },
        },
      },
      "/talents/{talentId}": {
        get: {
          summary:
            "Get talent profile by ID (Gated to Active Companies and Admins)",
          tags: ["Talents"],
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          parameters: [
            {
              name: "talentId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "Full talent profile detail record" },
            "402": {
              description: "Payment Required - Active subscription needed",
            },
            "403": { description: "Access Denied - Insufficient permissions" },
            "404": { description: "Talent profile not found" },
          },
        },
      },
      "/companies/{companyId}": {
        get: {
          summary: "Get public company profile and active job postings by ID",
          tags: ["Companies"],
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          parameters: [
            {
              name: "companyId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description:
                "Public company profile detail record with active job listings",
            },
            "404": { description: "Company profile not found" },
          },
        },
      },
      "/courses/{courseId}": {
        delete: {
          summary:
            "Delete course by ID (Admin only, cascades to Cloudinary assets)",
          tags: ["Courses"],
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          parameters: [
            {
              name: "courseId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description:
                "Course and related lessons/quizzes/materials deleted successfully",
            },
            "403": { description: "Admin permissions required" },
            "404": { description: "Course not found" },
          },
        },
      },
      "/courses/{courseId}/lessons/{lessonId}/video": {
        delete: {
          summary: "Delete lesson video (Admin only, removes from Cloudinary)",
          tags: ["Courses"],
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          parameters: [
            {
              name: "courseId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
            {
              name: "lessonId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description:
                "Lesson video reference and file deleted successfully",
            },
            "403": { description: "Admin permissions required" },
            "404": { description: "Lesson or course not found" },
          },
        },
      },
      "/payments/skills/access-status": {
        get: {
          summary:
            "Get current user's Blih Skills access and entitlement status",
          tags: ["Payments"],
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          responses: {
            "200": {
              description: "Live skills entitlement status and payment details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      hasAccess: { type: "boolean", example: true },
                      grantedAt: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                      },
                      payment: {
                        $ref: "#/components/schemas/PaymentTransaction",
                        nullable: true,
                      },
                    },
                  },
                },
              },
            },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/payments/skills/initialize": {
        post: {
          summary:
            "Initialize Blih Skills 1,000 ETB hosted payment checkout with Chapa",
          tags: ["Payments"],
          security: [{ cookieAuth: [] }, { bearerAuth: [] }],
          responses: {
            "200": {
              description: "Chapa checkout URL or existing access confirmation",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      alreadyHasAccess: { type: "boolean" },
                      checkoutUrl: {
                        type: "string",
                        example:
                          "https://checkout.chapa.co/checkout/payment/...",
                      },
                      txRef: {
                        type: "string",
                        example: "blih_skills_1788330635551_4778",
                      },
                    },
                  },
                },
              },
            },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/payments/verify/{txRef}": {
        get: {
          summary:
            "Server-side payment verification with Chapa gateway (Idempotent)",
          tags: ["Payments"],
          parameters: [
            {
              name: "txRef",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description:
                "Payment verified successfully and entitlement granted",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      verified: { type: "boolean", example: true },
                      payment: {
                        $ref: "#/components/schemas/PaymentTransaction",
                      },
                      entitlement: {
                        $ref: "#/components/schemas/SkillsEntitlement",
                      },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Payment verification failed or invalid amount",
            },
            "404": { description: "Transaction reference not found" },
          },
        },
      },
      "/payments/chapa/webhook": {
        post: {
          summary: "Chapa asynchronous webhook notification receiver",
          tags: ["Payments"],
          responses: {
            "200": {
              description: "Webhook received and processed idempotently",
            },
            "400": { description: "Invalid payload or signature" },
          },
        },
      },
    },
  },
  apis: [
    "./apps/api/src/modules/**/*.routes.ts",
    "./src/modules/**/*.routes.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

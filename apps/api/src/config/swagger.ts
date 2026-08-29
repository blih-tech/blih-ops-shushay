import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blih Operations API Documentation",
      version: "1.0.0",
      description: "API specifications for Blih Ecosystem (Auth, Skills, Talent, and Management)",
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
                    email: { type: "string", format: "email", example: "user@example.com" },
                    password: { type: "string", minimum: 6, example: "Secret123!" },
                    role: { type: "string", enum: ["TALENT", "COMPANY"], example: "TALENT" },
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
                    email: { type: "string", format: "email", example: "user@example.com" },
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
                    email: { type: "string", format: "email", example: "user@example.com" },
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
                    password: { type: "string", minimum: 6, example: "NewPassword123!" },
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
          summary: "Get logged-in talent's profile with detailed completion metrics",
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
          summary: "Get talent profile by ID (Gated to Active Companies and Admins)",
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
            "402": { description: "Payment Required - Active subscription needed" },
            "403": { description: "Access Denied - Insufficient permissions" },
            "404": { description: "Talent profile not found" },
          },
        },
      },
      "/courses/{courseId}": {
        delete: {
          summary: "Delete course by ID (Admin only, cascades to Cloudinary assets)",
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
            "200": { description: "Course and related lessons/quizzes/materials deleted successfully" },
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
            "200": { description: "Lesson video reference and file deleted successfully" },
            "403": { description: "Admin permissions required" },
            "404": { description: "Lesson or course not found" },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);

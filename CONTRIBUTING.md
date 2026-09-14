# BLIH OPS — Development Guidelines

Welcome to the **BLIH OPS** workspace.

This document is the authoritative **Development & Contribution Guidelines** for the entire project. These rules apply to everyone contributing to the project, including human developers and AI coding agents.

Before implementing, modifying, or refactoring code, review and follow these guidelines.

> **Golden Rule:** Prefer the smallest correct, maintainable change that fits the existing architecture. Reuse what already exists, preserve unrelated behavior, and avoid introducing new patterns without a clear reason.

---

# Monorepo Architecture & Workspace Commands

## Project Structure

```text
blih-ops/
├── apps/
│   ├── api/            # Express Backend API & Prisma ORM Service
│   └── web/            # Unified Web Application (Auth, Skills, Talent, Admin)
│
├── packages/
│   ├── api-client/     # Shared Typed API Client & Data Fetchers
│   ├── types/          # Shared TypeScript Types
│   ├── ui/             # Shared UI Components & Design System
│   └── validation/     # Shared Validation Schemas
│
├── AGENTS.md
├── CONTRIBUTING.md
├── nx.json
├── package.json
└── ...
```

Follow the actual repository structure and existing Nx conventions. Do not reorganize the workspace without a clear architectural requirement.

## Workspace Commands

Use the project's established package manager and Nx commands.

Common commands include:

| Command             | Action                           |
| :------------------ | :------------------------------- |
| `pnpm dev`          | Launch local development servers |
| `pnpm build`        | Build production bundles         |
| `pnpm typecheck`    | Run TypeScript type checking     |
| `pnpm lint`         | Run ESLint                       |
| `pnpm test`         | Run the test suite               |

If a command does not exist in the current workspace, do not invent or document it as an available command. Check `package.json` and Nx configuration first.

---

# Development Guidelines

## 1. Separation of Concerns

Keep responsibilities separated.

Do not unnecessarily mix:

- Types/interfaces
- Components
- Business logic
- API calls/services
- State management
- Hooks
- Helper/utility functions
- Constants
- Mock data
- Validation schemas
- Contexts/providers
- Configuration
- Data transformation
- UI/presentation logic

Place each responsibility in the appropriate existing folder/module.

Do not create unnecessary files solely to satisfy this rule. Keep closely related code together when that improves maintainability.

---

## 2. Modularity

Keep files reasonably small and focused.

- Target: **≤300 lines of code per file**.
- If a file exceeds 300 lines, review it for possible decomposition.
- Do not split code artificially just to satisfy the line limit.
- Components with multiple independent responsibilities should be decomposed into smaller components, hooks, or modules.
- Route/page files should primarily compose the page rather than contain large amounts of implementation logic.
- Modules should have clear responsibilities and boundaries.

The 300-line target is a **review threshold, not an absolute requirement**.

---

## 3. Reusability

Before creating new code:

1. Check whether an existing component, hook, utility, constant, type, service, or helper already provides the required functionality.
2. Reuse existing abstractions when appropriate.
3. If similar logic exists in multiple places, consider extracting a reusable abstraction.
4. Avoid premature abstraction when the use case is genuinely specific.

Do not duplicate existing functionality unnecessarily.

Prefer:

```text
Existing abstraction → reuse
Repeated behavior → consider extraction
Unique behavior → keep local
```

Do not create generic abstractions that have no meaningful reuse case.

---

## 4. Consistency

Follow existing project conventions for:

- Naming
- Folder structure
- Component patterns
- Import organization
- State management
- API communication
- Error handling
- Loading states
- Form handling
- Validation
- Styling
- Type definitions
- File naming
- Export patterns
- Data fetching
- Testing

Do not introduce a new pattern when an established project pattern already exists.

Consistency is preferred over introducing personal coding preferences.

---

## 5. Type Safety

The project should remain strongly typed.

- Avoid `any` unless genuinely necessary and justified.
- Do not suppress TypeScript errors without understanding the underlying issue.
- Reuse existing shared types where appropriate.
- Keep API request/response types consistent between layers.
- Do not duplicate equivalent type definitions unnecessarily.
- Prefer explicit and meaningful types over implicit weak typing.
- Do not use unsafe type assertions to bypass real type problems.
- Run type checking after significant changes.

Type errors should be fixed at their source rather than hidden.

---

## 6. Constants

Do not scatter repeated magic values throughout the code.

Extract appropriate values into constants, such as:

- Routes
- API endpoints
- Limits
- Configuration values
- Repeated labels
- Status values
- Query keys
- Timeouts
- File constraints
- Pagination values

Keep constants close to their domain unless they are genuinely shared.

Do not create a global constants file for values that are only relevant to one feature.

---

## 7. Mock Data

Mock/demo data must not be mixed unnecessarily with production logic.

- Keep mock data in the project's established mock/data location.
- Do not leave temporary mock data in production code after the real implementation is available.
- Clearly distinguish mock data from real application data.
- Do not use mock data to hide incomplete production functionality.
- Remove temporary mocks when the actual implementation is ready.

---

## 8. Components

Components should have a clear responsibility.

Avoid large components that simultaneously handle:

- Complex UI
- API requests
- Business logic
- Form logic
- Data transformation
- State management

Extract appropriate logic into:

- Hooks
- Services
- Utilities
- Child components
- Shared modules

Do not create tiny components that provide no meaningful abstraction merely to reduce line count.

A component should be extracted when doing so improves readability, reuse, testability, or responsibility boundaries.

---

## 9. Hooks

Custom hooks should encapsulate reusable stateful behavior or React-specific logic.

- Do not put generic utility functions inside hooks when they do not depend on React.
- Keep API/data-fetching logic consistent with the project's existing data-fetching architecture.
- Hooks should have clear responsibilities.
- Avoid hooks that become large collections of unrelated behavior.
- Reuse existing hooks before creating new ones.

---

## 10. Services / API

Keep API communication separate from presentation components when the project architecture supports it.

- Components should not contain large amounts of raw API implementation.
- Reuse the existing API client, services, query hooks, and error-handling patterns.
- Keep API concerns separate from UI concerns.
- Avoid duplicating request logic across components.
- Keep request and response handling predictable and consistent.
- Handle API errors using the project's established strategy.

---

## 11. Pages and Routes

Pages/routes should primarily orchestrate the page.

Avoid putting large amounts of:

- Business logic
- API implementation
- Helper functions
- Type definitions
- Mock data
- Complex state logic

directly inside route/page files.

Extract them into appropriate modules.

A page should generally compose:

```text
Page
├── Layout
├── Components
├── Hooks
└── Data/API abstractions
```

rather than becoming the implementation location for the entire feature.

---

## 12. Duplication

Before adding code, search the project for similar implementations.

If the same logic appears multiple times:

- Determine whether it should be shared.
- Extract reusable functionality when appropriate.
- Do not maintain multiple subtly different implementations of the same behavior without a clear reason.

However, do not force unrelated functionality into a shared abstraction merely because two pieces of code currently look similar.

---

## 13. Dead Code

Do not leave behind:

- Unused imports
- Unused variables
- Unused components
- Deprecated implementations
- Commented-out code
- Temporary debugging statements
- Unused types
- Unused dependencies
- Unreachable code

Remove dead code when it is no longer needed.

Do not remove apparently unused code without checking whether it is referenced dynamically or required by the framework.

---

## 14. Error Handling

Follow the project's existing error-handling strategy.

- Do not silently swallow errors.
- Handle expected errors explicitly.
- User-facing errors should be handled appropriately.
- Implementation details should not unnecessarily leak to users.
- Do not expose stack traces, secrets, database details, or internal infrastructure information to users.
- Preserve useful error information for debugging through appropriate logging.

---

## 15. Loading / Empty / Error / Success States

When implementing data-driven UI, consider the appropriate:

- Loading state
- Empty state
- Error state
- Success state

Follow existing project patterns rather than creating inconsistent implementations.

Do not leave data-driven interfaces without meaningful feedback while requests are loading or failing.

---

## 16. Accessibility

Maintain appropriate accessibility practices:

- Semantic HTML
- Keyboard accessibility
- Labels for form controls
- Appropriate ARIA attributes when necessary
- Visible focus states
- Meaningful button/link labels
- Accessible interactive components
- Appropriate heading hierarchy
- Sufficient interaction targets

Do not sacrifice accessibility for visual implementation.

ARIA should supplement semantic HTML rather than replace it unnecessarily.

---

## 17. Responsive Design

Follow the project's existing responsive design system and breakpoints.

- Do not introduce arbitrary breakpoints or inconsistent responsive patterns.
- Reuse existing responsive utilities and patterns.
- Test layouts across the project's supported viewport sizes.
- Ensure content remains usable at smaller and larger viewport widths.
- Avoid fixed dimensions that unnecessarily prevent responsive behavior.
- Consider desktop, tablet, and mobile layouts where applicable.
- Do not make responsive changes that unnecessarily alter existing desktop behavior.

Responsive behavior should be intentional and consistent across the application.

---

## 18. UI / Design System

Maintain visual and interaction consistency across the application.

- Reuse components from the shared UI library when appropriate.
- Reuse existing design tokens.
- Reuse established spacing, typography, colors, borders, radii, shadows, and responsive patterns.
- Do not introduce arbitrary visual values when an existing design token or convention exists.
- Keep equivalent UI patterns visually and behaviorally consistent.
- Do not create page-specific versions of existing shared components without a clear reason.
- Preserve existing UI behavior unless the task explicitly requires a change.

Do not redesign unrelated UI while implementing a feature.

---

## 19. Dependencies

Before adding a dependency:

1. Check whether the project already has a library that solves the problem.
2. Prefer existing dependencies.
3. Avoid adding a dependency for trivial functionality.
4. Follow the project's package-management conventions.
5. Consider bundle size, maintenance, security, and long-term cost.
6. Add a dependency only when its value justifies the additional complexity.

Do not introduce duplicate libraries that solve the same problem without a clear reason.

---

## 20. Database & Prisma

Database changes must follow the project's Prisma conventions.

- Reuse existing Prisma models and relations where appropriate.
- Do not duplicate equivalent database concepts.
- Use Prisma migrations for schema changes.
- Do not manually modify generated Prisma client files.
- Preserve existing relationships and constraints unless the requested change requires modification.
- Consider indexes, uniqueness constraints, nullability, and referential integrity when changing models.
- Avoid unnecessary database queries.
- Avoid N+1 query patterns where practical.
- Do not expose database models directly to clients when a dedicated API contract is appropriate.
- Keep database access within the appropriate backend/service boundary.
- Do not modify production database structure manually when a migration should be used.

Database changes should be reviewed for backward compatibility and data integrity.

---

## 21. API Contracts

Maintain clear and consistent contracts between frontend and backend.

- Reuse the existing API client and shared types where appropriate.
- Keep request and response structures consistent.
- Validate incoming API data at appropriate boundaries.
- Do not silently change existing API contracts.
- When an API contract must change, update all affected consumers.
- Use consistent HTTP methods.
- Use appropriate HTTP status codes.
- Maintain consistent error response structures.
- Do not duplicate API request logic across multiple components.
- Do not trust client-provided values for security-sensitive decisions.

API contracts should be treated as explicit boundaries between application layers.

---

## 22. Security

Security must be considered in every implementation.

- Never commit secrets, credentials, API keys, tokens, or private configuration.
- Use environment variables for sensitive configuration.
- Never expose server-only secrets to client-side code.
- Validate untrusted input at appropriate boundaries.
- Enforce authorization on the backend.
- Do not rely on frontend checks for security.
- Do not trust client-provided roles, permissions, ownership, prices, IDs, or other security-sensitive values.
- Avoid logging passwords, tokens, secrets, or sensitive personal data.
- Follow secure authentication, session, cookie, and API practices already established by the project.
- Apply least-privilege principles where applicable.
- Do not bypass authorization checks for convenience during development.
- Do not disable security mechanisms simply to make local development easier unless explicitly required and documented.

Security-sensitive changes should receive additional review.

---

## 23. Environment & Configuration

Keep environment-specific configuration separate from application logic.

- Never hardcode environment-specific URLs, credentials, ports, or secrets.
- Use the project's established environment-variable conventions.
- Keep `.env.example` files free of real credentials.
- Do not modify environment configuration unnecessarily.
- Clearly distinguish development, testing, and production configuration.
- Validate required environment variables at application startup where appropriate.
- Do not commit local environment files containing secrets.

Configuration should be explicit, predictable, and environment-aware.

---

## 24. Performance

Do not introduce unnecessary performance regressions.

- Avoid unnecessary re-renders.
- Avoid unnecessary API requests.
- Avoid fetching data that is not required.
- Use appropriate caching and data-fetching mechanisms already established by the project.
- Optimize large lists, images, and expensive UI operations when appropriate.
- Avoid unnecessary database queries.
- Do not perform expensive calculations repeatedly when they can reasonably be avoided.
- Prefer simple, maintainable solutions over premature optimization.

Do not introduce complex performance optimizations without a meaningful reason.

---

## 25. Testing

Changes should include appropriate test coverage when practical.

- Add or update tests for new business logic and important behavior.
- Test authorization and security-sensitive behavior.
- Test important validation and error cases.
- Test important API behavior.
- Do not remove existing tests merely to make a change pass.
- Keep tests deterministic and independent.
- Reuse existing testing utilities and conventions.
- Run relevant tests after significant changes.
- Fix failing tests caused by the implementation rather than bypassing them.

Testing should focus on meaningful behavior rather than implementation details.

---

## 26. Documentation & Comments

Code should be understandable without unnecessary comments.

- Prefer clear naming and structure over explanatory comments.
- Add comments when they explain non-obvious decisions, constraints, or business rules.
- Do not add comments that simply restate what the code does.
- Update relevant documentation when architecture, commands, APIs, or developer workflows change.
- Do not leave outdated documentation after changing project behavior.
- Keep documentation consistent with the actual implementation.

Documentation should explain things that are difficult to infer from the code itself.

---

## 27. Changes Must Be Scoped

Do not change unrelated UI, architecture, behavior, or business logic merely because you notice an opportunity for improvement.

Only make changes necessary for the requested task unless a discovered issue directly prevents the implementation from being correct or safe.

Do not:

- Redesign unrelated components.
- Rename unrelated files.
- Reorganize unrelated folders.
- Upgrade unrelated dependencies.
- Rewrite working code without a concrete reason.
- Change business behavior that was not part of the requirement.
- Modify unrelated APIs.
- Introduce unrelated architectural changes.

Keep changes focused and reviewable.

---

## 28. No Speculative Refactoring

Do not refactor code simply because it could theoretically be improved.

- Implement the requested change first.
- Refactor existing code only when it directly improves correctness, maintainability, reuse, or safety for the requested change.
- Do not rewrite working code without a concrete reason.
- Do not change established architecture merely because another approach appears preferable.
- Do not upgrade dependencies without a requirement.
- Do not redesign components without a requirement.
- Do not reorganize folders without a clear architectural reason.
- Do not extract abstractions that currently have no meaningful reuse case.

Avoid "while I'm here" refactoring.

---

## 29. Git & Change Discipline

Keep changes easy to review and understand.

- Do not modify files unrelated to the requested task.
- Avoid mixing feature work with unrelated refactoring.
- Do not commit generated files unless the project requires them.
- Do not commit secrets or local environment files.
- Review `git diff` before considering work complete.
- Ensure accidental changes are removed before committing.
- Keep commits focused when possible.
- Do not rewrite shared Git history unless explicitly required.

The final diff should clearly correspond to the requested work.

---

## 30. Before Creating a New File

Before creating a new file, determine:

- Does an appropriate existing file already exist?
- Can the functionality be reused?
- Does the new file have a clear responsibility?
- Does its location follow the existing architecture?
- Will creating it improve maintainability?
- Is the functionality likely to be reused?
- Is there a better existing module for this responsibility?

Avoid unnecessary file proliferation.

Do not create files merely to satisfy an arbitrary organizational preference.

---

## 31. Verification

After implementation:

1. Review the changed files.
2. Review the final Git diff.
3. Check for duplication.
4. Check separation of concerns.
5. Check type safety.
6. Check imports and unused code.
7. Check consistency with existing architecture.
8. Check responsive behavior when UI changes are involved.
9. Check accessibility when UI changes are involved.
10. Run type checking.
11. Run linting if configured.
12. Run relevant tests if available.
13. Verify API/database behavior when applicable.
14. Verify error/loading/empty states when applicable.
15. Verify that existing functionality has not been unnecessarily changed.

Do not consider an implementation complete merely because the code compiles.

---

## 32. Before Finishing Any Task

Perform a final architecture and developer-experience review.

Ask:

- Is separation of concerns maintained?
- Is the code modular?
- Is there unnecessary duplication?
- Is existing functionality being reused?
- Is the implementation consistent with the project?
- Are types correct?
- Are there unnecessary abstractions?
- Are there oversized files that should be reviewed?
- Are there unused/dead code paths?
- Are page/route files clean?
- Are mock data, constants, helpers, and types in appropriate locations?
- Is API communication following the existing architecture?
- Are database changes safe and properly migrated?
- Are authorization boundaries preserved?
- Are security-sensitive values protected?
- Is responsive behavior correct?
- Is accessibility maintained?
- Are loading, empty, error, and success states handled?
- Has unrelated functionality remained unchanged?
- Has speculative refactoring been avoided?
- Does type checking pass?
- Does linting pass when configured?
- Do relevant tests pass?
- Is the final diff focused and reviewable?
- Is relevant documentation up to date?

The implementation is not complete until this review has been performed.

---

# Final Engineering Principle

The goal is not to maximize the number of files, abstractions, components, tests, or architectural patterns.

The goal is to build software that is:

- **Correct**
- **Maintainable**
- **Modular**
- **Reusable**
- **Consistent**
- **Secure**
- **Accessible**
- **Responsive**
- **Performant**
- **Strongly typed**
- **Testable**
- **Easy for future developers to understand**

When there are multiple valid approaches, prefer the solution that:

1. Fits the existing architecture.
2. Reuses existing functionality.
3. Makes the smallest necessary change.
4. Introduces the least unnecessary complexity.
5. Preserves existing behavior.
6. Remains easy to maintain and extend.

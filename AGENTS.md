# Development Guidelines

These guidelines apply to the entire project. Before implementing, modifying, or refactoring code, review and follow these rules.

## 1. Separation of Concerns

Keep responsibilities separated. Do not unnecessarily mix:

* Types/interfaces
* Components
* Business logic
* API calls/services
* State management
* Hooks
* Helper/utility functions
* Constants
* Mock data
* Validation schemas
* Contexts/providers
* Configuration
* Data transformation
* UI/presentation logic

Place each responsibility in the appropriate existing folder/module.

Do not create unnecessary files solely to satisfy this rule. Keep closely related code together when that improves maintainability.

## 2. Modularity

Keep files reasonably small and focused.

* Target: **≤300 lines of code per file**
* If a file exceeds 300 lines, review it for possible decomposition.
* Do not split code artificially just to meet the line limit.
* Components with multiple independent responsibilities should be decomposed into smaller components/hooks/modules.
* Route/page files should primarily compose the page rather than contain large amounts of implementation logic.

## 3. Reusability

Before creating new code:

1. Check whether an existing component, hook, utility, constant, type, service, or helper already provides the required functionality.
2. Reuse existing abstractions when appropriate.
3. If similar logic exists in multiple places, consider extracting a reusable abstraction.
4. Avoid premature abstraction when the use case is genuinely specific.

Do not duplicate existing functionality.

## 4. Consistency

Follow existing project conventions for:

* Naming
* Folder structure
* Component patterns
* Import organization
* State management
* API communication
* Error handling
* Loading states
* Form handling
* Validation
* Styling
* Type definitions
* File naming
* Export patterns

Do not introduce a new pattern when an established project pattern already exists.

## 5. Type Safety

The project should remain strongly typed.

* Avoid `any` unless genuinely necessary and justified.
* Do not suppress TypeScript errors without understanding the underlying issue.
* Reuse existing shared types where appropriate.
* Keep API request/response types consistent between layers.
* Do not duplicate equivalent type definitions unnecessarily.
* Run type checking after significant changes.

## 6. Constants

Do not scatter repeated magic values throughout the code.

Extract appropriate values into constants, such as:

* Routes
* API endpoints
* Limits
* Configuration values
* Repeated labels
* Status values
* Query keys
* Timeouts
* File constraints

Keep constants close to their domain unless they are genuinely shared.

## 7. Mock Data

Mock/demo data must not be mixed unnecessarily with production logic.

Keep mock data in the project's established mock/data location.

Do not leave temporary mock data in production code after the real implementation is available.

## 8. Components

Components should have a clear responsibility.

Avoid large components that simultaneously handle:

* Complex UI
* API requests
* Business logic
* Form logic
* Data transformation
* State management

Extract appropriate logic into hooks, services, utilities, or child components.

Do not create tiny components that provide no meaningful abstraction merely to reduce line count.

## 9. Hooks

Custom hooks should encapsulate reusable stateful behavior or React-specific logic.

Do not put generic utility functions inside hooks when they do not depend on React.

Keep API/data-fetching logic consistent with the project's existing data-fetching architecture.

## 10. Services / API

Keep API communication separate from presentation components when the project architecture supports it.

Components should not contain large amounts of raw API implementation.

Reuse the existing API client, services, query hooks, and error-handling patterns.

## 11. Pages and Routes

Pages/routes should primarily orchestrate the page.

Avoid putting large amounts of:

* Business logic
* API implementation
* Helper functions
* Type definitions
* Mock data
* Complex state logic

directly inside route/page files.

Extract them into appropriate modules.

## 12. Duplication

Before adding code, search the project for similar implementations.

If the same logic appears multiple times:

* Determine whether it should be shared.
* Extract reusable functionality when appropriate.
* Do not maintain multiple subtly different implementations of the same behavior without a clear reason.

## 13. Dead Code

Do not leave behind:

* Unused imports
* Unused variables
* Unused components
* Deprecated implementations
* Commented-out code
* Temporary debugging statements
* Unused types
* Unused dependencies

Remove them when they are no longer needed.

## 14. Error Handling

Follow the project's existing error-handling strategy.

Do not silently swallow errors.

User-facing errors should be handled appropriately, while implementation details should not unnecessarily leak to users.

## 15. Loading / Empty / Error States

When implementing data-driven UI, consider the appropriate:

* Loading state
* Empty state
* Error state
* Success state

Follow existing project patterns rather than creating inconsistent implementations.

## 16. Accessibility

Maintain appropriate accessibility practices:

* Semantic HTML
* Keyboard accessibility
* Labels for form controls
* Appropriate ARIA attributes when necessary
* Visible focus states
* Meaningful button/link labels
* Accessible interactive components

Do not sacrifice accessibility for visual implementation.

## 17. Responsive Design

Follow the project's existing responsive design system and breakpoints.

Do not introduce arbitrary breakpoints or inconsistent responsive patterns.

Test layouts across the project's supported viewport sizes.

## 18. Dependencies

Before adding a dependency:

1. Check whether the project already has a library that solves the problem.
2. Prefer existing dependencies.
3. Avoid adding a dependency for trivial functionality.
4. Follow the project's package-management conventions.

## 19. Changes Must Be Scoped

Do not change unrelated UI, architecture, behavior, or business logic merely because you notice an opportunity for improvement.

Only make changes necessary for the requested task unless a discovered issue directly prevents the implementation from being correct or safe.

## 20. Verification

After implementation:

1. Review the changed files.
2. Check for duplication.
3. Check separation of concerns.
4. Check type safety.
5. Check imports and unused code.
6. Check consistency with existing architecture.
7. Run type checking.
8. Run linting if configured.
9. Run relevant tests if available.
10. Verify that existing functionality has not been unnecessarily changed.

## 21. Before Creating a New File

Before creating a new file, determine:

* Does an appropriate existing file already exist?
* Can the functionality be reused?
* Does the new file have a clear responsibility?
* Does its location follow the existing architecture?
* Will creating it improve maintainability?

Avoid unnecessary file proliferation.

## 22. Before Finishing Any Task

Perform a final architecture/DX review of the implementation.

Ask:

* Is separation of concerns maintained?
* Is the code modular?
* Is there duplication?
* Is existing functionality being reused?
* Is the implementation consistent with the project?
* Are types correct?
* Are there unnecessary abstractions?
* Are there oversized files?
* Are there unused/dead code paths?
* Are page/route files clean?
* Are mock data, constants, helpers, and types in appropriate locations?
* Has unrelated functionality remained unchanged?
* Does type checking pass?
* Do relevant tests pass?

The implementation is not complete until this review has been performed.

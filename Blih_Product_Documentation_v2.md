# Blih MVP Domain Plan

## 1. Domain architecture

Blih will have three user-facing web applications and one backend API:

```text
skills.blih.com  →  Skills Web
talent.blih.com  →  Talent Web
auth.blih.com    →  Auth Web
api.blih.com     →  One API
```

The exact production domains can change later. These names describe the planned separation of responsibilities.

## 2. Skills Web

### Main users

- Learners
- Blih administrators

### Responsibilities

- Display course titles and descriptions
- Process the one-time Skills payment
- Display courses and lessons
- Display videos and downloadable documents
- Handle quizzes and assignments
- Track learning progress
- Display course completion
- Display and download certificates
- Provide course administration for Blih administrators

### Suggested routes

```text
/
/courses
/courses/:courseId
/courses/:courseId/learn
/dashboard
/profile
/certificates
/admin
/admin/courses
/admin/courses/new
/admin/courses/:courseId/edit
```

The route names are initial planning names and can change during implementation.

## 3. Talent Web

### Main users

- Talents
- Companies

### Talent responsibilities

- Create and edit talent profile
- Display completed Blih Skills courses and certificates
- Browse and search jobs
- View job details
- Apply to jobs
- View submitted applications

### Company responsibilities

- Create and edit company profile
- Select and pay for a subscription
- View subscription status
- Search talents
- View full talent profiles, CVs, email, and phone number
- Create unlimited job posts
- Edit and close own job posts
- View applications for own jobs
- Change applications to Reviewing

### Suggested routes

```text
/
/jobs
/jobs/:jobId
/applications
/profile
/companies/:companyId
/company
/company/subscription
/company/talents
/company/talents/:talentId
/company/jobs
/company/jobs/new
/company/jobs/:jobId/edit
/company/jobs/:jobId/applications
```

## 4. Auth Web

### Responsibilities

- Sign up
- Login
- Logout
- Email verification
- Password reset
- Role selection during registration
- Redirect users to the correct product after authentication

The Auth Web is the central authentication interface. It should not contain course, job, talent, company, or payment business logic.

### Suggested routes

```text
/login
/register
/verify-email
/forgot-password
/reset-password
```

A user has one role in the MVP:

- Talent
- Company

Administrator access is handled separately through the administrator account and Skills Web.

## 5. One API

The API is the single backend for all three web applications.

### API responsibilities

- Authentication and sessions/tokens
- User accounts and roles
- Talent profiles
- Company profiles
- Course catalog and content
- Learning progress
- Quizzes and assignments
- Certificates
- Skills payments
- Company subscriptions
- Chapa payment callbacks/webhooks
- Jobs
- Applications
- Notifications

### Suggested API modules

```text
auth
users
talents
companies
courses
learning
certificates
payments
subscriptions
jobs
applications
notifications
```

These are modules within one API application, not separate services.

## 6. Data ownership

The API owns the database. The web applications communicate with the API and do not access the database directly.

```text
Skills Web ─┐
Talent Web ─┼── API ─── Database
Auth Web ───┘
```

The API is responsible for authorization. Each request must verify that the user has permission to access the requested resource.

Examples:

- A talent can edit only their own profile.
- A company can edit only its own company profile and jobs.
- A company can view talent details only with an active subscription.
- A company can view applications only for its own jobs.
- Only Blih administrators can manage courses.

## 7. Shared authentication flow

```text
User opens Skills Web or Talent Web
→ User is redirected to Auth Web if not logged in
→ User logs in or registers
→ Auth Web creates the authenticated session
→ User is redirected back to the original product
→ Product Web requests data from the API
```

The authentication implementation should be shared across both products even though the user-facing websites are separate.

## 8. Payment flow

### Blih Skills

```text
Learner selects access
→ Skills Web requests payment from API
→ API creates Chapa payment
→ Learner completes payment
→ Chapa notifies API
→ API verifies payment
→ API grants permanent Skills access
→ Skills Web displays unlocked courses
```

### Blih Talent company subscription

```text
Company selects monthly or yearly plan
→ Talent Web requests payment from API
→ API creates Chapa payment
→ Company completes payment
→ Chapa notifies API
→ API verifies payment
→ API activates subscription
→ Talent Web enables company features
```

Renewal is manual. The API must block talent search and job posting when the subscription is no longer active.

## 9. Notifications

The first version supports notifications for:

- Successful Skills payment
- Successful company subscription payment
- New job application

Each supported notification is delivered:

- By email
- Inside the relevant dashboard

## 10. MVP boundaries

This domain plan does not define:

- A monorepo structure
- A specific frontend framework
- A specific backend framework
- A specific database engine
- Deployment infrastructure
- Microservices
- Mobile applications
- Internal chat
- Separate admin application

Those decisions belong in the implementation plan.

---

# Blih MVP Implementation Plan

## 1. Purpose

This document provides the step-by-step implementation order for the Blih MVP.

The repositories are assumed to already exist:

- Skills Web
- Talent Web
- Auth Web
- One API

The implementation should stay simple and should complete each feature end-to-end before moving to the next feature.

## 2. Architecture reminder

```text
skills.blih.com  →  Skills Web
talent.blih.com  →  Talent Web
auth.blih.com    →  Auth Web
api.blih.com     →  One API → Database
```

The web applications communicate with the API. They do not access the database directly.

The API should remain one application with internal modules rather than being split into microservices.

## 3. Implementation principles

1. Build the smallest version that satisfies the PRD.
2. Build vertical slices from the UI through the API and database.
3. Keep authorization in the API, not only in the web applications.
4. Verify Chapa payments on the server before granting access.
5. Use migrations for every database change.
6. Use test data and seed scripts for local development.
7. Avoid building out-of-scope features.
8. Test each phase before beginning the next phase.

## 4. Phase 0: Technical foundation

### API tasks

- Configure environment variables.
- Configure the database connection.
- Add database migrations.
- Add the `/api/v1` API prefix.
- Add a health-check endpoint.
- Add request validation.
- Define a consistent error response format.
- Add basic request logging.
- Configure CORS for Auth Web, Skills Web, and Talent Web.
- Define the API documentation format, preferably OpenAPI.

### Shared infrastructure tasks

- Configure development and production environments.
- Choose and configure file storage.
- Configure the email provider.
- Add Chapa test configuration.
- Define the base application URLs.
- Define database backup and logging requirements.

### Completion checkpoint

- All repositories run locally.
- The API can connect to the database.
- Migrations can be executed and rolled back where supported.
- The health-check endpoint responds successfully.
- The web applications can make authenticated-free requests to the API.

## 5. Phase 1: Authentication

### API tasks

- Create the user model.
- Add user roles: talent, company, and administrator.
- Implement registration.
- Implement login.
- Implement logout.
- Implement email verification.
- Implement password reset.
- Implement sessions or access tokens.
- Add authentication middleware.
- Add role-based authorization middleware.
- Add current-user endpoint.

### Auth Web tasks

- Build registration page.
- Build role selection.
- Build login page.
- Build email verification page.
- Build forgot-password page.
- Build reset-password page.
- Implement redirect back to the original product.
- Display authentication errors clearly.

### Product integration tasks

- Protect Skills Web routes.
- Protect Talent Web routes.
- Redirect unauthenticated users to Auth Web.
- Redirect users to the correct dashboard based on their role.
- Prevent talents from opening company routes.
- Prevent companies from opening talent routes.
- Protect administrator routes.

### Completion checkpoint

- A talent can register, verify email, log in, and reach Talent Web.
- A company can register, verify email, log in, and reach Talent Web.
- An administrator can log in and reach Skills Web administration.
- Logout and password reset work.
- Role restrictions are enforced by the API.

## 6. Phase 2: Profiles and file uploads

### API tasks

- Create talent profile model and endpoints.
- Create company profile model and endpoints.
- Add profile update validation.
- Add profile photo upload.
- Add talent CV upload.
- Add company logo upload.
- Add file type and file size validation.
- Add profile completion state if needed by the UI.

### Talent Web tasks

- Build talent profile setup page.
- Build talent profile edit page.
- Build talent profile preview page.
- Add profile photo upload.
- Add CV upload.
- Add fields for skills, English level, experience, and education.

### Company Web tasks

- Build company profile setup page.
- Build company profile edit page.
- Add company logo upload.
- Add company contact and website fields.

### Completion checkpoint

- Talents can create and edit their profiles.
- Companies can create and edit their profiles.
- Uploaded files are stored safely.
- Users can edit only their own profiles.

## 7. Phase 3: Blih Skills course administration

### API tasks

Create the course content structure:

```text
Course
  └── Lesson
        ├── Written content
        ├── Video
        ├── Documents
        ├── Quiz
        └── Assignment
```

Implement:

- Course creation.
- Course editing.
- Course publish and unpublish state.
- Lesson creation and editing.
- Lesson ordering.
- Video and document uploads.
- Quiz creation and editing.
- Assignment creation and editing.
- Public course catalog endpoint.
- Course detail endpoint.

### Skills Web tasks

- Build public course catalog.
- Build course detail page.
- Build administrator course list.
- Build course creation form.
- Build course editing form.
- Build lesson management.
- Build quiz and assignment management.
- Add course publish controls.

### Completion checkpoint

- An administrator can create and publish a complete course.
- Visitors can see course titles and descriptions.
- Course content can be managed without direct database access.

## 8. Phase 4: Blih Skills payment and access

### API tasks

- Create payment transaction model.
- Create Skills access or entitlement model.
- Add the 1,000 ETB Skills product.
- Create Chapa checkout request.
- Handle Chapa callback or webhook.
- Verify payment status with Chapa.
- Make payment handling idempotent.
- Grant permanent Skills access after verified payment.
- Add endpoint for current Skills access status.

### Skills Web tasks

- Add payment call-to-action.
- Add checkout redirect.
- Add payment success page.
- Add payment failure page.
- Add locked course and lesson states.
- Add unlocked course and lesson states.
- Add payment confirmation display.

### Notification tasks

- Create payment confirmation record.
- Send payment confirmation email.
- Display payment confirmation internally.

### Completion checkpoint

- A learner can pay 1,000 ETB.
- Verified payment unlocks all current courses.
- Future courses are unlocked automatically.
- Failed or unverified payments do not unlock content.
- Duplicate callbacks do not create duplicate access or inconsistent payment state.

## 9. Phase 5: Learning experience and progress

### API tasks

- Create lesson progress model.
- Add mark-lesson-complete endpoint.
- Add course progress calculation.
- Create quiz attempt model.
- Store quiz results.
- Create assignment submission model.
- Store assignment submissions.
- Add course completion calculation.

### Skills Web tasks

- Build course learning page.
- Build lesson navigation.
- Add written lesson display.
- Add video display.
- Add document download.
- Add lesson completion action.
- Add course progress indicator.
- Build quiz interface.
- Build assignment submission interface.
- Build course completion state.

### Recommended initial completion rule

```text
Required lessons completed
+ Required quiz requirements completed
+ Required assignments submitted
= Course completed
```

Avoid manual assignment grading in the first version unless it becomes necessary.

### Completion checkpoint

- Learning progress is saved.
- Learners can continue where they stopped.
- Quizzes and assignments are recorded.
- Course completion is calculated consistently.

## 10. Phase 6: Certificates and product integration

### API tasks

- Create certificate model.
- Create certificate identifier or number.
- Generate certificate data after course completion.
- Add certificate download endpoint.
- Add completed course data to talent profile responses.
- Add certificate data to talent profile responses.

### Skills Web tasks

- Build certificate page.
- Add certificate download.
- Display completed course state.

### Talent Web tasks

- Display completed Blih Skills courses.
- Display certificates.
- Add certificate download links.

### Completion checkpoint

- A completed course generates a certificate.
- The certificate can be downloaded.
- Completed courses and certificates appear automatically on the talent profile.

## 11. Phase 7: Company subscriptions

### API tasks

- Create subscription plan configuration.
- Add monthly plan: 2,000 ETB.
- Add yearly plan: 10,000 ETB.
- Create subscription model.
- Create subscription payment transactions.
- Add Chapa checkout for subscriptions.
- Handle and verify Chapa callbacks or webhooks.
- Calculate subscription start and expiry dates.
- Add manual renewal.
- Add active-subscription authorization middleware.

### Talent Web company tasks

- Build subscription plan page.
- Build monthly and yearly plan selection.
- Build Chapa checkout flow.
- Build payment success and failure states.
- Display active subscription status.
- Display expiry date.
- Build manual renewal flow.
- Display expired subscription state.

### Access rules

An active company subscription is required to:

- Search talents.
- View full talent profiles.
- Create jobs.
- Edit jobs.
- Review applications.

When the subscription expires:

- Talent search is blocked.
- New job posting is blocked.
- Existing data remains stored.
- Manual renewal restores access after payment verification.

### Completion checkpoint

- A company can subscribe monthly or yearly.
- Access starts only after verified payment.
- Monthly and yearly subscriptions expire correctly.
- Manual renewal restores access.

## 12. Phase 8: Jobs and talent search

### API job tasks

- Create job model.
- Create job endpoint.
- Edit own job endpoint.
- List own jobs endpoint.
- View job detail endpoint.
- Close own job endpoint.
- List active jobs endpoint.
- Add basic search and filters.
- Enforce active subscription checks.

### Required job fields

- Job title
- Job description
- Required skills
- English level
- Salary or salary range
- Employment type
- Working hours
- Time zone
- Country restrictions
- Experience level
- Application deadline

### Talent search tasks

- Add talent search endpoint.
- Add basic filters.
- Return completed Skills courses and certificates.
- Restrict full profile access to active companies.
- Do not add saved talents or bookmarks.

### Talent Web tasks

- Build job listing page.
- Build job detail page.
- Add basic job search and filters.
- Build talent applications entry point.

### Company Web tasks

- Build company jobs dashboard.
- Build create-job form.
- Build edit-job form.
- Build close-job action.
- Build talent search page.
- Build talent detail page.

### Completion checkpoint

- Active companies can publish unlimited jobs immediately.
- Talents can browse active jobs.
- Companies can search and view talent profiles.
- Closed jobs are unavailable for new applications.

## 13. Phase 9: Applications and notifications

### API tasks

- Create application model.
- Create apply-to-job endpoint.
- Prevent duplicate applications by the same talent to the same job.
- List a talent's applications.
- List applications for a company's own job.
- Update application status.
- Create internal notification model.
- Add notification read state.
- Add email notification service.

### Application statuses

```text
Applied → Reviewing
```

There is no Hired status. Hiring takes place outside Blih.

### Talent Web tasks

- Add Apply button.
- Add application confirmation.
- Build My Applications page.
- Display application status.

### Company Web tasks

- Build applications list per job.
- Display applicant profile and CV.
- Add status update to Reviewing.
- Add external contact details.

### Notifications

Send email and create internal notifications for:

- Successful Skills payment.
- Successful company subscription payment.
- New job application.

### Completion checkpoint

- A talent can apply for a job.
- Duplicate applications are prevented.
- Companies receive new-application notifications.
- Companies can update an application to Reviewing.
- Contact and hiring happen externally.

## 14. Phase 10: Testing and hardening

### Functional testing

Test:

- Talent registration and login.
- Company registration and login.
- Administrator login.
- Password reset.
- Skills payment.
- Skills course access.
- Course progress.
- Quiz and assignment submission.
- Certificate generation.
- Completed course display on talent profile.
- Company subscription payment.
- Subscription expiry.
- Manual subscription renewal.
- Talent search.
- Job creation and closing.
- Job search.
- Job application.
- Application review.
- Email and internal notifications.

### Authorization testing

Verify that:

- Users can edit only their own profiles.
- Talents cannot access company actions.
- Companies cannot access talent-only actions.
- Companies cannot view full talent information without an active subscription.
- Companies can access only their own jobs and applications.
- Closed jobs do not accept applications.
- Expired companies cannot search or post jobs.
- Only administrators can manage courses.

### Payment testing

Verify:

- Successful payments grant the correct access.
- Failed payments do not grant access.
- Duplicate callbacks are safe.
- Invalid callbacks are rejected.
- Payment status is stored correctly.
- Manual renewal works.

### Launch preparation

- Configure production environment variables.
- Configure Chapa production credentials.
- Configure production email.
- Configure production file storage.
- Configure database backups.
- Configure error logging.
- Create the first administrator account.
- Add initial Skills courses.
- Add Terms of Service and Privacy Policy pages.

## 15. Recommended development rhythm

For every feature:

```text
Define API contract
→ Create migration/model
→ Implement API
→ Add authorization
→ Add web UI
→ Add success and error states
→ Test the complete flow
→ Document any decision
```

Do not move to the next phase until the current phase passes its completion checkpoint.

## 16. First implementation task

Start with Phase 0:

1. Confirm the database and file-storage choices.
2. Configure local environment variables.
3. Add the API health-check endpoint.
4. Add the first database migration.
5. Define the initial API response and error format.
6. Configure communication between the three web applications and the API.

After that, implement authentication end-to-end before starting course or marketplace features.

---

# Blih MVP Product Requirements Document

## 1. Document purpose

This document defines the minimum product requirements for Blih Skills and Blih Talent.

## 2. Products and roles

### Products

- Blih Skills
- Blih Talent

### User roles

- **Talent**: Learns, creates a profile, searches jobs, and applies.
- **Company**: Subscribes, searches talents, posts jobs, and reviews applications.
- **Blih administrator**: Manages Blih Skills course content.

Each account has one role in the MVP. A user cannot act as both a talent and a company.

## 3. Authentication requirements

Both products must use shared authentication while remaining separate websites.

The authentication system must support:

- Account registration
- Login
- Logout
- Email verification
- Password reset
- Role selection during registration
- Access based on the user's role

## 4. Blih Skills requirements

### 4.1 Course discovery

Learners can:

- View the course catalog
- See course titles
- See course descriptions
- See that one payment unlocks all current and future courses

Course content remains locked until payment is confirmed.

### 4.2 Skills payment

- The learner pays **1,000 ETB** once through Chapa.
- A successful payment unlocks all current courses.
- The same purchase unlocks future courses.
- Access does not expire.
- Duplicate successful purchases must not remove or reset access.
- Payment confirmation must be shown to the learner.
- Payment confirmation must generate an email and an internal notification.

### 4.3 Course content

A course can contain:

- Written lessons
- Videos
- Downloadable documents
- Quizzes
- Assignments

Learners must be able to:

- Open lessons in course order or from the course outline
- Mark lessons as completed
- View course progress
- Complete quizzes
- Submit assignments
- See whether a course is completed

### 4.4 Course completion and certificates

When the required course content is completed:

- The course is marked as completed.
- A certificate is generated or made available for download.
- The completed course is added to the talent's Blih Talent profile.
- The certificate is displayed on the talent's Blih Talent profile.

### 4.5 Course administration

Only Blih administrators can:

- Create courses
- Edit courses
- Add, edit, and order lessons
- Upload videos and documents
- Create quizzes
- Create assignments
- Publish and unpublish courses

The MVP does not require Blih administrators to manage companies, jobs, talents, or applications.

## 5. Talent requirements

### 5.1 Talent profile

A talent can create and edit a profile containing:

- Full name
- Profile photo
- Email
- Phone number
- Country
- City
- English level
- Skills
- Work experience
- Education
- CV upload
- Completed Blih Skills courses
- Certificates

A talent can browse and apply for jobs after creating a profile. Completing a Blih Skills course is not required to use Blih Talent.

### 5.2 Job search

Talents can:

- Browse active jobs
- View full job details
- Search or filter jobs using the available job information
- Apply to a job
- View their applications

### 5.3 Applications

An application uses the talent's profile and CV.

The MVP application statuses are:

- Applied
- Reviewing

The final hiring process happens outside Blih. There is no Hired status in the MVP.

## 6. Company requirements

### 6.1 Company profile

A company can create and edit a profile containing:

- Company name
- Company logo
- Company description
- Website
- Country
- City
- Contact person name
- Contact email
- Contact phone number

### 6.2 Company subscription

Companies can select one of two plans:

| Plan | Price | Features |
|---|---:|---|
| Monthly | 2,000 ETB | Same as yearly plan |
| Yearly | 10,000 ETB | Same as monthly plan |

Requirements:

- Payment is processed through Chapa.
- Access is activated after successful payment confirmation.
- Renewal is manual.
- An active subscription is required to search talents and post jobs.
- When the subscription expires, talent search and job posting are blocked.
- Existing company data and applications remain stored.
- No limits are placed on the number of job posts while the subscription is active.

### 6.3 Talent search

An active company can:

- Search talents
- View full talent profiles
- View completed Blih Skills courses and certificates
- View CVs
- View email and phone number
- Contact talents externally

The MVP does not include saving or bookmarking talents.

## 7. Job requirements

### 7.1 Job creation

An active company can publish unlimited jobs immediately.

A job must include:

- Job title
- Job description
- Required skills
- English level
- Salary or salary range
- Employment type
- Working hours
- Time zone
- Country restrictions
- Experience level
- Application deadline

### 7.2 Job lifecycle

- A job is published immediately after the company submits it.
- A job remains active until the company closes it.
- A company closes the job after hiring externally.
- Closed jobs are no longer available for new applications.
- There is no job approval workflow in the MVP.

### 7.3 Application review

A company can:

- View applications for its own jobs
- View the applicant's profile and CV
- Change the application status from Applied to Reviewing
- Contact the applicant externally

## 8. Notifications

The MVP supports email and internal dashboard notifications for:

- Successful Blih Skills payment
- Successful company subscription payment
- New job application

Other notifications are out of scope for now.

## 9. Payment requirements

Chapa will be the payment provider for:

- The 1,000 ETB Blih Skills purchase
- The 2,000 ETB monthly company plan
- The 10,000 ETB yearly company plan

The system must verify payment success before unlocking course access or company features.

## 10. MVP acceptance criteria

The MVP is functionally complete when:

1. A learner can pay 1,000 ETB and access all current and future courses.
2. A learner can complete a course and receive a certificate.
3. Completed courses and certificates appear on the talent profile.
4. A talent can create a profile and apply for a job for free.
5. A company can pay for a monthly or yearly plan.
6. An active company can search talents and view full talent information.
7. An active company can publish unlimited jobs immediately.
8. A company can review applications using Applied and Reviewing statuses.
9. A company can close a job after hiring externally.
10. Expired companies cannot search talents or post new jobs.
11. Payment and new-application notifications are sent by email and shown internally.

## 11. Out of scope

- Internal messaging
- Talent saving/bookmarking
- AI matching
- Automated recommendations
- Video interviews
- Payroll
- Time tracking
- Hiring management after external contact
- Mobile apps
- Live classes
- External instructors
- Company approval
- Job approval
- Admin management of companies, jobs, talents, or applications
- Automatic subscription renewal
- Advanced analytics and success metrics

---

# Blih Product Plan

This folder contains the current planning documents for the Blih product family.

## Products

- **Blih Skills**: A paid learning platform that prepares people for remote work.
- **Blih Talent**: A job marketplace connecting talents with companies.

## Current planning status

- Product direction: defined
- Product brief: complete
- MVP PRD: complete
- User flows: complete
- Scope and decisions: complete
- Domain plan: complete
- Implementation plan: complete

## Documents

| Document | Purpose |
|---|---|
| [Product brief](./product-brief.md) | Product vision, users, business model, and goals |
| [PRD](./prd.md) | Functional requirements for the MVP |
| [User flows](./user-flows.md) | Main learner, talent, and company journeys |
| [Scope and decisions](./scope-and-decisions.md) | Confirmed decisions, boundaries, and out-of-scope features |
| [Domain plan](./domain-plan.md) | Skills Web, Talent Web, Auth Web, and the shared API responsibilities |
| [Implementation plan](./implementation-plan.md) | Step-by-step development order, tasks, and completion checkpoints |

## Important principle

Keep the first version simple. Blih Skills provides training and Blih Talent connects talents with companies. The final hiring process happens outside Blih.

---

# Blih MVP Scope and Decisions

## Confirmed decisions

| Area | Decision |
|---|---|
| Blih Skills price | 1,000 ETB one-time payment |
| Blih Skills access | All current and future courses; access does not expire |
| Blih Skills audience | Everyone |
| Course preview | Course title and description are visible before payment |
| Course administrators | Blih administrators only |
| Course content | Written lessons, videos, downloadable documents, quizzes, assignments |
| Course completion | Certificate and completed course displayed on talent profile |
| Talent access | Free |
| Talent profile | Required before applying and searchable by companies |
| Company plans | 2,000 ETB monthly or 10,000 ETB yearly |
| Company plan features | Same features; yearly plan is cheaper overall |
| Subscription renewal | Manual |
| Job posting | Unlimited and published immediately |
| Company approval | Not required in the MVP |
| Company access | Active subscribers can view full talent information |
| Talent saving | Not included |
| Communication | External contact; no internal chat |
| Application statuses | Applied and Reviewing only |
| Hiring workflow | Managed externally; company closes the job after hiring |
| Job expiration | Job remains active until company closes it |
| Payment provider | Chapa |
| Notifications | Payment and new applications by email and internally |
| User roles | One role per account |
| Websites | Separate websites with shared login |
| Primary company market | Germany, Poland, and Europe |
| Success metrics | Not documented at this stage |

## MVP boundaries

### Included

- Shared authentication
- Talent accounts and profiles
- Company accounts and profiles
- One-time Blih Skills purchase
- Company subscriptions
- Course catalog and course learning
- Course progress
- Quizzes and assignments
- Certificates
- Talent search
- Job posting
- Job search
- Job applications
- Basic application statuses
- Email and internal notifications
- Blih Skills course administration

### Not included

- Internal chat
- Talent bookmarks or saved talents
- AI matching
- Recommendations
- Video interviews
- Payroll
- Time tracking
- Mobile applications
- Live classes
- External instructors
- Company or job approval
- Admin management of companies, jobs, talents, or applications
- Automatic subscription renewal
- Advanced analytics
- Success metrics

## Product rules

1. A learner's single Skills payment unlocks current and future courses permanently.
2. A talent does not need to complete a course before using Blih Talent.
3. A company must have an active subscription to search talents or post jobs.
4. Companies can publish unlimited jobs while their subscription is active.
5. Companies can see full talent information while subscribed.
6. Job applications do not contain a Hired status.
7. Hiring happens outside Blih.
8. Closing a job ends new applications for that job.
9. An expired company keeps its data but loses talent-search and job-posting access.
10. Only Blih administrators manage course content in the MVP.

## Future decisions

These items are intentionally left for later planning:

- Exact tax and payment handling
- Refund policy
- Terms of service and privacy policy details
- Company verification and moderation
- Talent profile approval
- Job reporting and abuse handling
- Additional subscription plans
- Success metrics
- In-platform communication

---

# Blih MVP User Flows

## 1. Account registration

### Talent

```text
Open Blih Skills or Blih Talent
→ Create account
→ Select Talent role
→ Verify email
→ Complete talent profile
```

### Company

```text
Open Blih Talent
→ Create account
→ Select Company role
→ Verify email
→ Complete company profile
→ Choose subscription
→ Pay through Chapa
→ Company access becomes active
```

### Administrator

Blih administrators use an administrator account to access course management. Administrator accounts are not created through the public talent or company registration flow.

## 2. Blih Skills learner flow

```text
View course catalog
→ Read course title and description
→ Pay 1,000 ETB once
→ Payment confirmed
→ All current courses unlock
→ Study lessons
→ Watch videos
→ Download documents
→ Complete quizzes and assignments
→ Course completed
→ Certificate becomes available
→ Course and certificate appear on talent profile
```

## 3. Talent job-search flow

```text
Log in
→ Open Blih Talent
→ Complete talent profile
→ Browse active jobs
→ Open job details
→ Apply with profile and CV
→ Application status is Applied
→ Company reviews application
→ Status may become Reviewing
→ Company contacts talent externally
```

## 4. Company job-posting flow

```text
Log in
→ Confirm active subscription
→ Open company dashboard
→ Create job
→ Enter all required job information
→ Publish job
→ Job is immediately visible
→ Receive applications
→ Review applicants
→ Contact selected talent externally
→ Close job after hiring
```

## 5. Company talent-search flow

```text
Log in
→ Confirm active subscription
→ Search talents
→ Open talent profile
→ View skills, experience, CV, courses, certificates, email, and phone
→ Contact talent externally
```

## 6. Subscription expiration flow

```text
Company subscription expires
→ Talent search is blocked
→ New job posting is blocked
→ Existing data remains stored
→ Company manually renews through Chapa
→ Access is restored after payment confirmation
```

## 7. Application notification flow

```text
Talent submits application
→ Application is saved
→ Company receives email notification
→ Company sees an internal notification
→ Company opens the application
→ Company can change status to Reviewing
```

---

# Blih MVP Data and Permissions

This document describes the main data areas and who can access them. It is a planning reference, not a final technical database design.

## Main data areas

### User

- Account credentials
- Email verification state
- Role: talent, company, or administrator

### Talent profile

- Personal information
- Contact information
- Location
- English level
- Skills
- Experience
- Education
- CV
- Course completions
- Certificates

### Company profile

- Company information
- Company contact information
- Website
- Subscription status

### Course

- Title
- Description
- Publication status
- Lessons
- Videos
- Documents
- Quizzes
- Assignments

### Learning progress

- Learner
- Course
- Lesson progress
- Quiz results
- Assignment submissions
- Completion status
- Certificate

### Payment

- User or company
- Payment type
- Amount
- Currency
- Chapa reference
- Payment status
- Date

Payment types:

- Skills access
- Monthly company subscription
- Yearly company subscription

### Job

- Company
- Job details
- Requirements
- Status: active or closed
- Creation date
- Application deadline

### Application

- Talent
- Job
- Application date
- Status: Applied or Reviewing
- Profile and CV reference

### Notification

- Recipient
- Type
- Message
- Read status
- Created date

## Permission summary

| Action | Talent | Company | Admin |
|---|---:|---:|---:|
| Manage own account | Yes | Yes | Yes |
| Manage own talent profile | Yes | No | No |
| Manage own company profile | No | Yes | No |
| View active jobs | Yes | Yes | Yes |
| Apply to jobs | Yes | No | No |
| Search talents | No | Active subscription | No |
| View full talent profile | No | Active subscription | No |
| Create jobs | No | Active subscription | No |
| Manage own jobs | No | Active subscription | No |
| Review applications | No | Own jobs | No |
| Manage courses | No | No | Yes |
| Manage users | No | No | No |
| Manage company/job moderation | No | No | No |

## Privacy rule

A subscribed company can view a talent's full profile, including email, phone number, CV, completed courses, and certificates, because the company is using the platform to contact the talent externally.

---

# Blih Product Brief

## 1. Overview

Blih will operate two connected products:

- **Blih Skills** prepares people for remote work through practical courses.
- **Blih Talent** connects trained and interested talents with companies looking for remote workers.

Blih provides training and introductions. Blih does not directly employ talents or manage the final hiring process.

## 2. Product vision

Make it simple for people to become remote-ready and simple for companies to find remote talent.

## 3. Target users

### Talents

People who want to:

- Learn practical remote-work skills
- Build a professional talent profile
- Find remote job opportunities
- Apply to jobs for free

### Companies

Companies, mainly in Germany, Poland, and Europe, that want to:

- Find remote talent
- View talent profiles and CVs
- Post job opportunities
- Contact candidates directly

### Blih administrators

Blih administrators manage course content on Blih Skills.

## 4. Business model

### Blih Skills

- One-time payment: **1,000 ETB**
- Payment unlocks all current and future courses
- Access does not expire
- Payment is processed through Chapa

### Blih Talent

- Free for talents
- Monthly company plan: **2,000 ETB**
- Yearly company plan: **10,000 ETB**
- Monthly and yearly plans have the same features
- Renewal is manual
- Companies receive access after successful payment through Chapa

## 5. Product relationship

The products will use separate websites with shared authentication:

```text
skills.blih.com
talent.blih.com
```

A talent's completed Blih Skills courses and certificates should appear on the talent's Blih Talent profile.

In the first version, each account has one role only:

- Talent
- Company

## 6. Core value proposition

### For talents

Learn remote-work skills, prove course completion, and access job opportunities without paying to use the talent marketplace.

### For companies

Pay one simple subscription to search talent profiles, view CVs and contact details, and post unlimited jobs.

### For Blih

Train a pool of remote-ready talents and create a paid connection between them and companies.

## 7. MVP outcome

The MVP should allow this complete flow:

```text
Learner pays once
→ Learner completes courses
→ Course certificates appear on talent profile
→ Company subscribes
→ Company searches talents and posts jobs
→ Talent applies
→ Company contacts talent externally
```

## 8. Deliberate simplicity

The MVP will not include in-platform chat, AI matching, payroll, time tracking, video interviews, mobile apps, or complex hiring management.

---

# DESIGN.md

```yaml
version: alpha
name: BlihOps
description: A calm, editorial operations interface where disciplined structure
  communicates trust. White and soft-neutral surfaces carry most of the page;
  a focused blue marks action and live operational signals. Source Serif 4 adds
  authority to headings, while Inter and JetBrains Mono keep the system practical
  and technical. Hairline grids, compact radii, restrained depth, and purposeful
  motion make intelligent outsourcing feel measurable rather than abstract.

colors:
  primary: '#3B82F6'
  primary-foreground: '#FFFFFF'
  foreground: '#333333'
  body: '#4B5563'
  muted-foreground: '#6B7280'
  background: '#FFFFFF'
  card: '#FFFFFF'
  muted: '#F9FAFB'
  secondary: '#F3F4F6'
  border: '#E5E7EB'
  accent: '#E0F2FE'
  accent-foreground: '#1E3A8A'
  destructive: '#EF4444'
  dark-background: '#171717'
  dark-card: '#262626'
  dark-foreground: '#E5E5E5'
  dark-muted: '#1F1F1F'
  dark-muted-foreground: '#A3A3A3'
  dark-border: '#404040'

typography:
  display-hero:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: 60px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -1.5px
  display-section:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -1.2px
  heading-card:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.2px
  body-lg:
    fontFamily: 'Inter, sans-serif'
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: 0
  body-md:
    fontFamily: 'Inter, sans-serif'
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: 0
  body-sm:
    fontFamily: 'Inter, sans-serif'
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: 0
  label:
    fontFamily: 'Inter, sans-serif'
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 1.2px
  technical:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.6px
  button:
    fontFamily: 'Inter, sans-serif'
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0

rounded:
  none: 0px
  sm: 3.6px
  md: 4.8px
  lg: 6px
  xl: 8.4px
  2xl: 10.8px
  3xl: 13.2px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  section-mobile: 64px
  section-desktop: 96px

motion:
  ease-out: 'cubic-bezier(0.22, 1, 0.36, 1)'
  ease-snappy: 'cubic-bezier(0.16, 1, 0.3, 1)'
  micro: 180ms
  interactive: 300ms
  entrance: 450ms
  entrance-long: 550ms
  numeric: 900ms
  stagger: 80ms

components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.primary-foreground}'
    typography: '{typography.button}'
    rounded: '{rounded.md}'
    height: 40px
    padding: '0 {spacing.base}'
  button-outline:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground}'
    borderColor: '{colors.border}'
    typography: '{typography.button}'
    rounded: '{rounded.md}'
    height: 40px
    padding: '0 {spacing.base}'
  eyebrow-label:
    textColor: '{colors.muted-foreground}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
  section-heading:
    textColor: '{colors.foreground}'
    typography: '{typography.display-section}'
  section-intro:
    textColor: '{colors.muted-foreground}'
    typography: '{typography.body-md}'
  structural-panel:
    backgroundColor: '{colors.card}'
    textColor: '{colors.foreground}'
    borderColor: '{colors.border}'
    rounded: '{rounded.none}'
  operational-card:
    backgroundColor: '{colors.card}'
    textColor: '{colors.foreground}'
    borderColor: '{colors.border}'
    rounded: '{rounded.xl}'
    padding: '{spacing.lg}'
  status-badge:
    backgroundColor: '{colors.muted}'
    textColor: '{colors.muted-foreground}'
    borderColor: '{colors.border}'
    typography: '{typography.label}'
    rounded: '{rounded.full}'
  metric-card:
    backgroundColor: '{colors.muted}'
    textColor: '{colors.foreground}'
    borderColor: '{colors.border}'
    rounded: '{rounded.xl}'
    padding: '{spacing.xl}'
  image-cta-panel:
    backgroundColor: '{colors.dark-background}'
    textColor: '{colors.primary-foreground}'
    borderColor: '{colors.border}'
    rounded: '{rounded.2xl}'
  form-control:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground}'
    borderColor: '{colors.border}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.md}'
    height: 40px
```

## How to Use This File

Read this file before creating or changing any BlihOps interface. It describes
the visual logic of the current marketing site and turns its strongest recurring
patterns into rules for future work.

Use this precedence when sources appear to disagree:

1. This file decides visual intent, composition, and taste.
2. `src/app/globals.css` supplies implementation values and semantic Tailwind
   tokens.
3. Existing shared primitives such as `SectionWrapper`, `buttonVariants`,
   `TimelineAnimation`, `HeroBackdrop`, and `DecorIcon` supply implementation
   patterns.
4. A style found on only one page is an example, not automatically a new rule.

The hexadecimal values above are readable equivalents of the current OKLCH
theme. In code, use semantic classes such as `bg-background`, `text-foreground`,
`text-muted-foreground`, `border-border`, and `bg-primary`. Do not copy the hex
values into components.

## Overview

BlihOps should feel like an operations partner before it feels like a software
product. The interface is calm, exact, and visibly structured. Its visual
language borrows from editorial typography, operational dashboards, process
diagrams, and carefully ruled documents. The result should communicate that
complex work will be made orderly, measured, and accountable.

Most pages are bright and neutral. Blue carries action and live operational
meaning, so it stays scarce enough to remain useful. Serif headings make the
brand assured and human; sans-serif descriptions keep it direct; monospaced
labels make SLAs, steps, identifiers, and metrics feel concrete.

The design is not card-led. Structure comes from whitespace, hairline borders,
full-width dividers, visible grids, alternating compositions, and occasional
dark contrast panels. Rounded cards and shadows are available, but they are
supporting devices rather than the page's default grammar.

**Key characteristics:**

- Editorial serif hierarchy paired with practical sans-serif copy.
- A restrained blue signal inside an overwhelmingly neutral interface.
- Hairline grids, crossing rules, square frames, and small crosshair details.
- Operational proof shown through SLAs, workflows, metrics, steps, and reporting.
- Compact radii and quiet shadows rather than soft, oversized SaaS cards.
- Purposeful motion that resolves quickly and never competes with comprehension.

## Design Principles

### Structure is the visual metaphor

The service promise is operational control. Layouts should therefore reveal
their structure: grids may keep their borders, timelines may expose their rail,
and feature groups may share a single framed surface. Avoid hiding every piece
inside a separate floating card.

### Proof before decoration

Use meaningful operational artifacts—workflow stages, SLA adherence, pod roles,
response times, reporting cadence, and measurable outcomes—as visual material.
Do not fill empty areas with abstract gradient blobs or arbitrary dashboards.

### Restraint creates authority

Let typography, spacing, and alignment establish hierarchy. Blue, shadows,
rounded shapes, and animation should each have a clear job. Repeating them
without purpose weakens the brand.

### Warm expertise, not sterile machinery

Source Serif headings and confident plain-language copy keep the technical
structure human. The system should feel capable and calm, never cold or robotic.

## Colors

The implementation source of truth is the semantic variable set in
`src/app/globals.css`. The roles below explain when to use those variables.

### Brand and action

- **Primary blue** (`{colors.primary}` — #3B82F6): Primary CTAs, selected
  services, active workflow states, progress fills, live status dots, inline
  action links, and occasional icon backgrounds. Do not use it as a large page
  background by default.
- **Primary foreground** (`{colors.primary-foreground}` — #FFFFFF): Text and
  icons placed on primary blue.
- **Accent blue** (`{colors.accent}` — #E0F2FE) and **accent foreground**
  (`{colors.accent-foreground}` — #1E3A8A): Quiet selected or informational
  states where primary blue would be too loud.

### Surfaces

- **Background** (`{colors.background}` — #FFFFFF): Default page floor.
- **Card** (`{colors.card}` — #FFFFFF): Content plates placed within bordered or
  muted structures. It intentionally matches the canvas in light mode; borders
  provide separation.
- **Muted** (`{colors.muted}` — #F9FAFB): Section bands, inactive controls,
  diagram layers, metric surfaces, and subtle hover states.
- **Secondary** (`{colors.secondary}` — #F3F4F6): Controls or surfaces that need
  one more step of contrast than muted.

### Text and rules

- **Foreground** (`{colors.foreground}` — #333333): Headings, important body
  text, icons, and the near-black contrast surface used by selected callouts.
- **Body** (`{colors.body}` — #4B5563): Supporting text when stronger contrast
  than muted copy is required.
- **Muted foreground** (`{colors.muted-foreground}` — #6B7280): Descriptions,
  labels, metadata, inactive navigation, and secondary iconography.
- **Border** (`{colors.border}` — #E5E7EB): The primary structural device.
  Dividers, grids, cards, inputs, timelines, and framed visuals all use this
  hairline neutral.
- **Destructive** (`{colors.destructive}` — #EF4444): Errors and destructive
  actions only. It is not a decorative brand accent.

### Dark contrast

Dark values exist for theme compatibility and for deliberate contrast panels.
Use a dark foreground or dark-background block as a single moment inside a
light page—for security, a quote, or a strong proof point. Do not alternate
light and dark every section.

The repository contains dark theme tokens, but no public theme switch is part
of the documented marketing experience. New dark-mode work must verify every
marketing composition rather than assuming token support is sufficient.

## Typography

### Families

- **Source Serif 4:** Display headings, section headings, card titles, large
  numbers, and high-value statements. It gives BlihOps editorial authority.
- **Inter:** Body copy, navigation, controls, labels, and form content. It keeps
  operational information direct and readable.
- **JetBrains Mono:** Step numbers, pod identifiers, compact percentages,
  technical labels, and system-state metadata. Use it sparingly; it is a signal
  for structured information, not the body font.

### Hierarchy

| Role               | Desktop |  Mobile |  Weight | Use                                          |
| ------------------ | ------: | ------: | ------: | -------------------------------------------- |
| Hero display       |    60px |    36px |     600 | One primary claim per page                   |
| Section display    |    48px |    30px |     600 | Major section titles                         |
| Subsection heading | 30–36px | 24–30px |     600 | Split-layout or framed-section headings      |
| Card heading       | 16–24px | 16–20px | 500–600 | Feature, service, and process titles         |
| Lead body          |    18px |    16px |     400 | Hero support copy only                       |
| Body               |    16px |    14px |     400 | Section descriptions and longer explanations |
| Compact body       |    14px | 12–14px | 400–500 | Cards, metadata, and controls                |
| Eyebrow label      |    12px |    12px |     500 | Uppercase section categories                 |
| Technical label    | 10–12px | 10–12px | 500–600 | IDs, steps, system states, percentages       |

### Principles

Headings rely on serif character, size, and tight tracking rather than extreme
weight. Use `font-heading`, `font-semibold`, and `tracking-tight` as the normal
display combination. Keep hero copy to roughly two lines on a small laptop and
avoid forced line breaks unless the composition has been verified across
breakpoints.

Body text normally uses `leading-relaxed`. Intro paragraphs should usually cap
between `max-w-lg` and `max-w-2xl`; do not let explanatory text run the full
container width. Uppercase labels use `tracking-widest` and muted color so they
organize without competing with headings.

### Font substitutes

The fonts load through `next/font/google` in `src/app/layout.tsx`. If loading is
unavailable, use Georgia for Source Serif, system sans-serif for Inter, and the
system monospace stack for JetBrains Mono. Do not introduce a fourth family.

## Layout

### Container and grid

Use `SectionWrapper` for normal site content: `max-w-6xl`, centered, with `16px`
mobile gutters and `24px` gutters from the small breakpoint upward. Full-bleed
backgrounds belong outside it; their content remains constrained inside it.

The canonical section rhythm is `{spacing.section-mobile}` (64px) vertically on
mobile and `{spacing.section-desktop}` (96px) from the medium breakpoint. Use
48–64px between a section introduction and its primary visual. Denser process
rows and inner cells may use 32–48px.

### Composition patterns

Choose a composition based on content rather than repeating the same centered
stack:

- **Centered editorial intro:** Eyebrow, serif heading, restrained description,
  then a large structured visual. Use for major capability and proof sections.
- **Asymmetric split:** Text and visual in roughly 45/55 or 50/50 columns. Use
  for services, detailed value propositions, and product-like demonstrations.
- **Sticky narrative:** A short left introduction remains sticky while steps or
  service rows move on the right. Use for sequential explanations.
- **Framed system:** Multiple cells share one border and internal dividers. Use
  when features form one operating model.
- **Timeline:** Alternate text and visuals around a visible center rail. Use only
  when order and progression are meaningful.
- **Editorial marquee:** Repeating testimonials or logos may extend horizontally
  while headings remain aligned to the main container.

Avoid using more than two consecutive sections with the same alignment and grid.
Vary rhythm through content structure, not arbitrary decoration.

### Whitespace philosophy

Whitespace represents control. Preserve generous separation around section
headings and primary claims, but keep related UI fragments tightly grouped.
When a layout feels empty, first improve scale, alignment, or meaningful proof;
do not immediately add a decorative card or gradient.

## Shape and Decoration

The base radius is 6px. Buttons and controls use compact `rounded-md`; small
interface modules use `rounded-lg` or `rounded-xl`; high-value image panels may
reach `rounded-2xl`. `rounded-full` is reserved for status dots, avatars,
progress tracks, and truly pill-shaped badges.

Structural surfaces may use no radius at all. Square borders are especially
appropriate for timelines, service imagery, comparison grids, and process
diagrams. This tension between compact rounded controls and square structural
frames is part of the BlihOps taste.

Small crosshair or plus marks may appear where border lines meet. Use the shared
`DecorIcon` or the established grid-plus treatment. These marks should clarify
the constructed geometry; do not scatter them across unrelated empty space.

Background graphics remain quiet: faint radial light, vertical hairlines, and
low-opacity grid rules. Avoid saturated mesh gradients, neon glows, noise
textures, and decorative blobs.

## Elevation

The default depth model is border first, surface second, shadow third.

- **Flat:** Page sections, grid cells, testimonials, timelines, and most feature
  groups use a 1px `{colors.border}` rule with no shadow.
- **Raised:** Small operational mockups may use `shadow-xs` or `shadow-md` so
  they read as interface artifacts sitting inside a flat editorial frame.
- **Prominent:** `shadow-lg` is reserved for a primary image CTA, an active
  overlay, or a deliberately floating demonstration card.
- **Atmospheric glow:** A faint primary or chart-color blur may support one
  automation visual. It must not become a general card treatment.

Never place a shadow on every card in a grid. Do not combine strong shadow,
large radius, gradient, blur, and border on the same ordinary component.

## Components

**`button-primary`** — The main conversion action. Use the existing default
`buttonVariants` treatment: `{colors.primary}` background,
`{colors.primary-foreground}` content, `{typography.button}`, compact
`{rounded.md}` corners, and a 40px large-CTA height. Marketing CTAs may keep a
solid primary hover over imagery. An inline arrow may move 2px on hover.

**`button-outline`** — The secondary action beside or near a primary CTA.
Background `{colors.background}`, border `{colors.border}`, text
`{colors.foreground}`, and the same height and radius as its primary partner.
Hover changes the surface to `{colors.muted}`; it does not become another blue
button.

**`eyebrow-label`** — A short category such as “Our approach,” “Trust & Proof,”
or “Intelligent Outsourcing Services.” Use `{typography.label}`, uppercase,
wide tracking, and `{colors.muted-foreground}`. It may sit inside a compact
bordered badge when status-like, but plain text is the normal section treatment.

**`section-heading`** — A concise Source Serif statement using
`{typography.display-section}` and `{colors.foreground}`. Center it for broad
category sections and left-align it for narrative or split sections. Do not
center all headings by habit.

**`section-intro`** — One to three sentences of `{typography.body-md}` in
`{colors.muted-foreground}`. Keep the measure narrow and place it close to the
heading. It explains the promise; the following visual or proof should support
it rather than repeat it.

**`structural-panel`** — A square-cornered `{colors.card}` surface bounded by
`{colors.border}`. Internal children share dividers instead of becoming nested
cards. Use for operating models, timelines, process sequences, service images,
and multi-part demonstrations. Crosshair details are allowed at meaningful
intersections.

**`operational-card`** — A compact interface artifact representing a pod,
workflow, SLA, or report. It uses `{colors.card}`, `{colors.border}`, modest
`{rounded.xl}`, and restrained shadow. Combine serif values, sans-serif labels,
and selective mono metadata. It should show plausible information, not random
dashboard chrome.

**`status-badge`** — A compact state marker. Neutral states use muted surface and
border; live or active states may use a pale primary treatment and primary text.
Full-pill geometry is appropriate here. Include text, not color alone, when the
state matters.

**`metric-card`** — A proof block with one large serif value and a short
sans-serif explanation. It may sit in a low-contrast muted grid with
`{rounded.xl}` corners, but adjacent metrics should behave as one composition.
Use tabular numbers and animate only when the value enters view.

**`image-cta-panel`** — The main pre-footer conversion moment. Use one strong
photograph, a dark neutral overlay, white serif heading, compact support copy,
and one primary CTA. Rounded `{rounded.2xl}` corners and `shadow-lg` are allowed
because this is a singular focal surface.

**`form-control`** — A compact white control using `{colors.border}`,
`{typography.body-sm}`, and `{rounded.md}`. Focus uses the semantic ring and a
visible three-pixel translucent halo. Placeholder text is muted. Error and
disabled states must use the existing semantic tokens rather than new colors.

## Imagery and Iconography

Use operationally credible photography: teams at work, service contexts,
infrastructure, and environments connected to delivery. Images are normally
contained in square or lightly rounded editorial frames and may receive a quiet
dark overlay when supporting white text. Avoid glossy stock-photo collages,
floating image bubbles, and decorative photos that do not support the message.

Use Lucide icons for interface concepts. Normal icon size is 16–20px with a
1.5–1.75 stroke. Place icons in small bordered or muted containers when they
need emphasis. Use inline SVG only for brand or social marks unavailable in
Lucide. Do not mix filled cartoon icons with the line-icon system.

## Motion

Motion should feel like a system resolving into order.

### Entrance motion

The canonical section entrance moves from `opacity: 0`, `y: 16–18px`, and
`blur(10px)` to a sharp resting state. Use `{motion.entrance}` (450ms),
`{motion.ease-out}`, and an 80ms stagger. Hero sequences may stagger by
100–140ms and last up to 500ms. Footer or large visual sequences may use 550ms.

Use the shared `TimelineAnimation` where appropriate. Existing marketing
sections intentionally replay when re-entering view (`once={false}`), but do not
replay dense controls, form feedback, or anything whose movement could interrupt
task completion.

### Interaction motion

- Hover and state changes: about 300ms.
- Menu open and close: about 180ms with `{motion.ease-snappy}`.
- Icons: translate 2px, scale to roughly 1.05–1.10, or rotate no more than 3°.
- Images: scale to no more than 1.05 inside an overflow-hidden frame.
- Active list highlights may use a high-stiffness, well-damped spring.
- Animated metrics may use 900ms with `{motion.ease-out}`.

Never animate every decorative layer independently. Avoid continuous motion
except a subtle live-status ping, marquee, progress rail, or slowly rotating
globe with genuine semantic value.

### Reduced motion

Honor `prefers-reduced-motion`. Remove blur, large translations, smooth-scroll
effects, autoplay marquees, and nonessential number animation while preserving
content and state changes.

## Responsive Behavior

| Name    |       Width | Key changes                                                                                                       |
| ------- | ----------: | ----------------------------------------------------------------------------------------------------------------- |
| Mobile  |     < 640px | 16px gutters; 36px hero; 30px section titles; one-column grids; mobile navigation; 64px section rhythm            |
| Small   |   640–767px | 24px gutters; larger hero copy; CTAs may remain inline when they fit; two-column compact grids may begin          |
| Medium  |  768–1023px | 48px section titles; 96px section rhythm; two-column cards; larger process visuals; desktop-scale spacing         |
| Desktop | 1024–1279px | Full navigation; split layouts; sticky narratives; alternating timelines; 3–4 column grids; decorative hero rails |
| Wide    |    ≥ 1280px | Content remains capped at 1152px; outer gutters absorb additional width                                           |

### Collapsing strategy

- Split layouts stack to one column before their text becomes narrow.
- Four-column feature grids reduce to two columns and then one.
- Shared bordered systems keep their internal dividers when stacked; remove only
  borders that would double up.
- Alternating timeline rows become a simple vertical sequence on small screens.
- Sticky introductions return to normal flow below the desktop breakpoint.
- Hero background rails and other nonessential geometry may disappear below
  desktop to protect space and performance.
- CTAs wrap as a centered or left-aligned group according to the section, then
  become full-width only when that improves mobile usability.
- Do not use horizontal scrolling to preserve a desktop card grid. Marquees and
  intentionally scrollable tab systems are the exceptions.

### Touch and readability

Primary mobile actions should provide at least a 44px effective touch area.
Existing 32–40px compact controls are acceptable in desktop chrome but should
receive surrounding hit area or a larger mobile size. Body copy must not fall
below 12px, and 12px is reserved for metadata or compact card copy rather than
long paragraphs.

## Accessibility and Interaction States

- Preserve visible `focus-visible` rings and semantic border changes.
- Maintain at least WCAG AA contrast for text and controls.
- Never communicate active, success, warning, or failure state through color
  alone; pair it with text, an icon, or both.
- Use semantic headings in document order even when a visual style differs.
- Give decorative images empty alt text and meaningful images concise alt text.
- Keyboard focus must activate the same service previews and menus as hover.
- Interactive elements need disabled, hover, focus, active, and invalid states
  where relevant.
- Motion and smooth scrolling must not prevent keyboard navigation or reading.

## Content and Voice

Copy is direct, operational, and evidence-oriented. Prefer concrete nouns and
measurable outcomes: pods, SLAs, QA, reporting, response time, deployment window,
cost reduction, ownership, and weekly cadence.

Headings should make one confident claim. Descriptions explain how the claim is
delivered. Avoid inflated AI language, vague transformation promises, and dense
consulting jargon. The recurring primary CTA is “Get free pilot”; do not invent
several competing conversion labels on the same page.

## Agent Guardrails

### Do

- Read this file and inspect nearby shared components before writing UI.
- Use semantic theme classes and the existing font mappings.
- Reuse `SectionWrapper`, `buttonVariants`, `TimelineAnimation`, `HeroBackdrop`,
  and `DecorIcon` when their roles match.
- Build one strong structured composition instead of many unrelated cards.
- Use blue to express action, selection, progress, or a live operational state.
- Vary section alignment and rhythm while keeping tokens consistent.
- Show plausible BlihOps operational proof inside interface mockups.
- Check mobile, reduced-motion, keyboard, and focus behavior.

### Do not

- Add purple-blue mesh gradients, neon glows, or generic gradient hero text.
- Default to a centered hero followed by repeated three-card grids.
- Put every idea inside a rounded, shadowed card.
- Use excessive `rounded-full` geometry outside badges, indicators, and avatars.
- introduce hardcoded brand hex values when semantic tokens exist.
- Add a new font, gray scale, blue, radius system, or animation curve casually.
- Use glassmorphism as a general surface treatment.
- Add decorative dashboards whose data does not support the message.
- Turn every section dark or alternate dark and light without narrative reason.
- Hide essential information behind hover-only interaction.

## Review Checklist for New UI

Before considering a page or component complete, verify:

1. Does the page feel structured, calm, editorial, and operational?
2. Is blue scarce and semantically meaningful?
3. Are heading, body, and technical roles using the correct font families?
4. Does the layout use the shared container and 64/96px section rhythm?
5. Are borders and whitespace doing more work than shadows?
6. Is there compositional variety without introducing a new visual system?
7. Are operational mockups plausible and connected to the surrounding copy?
8. Do animation timings and easing match the documented motion language?
9. Does the UI remain clear on mobile, by keyboard, and with reduced motion?
10. Did the implementation reuse semantic tokens and shared primitives?

## Known Gaps

- Dark theme variables exist, but the complete marketing site has not been
  established here as a fully validated dark-mode experience.
- Form success, warning, loading, and server-error compositions are only partly
  represented by current pages.
- Data visualizations beyond compact metrics, progress bars, and process diagrams
  are not yet part of the canonical visual language.
- Photography selection has a clear role but not yet a formal art-direction or
  image-treatment specification.
- Some routes linked by the shared navigation and footer are not implemented, so
  their content-specific compositions remain open.
- Existing small controls do not always reach a 44px mobile touch target; future
  work should improve effective hit areas without changing the compact visual
  character.

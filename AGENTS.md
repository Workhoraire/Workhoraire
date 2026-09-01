# WorkHoraire — Agent Instructions

## 1. Project Overview

WorkHoraire is a SaaS application for TPEs and SMEs. Its purpose is to replace Excel-based employee time tracking with a simple web application.
The main features will include:

* Employee management
* Clock-in / clock-out
* Time tracking
* Attendance history
* Absence and leave management
* Working hours calculation
* Administrative dashboard
* Data exports
* Role-based access control

The project is currently being developed as an MVP.
---

## 2. Technical Stack
### Frontend

* Angular
* TypeScript
* Angular Standalone Components
* Angular Material
* Angular Router
* Angular HttpClient
* Reactive Forms

### Backend

* NestJS
* TypeScript
* REST API

### Database

* PostgreSQL
* Prisma ORM

### Authentication

* Keycloak
* OpenID Connect / OAuth 2.0

### Infrastructure

* Docker
* Docker Compose

### Repository

* Git
* GitHub
* Monorepo

---

## 3. Repository Structure

```text
workhoraire/
├── frontend/          # Angular application
├── backend/           # NestJS application
├── infrastructure/    # Docker and infrastructure configuration
├── docs/              # Documentation
├── docker-compose.yml
├── .env.example
├── .gitignore
├── AGENTS.md
└── CLAUDE.md
```

Keep frontend and backend separated. Do not introduce Nx, Turborepo, micro-frontends, or another monorepo framework unless explicitly requested.

---

## 4. Architecture

WorkHoraire uses a modular monolith architecture.

```text
Angular
   │
   │ HTTP / REST
   ▼
NestJS
   │
   ▼
Prisma
   │
   ▼
PostgreSQL
```

Authentication is handled by Keycloak:

```text
Angular
   │
   ▼
Keycloak
   │
   │ Access Token
   ▼
NestJS
   │
   ▼
PostgreSQL
```

Do not introduce microservices. Do not introduce distributed systems unless a concrete requirement justifies them.

---

## 5. General Development Principles

Prioritize:

1. Simplicity
2. Correctness
3. Security
4. Maintainability
5. Readability
6. Performance

Avoid premature optimization.

Do not introduce a technology simply because it is popular or considered scalable.

Prefer the simplest solution that correctly solves the problem.

Do not add dependencies without a clear justification.

Before making major architectural changes, explain the proposed approach and its consequences.

---

# 6. Frontend Rules

Use Angular Standalone Components.

Do not use NgModules unless there is a specific technical reason.

Prefer:

* Standalone Components
* Reactive Forms
* Angular Router
* HttpClient
* Dependency Injection
* Signals where appropriate

Keep components focused on presentation and user interaction.

Business logic should not be unnecessarily placed inside components.

Prefer:

```text
Component
    ↓
Service
    ↓
HTTP API
```

Use Angular Material for standard UI components.

The interface must be responsive because employees may use WorkHoraire from smartphones or tablets.

---

# 7. Backend Rules

Use NestJS modules to organize business domains.

Prefer:

```text
Module
├── Controller
├── Service
├── DTO
└── Database access
```

Controllers should remain thin.

Business logic belongs in services.

Database access should use Prisma.

Prefer:

```text
Controller
    ↓
Service
    ↓
Prisma
    ↓
PostgreSQL
```

Use REST APIs with clear resource-oriented routes.

Validate all incoming data.

Never trust data received from the frontend.

---

# 8. Authentication

Keycloak is responsible for authentication.

The application must not store user passwords.

Do not implement custom authentication, password hashing, custom JWT handling, or refresh-token systems unless explicitly requested.

Authentication answers:

> Who is the user?

Authorization answers:

> What is the user allowed to do?

These responsibilities must remain separate.

---

# 9. Authorization

Initial roles include:

* ADMIN
* MANAGER
* EMPLOYEE

Authorization must be enforced by the backend.

Frontend checks are only for user experience and must never be considered a security mechanism.

---

# 10. Multi-Tenancy

WorkHoraire is a multi-tenant SaaS.

Companies must be isolated from each other.

Conceptually:

```text
Company
├── Users
├── Employees
├── TimeEntries
├── Leaves
└── Schedules
```

Business entities belonging to a company should contain an appropriate `companyId`.

Never trust a `companyId` supplied by the frontend.

The backend must determine the user's company from trusted authentication/application data.

For the MVP, use application-level tenant isolation.

Do not introduce PostgreSQL Row Level Security unless explicitly requested.

---

# 11. Database

Use PostgreSQL with Prisma.

Use Prisma migrations for schema changes.

Do not manually modify the production database schema.

When changing the schema:

1. Update Prisma schema.
2. Create a migration.
3. Run the migration locally.
4. Update affected code.
5. Test the changes.

Prefer proper relational constraints and foreign keys.

Do not introduce partitioning or advanced PostgreSQL optimizations unless a real requirement exists.

---

# 12. Security

Never commit:

* Passwords
* API keys
* Access tokens
* Private keys
* Production credentials
* `.env` files containing secrets

Use environment variables.

Commit `.env.example` with placeholder values.

Never expose server-side secrets to the Angular application.

Validate all client input.

Do not expose stack traces or internal database errors to users.

Employee and company data must be treated as sensitive business data.

---

# 13. Infrastructure

Use Docker and Docker Compose.

The initial environment should contain:

```text
frontend
backend
postgres
keycloak
```

Do not introduce:

* Kubernetes
* Redis
* BullMQ
* Kafka
* RabbitMQ
* Terraform

unless a concrete requirement appears.

---

# 14. Testing

Tests should focus on important business behavior.

Prioritize:

* Authentication
* Authorization
* Tenant isolation
* Employee management
* Clock-in / clock-out
* Working-hour calculations
* Critical business rules

Do not write tests solely to increase coverage numbers.

---

# 15. Git

Git operations that only inspect the repository are allowed.

The agent may freely use read-only Git commands such as:

```bash
git status
git diff
git diff --stat
git log
git log --oneline
git branch
git show
git remote -v
git ls-files
```
Creating commits is always a manual action performed by the developer. The agent must NEVER create a commit unless the user explicitly asks it to.

---

# 16. AI Agent Behavior

When working on the project:

1. Inspect the existing implementation first.
2. Understand the relevant architecture.
3. Identify the smallest reasonable change.
4. Implement it.
5. Run relevant tests and checks.
6. Report what changed.

Do not rewrite existing code unnecessarily.

Do not create unnecessary files.

Do not replace an existing technology without a clear reason.

Do not make large architectural decisions autonomously.

If a requirement is ambiguous and the ambiguity could affect architecture, ask for clarification.

When several solutions are possible, prefer the simplest maintainable solution.

---

# 17. Important Rule

WorkHoraire is an MVP.

Do not optimize for hypothetical scale.

Do not introduce complexity before the product requires it.

The default architecture should remain:

```text
Angular
+
NestJS
+
PostgreSQL
+
Prisma
+
Keycloak
+
Docker
```

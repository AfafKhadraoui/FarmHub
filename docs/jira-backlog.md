# FarmHub Jira Backlog (Readable)

This document renders the backlog from `jira-backlog.csv` in a human-friendly, hierarchical view. Structure: Epic → Stories → Sub-tasks. For each item, key fields are shown: Story Points (SP), MoSCoW, Priority, Components, Labels. Story descriptions include acceptance criteria.

Quick tip: Import the CSV into Jira for tracking; use this Markdown for reviews and offline planning.

---

## Table of Contents

- [EPIC-AUTH — Authentication & RBAC](#epic-auth--authentication--rbac)
- [EPIC-WORKSPACE — Workspace Shell & Navigation](#epic-workspace--workspace-shell--navigation)
- [EPIC-FIELDS — Field Management & History](#epic-fields--field-management--history)
- [EPIC-TASKS — Task Management & Assignment](#epic-tasks--task-management--assignment)
- [EPIC-WORKERS — Worker Management](#epic-workers--worker-management)
- [EPIC-NOTIFS — Notifications](#epic-notifs--notifications)
- [EPIC-ANALYTICS — Analytics & Dashboard](#epic-analytics--analytics--dashboard)
- [EPIC-WEATHER — Weather Integration](#epic-weather--weather-integration)
- [EPIC-ADMIN — Platform Admin](#epic-admin--platform-admin)
- [EPIC-DEVOPS — DevOps & Security](#epic-devops--devops--security)
- [EPIC-QA — QA & Test Automation](#epic-qa--qa--test-automation)
- [EPIC-DOCS — Documentation & UX](#epic-docs--documentation--ux)

---

## EPIC-AUTH — Authentication & RBAC

Scope: Login, registration, JWT, role-based authorization (platform_admin, admin, worker). Outcomes: secure access and correct role routing.

Priority: High • MoSCoW: Must • Components: Frontend; Backend; Security • Labels: area:auth,rbac

### STORY-AUTH-LOGIN — User can log in (SP: 5, Must, High)

As a user, I want to log in so that I can access my workspace.

- Acceptance: valid creds issue JWT; role redirect (platform_admin → /admin/dashboard, others → /dashboard); token persisted; unauthorized shows error; protected routes redirect to /login.
- Components: Frontend; Backend; Security • Labels: area:auth,role:user

Sub-tasks:

- SUB-AUTH-LOGIN-FE (SP: 2) — FE: Login page + flow
- SUB-AUTH-LOGIN-BE (SP: 2) — BE: POST /auth/login
- SUB-AUTH-LOGIN-DB (SP: 1) — DB: Seed platform admin
- SUB-AUTH-LOGIN-TEST (SP: 1) — Tests: login success/failure
- SUB-AUTH-LOGIN-DOCS (SP: -) — Docs: Auth flow

### STORY-AUTH-REGISTER-ADMIN — Admin can register farm (SP: 8, Must, High)

As an admin, I want to register my farm so that I can set up workers.

- Acceptance: creates Farm, joinCode, and admin user; redirects to dashboard; duplicate emails rejected.
- Components: Frontend; Backend; Database • Labels: area:auth,role:admin

Sub-tasks:

- SUB-AUTH-REG-FE (SP: 2) — FE: Register admin form
- SUB-AUTH-REG-BE (SP: 3) — BE: POST /auth/register-admin
- SUB-AUTH-REG-DB (SP: 1) — DB: Farm indexes
- SUB-AUTH-REG-TEST (SP: 1) — Tests: register admin
- SUB-AUTH-REG-DOCS (SP: -) — Docs: register admin

### STORY-AUTH-WORKER-JOIN — Worker can join via code (SP: 5, Should, Medium)

As a worker, I want to join a farm with a code so that I can be assigned tasks.

- Acceptance: code validation, worker linked to farm, limited permissions.
- Components: Frontend; Backend • Labels: area:auth,role:worker

Sub-tasks:

- SUB-AUTH-JOIN-FE (SP: 2) — FE: Join flow
- SUB-AUTH-JOIN-BE (SP: 2) — BE: POST /farm/join
- SUB-AUTH-JOIN-TEST (SP: 1) — Tests: join code
- SUB-AUTH-JOIN-DOCS (SP: -) — Docs: join flow

---

## EPIC-WORKSPACE — Workspace Shell & Navigation

Scope: Layout shell, protected routes, role-based menus, theming.

Priority: High • MoSCoW: Must • Components: Frontend • Labels: area:workspace

### STORY-WS-SHELL — Workspace shell + route guard (SP: 5, Must, High)

As an admin/worker, I want a workspace shell so that I can navigate modules.

- Acceptance: (workspace)/layout.tsx with sidebar/topbar; protected routes; role-based menu visibility; mobile responsive.
- Components: Frontend • Labels: area:workspace,ui

Sub-tasks:

- SUB-WS-SHELL-LAYOUT (SP: 2) — Layout and navigation
- SUB-WS-SHELL-GUARD (SP: 2) — Route protection
- SUB-WS-SHELL-TEST (SP: 1) — Tests: shell and guard

---

## EPIC-FIELDS — Field Management & History

Scope: Field CRUD, archive, history lifecycle with active flag, history timeline.

Priority: High • MoSCoW: Must • Components: Frontend; Backend; Database • Labels: area:fields

### STORY-FIELDS-CRUD — Field CRUD + archive (SP: 8, Must, High)

As an admin, I want to create/edit/archive fields so that I can manage plots.

- Acceptance: create with name/size/crop/status; edit updates; archive sets active=false; validations; UI modals.
- Components: Frontend; Backend; Database • Labels: area:fields,role:admin

Sub-tasks:

- SUB-FIELDS-CRUD-FE (SP: 3) — FE: field modals
- SUB-FIELDS-CRUD-BE (SP: 3) — BE: /fields CRUD
- SUB-FIELDS-CRUD-DB (SP: 1) — DB: fields indices
- SUB-FIELDS-CRUD-TEST (SP: 1) — Tests: field CRUD
- SUB-FIELDS-CRUD-DOCS (SP: -) — Docs: fields API

### STORY-FIELDS-HISTORY — Field history lifecycle (SP: 8, Must, High)

As an admin, I want field history so that I can track crop changes.

- Acceptance: changing crop creates new row (active=true) and sets previous active=false; history page with timeline and filters.
- Components: Frontend; Backend; Database • Labels: area:fields,history

Sub-tasks:

- SUB-FIELDS-HIST-FE (SP: 3) — FE: history page
- SUB-FIELDS-HIST-BE (SP: 3) — BE: history endpoints
- SUB-FIELDS-HIST-DB (SP: 1) — DB: history semantics
- SUB-FIELDS-HIST-TEST (SP: 1) — Tests: history

### STORY-FIELDS-WORKER-VIEW — Worker read-only fields (SP: 3, Should, Medium)

As a worker, I want to view only my assigned fields so that I focus on work.

- Acceptance: role-based filter; actions hidden; read-only detail.
- Components: Frontend; Backend • Labels: area:fields,role:worker

Sub-tasks:

- SUB-FIELDS-WORKER-FE (SP: 1) — FE: gating and filters
- SUB-FIELDS-WORKER-BE (SP: 1) — BE: scoped queries

---

## EPIC-TASKS — Task Management & Assignment

Scope: Task CRUD, status transitions, priorities, multi-worker assignment, completion flow.

Priority: High • MoSCoW: Must • Components: Frontend; Backend; Database • Labels: area:tasks

### STORY-TASKS-CRUD — Task CRUD (SP: 8, Must, High)

As an admin, I want to manage tasks so that work progresses.

- Acceptance: create/read/update/delete; status transitions; priority; due date.
- Components: Frontend; Backend; Database • Labels: area:tasks,role:admin

Sub-tasks:

- SUB-TASKS-CRUD-FE (SP: 3) — FE: task forms
- SUB-TASKS-CRUD-BE (SP: 3) — BE: /tasks CRUD
- SUB-TASKS-CRUD-DB (SP: 1) — DB: task indices
- SUB-TASKS-CRUD-TEST (SP: 1) — Tests: task CRUD

### STORY-TASKS-ASSIGN — Assign multiple workers (SP: 5, Must, High)

As an admin, I want to assign multiple workers to a task so that work is shared.

- Acceptance: TaskAssignment junction; unique(worker,task); UI for multi-select.
- Components: Frontend; Backend; Database • Labels: area:tasks,assignments

Sub-tasks:

- SUB-TASKS-ASSIGN-FE (SP: 2) — FE: assignment UI
- SUB-TASKS-ASSIGN-BE (SP: 2) — BE: assign route
- SUB-TASKS-ASSIGN-DB (SP: 1) — DB: TaskAssignment

### STORY-TASKS-COMPLETE — Worker completes task (SP: 5, Should, Medium)

As a worker, I want to mark a task complete so that the admin is notified.

- Acceptance: completion modal with notes, attachments optional; status → completed; notification sent.
- Components: Frontend; Backend • Labels: area:tasks,role:worker

Sub-tasks:

- SUB-TASKS-COMPLETE-FE (SP: 2) — FE: completion modal
- SUB-TASKS-COMPLETE-BE (SP: 2) — BE: complete route
- SUB-TASKS-COMPLETE-TEST (SP: 1) — Tests: completion

---

## EPIC-WORKERS — Worker Management

Scope: Invite/join via code, list, deactivate/reactivate, farm scoping.

Priority: High • MoSCoW: Must • Components: Frontend; Backend • Labels: area:workers

### STORY-WORKERS-INVITE — Invite/add workers (SP: 8, Must, High)

As an admin, I want to invite/add workers so that I can build a team.

- Acceptance: generate join code; add worker; list workers; deactivate.
- Components: Frontend; Backend • Labels: area:workers,role:admin

Sub-tasks:

- SUB-WORKERS-INVITE-FE (SP: 3) — FE: workers list + invite
- SUB-WORKERS-INVITE-BE (SP: 3) — BE: /workers endpoints
- SUB-WORKERS-INVITE-TEST (SP: 1) — Tests: workers mgmt

---

## EPIC-NOTIFS — Notifications

Scope: In-app notifications, read/unread, event triggers for assignments and status updates.

Priority: Medium • MoSCoW: Should • Components: Frontend; Backend • Labels: area:notifications

### STORY-NOTIFS-INAPP — In-app notifications (SP: 8, Should, Medium)

As a user, I want notifications so that I don’t miss updates.

- Acceptance: list with read/unread; created on task assignment/status changes.
- Components: Frontend; Backend • Labels: area:notifications

Sub-tasks:

- SUB-NOTIFS-FE (SP: 3) — FE: notifications UI
- SUB-NOTIFS-BE (SP: 3) — BE: notifications service
- SUB-NOTIFS-TEST (SP: 1) — Tests: notifications

---

## EPIC-ANALYTICS — Analytics & Dashboard

Scope: KPIs, charts, recent activity. Admin-focused; platform analytics later.

Priority: Medium • MoSCoW: Should • Components: Frontend; Backend • Labels: area:analytics

### STORY-ANALYTICS-KPIS — Admin dashboard KPIs (SP: 8, Should, Medium)

As an admin, I want a dashboard with key metrics so that I can monitor performance.

- Acceptance: fields status distribution, tasks by status, recent activity.

Sub-tasks:

- SUB-ANALYTICS-FE (SP: 3) — FE: charts
- SUB-ANALYTICS-BE (SP: 3) — BE: metrics endpoints

---

## EPIC-WEATHER — Weather Integration

Scope: Weather by farm location with forecast and fallbacks.

Priority: Low • MoSCoW: Could • Components: Frontend; Backend • Labels: area:weather

### STORY-WEATHER-CARD — Weather by location (SP: 5, Could, Low)

As an admin, I want weather insights by location so that I can plan tasks.

- Acceptance: location from farm; daily/weekly; graceful fallback.

Sub-tasks:

- SUB-WEATHER-FE (SP: 2) — FE: weather widget
- SUB-WEATHER-BE (SP: 2) — BE: weather proxy

---

## EPIC-ADMIN — Platform Admin

Scope: Platform-wide farm/user visibility and management for platform_admin.

Priority: Medium • MoSCoW: Should • Components: Frontend; Backend • Labels: area:platform-admin

### STORY-ADMIN-MANAGE-FARMS — Platform admin manages farms (SP: 8, Should, Medium)

As a platform admin, I want to manage farms so that I control access.

- Acceptance: list farms; view farm details; create/delete farm; user visibility.

Sub-tasks:

- SUB-ADMIN-FE (SP: 3) — FE: admin pages
- SUB-ADMIN-BE (SP: 3) — BE: admin endpoints

---

## EPIC-DEVOPS — DevOps & Security

Scope: CI/CD, lint/test/build gates, security headers, rate limiting, logging.

Priority: High • MoSCoW: Must • Components: DevOps; Security • Labels: area:devops,security

### STORY-DEVOPS-CICD — CI/CD pipeline (SP: 5, Must, High)

As a developer, I want CI/CD so that changes ship safely.

- Acceptance: PR checks (lint, typecheck, tests, build); main deploy.

Sub-tasks:

- SUB-DEVOPS-CI (SP: 2) — Set up CI workflows
- SUB-DEVOPS-CD (SP: 2) — Set up deployment

### STORY-SEC-RBAC — RBAC backend enforcement (SP: 8, Must, High)

As a developer, I want role-based backend enforcement so that data is secure.

- Acceptance: JWT middleware; role guards; farm scoping; platform_admin cross-farm reads.

Sub-tasks:

- SUB-SEC-MW (SP: 3) — Auth middleware
- SUB-SEC-GUARDS (SP: 3) — Role guards

---

## EPIC-QA — QA & Test Automation

Scope: Unit/integration/e2e baselines; coverage and pipelines.

Priority: High • MoSCoW: Must • Components: QA • Labels: area:qa

### STORY-QA-BASE — Testing baselines (SP: 8, Must, High)

As a team, I want tests so that we catch regressions.

- Acceptance: unit/integration/e2e in place; coverage reports in CI.

Sub-tasks:

- SUB-QA-FE (SP: 3) — FE unit/component tests
- SUB-QA-BE (SP: 3) — BE unit/integration tests
- SUB-QA-E2E (SP: 2) — E2E flow tests

---

## EPIC-DOCS — Documentation & UX

Scope: Runbooks, API docs, ERD, ADRs, user guides, contribution guidelines.

Priority: High • MoSCoW: Must • Components: Documentation • Labels: area:docs

### STORY-DOCS-BASE — Documentation baseline (SP: 5, Must, High)

As a team, I want comprehensive docs so that onboarding is fast.

- Acceptance: runbooks, API docs, ERD, ADRs, user guides, contribution guide.

Sub-tasks:

- SUB-DOCS-READMES (SP: 2) — READMEs and runbooks
- SUB-DOCS-API (SP: 2) — API documentation
- SUB-DOCS-ARCH (SP: 1) — Architecture docs

---

Generated from jira-backlog.csv (keep CSV as source of truth for Jira import).

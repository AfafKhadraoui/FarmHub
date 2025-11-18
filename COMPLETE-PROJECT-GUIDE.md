# 🌾 FarmHub - Complete Project Structure & Architecture Guide

> **A modern farm management system with role-based access control**  
> Built with Next.js, Express.js, PostgreSQL, and TypeScript

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Database Architecture](#database-architecture)
4. [Backend Structure](#backend-structure)
5. [Frontend Structure](#frontend-structure)
6. [Key Features](#key-features)
7. [Setup Instructions](#setup-instructions)

---

## Project Overview

**FarmHub** is a comprehensive farm management platform that helps farm owners manage their operations and coordinate with workers efficiently.

### **User Roles:**

1. **Farm Admin** - Farm owner with full control
   - Manage fields and crop history
   - Create and assign tasks to multiple workers
   - Manage team members
   - View analytics and reports
   - Access farm settings

2. **Worker** - Farm employee with limited access
   - View assigned tasks only
   - Update task status and add notes
   - View field information (read-only)
   - Check weather information

3. **Platform Admin** (Developers)
   - Monitor all farms
   - Track farm creation
   - System administration

### **Core Features:**

**Field Management** - Track farm plots with crop history  
**Task Management** - Assign tasks to multiple workers  
**Team Collaboration** - Farm code system for easy team building  
**Weather Integration** - Real-time weather updates  
**History Tracking** - Complete audit trail for field changes  
**Analytics Dashboard** - Visual insights and statistics  

---

## Tech Stack

### **Frontend:**
- **Framework:** Next.js 14/15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** Zustand
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form + Zod

### **Backend:**
- **Framework:** Express.js
- **Language:** TypeScript/JavaScript
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Validation:** Joi / Zod

### **Database:**
- **Database:** PostgreSQL
- **Hosting Options:** Neon, Supabase, Railway
- **ORM:** Prisma Client

### **DevOps:**
- **Version Control:** Git + GitHub
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Railway / Render
- **Database Hosting:** Neon / Supabase

---

## Database Architecture

### **Overview:**

We use **PostgreSQL** with **5 tables** and a hybrid approach:
- **Shared routes** for similar functionality
- **Separate routes** for admin-only features

### **Tables:**

```
┌─────────────────────────────────────────┐
│             FARMS                       │
│  (with createdBy tracking)              │
└───────────────┬─────────────────────────┘
                │
        ┌───────┼───────┬─────────┐
        │       │       │         │
        ▼       ▼       ▼         ▼
     USERS   FIELDS  TASKS   TASK_ASSIGNMENTS
              (active)        (many-to-many)
              history          ├→ TASKS
                              └→ USERS (workers)
```

### **1. FARMS Table**
Stores farm organizations with unique join codes.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Auto-increment ID |
| name | VARCHAR(255) | Farm name |
| location | VARCHAR(255) | Farm location |
| joinCode | VARCHAR(20) | Unique code for workers (e.g., "FARM-ABC123") |
| createdBy | VARCHAR(255) | Email of platform admin (for tracking) |
| createdAt | TIMESTAMP | Creation time |
| updatedAt | TIMESTAMP | Last update |

**Example:**
```sql
id: 1
name: "Green Valley Farm"
location: "Algiers, Algeria"
joinCode: "FARM-ABC123"
createdBy: "dev@farmhub.com"
```

---

### **2. USERS Table**
Stores admin, worker, and platform_admin accounts.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Auto-increment ID |
| email | VARCHAR(255) | Unique email |
| password | VARCHAR(255) | Hashed with bcrypt |
| name | VARCHAR(255) | User's full name |
| phone | VARCHAR(20) | Optional phone |
| role | ENUM | 'admin', 'worker', 'platform_admin' |
| farmId | INTEGER (FK) | References farms (NULL for platform_admin) |
| createdAt | TIMESTAMP | Creation time |
| updatedAt | TIMESTAMP | Last update |

---

### **3. FIELDS Table**  (With History Tracking!)

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Auto-increment ID |
| **name** | VARCHAR(255) | Field name (e.g., "North Field") |
| size | DOUBLE PRECISION | Size in hectares/acres |
| cropType | VARCHAR(100) | Type of crop |
| status | ENUM | 'idle', 'planted', 'growing', 'harvesting' |
| plantedDate | DATE | When planted |
| harvestDate | DATE | Expected harvest |
| **active** | BOOLEAN | **TRUE = current, FALSE = historical** ⭐ |
| farmId | INTEGER (FK) | References farms |
| createdAt | TIMESTAMP | Creation time |
| updatedAt | TIMESTAMP | Last update |

**History Tracking Feature:**

When admin updates a crop (e.g., Wheat → Corn):
1. **Don't UPDATE** the existing row
2. **Set** old row `active = FALSE`
3. **CREATE** new row with `active = TRUE`
4. **Result:** Complete history preserved!

**Example:**
```sql
-- Historical record
id: 1, name: 'North Field', cropType: 'Wheat', active: FALSE, createdAt: '2025-01-15'

-- Current record
id: 5, name: 'North Field', cropType: 'Corn', active: TRUE, createdAt: '2025-03-01'
```

**Query active fields:**
```sql
SELECT * FROM fields WHERE farmId = 1 AND active = TRUE;
```

**Query field history:**
```sql
SELECT * FROM fields 
WHERE farmId = 1 AND name = 'North Field' AND active = FALSE 
ORDER BY createdAt DESC;
```

---

### **4. TASKS Table**

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Auto-increment ID |
| title | VARCHAR(255) | Task title |
| description | TEXT | Detailed description |
| status | ENUM | 'pending', 'in_progress', 'completed' |
| priority | ENUM | 'low', 'medium', 'high' |
| dueDate | TIMESTAMP | When task is due |
| notes | TEXT | Worker's notes/comments |
| farmId | INTEGER (FK) | References farms |
| fieldId | INTEGER (FK) | Related field (optional) |
| createdAt | TIMESTAMP | Creation time |
| updatedAt | TIMESTAMP | Last update |

**Note:** No `createdById` or `assignedToId` - we use task_assignments table!

---

### **5. TASK_ASSIGNMENTS Table** (Multiple Workers per Task!)

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER (PK) | Auto-increment ID |
| taskId | INTEGER (FK) | References tasks |
| workerId | INTEGER (FK) | References users |
| assignedAt | TIMESTAMP | When assigned |

**Purpose:** Many-to-many relationship (one task can have multiple workers)

**Example:**
```sql
Task ID 1: "Water North Field"
  ├── taskId: 1, workerId: 3 (Ahmed)
  ├── taskId: 1, workerId: 4 (Sara)
  └── taskId: 1, workerId: 5 (Ali)
```

---

## Backend Structure

### **File Organization:**

```
backend/
│
├── 📁 src/
│   │
│   ├── 📁 config/
│   │   ├── 📄 database.js            # Prisma client instance
│   │   └── 📄 env.js                 # Environment variables
│   │
│   ├── 📁 controllers/               # Request handlers
│   │   ├── 📄 auth.controller.js     # Login, register, logout
│   │   ├── 📄 farm.controller.js     # Farm CRUD
│   │   ├── 📄 field.controller.js    # Field CRUD + history
│   │   ├── 📄 task.controller.js     # Task CRUD + assignments
│   │   ├── 📄 worker.controller.js   # Worker management
│   │   └── 📄 weather.controller.js  # Weather API
│   │
│   ├── 📁 middleware/
│   │   ├── 📄 auth.middleware.js     # JWT verification
│   │   ├── 📄 role.middleware.js     # Role-based access
│   │   ├── 📄 error.middleware.js    # Error handling
│   │   └── 📄 validation.middleware.js # Input validation
│   │
│   ├── 📁 routes/
│   │   ├── 📄 auth.routes.js         # POST /api/auth/login, register
│   │   ├── 📄 farm.routes.js         # CRUD /api/farms
│   │   ├── 📄 field.routes.js        # CRUD /api/fields + history
│   │   ├── 📄 task.routes.js         # CRUD /api/tasks + assignments
│   │   ├── 📄 worker.routes.js       # GET /api/workers
│   │   ├── 📄 weather.routes.js      # GET /api/weather
│   │   └── 📄 index.js               # Route aggregator
│   │
│   ├── 📁 services/                  # Business logic
│   │   ├── 📄 auth.service.js        # Auth logic
│   │   ├── 📄 field.service.js       # Field operations + history
│   │   ├── 📄 task.service.js        # Task operations + assignments
│   │   ├── 📄 weather.service.js     # Weather API calls
│   │   └── 📄 email.service.js       # Email notifications (optional)
│   │
│   ├── 📁 utils/
│   │   ├── 📄 jwt.util.js            # JWT helpers
│   │   ├── 📄 password.util.js       # Bcrypt helpers
│   │   ├── 📄 farmCode.util.js       # Generate farm codes
│   │   └── 📄 validation.util.js     # Common validators
│   │
│   ├── 📁 types/                     # TypeScript types
│   │   ├── 📄 user.types.ts
│   │   ├── 📄 field.types.ts
│   │   └── 📄 task.types.ts
│   │
│   └── 📄 server.js                  # Express app entry point
│
├── 📁 prisma/
│   ├── 📄 schema.prisma              # Database schema
│   └── 📁 migrations/                # Database migrations
│
├── 📄 .env                           # Environment variables
├── 📄 .env.example                   # Example env file
├── 📄 .gitignore
├── 📄 package.json
└── 📄 README.md
```

### **Key Backend Features:**

#### **1. Authentication Flow:**
```javascript
POST /api/auth/register
  ↓ (role selection: admin or worker)
  ↓ (if worker: validate farm code)
  ↓ (hash password with bcrypt)
  ↓ (create user in database)
  ↓ (generate JWT token)
  ↓ (return user + token)
```

#### **2. Field History Tracking:**
```javascript
PUT /api/fields/:id
  ↓ (mark old record as inactive)
  ↓ (create new record with active = true)
  ↓ (return new field)

GET /api/fields/:id/history
  ↓ (get all inactive records for this field)
  ↓ (return history ordered by date)
```

#### **3. Multiple Workers per Task:**
```javascript
POST /api/tasks
  ↓ (create task)
  ↓ (assign multiple workers via task_assignments)
  ↓ (return task with assigned workers)

GET /api/tasks/:id
  ↓ (get task with all assigned workers)
  ↓ (return task + workers array)
```

#### **4. Role-Based Access:**
```javascript
// Middleware checks
isAuthenticated  → Verify JWT token
isAdmin          → Check user.role === 'admin'
isWorker         → Check user.role === 'worker'

// Example protected route
router.get('/workers', isAuthenticated, isAdmin, getWorkers);
```

---

## Frontend Structure

### **Hybrid Approach** (Industry Standard!)

We use a **HYBRID** approach combining:
- **Shared routes** - Same URL, different content by role
- **Separate routes** - Admin-only pages

**Examples of companies using this:**
- Notion, GitHub, Asana, Linear, Slack

### **File Organization:**

```
frontend/
│
├── 📁 public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── images/
│
├── 📁 src/
│   │
│   ├── 📁 app/                       # Next.js App Router
│   │   │
│   │   ├── 📄 page.tsx               # Landing page (/)
│   │   ├── 📄 layout.tsx             # Root layout
│   │   ├── 📄 globals.css            # Global styles + Tailwind
│   │   │
│   │   ├── 📁 (auth)/                # Auth routes group
│   │   │   ├── 📄 layout.tsx         # Auth layout (centered)
│   │   │   ├── 📁 login/
│   │   │   │   └── 📄 page.tsx       # /login
│   │   │   └── 📁 register/
│   │   │       └── 📄 page.tsx       # /register
│   │   │
│   │   ├── 📁 (workspace)/           # SHARED workspace (both roles)
│   │   │   ├── 📄 layout.tsx         # Workspace layout (sidebar)
│   │   │   │
│   │   │   ├── 📁 dashboard/
│   │   │   │   └── 📄 page.tsx       # /workspace/dashboard
│   │   │   │                         # Shows different content by role
│   │   │   │
│   │   │   ├── 📁 tasks/
│   │   │   │   ├── 📄 page.tsx       # /workspace/tasks
│   │   │   │   │                     # Admin: all tasks, Worker: my tasks
│   │   │   │   └── 📁 [id]/
│   │   │   │       └── 📄 page.tsx   # /workspace/tasks/[id]
│   │   │   │
│   │   │   ├── 📁 fields/
│   │   │   │   ├── 📄 page.tsx       # /workspace/fields
│   │   │   │   │                     # Admin: CRUD, Worker: read-only
│   │   │   │   └── 📁 [id]/
│   │   │   │       ├── 📄 page.tsx   # /workspace/fields/[id]
│   │   │   │       └── 📁 history/
│   │   │   │           └── 📄 page.tsx # /workspace/fields/[id]/history
│   │   │   │                         # Field history page!
│   │   │   │
│   │   │   └── 📁 weather/
│   │   │       └── 📄 page.tsx       # /workspace/weather
│   │   │                             # Same for both roles
│   │   │
│   │   └── 📁 admin/                 # SEPARATE admin-only section
│   │       ├── 📄 layout.tsx         # Admin layout
│   │       │
│   │       ├── 📁 workers/
│   │       │   └── 📄 page.tsx       # /admin/workers (admin only!)
│   │       │
│   │       ├── 📁 settings/
│   │       │   └── 📄 page.tsx       # /admin/settings (admin only!)
│   │       │
│   │       └── 📁 analytics/
│   │           └── 📄 page.tsx       # /admin/analytics (admin only!)
│   │
│   ├── 📁 components/
│   │   │
│   │   ├── 📁 ui/                    # shadcn/ui components
│   │   │   ├── 📄 button.tsx
│   │   │   ├── 📄 card.tsx
│   │   │   ├── 📄 input.tsx
│   │   │   ├── 📄 dialog.tsx
│   │   │   ├── 📄 select.tsx
│   │   │   ├── 📄 badge.tsx
│   │   │   ├── 📄 calendar.tsx
│   │   │   └── 📄 toast.tsx
│   │   │
│   │   ├── 📁 layout/
│   │   │   ├── 📄 Navbar.tsx         # Landing page navbar
│   │   │   ├── 📄 WorkspaceSidebar.tsx # Workspace sidebar (role-based)
│   │   │   ├── 📄 AdminSidebar.tsx   # Admin sidebar
│   │   │   ├── 📄 TopBar.tsx         # Top bar (search, notifications)
│   │   │   ├── 📄 Footer.tsx         # Landing page footer
│   │   │   └── 📄 MobileMenu.tsx     # Mobile navigation
│   │   │
│   │   ├── 📁 auth/
│   │   │   ├── 📄 LoginForm.tsx
│   │   │   ├── 📄 RegisterForm.tsx
│   │   │   └── 📄 RoleSelector.tsx   # Admin/Worker selection
│   │   │
│   │   ├── 📁 workspace/             # Shared workspace components
│   │   │   ├── 📁 dashboard/
│   │   │   │   ├── 📄 AdminDashboard.tsx
│   │   │   │   ├── 📄 WorkerDashboard.tsx
│   │   │   │   ├── 📄 StatsCard.tsx
│   │   │   │   ├── 📄 WeatherWidget.tsx
│   │   │   │   ├── 📄 ActivityFeed.tsx
│   │   │   │   ├── 📄 FieldStatusChart.tsx
│   │   │   │   └── 📄 TaskCompletionChart.tsx
│   │   │   │
│   │   │   ├── 📁 fields/
│   │   │   │   ├── 📄 FieldCard.tsx
│   │   │   │   ├── 📄 FieldGrid.tsx
│   │   │   │   ├── 📄 FieldForm.tsx
│   │   │   │   ├── 📄 FieldModal.tsx
│   │   │   │   ├── 📄 FieldDetails.tsx
│   │   │   │   ├── 📄 FieldHistory.tsx       # History component!
│   │   │   │   ├── 📄 FieldHistoryCard.tsx   # History card!
│   │   │   │   ├── 📄 FieldStatusBadge.tsx
│   │   │   │   └── 📄 FieldSearch.tsx
│   │   │   │
│   │   │   ├── 📁 tasks/
│   │   │   │   ├── 📄 TaskCard.tsx
│   │   │   │   ├── 📄 TaskList.tsx
│   │   │   │   ├── 📄 TaskForm.tsx
│   │   │   │   ├── 📄 TaskModal.tsx
│   │   │   │   ├── 📄 TaskDetails.tsx
│   │   │   │   ├── 📄 TaskFilters.tsx
│   │   │   │   ├── 📄 TaskSearch.tsx
│   │   │   │   ├── 📄 TaskStatusBadge.tsx
│   │   │   │   ├── 📄 PriorityBadge.tsx
│   │   │   │   ├── 📄 WorkerSelector.tsx     # Multi-select workers!
│   │   │   │   └── 📄 AssignedWorkers.tsx    # Display workers!
│   │   │   │
│   │   │   └── 📁 weather/
│   │   │       ├── 📄 CurrentWeather.tsx
│   │   │       ├── 📄 ForecastCard.tsx
│   │   │       ├── 📄 ForecastGrid.tsx
│   │   │       ├── 📄 WeatherIcon.tsx
│   │   │       └── 📄 WeatherDetails.tsx
│   │   │
│   │   ├── 📁 admin/                 # Admin-only components
│   │   │   ├── 📄 WorkerCard.tsx
│   │   │   ├── 📄 WorkerList.tsx
│   │   │   ├── 📄 FarmCodeDisplay.tsx # Farm code with copy button
│   │   │   ├── 📄 WorkerStats.tsx
│   │   │   ├── 📄 FarmSettings.tsx
│   │   │   └── 📄 Analytics.tsx
│   │   │
│   │   ├── 📁 landing/               # Landing page components
│   │   │   ├── 📄 Hero.tsx
│   │   │   ├── 📄 Features.tsx
│   │   │   ├── 📄 FeatureCard.tsx
│   │   │   ├── 📄 HowItWorks.tsx
│   │   │   └── 📄 CTA.tsx
│   │   │
│   │   └── 📁 common/                # Shared components
│   │       ├── 📄 LoadingSpinner.tsx
│   │       ├── 📄 EmptyState.tsx
│   │       ├── 📄 ErrorMessage.tsx
│   │       ├── 📄 ConfirmDialog.tsx
│   │       └── 📄 DatePicker.tsx
│   │
│   ├── 📁 lib/
│   │   ├── 📄 api.ts                 # Axios instance
│   │   ├── 📄 auth.ts                # Auth helpers
│   │   ├── 📄 utils.ts               # Utility functions
│   │   └── 📄 constants.ts           # Constants
│   │
│   ├── 📁 hooks/
│   │   ├── 📄 useAuth.ts
│   │   ├── 📄 useFields.ts
│   │   ├── 📄 useTasks.ts
│   │   ├── 📄 useWorkers.ts
│   │   ├── 📄 useWeather.ts
│   │   ├── 📄 useDashboard.ts
│   │   └── 📄 useDebounce.ts
│   │
│   ├── 📁 store/
│   │   ├── 📄 authStore.ts           # Auth state (Zustand)
│   │   ├── 📄 farmStore.ts           # Farm state
│   │   └── 📄 uiStore.ts             # UI state
│   │
│   ├── 📁 types/
│   │   ├── 📄 index.ts
│   │   ├── 📄 auth.types.ts
│   │   ├── 📄 field.types.ts
│   │   ├── 📄 task.types.ts
│   │   ├── 📄 worker.types.ts
│   │   └── 📄 weather.types.ts
│   │
│   └── 📁 services/
│       ├── 📄 auth.service.ts        # Auth API calls
│       ├── 📄 field.service.ts       # Field API calls
│       ├── 📄 task.service.ts        # Task API calls
│       ├── 📄 worker.service.ts      # Worker API calls
│       ├── 📄 weather.service.ts     # Weather API calls
│       └── 📄 dashboard.service.ts   # Dashboard API calls
│
├── 📄 middleware.ts                  # Route protection
├── 📄 .env.local
├── 📄 .env.example
├── 📄 .gitignore
├── 📄 next.config.js
├── 📄 tailwind.config.ts
├── 📄 tsconfig.json
├── 📄 package.json
├── 📄 components.json                # shadcn/ui config
└── 📄 README.md
```

---

## Key Frontend Concepts

### **1. Hybrid Routing Strategy**

#### **🔄 Shared Routes (`/workspace/*`)**
**When to use:** Pages with similar purpose but different data/permissions

**Examples:**
- `/workspace/dashboard` - Admin sees full stats, Worker sees simple view
- `/workspace/tasks` - Admin sees all tasks, Worker sees only their tasks
- `/workspace/fields` - Admin has CRUD, Worker has read-only

**Implementation:**
```typescript
// app/(workspace)/dashboard/page.tsx
export default function DashboardPage() {
  const { user } = useAuth();
  
  if (user.role === 'admin') {
    return <AdminDashboard />;  // Full stats + charts
  }
  
  return <WorkerDashboard />;  // Simple tasks view
}
```

**Benefits:**
✅ Single codebase  
✅ Shared components  
✅ Consistent UX  
✅ Easy to maintain  

---

#### **Separate Routes (`/admin/*`)**
**When to use:** Admin-only pages that workers should never access

**Examples:**
- `/admin/workers` - Manage team members
- `/admin/settings` - Farm configuration
- `/admin/analytics` - Advanced reports

**Implementation:**
```typescript
// app/admin/workers/page.tsx
// Middleware blocks workers from accessing
export default function WorkersPage() {
  return <WorkerManagement />;
}
```

**Benefits:**
Clear separation  
Easy to protect  
Different layout/design  
Scalable  

---

### **2. URL Structure**

| Route | Admin Access | Worker Access | Notes |
|-------|-------------|---------------|-------|
| `/` | ✅ | ✅ | Landing page (public) |
| `/login` | ✅ | ✅ | Login page (public) |
| `/register` | ✅ | ✅ | Register page (public) |
| `/workspace/dashboard` | ✅ Full view | ✅ Simple view | Different content |
| `/workspace/tasks` | ✅ All tasks | ✅ My tasks | Filtered data |
| `/workspace/fields` | ✅ Full CRUD | ✅ Read-only | Different permissions |
| `/workspace/fields/[id]/history` | ✅ | ✅ | Both can view history |
| `/workspace/weather` | ✅ | ✅ | Same for both |
| `/admin/workers` | ✅ | ❌ Blocked | Admin only |
| `/admin/settings` | ✅ | ❌ Blocked | Admin only |
| `/admin/analytics` | ✅ | ❌ Blocked | Admin only |

---

### **3. Navigation Flow**

#### **Admin User Flow:**
```
Login → /workspace/dashboard (admin view)
    ├── /workspace/tasks (all tasks + create/edit)
    ├── /workspace/fields (full CRUD + history)
    ├── /workspace/weather (weather info)
    ├── /admin/workers (manage team + farm code)
    ├── /admin/settings (farm configuration)
    └── /admin/analytics (reports)
```

#### **Worker User Flow:**
```
Login → /workspace/dashboard (worker view)
    ├── /workspace/tasks (my tasks only + update status)
    ├── /workspace/fields (read-only + history)
    └── /workspace/weather (weather info)
```

---

### **4. Sidebar Structure**

#### **Workspace Sidebar** (Visible to both roles)
```typescript
export function WorkspaceSidebar() {
  const { user } = useAuth();
  
  return (
    <aside>
      <Logo />
      
      {/* Common menu items */}
      <NavItem href="/workspace/dashboard">Dashboard</NavItem>
      <NavItem href="/workspace/tasks">Tasks</NavItem>
      <NavItem href="/workspace/fields">Fields</NavItem>
      <NavItem href="/workspace/weather">Weather</NavItem>
      
      {/* Admin-only link to admin panel */}
      {user.role === 'admin' && (
        <>
          <Separator />
          <NavItem href="/admin/workers">Admin Panel</NavItem>
        </>
      )}
      
      <Separator />
      <NavItem href="/profile">Profile</NavItem>
      <NavItem onClick={logout}>Logout</NavItem>
    </aside>
  );
}
```

#### **Admin Sidebar** (Only in `/admin/*` routes)
```typescript
export function AdminSidebar() {
  return (
    <aside>
      <Logo />
      
      <NavItem href="/workspace/dashboard">← Back to Workspace</NavItem>
      
      <Separator />
      
      <NavItem href="/admin/workers">Workers</NavItem>
      <NavItem href="/admin/settings">Settings</NavItem>
      <NavItem href="/admin/analytics">Analytics</NavItem>
    </aside>
  );
}
```

---

### **5. Route Protection (Middleware)**

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const user = verifyToken(token);
  
  // 1. Protect /admin/* routes (admin only)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user || user.role !== 'admin') {
      return NextResponse.redirect(
        new URL('/workspace/dashboard', request.url)
      );
    }
  }
  
  // 2. Protect /workspace/* routes (both roles)
  if (request.nextUrl.pathname.startsWith('/workspace')) {
    if (!user) {
      return NextResponse.redirect(
        new URL('/login', request.url)
      );
    }
  }
  
  // 3. Redirect authenticated users from auth pages
  if (request.nextUrl.pathname.startsWith('/login') || 
      request.nextUrl.pathname.startsWith('/register')) {
    if (user) {
      return NextResponse.redirect(
        new URL('/workspace/dashboard', request.url)
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/workspace/:path*', '/admin/:path*', '/login', '/register']
};
```

---

## Key Features Explained

### **1. Field History Tracking**

**Problem:** When updating a field's crop, we lose the history.

**Solution:** Don't UPDATE, CREATE new record!

**How it works:**
```typescript
// services/field.service.ts

export async function updateFieldCrop(fieldId: number, newCropData: any) {
  return await prisma.$transaction(async (tx) => {
    // Step 1: Mark old record as inactive
    await tx.field.update({
      where: { id: fieldId },
      data: { active: false }
    });
    
    // Step 2: Get old field data
    const oldField = await tx.field.findUnique({
      where: { id: fieldId }
    });
    
    // Step 3: Create new record with new crop
    return await tx.field.create({
      data: {
        name: oldField.name,          // Same name
        size: oldField.size,          // Same size
        cropType: newCropData.cropType, // NEW crop
        status: newCropData.status,   // NEW status
        plantedDate: newCropData.plantedDate,
        harvestDate: newCropData.harvestDate,
        active: true,                 // NEW record is active
        farmId: oldField.farmId
      }
    });
  });
}
```

**UI Component:**
```typescript
// components/workspace/fields/FieldHistory.tsx
export function FieldHistory({ fieldId }: { fieldId: number }) {
  const { data: history } = useQuery({
    queryKey: ['field-history', fieldId],
    queryFn: () => fieldService.getHistory(fieldId)
  });
  
  return (
    <div>
      <h2>Field History</h2>
      {history?.map((record) => (
        <FieldHistoryCard key={record.id} record={record} />
      ))}
    </div>
  );
}
```

---

### **2. Multiple Workers per Task**

**Problem:** Some tasks need multiple workers (e.g., harvesting).

**Solution:** Junction table `task_assignments` for many-to-many relationship!

**How it works:**
```typescript
// services/task.service.ts

export async function createTaskWithWorkers(
  taskData: any, 
  workerIds: number[]
) {
  return await prisma.$transaction(async (tx) => {
    // Step 1: Create task
    const task = await tx.task.create({
      data: taskData
    });
    
    // Step 2: Assign multiple workers
    await tx.taskAssignment.createMany({
      data: workerIds.map(workerId => ({
        taskId: task.id,
        workerId
      })),
      skipDuplicates: true
    });
    
    // Step 3: Return task with workers
    return await tx.task.findUnique({
      where: { id: task.id },
      include: {
        taskAssignments: {
          include: { worker: true }
        }
      }
    });
  });
}
```

**UI Component:**
```typescript
// components/workspace/tasks/WorkerSelector.tsx
export function WorkerSelector({ 
  selectedWorkers, 
  onChange 
}: WorkerSelectorProps) {
  const { data: workers } = useWorkers();
  
  return (
    <MultiSelect
      options={workers}
      value={selectedWorkers}
      onChange={onChange}
      placeholder="Select workers..."
    />
  );
}
```

---

### **3. Farm Code System**

**Problem:** How do workers join a farm?

**Solution:** Unique farm code!

**How it works:**

**Admin creates farm:**
```typescript
// Generate unique code
function generateFarmCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789';
  let code = 'FARM-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create farm with code
const farm = await prisma.farm.create({
  data: {
    name: 'Green Valley Farm',
    location: 'Algiers',
    joinCode: generateFarmCode(), // FARM-ABC123
    createdBy: 'dev@farmhub.com'
  }
});
```

**Worker registers with code:**
```typescript
// services/auth.service.ts
export async function registerWorker(data: RegisterWorkerData) {
  // Step 1: Validate farm code
  const farm = await prisma.farm.findUnique({
    where: { joinCode: data.farmCode }
  });
  
  if (!farm) {
    throw new Error('Invalid farm code');
  }
  
  // Step 2: Create worker account
  const worker = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: 'worker',
      farmId: farm.id  // Link to farm!
    }
  });
  
  return worker;
}
```

**UI Component:**
```typescript
// components/admin/FarmCodeDisplay.tsx
export function FarmCodeDisplay({ farmCode }: { farmCode: string }) {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(farmCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="farm-code-box">
      <h3>Your Farm Code</h3>
      <div className="code-display">
        <span className="code">{farmCode}</span>
        <Button onClick={copyToClipboard}>
          {copied ? '✓ Copied!' : '📋 Copy'}
        </Button>
      </div>
      <p>Share this code with workers so they can join your farm</p>
    </div>
  );
}
```

---

## Setup Instructions

### **Prerequisites:**
- Node.js 18+ and npm
- PostgreSQL database (local or hosted)
- Git

---

### **Backend Setup:**

```bash
# 1. Clone repository
git clone https://github.com/your-team/farmhub.git
cd farmhub/backend

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# 4. Generate Prisma client
npx prisma generate

# 5. Run database migrations
npx prisma migrate dev --name init

# 6. (Optional) Seed database with sample data
npx prisma db seed

# 7. Start development server
npm run dev

# Server running at http://localhost:5000
```

**Environment Variables (.env):**
```env
DATABASE_URL="postgresql://user:password@host:5432/farmhub"
JWT_SECRET="your-super-secret-key-change-this"
JWT_EXPIRES_IN="7d"
WEATHER_API_KEY="your-weather-api-key"
PORT=5000
```

---

### **Frontend Setup:**

```bash
# 1. Navigate to frontend
cd ../frontend

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local with your API URL

# 4. Initialize shadcn/ui
npx shadcn-ui@latest init

# 5. Add shadcn/ui components
npx shadcn-ui@latest add button card input dialog select badge calendar toast form

# 6. Start development server
npm run dev

# App running at http://localhost:3000
```

**Environment Variables (.env.local):**
```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
NEXT_PUBLIC_WEATHER_API_KEY="your-weather-api-key"
```

---

### **Database Setup Options:**

#### **Option 1: Local PostgreSQL**
```bash
# Install PostgreSQL
# Create database
createdb farmhub

# Use in .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/farmhub"
```

#### **Option 2: Neon (Recommended for development)**
1. Go to https://neon.tech
2. Create free account
3. Create new project
4. Copy connection string
5. Use in .env

#### **Option 3: Supabase**
1. Go to https://supabase.com
2. Create free account
3. Create new project
4. Get connection string from Settings > Database
5. Use in .env

---

## Project Statistics

### **Database:**
- **5 tables** (farms, users, fields, tasks, task_assignments)
- **4 enums** (UserRole, FieldStatus, TaskStatus, Priority)
- **Multiple indexes** for performance
- **Cascading deletes** for data integrity

### **Backend:**
- **~15-20 API endpoints**
- **JWT authentication**
- **Role-based middleware**
- **Field history tracking**
- **Multiple worker assignments**

### **Frontend:**
- **~50+ components**
- **9 main pages** (landing, auth, dashboard, tasks, fields, workers, weather, settings, analytics)
- **3 layouts** (root, auth, workspace, admin)
- **Type-safe** with TypeScript
- **Responsive** design

---

## Development Workflow

### **Team Roles:**

1. **Backend Developer**
   - Setup Express + Prisma
   - Create API endpoints
   - Implement authentication
   - Database migrations
   - API testing

2. **Frontend Developer (You!)**
   - Setup Next.js
   - Create components
   - Implement pages
   - State management
   - API integration
   - UI/UX polish

3. **Full-Stack Developer**
   - Connect frontend to backend
   - Integration testing
   - Bug fixes
   - Performance optimization
   - Deployment

---

### **Development Phases:**

#### **Phase 1: Foundation (Week 1-2)**
- ✅ Database schema
- ✅ Backend API setup
- ✅ Frontend project setup
- ✅ Authentication flow
- ✅ Basic layouts

#### **Phase 2: Core Features (Week 3-4)**
- ✅ Field management + history
- ✅ Task management + assignments
- ✅ Dashboard with charts
- ✅ Role-based access

#### **Phase 3: Additional Features (Week 5-6)**
- ✅ Worker management
- ✅ Weather integration
- ✅ Settings page
- ✅ Analytics

#### **Phase 4: Polish & Deploy (Week 7-8)**
- ✅ Bug fixes
- ✅ Performance optimization
- ✅ Mobile responsiveness
- ✅ Testing
- ✅ Deployment

---

## Summary

**FarmHub** is a modern, scalable farm management platform built with:

✅ **PostgreSQL** - Reliable database with history tracking  
✅ **Express.js** - Fast, flexible backend API  
✅ **Next.js 14** - Modern React framework with App Router  
✅ **TypeScript** - Type-safe development  
✅ **Prisma ORM** - Type-safe database access  
✅ **JWT Auth** - Secure authentication  
✅ **Zustand** - Simple state management  
✅ **Tailwind CSS + shadcn/ui** - Beautiful, responsive UI  

**Key Features:**
- Field management with complete history tracking
- Task management with multiple worker assignments
- Team collaboration with farm code system
- Weather integration
- Analytics dashboard with charts
- Role-based access control (Admin/Worker)
- Fully responsive design

**Architecture:**
- Hybrid routing (shared + separate routes)
- Modular, scalable structure
- Industry best practices (Notion, GitHub, Asana)
- Production-ready code

---



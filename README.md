# 🌾 FarmHub - Farm Management System

> A modern, comprehensive farm management platform built with Next.js, Express.js, and PostgreSQL, designed to streamline agricultural operations through role-based access control and intelligent task management.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.1-green?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [User Roles & Permissions](#user-roles--permissions)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Agile Methodology](#agile-methodology)
- [Contributors](#contributors)
- [Best Practices](#best-practices)
- [Future Enhancements](#future-enhancements)

---

## About the Project

**FarmHub** is a full-stack farm management system developed as a Software Engineering university project using **Agile Scrum methodology**. The platform empowers farm owners to efficiently manage their agricultural operations, coordinate with workers, track field crop history, and monitor tasks in real-time.

### Problem Statement

Traditional farm management relies on manual record-keeping and fragmented communication, leading to:

- Lost crop history and farming patterns
- Inefficient task assignment and tracking
- Poor coordination between farm owners and workers
- Lack of data-driven insights for decision-making

### Solution

FarmHub provides a centralized digital platform that:

- **Tracks complete field history** - Never lose crop rotation data
- **Enables multi-worker task assignment** - Coordinate teams efficiently
- **Provides role-based access** - Secure, permission-based interfaces
- **Integrates weather data** - Make informed farming decisions
- **Delivers real-time analytics** - Monitor farm performance at a glance

---

## Key Features

### Home (Public Interface)

- Modern, responsive landing page
- Feature showcase with interactive demonstrations
- User authentication (login/register)
- Role selection (Farm Owner/Worker)
- Farm code system for easy team joining

### Farmer (Farm Admin) Features

- **Dashboard**: Comprehensive overview with analytics, weather widgets, and activity feeds
- **Field Management**:
  - Create, update, and delete fields
  - Track crop types, sizes, and statuses
  - **Complete crop history tracking** (records preserved with active/inactive flags)
  - View planting and harvest dates
- **Task Management**:
  - Create tasks with priorities and due dates
  - **Assign multiple workers to a single task**
  - Monitor task completion status
  - Associate tasks with specific fields
- **Worker Management**:
  - View all farm workers
  - Generate and share farm join codes
  - Monitor worker activity
- **Analytics Dashboard**:
  - Farm statistics and trends
  - Field status distribution
  - Task completion charts
  - Worker performance metrics
- **Settings**: Configure farm details and preferences
- **Weather Integration**: Real-time weather updates

### Worker Features

- **Personalized Dashboard**: View assigned tasks and priorities
- **Task Management**:
  - View tasks assigned specifically to them
  - Update task status (pending → in progress → completed)
  - Add notes and comments
- **Field Information**: Read-only access to field details and history
- **Weather Updates**: Access farm-specific weather forecasts

### Platform Admin (Developer) Features

- **System Overview**: Monitor all farms and users
- **Farm Tracking**: View which platform admin created each farm
- **User Management**: Platform-level user administration
- **Analytics**: System-wide statistics and insights
- **Notifications**: Real-time platform activity monitoring

---

## System Architecture

FarmHub follows a **three-tier architecture** with clear separation of concerns:

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js 16<br/>App Router]
        B[React Components<br/>shadcn/ui]
        C[Zustand State<br/>Management]
    end

    subgraph "Backend Layer"
        D[Express.js<br/>REST API]
        E[JWT<br/>Authentication]
        F[Prisma ORM]
    end

    subgraph "Data Layer"
        G[(PostgreSQL<br/>Database)]
    end

    subgraph "External Services"
        H[Weather API]
    end

    A --> D
    B --> D
    C --> D
    D --> F
    E --> D
    F --> G
    D --> H

    style A fill:#61dafb,stroke:#333,stroke-width:2px,color:#000
    style D fill:#90c53f,stroke:#333,stroke-width:2px,color:#000
    style G fill:#336791,stroke:#333,stroke-width:2px,color:#fff
```

### Architecture Diagram Explanation

The system consists of three main layers:

1. **Frontend Layer (Client-Side)**

   - Built with Next.js 16 using the App Router
   - UI components from shadcn/ui for consistent design
   - State managed with Zustand for optimal performance
   - Communicates with backend via RESTful API calls

2. **Backend Layer (Server-Side)**

   - Express.js server handling HTTP requests
   - JWT-based authentication for secure access
   - Prisma ORM for type-safe database operations
   - Role-based middleware for permission control

3. **Data Layer (Persistence)**
   - PostgreSQL database for reliable data storage
   - Prisma schema defining data models
   - Database triggers for automatic timestamp updates

### Database Schema

```mermaid
erDiagram
    FARMS ||--o{ USERS : "has"
    FARMS ||--o{ FIELDS : "contains"
    FARMS ||--o{ TASKS : "manages"
    USERS ||--o{ TASK_ASSIGNMENTS : "assigned_to"
    TASKS ||--o{ TASK_ASSIGNMENTS : "has"
    TASKS ||--o| FIELDS : "relates_to"

    FARMS {
        int id PK
        string name
        string location
        string joinCode UK
        string createdBy
        timestamp createdAt
        timestamp updatedAt
    }

    USERS {
        int id PK
        string email UK
        string password
        string name
        string phone
        enum role
        int farmId FK
        timestamp createdAt
        timestamp updatedAt
    }

    FIELDS {
        int id PK
        string name
        float size
        string cropType
        enum status
        date plantedDate
        date harvestDate
        boolean active
        int farmId FK
        timestamp createdAt
        timestamp updatedAt
    }

    TASKS {
        int id PK
        string title
        text description
        enum status
        enum priority
        timestamp dueDate
        text notes
        int farmId FK
        int fieldId FK
        timestamp createdAt
        timestamp updatedAt
    }

    TASK_ASSIGNMENTS {
        int id PK
        int taskId FK
        int workerId FK
        timestamp assignedAt
    }
```

### Hybrid Routing Strategy

FarmHub implements a **hybrid approach** for role-based access, combining shared and separate routes:

**Shared Routes (`/workspace/*`)**: Same URL, different content based on user role

- `/workspace/dashboard` - Admin sees full analytics, Worker sees simple task view
- `/workspace/tasks` - Admin sees all tasks with CRUD, Worker sees only their tasks
- `/workspace/fields` - Admin has full management, Worker has read-only access

**Separate Routes (`/admin/*`)**: Admin-only pages

- `/admin/workers` - Team management (blocked for workers)
- `/admin/settings` - Farm configuration (admin exclusive)
- `/admin/analytics` - Advanced reports (admin exclusive)

---

## Technology Stack

### Frontend

| Technology                                      | Version | Purpose                         |
| ----------------------------------------------- | ------- | ------------------------------- |
| [Next.js](https://nextjs.org/)                  | 16.0    | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/)   | 5.x     | Type-safe JavaScript            |
| [React](https://react.dev/)                     | 19.2    | UI library                      |
| [Tailwind CSS](https://tailwindcss.com/)        | 4.x     | Utility-first CSS framework     |
| [shadcn/ui](https://ui.shadcn.com/)             | Latest  | Reusable component library      |
| [Zustand](https://zustand-demo.pmnd.rs/)        | 5.x     | Lightweight state management    |
| [React Hook Form](https://react-hook-form.com/) | 7.x     | Form validation                 |
| [Zod](https://zod.dev/)                         | 4.x     | Schema validation               |
| [Axios](https://axios-http.com/)                | 1.x     | HTTP client                     |
| [Recharts](https://recharts.org/)               | 3.x     | Chart library                   |
| [Lucide React](https://lucide.dev/)             | Latest  | Icon library                    |

### Backend

| Technology                                                 | Version | Purpose                   |
| ---------------------------------------------------------- | ------- | ------------------------- |
| [Express.js](https://expressjs.com/)                       | 5.x     | Node.js web framework     |
| [Prisma](https://www.prisma.io/)                           | 6.x     | Next-generation ORM       |
| [PostgreSQL](https://www.postgresql.org/)                  | 16.x    | Relational database       |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js)       | 6.x     | Password hashing          |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | 9.x     | JWT authentication        |
| [express-validator](https://express-validator.github.io/)  | 7.x     | Request validation        |
| [cors](https://github.com/expressjs/cors)                  | 2.x     | CORS middleware           |
| [dotenv](https://github.com/motdotla/dotenv)               | 17.x    | Environment configuration |
| [multer](https://github.com/expressjs/multer)              | 2.x     | File upload handling      |
| [node-cron](https://github.com/node-cron/node-cron)        | 4.x     | Scheduled tasks           |

### Development Tools

- **Version Control**: Git & GitHub
- **Code Quality**: ESLint, Prettier
- **Package Manager**: npm
- **Development Server**: Nodemon (backend), Next.js Dev Server (frontend)

---

## 📁 Project Structure

```
Farm_Management/
├── 📁 backend/                      # Express.js backend
│   ├── 📁 prisma/                   # Database schema & migrations
│   │   ├── schema.prisma            # Prisma data models
│   │   └── 📁 migrations/           # Database version control
│   ├── 📁 src/
│   │   ├── 📁 config/               # Database & environment config
│   │   ├── 📁 controllers/          # Request handlers
│   │   │   ├── authController.js    # Authentication logic
│   │   │   ├── fieldController.js   # Field CRUD + history
│   │   │   ├── taskController.js    # Task management
│   │   │   ├── workerController.js  # Worker operations
│   │   │   ├── dashboardController.js # Dashboard metrics
│   │   │   ├── weatherController.js # Weather integration
│   │   │   └── settingsController.js # Farm settings
│   │   ├── 📁 middleware/
│   │   │   ├── authMiddleware.js    # JWT verification
│   │   │   ├── dashboardMiddleware.js # Dashboard logic
│   │   │   ├── upload.js            # File uploads
│   │   │   └── validation.js        # Input validation
│   │   ├── 📁 routes/               # API route definitions
│   │   │   ├── activities.js
│   │   │   ├── admin.js
│   │   │   ├── authRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   ├── farms.js
│   │   │   ├── fieldRoutes.js
│   │   │   ├── notifications.js
│   │   │   ├── profile.js
│   │   │   ├── search.js
│   │   │   ├── settingsRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   ├── user_notifications.js
│   │   │   ├── user_profile.js
│   │   │   ├── weather.js
│   │   │   └── workerRoutes.js
│   │   ├── 📁 services/             # Business logic layer
│   │   │   ├── authService.js
│   │   │   ├── dashbordService.js
│   │   │   ├── notificationBackoundService.js
│   │   │   ├── taskService.js
│   │   │   ├── weatherServices.js
│   │   │   └── WorkerService.js
│   │   ├── 📁 test/                 # REST API test files
│   │   │   ├── activities.rest
│   │   │   ├── admin.rest
│   │   │   ├── fields.rest
│   │   │   ├── settings.rest
│   │   │   ├── users_notifications.rest
│   │   │   └── weather.rest
│   │   ├── 📁 utils/                # Helper functions
│   │   └── server.js                # Express app entry point
│   ├── database-setup.sql           # PostgreSQL schema
│   ├── package.json
│   └── .env.example
│
├── 📁 frontend/                     # Next.js frontend
│   ├── 📁 src/
│   │   ├── 📁 app/                  # Next.js App Router
│   │   ├── 📁 components/
│   │   ├── 📁 hooks/
│   │   ├── 📁 lib/
│   │   ├── 📁 services/
│   │   ├── 📁 store/
│   │   ├── 📁 types/
│   │   └── middleware.ts            # Next.js middleware (route protection)
│   ├── 📁 public/                   # Static assets
│   ├── package.json
│   ├── next.config.ts
│   ├── postcss.config.mjs
│   ├── tsconfig.json
│   └── README.md
│
├── 📁 docs/                         # Project documentation
│   ├── API-ENDPOINTS-SPECIFICATION.md
│   ├── COMPLETE-PROJECT-GUIDE.md
│   ├── BACKEND-QUICK-START.md
│   ├── IMPLEMENTATION-GUIDE.md
│   ├── IMPLEMENTATION-SUMMARY.md
│   ├── DATABASE-SETUP-GUIDE (1).md
│   ├── DASHBOARD-BACKEND-INTEGRATION.md
│   ├── BACKEND-API-DOCS.md
│   ├── BACKEND-INTEGRATION-CHECKLIST.md
│   └── jira-backlog.md
│
├── uploads/                         # File uploads
├── jira-backlog.csv                 # Sprint planning data
└── README.md                        # This file
```

## User Roles & Permissions

### 1️⃣ Farm Admin (Farmer)

**Description**: Farm owner with complete control over their farm operations.

**Permissions**:

- ✅ Full CRUD on fields (with history preservation)
- ✅ Create, assign, and delete tasks
- ✅ Assign multiple workers to tasks
- ✅ Manage farm workers and team
- ✅ Access farm analytics and reports
- ✅ Configure farm settings
- ✅ View and share farm join code
- ✅ Access admin-only routes

### 2️⃣ Worker

**Description**: Farm employee with task-focused limited access.

**Permissions**:

- ✅ View tasks assigned to them
- ✅ Update task status and add notes
- ✅ Read-only access to field information
- ✅ View field crop history
- ✅ Access weather information
- ✅ Update personal profile
- ❌ Cannot create/delete fields or tasks
- ❌ Cannot access admin routes
- ❌ Cannot manage other workers

### 3️⃣ Platform Admin (Developer)

**Description**: System administrator managing the entire platform.

**Permissions**:

- ✅ Monitor all farms across the platform
- ✅ View system-wide analytics
- ✅ Track farm creation (createdBy field)
- ✅ Manage platform users
- ✅ Access admin dashboard
- ⚠️ farmId is NULL (not tied to specific farm)

---

## 🚀 Installation & Setup

### Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **PostgreSQL** 14.x or higher ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

### Step 1: Clone the Repository

```bash
git clone https://github.com/AfafKhadraoui/FarmHub.git
cd FarmHub
```

### Step 2: Database Setup

#### Create PostgreSQL Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE farmhub;

-- Exit psql
\q
```

#### Run Database Schema

```bash
# Navigate to backend folder
cd backend

# Run the SQL schema
psql -U postgres -d farmhub -f database-setup.sql
```

This will create:

- All 5 tables (farms, users, fields, tasks, task_assignments)
- Indexes for query optimization
- Triggers for automatic timestamp updates
- Sample data for testing

### Step 3: Backend Setup

```bash
# Navigate to backend folder (if not already there)
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env   # Windows
# OR
cp .env.example .env     # macOS/Linux

# Edit .env file with your database credentials
```

**`.env` Configuration:**

```env
# Database
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/farmhub"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# CORS (frontend URL)
FRONTEND_URL="http://localhost:3000"

# Weather API (optional - get free key from openweathermap.org)
WEATHER_API_KEY="your-weather-api-key"
```

#### Run Prisma Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (if using Prisma migrations instead of SQL file)
npx prisma migrate dev
```

#### Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### Step 4: Frontend Setup

Open a **new terminal** and navigate to the frontend folder:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.example .env.local   # Windows
# OR
cp .env.example .env.local     # macOS/Linux

# Edit .env.local with backend URL
```

**`.env.local` Configuration:**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### Step 5: Verify Installation

1. **Backend Health Check**:

   - Open `http://localhost:5000` in your browser
   - You should see a JSON response or welcome message

2. **Frontend**:

   - Open `http://localhost:3000`
   - You should see the FarmHub landing page

3. **Test Login**:
   - Use the sample credentials from the database setup:
     - **Admin**: `admin@greenvalley.com` / password: `password123` (if you hashed it)
     - **Worker**: `ahmed@greenvalley.com` / password: `password123`

> **Note**: Sample passwords in `database-setup.sql` are bcrypt hashed. You'll need to either:
>
> - Create new users via the registration flow
> - OR update the SQL file with properly hashed passwords using your JWT_SECRET

---

## Usage Guide

### For Farm Owners (Admins)

#### 1. Register Your Farm

1. Click "Get Started" on the landing page
2. Select "I'm a Farm Owner"
3. Fill in farm details (name, location, your info)
4. Submit to create your farm and receive a **farm join code**

#### 2. Manage Fields

1. Navigate to **Fields** from the sidebar
2. Click "Add Field" to create a new field
3. Enter field name, size, crop type, status, and dates
4. Update crop types as seasons change (history is automatically preserved)
5. View field history by clicking on a field

#### 3. Manage Tasks

1. Go to **Tasks** page
2. Click "Create Task"
3. Fill in title, description, priority, due date
4. Select field (optional)
5. **Assign multiple workers** using the worker selector
6. Submit to create task

#### 4. Invite Workers

1. Navigate to **Workers** page
2. Share your **farm join code** with workers
3. Workers can register using this code to join your farm

### For Workers

#### 1. Join a Farm

1. Click "Get Started" on the landing page
2. Select "I'm a Worker"
3. Enter the farm join code provided by your farm owner
4. Complete registration

#### 2. View & Update Tasks

1. Login and view your **Dashboard**
2. See all tasks assigned to you
3. Click on a task to view details
4. Update task status: Pending → In Progress → Completed
5. Add notes or comments

#### 3. View Field Information

1. Navigate to **Fields**
2. Browse field details (read-only)
3. View crop history for planning

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Core API Endpoints

#### Authentication

| Method | Endpoint             | Description       | Access        |
| ------ | -------------------- | ----------------- | ------------- |
| POST   | `/api/auth/register` | Register new user | Public        |
| POST   | `/api/auth/login`    | Login user        | Public        |
| GET    | `/api/auth/me`       | Get current user  | Authenticated |
| POST   | `/api/auth/logout`   | Logout user       | Authenticated |

#### Fields

| Method | Endpoint                  | Description                    | Access        |
| ------ | ------------------------- | ------------------------------ | ------------- |
| GET    | `/api/fields`             | Get all active fields for farm | Authenticated |
| GET    | `/api/fields/:id`         | Get field details              | Authenticated |
| GET    | `/api/fields/:id/history` | Get field crop history         | Authenticated |
| POST   | `/api/fields`             | Create new field               | Admin only    |
| PUT    | `/api/fields/:id`         | Update field (creates history) | Admin only    |
| DELETE | `/api/fields/:id`         | Delete field                   | Admin only    |

#### Tasks

| Method | Endpoint         | Description                  | Access        |
| ------ | ---------------- | ---------------------------- | ------------- |
| GET    | `/api/tasks`     | Get tasks (filtered by role) | Authenticated |
| GET    | `/api/tasks/:id` | Get task details             | Authenticated |
| POST   | `/api/tasks`     | Create task with assignments | Admin only    |
| PUT    | `/api/tasks/:id` | Update task                  | Authenticated |
| DELETE | `/api/tasks/:id` | Delete task                  | Admin only    |

#### Workers

| Method | Endpoint           | Description              | Access     |
| ------ | ------------------ | ------------------------ | ---------- |
| GET    | `/api/workers`     | Get all workers for farm | Admin only |
| GET    | `/api/workers/:id` | Get worker details       | Admin only |

#### Dashboard

| Method | Endpoint               | Description         | Access        |
| ------ | ---------------------- | ------------------- | ------------- |
| GET    | `/api/dashboard/stats` | Get farm statistics | Authenticated |

#### Weather

| Method | Endpoint       | Description                   | Access        |
| ------ | -------------- | ----------------------------- | ------------- |
| GET    | `/api/weather` | Get weather for farm location | Authenticated |

For complete API documentation with request/response examples, see [API-ENDPOINTS-SPECIFICATION.md](docs/API-ENDPOINTS-SPECIFICATION.md).

---

## 🎯 Agile Methodology

### Scrum Framework

This project was developed using **Agile Scrum** with the following structure:

- **Sprint Duration**: 2 weeks
- **Team Size**: 5 members
- **Total Sprints**: 6 sprints
- **Ceremonies**: Daily standups, sprint planning, sprint review, retrospectives

### Team Roles

| Name                                                                      | Role                                                | Responsibilities                                                                                         |
| ------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Afaf** [@AfafKhadraoui](https://github.com/AfafKhadraoui)               | Product Owner + Frontend Developer + UI/UX Designer | Define product backlog, prioritize features, design user interfaces, implement frontend components       |
| **Ilyas** [@ilyas-git275](https://github.com/ilyas-git275)                | Scrum Master + Backend Developer                    | Facilitate Scrum ceremonies, remove blockers, design database schema, implement backend APIs             |
| **Abderraouf** [@Lounis-Abderraouf](https://github.com/Lounis-Abderraouf) | Backend Developer                                   | Build RESTful APIs, implement authentication, integrate Prisma ORM, write backend tests                  |
| **Belkeis** [@Belkeis](https://github.com/Belkeis)                        | Frontend Developer                                  | Develop React components, implement state management, integrate APIs, ensure responsive design           |
| **Loubna** [@BENSAOULALoubna](https://github.com/BENSAOULALoubna)         | Frontend Developer                                  | Build user interfaces, implement forms with validation, create reusable components, optimize performance |

### Sprint Breakdown

**Sprint 1-2**: Project setup, database design, authentication
**Sprint 3-4**: Core features (fields, tasks, workers)
**Sprint 5**: Advanced features (history tracking, multi-worker assignments)
**Sprint 6**: Polish, testing, documentation

### Collaboration Tools

- **Version Control**: Git with feature branches
- **Project Management**: Jira (see [jira-backlog.csv](jira-backlog.csv))
- **Communication**: Daily standups, Slack
- **Code Review**: Pull requests with peer review

### Agile Practices Implemented

✅ **User Stories**: Features defined from user perspective  
✅ **Sprint Planning**: Backlog refinement and story point estimation  
✅ **Daily Standups**: 15-minute sync meetings  
✅ **Sprint Reviews**: Demo to stakeholders  
✅ **Retrospectives**: Continuous improvement discussions  
✅ **Pair Programming**: Complex features developed collaboratively  
✅ **Continuous Integration**: Automated testing on commits

---

## Best Practices Followed

### Code Quality

- **TypeScript**: Strict type checking for reduced runtime errors
- **ESLint & Prettier**: Consistent code formatting and linting
- **Modular Architecture**: Separation of concerns (controllers, services, routes)
- **Component Reusability**: DRY principle with shadcn/ui components
- **Error Handling**: Centralized error middleware with meaningful messages

### Security

- **Password Hashing**: bcrypt with salt rounds for secure storage
- **JWT Authentication**: Secure, stateless authentication tokens
- **Role-Based Access Control**: Middleware ensuring permission checks
- **Input Validation**: express-validator for sanitizing user inputs
- **CORS Configuration**: Restricted cross-origin requests
- **Environment Variables**: Sensitive data in `.env` files (gitignored)
- **SQL Injection Prevention**: Prisma ORM with parameterized queries

### Database Design

- **Normalization**: Third normal form (3NF) for data integrity
- **Foreign Keys with Cascade**: Automatic cleanup of related data
- **Indexes**: Optimized query performance on frequently searched columns
- **History Tracking**: Active/inactive flags for audit trails
- **Timestamps**: Automatic createdAt/updatedAt via triggers
- **Many-to-Many Relationships**: Junction table for task assignments

### Performance

- **Server-Side Rendering**: Next.js for faster initial page loads
- **API Pagination**: Limiting data transfer for large datasets
- **Database Indexing**: Strategic indexes on foreign keys
- **Code Splitting**: Next.js automatic route-based splitting
- **State Management**: Zustand for minimal re-renders

### Development Workflow

- **Git Flow**: Feature branches, pull requests, code reviews
- **Environment Separation**: Development, staging, production configs
- **Documentation**: Inline comments, JSDoc, comprehensive READMEs
- **Version Control**: Semantic versioning (MAJOR.MINOR.PATCH)

---

## Contributors

This project was collaboratively developed by a dedicated team of students:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/AfafKhadraoui">
        <img src="https://github.com/AfafKhadraoui.png" width="100px;" alt="Afaf"/>
        <br />
        <sub><b>Afaf Khadraoui</b></sub>
      </a>
      <br />
      <sub>Product Owner</sub>
      <br />
      <sub>Frontend Dev</sub>
      <br />
      <sub>UI/UX Designer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/ilyas-git275">
        <img src="https://github.com/ilyas-git275.png" width="100px;" alt="Ilyas"/>
        <br />
        <sub><b>Ilyas</b></sub>
      </a>
      <br />
      <sub>Scrum Master</sub>
      <br />
      <sub>Backend Developer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/Lounis-Abderraouf">
        <img src="https://github.com/Lounis-Abderraouf.png" width="100px;" alt="Abderraouf"/>
        <br />
        <sub><b>Abderraouf Lounis</b></sub>
      </a>
      <br />
      <sub>Backend Developer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/Belkeis">
        <img src="https://github.com/Belkeis.png" width="100px;" alt="Belkeis"/>
        <br />
        <sub><b>Belkeis</b></sub>
      </a>
      <br />
      <sub>Frontend Developer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/BENSAOULALoubna">
        <img src="https://github.com/BENSAOULALoubna.png" width="100px;" alt="Loubna"/>
        <br />
        <sub><b>Loubna</b></sub>
      </a>
      <br />
      <sub>Frontend Developer</sub>
    </td>
  </tr>
</table>

### Contribution Guidelines

We welcome contributions! If you'd like to improve FarmHub:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Acknowledgments
- **Open Source Community**: For the amazing tools and libraries
- **shadcn/ui**: For the beautiful component library
- **Prisma Team**: For the excellent ORM
- **Vercel**: For Next.js and deployment platform

---

## Support & Contact

For questions, issues, or feedback:

- **Issues**: [GitHub Issues](https://github.com/AfafKhadraoui/FarmHub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/AfafKhadraoui/FarmHub/discussions)
- **Email**: afaf.khadraoui@gmail.com

---

## Additional Documentation

- [Complete Project Guide](docs/COMPLETE-PROJECT-GUIDE.md) - Comprehensive architecture and implementation details
- [API Endpoints Specification](docs/API-ENDPOINTS-SPECIFICATION.md) - Full API reference
- [Backend Quick Start](docs/BACKEND-QUICK-START.md) - Backend setup and development guide
- [Implementation Guide](docs/IMPLEMENTATION-GUIDE.md) - Step-by-step implementation walkthrough

---

<div align="center">

**Built with ❤️ by the FarmHub Team**

⭐ Star this repository if you found it helpful!

[Report Bug](https://github.com/AfafKhadraoui/FarmHub/issues) · [Request Feature](https://github.com/AfafKhadraoui/FarmHub/issues) · [Contribute](CONTRIBUTING.md)

</div>

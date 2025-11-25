# 🌾 FarmHub - Sprint 2 Task Assignment with Detailed Role Logic

**Team:** 2 Backend, 3 Frontend  
**Deadline:** 10 days

---

## 📋 Team Roles

| Member       | Role     | Main Focus Areas                                   |
|--------------|----------|----------------------------------------------------|
| Backend 1    | Backend  | Fields, Tasks, Task Assignments, Platform Admin    |
| Backend 2    | Backend  | Workers, Weather, Analytics, Settings, Profile, Platform Admin   |
| Frontend 1   | Frontend | Tasks & Weather                                    |
| Frontend 2   | Frontend | Fields & Workers                                   |
| Frontend 3   | Frontend | Dashboard, Analytics, Settings, Profile            |


---

## 🔧 Backend Tasks — Detailed Role Logic

### **Fields API**
- **Admin:**
  - Sees **all farm fields**.
  - Can **create, update, delete any field**.
  - Can view **full history of any field**.
- **Worker:**
  - Sees **only fields that have at least one task assigned to them** (via task_assignments with their user ID).
  - **Read-only**: Cannot create, update, or delete fields.
  - Can view **field history**, but only for fields they can see.

### **Tasks API**
- **Admin:**
  - Sees **all tasks** for the farm.
  - Can **create, update, delete any task**.
  - Can **assign one or more workers**.
- **Worker:**
  - Sees **only tasks assigned to them**.
  - Can **update their own task status and notes/comments**.
  - Cannot create, edit, delete or assign tasks to others.

### **Workers API**
- **Admin:** Manage all farm workers (invite, edit, remove, see farm code).
- **Worker:** No access to workers API (cannot view/manage team members).

### **Weather API**
- **Both admin and worker**: See weather for farm location.
- No special differences; endpoint returns same farm/location data, filtered as needed.

### **Analytics API**
- **Admin only**: See charts and stats for farm tasks, fields, workers.
- **Worker:** No access.

### **Settings/Profile APIs**
- **Admin:** Can view/edit farm settings and their own profile.
- **Worker:** Can view/edit their own profile only.

---

## 🎨 Frontend Tasks — Detailed Role Logic

### Frontend 1 – Tasks & Weather

**Tasks List Page (`/workspace/tasks`):**
  - **Admin:** Sees all farm tasks, can filter/search, create/edit/delete, assign workers.
  - **Worker:** Sees only tasks assigned to them, can update status/comments. No task CRUD or assignment actions.
**Task Details Page (`/workspace/tasks/[id]`):**
  - **Admin:** Full details, edit/delete, assign more workers.
  - **Worker:** Sees details **only for assigned tasks**. Can update status/notes if they are assigned.

**Weather Page (`/workspace/weather`):**
  - **Both roles:** View weather widget, forecast, alerts for farm location.

---

### Frontend 2 – Fields & Workers

**Fields List Page (`/workspace/fields`):**
  - **Admin:** Sees all farm fields. Can create, edit, delete, view history.
  - **Worker:** Sees **only fields tied to at least one task assigned to them**, read-only view (no edit/delete/create).
**Fields Details Page (`/workspace/fields/[id]`):**
  - **Admin:** See details for any field, edit/delete, link to crop history.
  - **Worker:** See details **only for assigned fields**, read-only.

**Fields History Page (`/workspace/fields/[id]/history`):**
  - **Both roles:** View field/crop history, but workers only for their fields.

**Workers Page (`/admin/workers`):**
  - **Admin only:** Manage workers/team members, see/add/edit/remove, display farm code.
  - **Worker:** No access.

---

### Frontend 3 – Dashboard, Analytics, Settings, Profile

**Dashboard Page (`/workspace/dashboard`):**
  - **Admin:** Full stats/charts, recent activity, shortcuts, weather.
  - **Worker:** Summary of their own assigned tasks, field status (only assigned fields), notifications, weather.

**Analytics Page (`/admin/analytics`):**
  - **Admin only:** Farm analytics dashboard, stats/charts. Not shown to workers.

**Settings Page (`/admin/settings`):**
  - **Admin only:** Update farm preferences/config.
  - **Worker:** No access.

**Profile Page (`/profile`):**
  - **Both:** Edit/view their own profile and password.

---

## 🗂️ Route-to-Member Summary with Role Details

| Route                           | Owner       | Admin Experience                                 | Worker Experience                   |
|----------------------------------|-------------|--------------------------------------------------|-------------------------------------|
| `/workspace/tasks`               | FE1         | All tasks, CRUD, assign workers                  | Only assigned tasks, update status  |
| `/workspace/tasks/[id]`          | FE1         | Full detail/edit/assignment                      | Only assigned tasks, update status  |
| `/workspace/weather`             | FE1         | See farm weather/forecast                        | See farm weather/forecast           |
| `/workspace/fields`              | FE2         | All fields, full CRUD, view history              | Only fields with assigned tasks, read-only |
| `/workspace/fields/[id]`         | FE2         | Full details, edit/delete                        | Only assigned fields, read-only     |
| `/workspace/fields/[id]/history` | FE2         | Full history for any field                       | History for only assigned fields    |
| `/admin/workers`                 | FE2         | Manage team, farm code                           | No access                           |
| `/workspace/dashboard`           | FE3         | Full stats, charts, shortcuts, weather            | Summary of tasks/fields, weather    |
| `/admin/analytics`               | FE3         | Analytics, charts, farm reports                  | No access                           |
| `/admin/settings`                | FE3         | Update farm info/preferences                     | No access                           |
| `/profile`                       | FE3         | Edit/view own info/password                      | Edit/view own info/password         |

---

## ⚡ Integration & Shared Logic

- Frontend must always check `user.role` and conditionally render forms, CRUD actions, detail/pages.
- Backend must:
  - Filter `/api/fields` for workers to only fields connected via assigned tasks.
  - Filter `/api/tasks` for workers to only assigned tasks.
  - Block worker requests to GET/PUT/POST `/admin/*` APIs.
  - Ensure worker cannot mutate any objects not related to them.
- Shared UI contributions are distributed among all frontend members as-needed.

---

## 🟩 Platform Admin Login (Special Case)

- **Backend 1 & 2:** Create API and authentication for platform admin (developer console).
- **Frontend 3 (with help if needed):** Build platform admin login page and dashboard UI.

---

**Role-sensitive details are now defined for every page and API. Use this for backend API security and frontend UI/UX conditional rendering!**

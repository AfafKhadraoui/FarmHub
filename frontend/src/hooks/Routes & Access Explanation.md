# 🌾 FarmHub - Frontend Routes & Access Explanation

> **This file explains what each main route does, who can access it (admin/worker), and what major functionality appears. Use as a reference for feature implementation and role-based UI logic.**

---

## 🗂️ Route Breakdown

| Route                             | Access         | Display Logic                               | Main Functionality                                    |
|------------------------------------|---------------|----------------------------------------------|-------------------------------------------------------|
| `/workspace/dashboard`             | Shared        | - If `user.role === 'admin'` → AdminDashboard<br>- If `user.role === 'worker'` → WorkerDashboard | Show stats for admin, tasks summary for worker        |
| `/workspace/tasks`                 | Shared        | - If `user.role === 'admin'` → all tasks, CRUD<br>- If `user.role === 'worker'` → my tasks, update status | Task list, assignment, update status                  |
| `/workspace/tasks/[id]`            | Shared        | Task details (admin sees all, worker only assigned tasks) | Details, status, assigned workers                     |
| `/workspace/fields`                | Shared        | - If `user.role === 'admin'` → CRUD<br>- If `user.role === 'worker'` → read-only | Field list, status, create/edit/delete for admin      |
| `/workspace/fields/[id]`           | Shared        | Field details (CRUD for admin, read-only for worker) | Field info, crop history link                         |
| `/workspace/fields/[id]/history`   | Shared        | Any role—view field/crop history                   | Complete history for a single field                   |
| `/workspace/weather`               | Shared        | Both see same weather page                          | Weather widget, forecast                              |
| `/admin/workers`                   | Admin only    | Worker management                                   | List/add/remove/edit team members, farm code           |
| `/admin/settings`                  | Admin only    | Farm settings                                       | Update farm info, preferences                          |
| `/admin/analytics`                 | Admin only    | Analytics dashboard                                 | Charts, stats, reports for the farm                    |
| `/profile`                         | Shared        | Both roles, profile info & updates                   | Edit own info                                          |

---

## 🔑 Route Types

- **Shared:** Both admin and worker use the same route, but content/functionalities differ based on `user.role`.
- **Admin only:** Only accessible by users with `admin` role, hidden or blocked from workers.

---

## 💡 Route Details

### `/workspace/dashboard`
- **Admin:** Sees full farm statistics, charts, latest activities, shortcuts to management pages.
- **Worker:** Sees summary of assigned tasks, field statuses, relevant notifications.

### `/workspace/tasks`
- **Admin:** Lists all farm tasks, ability to create, edit, assign, and delete tasks.
- **Worker:** Lists only tasks assigned to them, can update task status and add notes.

### `/workspace/tasks/[id]`
- **Admin:** Sees all details for any farm task, can change assignment and details.
- **Worker:** Can view only tasks assigned to them; limited to status and notes update.

### `/workspace/fields`
- **Admin:** Can create, edit, and delete fields; see current and historical data for all fields.
- **Worker:** Can only view list/read field info; no edit or CRUD options.

### `/workspace/fields/[id]`
- **Admin:** Can manage field details, link to crop history and edit data.
- **Worker:** Can only read field details and follow history link.

### `/workspace/fields/[id]/history`
- **Both Roles:** Either role can view full crop/field history and timelines.

### `/workspace/weather`
- **Both Roles:** Both see weather widget, forecasts, and alerts for the farm location(s).

### `/admin/workers`
- **Admin Only:** Manage all farm workers, invite, edit roles, remove workers, see/join farm codes.

### `/admin/settings`
- **Admin Only:** Change farm configuration, preferences, update settings.

### `/admin/analytics`
- **Admin Only:** Full analytics dashboard with charts, statistics, and farm reports.

### `/profile`
- **Both Roles:** Edit personal info, change password, view account details.

---

## ⚡ Summary

- Each route matches your role-based access model.
- **Shared routes** have conditional displays—always check `user.role` and render proper component/content.
- **Admin-only routes** are hidden or access-blocked from workers by middleware and navigation.

**Use this file for clear implementation, design, QA, and role-based logic development.**


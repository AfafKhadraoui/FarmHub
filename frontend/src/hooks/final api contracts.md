# 🌾 FarmHub - Full API Contract v2.0 (Sprint 2 ✅, Dashboard & Platform Admin Included)

**Respecting API design, error formats, pagination, security, dashboard, and authentication from**  
`API-ENDPOINTS-SPECIFICATION.md`, `DASHBOARD-BACKEND-INTEGRATION.md`, and `BACKEND-INTEGRATION-CHECKLIST.md`

---

## 📋 Table of Contents

1. Security & Conventions
2. Authentication
3. Core App Business APIs (fields, tasks, workers, weather, analytics, settings, profile)
4. Platform Admin & Dashboard APIs (platform reports, search, notifications, analytics)
5. Error Format
6. Pagination Format
7. Environment Variables
8. Security Checklist

---

## 1. 🔒 Security & Conventions

- **JWT**: HS256, `Authorization: Bearer <token>` sent on all requests
- **Role-based**: `role` field checked in JWT, endpoints protected per role
- **All times:** ISO 8601 (`2025-11-24T10:30:00Z`)
- **Rate limiting:** 100 requests / 15 min / IP
- **Error/Response Shape:** Always `{ success, data?, error?, code?, details? }`
- **Pagination:** `{ data: [ ... ], pagination: { total, page, limit, totalPages } }`
- **Farm Code:** `FARM-` + [A-Z2-9]{6}
- **Platform admin:** `role: platformadmin`, `farmId: null`

---

## 2. Authentication API

### Admin Registration (`/api/auth/register`)
- **POST**
- **Body:**  
  `{ "role": "admin", "name": "...", "email": "...", "password": "...", "farmName": "...", "location": "...", "phone": "..." }`
- **Response:**  
  `{ "success": true, "data": { "userId": 1, "farmId": 5, "joinCode": "FARM-XYZ789", "token": "...", "refreshToken": "...", "expiresIn": 3600 } }`

### Worker Registration (`/api/auth/register`)
- **POST**  
  `{ "role": "worker", "name": "...", "email": "...", "password": "...", "joinCode": "FARM-XYZ789", ... }`
- **Response:** As above, with `"farmName": ...`

### Login (`/api/auth/login`)
- **POST**  
  `{ "email": "...", "password": "..." }`
- **Response:**  
  `{ "success": true, "data": { "userId":..., "role":..., "farmId"..., "token": "...", "refreshToken": "...", "expiresIn": 3600 }}`

### Refresh Token (`/api/auth/refresh-token`)
- **POST**  
  `{ "refreshToken": "..." }`
- **Response:**  
  `{ "success": true, "data": { "token": "...", "expiresIn": 3600 } }`

### Logout (`/api/auth/logout`)
- **POST** (Header: `Authorization: Bearer <token>`)
- **Body:** `{ "refreshToken": "..." }`
- **Response:** `{ "success": true, "message": "Logout successful" }`

### Regenerate Farm Code (Admin) (`/api/auth/regenerate-code`)
- **POST** (Admin only)
- **Response:**  
  `{ "success": true, "data": { "joinCode": "FARM-NEW111", "oldCode": "FARM-XYZ789", "regeneratedAt": "..." } }`

### Platform Admin Registration (`/api/auth/register-platform-admin`)
- **POST**
- **Header:** `X-Admin-Secret: SUPERSECRET`
- **Body:** `{ "role": "platform_admin", "name": "...", "email": "...", "password": "..." }`
- **Response:** As login, with `role: "platform_admin", "farmId": null`

### Get Profile (`/api/auth/profile`)
- **GET** (JWT required)
- **Response:**  
  `{ "success": true, "data": { ...userFields..., "farm": { ... } } }`

---

## 3. Core App Business APIs

### Fields

#### List fields (`/api/fields`)
- **Admin:** All farm fields
- **Worker:** Only fields with at least one assigned task
- **GET**  
- **Response:** Array of field objects (see above examples), including cropType, status, size, etc.

#### Field detail (`/api/fields/:id`)
- **GET**  
- **Response:** Full field info + (optionally) current/previous crops

#### Field history (`/api/fields/:id/history`)
- **GET**  
- **Response:** Array of field historical state objects

---

### Tasks

#### List tasks (`/api/tasks`)
- **Admin:** All tasks in the farm
- **Worker:** Only assigned tasks
- **GET**  
- **Response:** Array of tasks; each task includes assignedWorkers (userId/name), field, dueDate, status

#### Task CRUD (`/api/tasks`, `/api/tasks/:id`)
- **POST** (Admin only, assign workers at creation)
- **PUT** (Admin edits any, worker can only update own `status`/`notes`)
- **DELETE** (Admin only)

#### Task Assignment (`/api/tasks/:id/assignments`)
- **POST** (Admin can assign/change workers)

---

### Workers

#### List workers (`/api/workers`)
- **GET** (Admin only)
- **Response:** Array of users `{ id, name, email, phone, role }`

#### Worker CRUD (`/api/workers/:id`)
- **GET**/**PUT**/**DELETE** (Admin only)

---

### Weather

**GET** `/api/weather?farmId=...`
- **Both roles**
- **Response:**  
  `{ "location": "...", "forecast": [ { "date": "...", "temp": 19, "icon": "...", ... } ] }`

---

### Analytics

**GET** `/api/analytics`
- **Admin only**
- **Response:**  
  `{ "tasksCompleted": ..., "fieldsActive": ..., "workerStats": [...], ... }`

---

### Settings & Profile

**GET** `/api/settings` (Admin only)
- Farm preferences config, codes, etc.

**GET/PUT** `/api/profile`
- User's account info for either role (`/api/profile` → own info, `/api/profile` PATCH/PUT → update own info)

---

## 4. Platform Admin & Dashboard APIs

### Dashboard Metrics (`/admin/metrics`)
- **GET** (platform admin only)
- **Response:**  
  `{ "totalFarms": 523, "totalUsers": 12847, "totalTasks": 45621, ... }`

### Recent Farms (`/admin/farms/recent`)
- **GET** `?limit=5`
- **Response:**  
  List of `{ id, name, owner, ownerEmail, location, workers, fields, createdAt }`

### Farm Growth (`/admin/analytics/farm-growth`)
- **GET** `?months=6`
- **Response:**  
  List of `{ "month": "Nov", "farms": 128 }`

### Recent Activities (`/admin/activities`)
- **GET** `?limit=10`
- **Response:**  
  List of `{ id, type, title, message, timestamp, metadata: { farmId, userId } }`

### Notifications (`/admin/notifications`)
- **GET**: all, filter by `unreadOnly` param  
- **PATCH** `/admin/notifications/{id}/read`: mark one as read  
- **PATCH** `/admin/notifications/read-all`: mark all as read  
- **DELETE** `/admin/notifications/{id}`: delete  
- **Response:** JSON array of notification objects

### Platform Profile (`/admin/profile`)
- **GET**: current profile  
- **PATCH**: update `{ name, phone, bio }`  
- **POST** `/admin/profile/avatar`: multipart upload `{ avatar: <file> }` (JPEG/PNG/WebP, max 5MB)  
- **Response:** profile JSON (with `avatarUrl` if uploaded)

### Search (`/admin/search`)
- **GET** `?q=something&type=farms|users|all`
- **Response:**  
  Farms: `{ id, name, location, owner }`  
  Users: `{ id, name, email, role }`

### Users & Farms (Paginated Lists)
- **GET** `/admin/farms?page=1&limit=10&search=...`  
  - Response: `{ data: [...farms...], pagination: { total, page, limit, totalPages } }`
- **GET** `/admin/users?page=1&limit=10&role=worker|admin|platformadmin&farmId=...&search=...`
  - Response: as above, with user details

---

## 5. Error Format

All errors:
{
"success": false,
"error": "Human-readable message",
"code": "ERROR_CODE",
"details": { /* field-specific/validation details */ }
}

text
- Common codes: VALIDATION_ERROR, EMAIL_EXISTS, INSUFFICIENT_PERMISSIONS, INVALID_FARM_CODE, TOKEN_EXPIRED, RATE_LIMIT_EXCEEDED, INTERNAL_SERVER_ERROR
- Status codes: 400, 401, 403, 404, 409, 429, 500

---

## 6. Pagination Format (for lists)

{
"data": [ ...items... ],
"pagination": {
"total": 523,
"page": 1,
"limit": 10,
"totalPages": 53
}
}

text

---

## 7. Environment Variables

JWT_SECRET=...
JWT_REFRESH_SECRET=...
PLATFORM_ADMIN_SECRET=...
DATABASE_URL=postgres://user:pw@localhost:5432/farm_db
PORT=5000
BCRYPT_ROUNDS=10
TOKEN_EXPIRY=3600
REFRESH_TOKEN_EXPIRY=604800
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100

text

---

## 8. Security Checklist

- [x] Enforce HTTPS, JWT validation, rate limits
- [x] Only platformadmin sees `/admin/*`
- [x] Pagination on all list endpoints
- [x] All profile/farm/user/task/field actions check user role
- [x] Error responses always follow agreed shape
- [x] All date/timestamps ISO 8601
- [x] Real data ready for dashboard, profile, analytics, activity, farms, users, notifications
- [x] Token stored in memory (frontend), refresh in httpOnly cookie

---

**Status:** PRODUCTION READY  
_Last update: 2025-11-24_
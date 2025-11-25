# 🌾 FarmHub - Full API Contract v2.0 (Sprint 2 Ready)

## 📋 Table of Contents

1. Security Implementation
2. Authentication APIs
    - Admin Registration (Create Farm)
    - Worker Registration (Join Farm)
    - Login (All Roles)
    - Refresh Token
    - Logout
    - Regenerate Farm Code (Admin Only)
    - Platform Admin Registration
    - Get Profile
    - Error Responses
3. Main Feature APIs (CRUD, Role Filtering)
    - Fields
    - Tasks
    - Task Assignment
    - Workers
    - Weather
    - Analytics
    - Settings/Profile
4. Environment Variables
5. Security Checklist

---

## 1. 🔒 Security Implementation

- Passwords: bcrypt (10 rounds), min 8 chars, at least 1 uppercase & number
- JWT: HS256, Access: 1hr, Refresh: 7 days, memory/sessionStorage (access), HttpOnly cookie (refresh)
- Auth Header: `Authorization: Bearer <token>`
- Farm Code: `FARM-` + [A-Z2-9]{6}, database-unique, regenerated when needed

---

## 2. Authentication APIs

### Admin Registration (Create Farm)
**POST** `/api/auth/register`

Request:
{
"role": "admin",
"name": "John Doe",
"email": "john@example.com",
"password": "SecurePass123",
"phone": "1234567890",
"farmName": "Doe Farms",
"location": "Springfield, USA"
}

text
Response:
{
"success": true,
"data": {
"userId": 12,
"farmId": 5,
"joinCode": "FARM-ABC123",
"token": "<accessToken>",
"refreshToken": "<refreshToken>",
"expiresIn": 3600
}
}

text

---

### Worker Registration (Join Farm)
**POST** `/api/auth/register`

Request:
{
"role": "worker",
"name": "Jane Smith",
"email": "jane@example.com",
"password": "WorkerPass456",
"phone": "0987654321",
"joinCode": "FARM-ABC123"
}

text
Response:
{
"success": true,
"data": {
"userId": 25,
"farmId": 5,
"farmName": "Doe Farms",
"token": "<accessToken>",
"refreshToken": "<refreshToken>",
"expiresIn": 3600
}
}

text
Notes:
- Workers auto-approved upon registration

---

### Login (All Roles)
**POST** `/api/auth/login`

Request:
{
"email": "user@example.com",
"password": "userpassword"
}

text
Response:
{
"success": true,
"data": {
"userId": 12,
"role": "admin",
"farmId": 5,
"farmName": "Doe Farms",
"token": "<accessToken>",
"refreshToken": "<refreshToken>",
"expiresIn": 3600
}
}

text
JWT Payload:
{
"userId": 12,
"email": "john@example.com",
"role": "admin",
"farmId": 5,
"iat": 1700003600,
"exp": 1700007200
}

text

---

### Refresh Token
**POST** `/api/auth/refresh-token`
Request:
{ "refreshToken": "<refreshToken>" }

text
Response:
{
"success": true,
"data": {
"token": "<newAccessToken>",
"expiresIn": 3600
}
}

text

---

### Logout
**POST** `/api/auth/logout`
Header: `Authorization: Bearer <accessToken>`
Request:
{ "refreshToken": "<refreshToken>" }

text
Response:
{ "success": true, "message": "Logout successful" }

text

---

### Regenerate Farm Code (Admin Only)
**POST** `/api/auth/regenerate-code`
Header: `Authorization: Bearer <adminAccessToken>`
Response:
{
"success": true,
"data": {
"joinCode": "FARM-XYZ789",
"oldCode": "FARM-ABC123",
"regeneratedAt": "2025-11-16T14:30:00Z"
}
}

text
Notes:
- Old code invalidated, only admin can regenerate

---

### Platform Admin Registration
**POST** `/api/auth/register-platform-admin`
Header: `X-Admin-Secret: <PLATFORM_ADMIN_SECRET_KEY>`
Request:
{
"role": "platform_admin",
"name": "Super Admin",
"email": "admin@platform.com",
"password": "SuperSecure789"
}

text
Response:
{
"success": true,
"message": "Platform admin registered successfully",
"data": {
"userId": 99,
"role": "platform_admin",
"token": "<accessToken>",
"refreshToken": "<refreshToken>",
"expiresIn": 3600
}
}

text
Notes:
- Platform admin has access to all farms; no farmId linked

---

### Get Profile
**GET** `/api/auth/profile`
Header: `Authorization: Bearer <accessToken>`
Response:
{
"success": true,
"data": {
"id": 12, "name": "John Doe", "email": "john@example.com", "phone": "1234567890",
"role": "admin", "farmId": 5, "createdAt": "...",
"farm": { "id": 5, "name": "Doe Farms", "location": "...", "joinCode": "FARM-ABC123" }
}
}

text

---

### Error Responses Example
All error responses:
{
"success": false,
"error": "Error message",
"code": "ERROR_CODE",
"details": {}
}

text
Common errors: `VALIDATION_ERROR`, `EMAIL_EXISTS`, `INSUFFICIENT_PERMISSIONS`, `INVALID_FARM_CODE`, `RATE_LIMIT_EXCEEDED`, `TOKEN_EXPIRED`

---

## 3. Main Feature APIs (CRUD, Role Filtering)

### Fields
**GET** `/api/fields`
- **Admin:** returns all fields in farm
- **Worker:** only fields related to worker's assigned tasks
Response:
[
{
"id": 5,
"name": "North Field",
"size": 3.1,
"cropType": "Wheat",
"status": "growing", // "idle" | "planted" | "growing" | "harvesting"
"plantedDate": "2025-10-10",
"harvestDate": "2025-12-15",
"active": true,
"historyAvailable": true
}
]

text

**GET** `/api/fields/:id` (same role filtering)
**GET** `/api/fields/:id/history` (history data for the field)

---

### Tasks
**GET** `/api/tasks`
- **Admin:** all farm tasks
- **Worker:** only assigned tasks
Response:
[
{
"id": 21,
"title": "Water North Field",
"status": "pending",
"priority": "high",
"dueDate": "2025-11-28T09:00:00Z",
"field": { "id": 5, "name": "North Field" },
"assignedWorkers": [{ "id": 2, "name": "Ahmed" }],
"notes": "Add fertilizer after"
}
]

text
**POST** `/api/tasks` (admin only, assign workerIds)
**PUT** `/api/tasks/:id` (admin edits everything, worker only updates status/notes)

---

### Task Assignment
**POST** `/api/tasks/:id/assignments` (admin only, update assigned workers)
**GET** `/api/task_assignments` (admin only, or analytics/stats)

---

### Workers
**GET** `/api/workers` (admin only, list/search/add workers)
**GET** `/api/workers/:id` (admin only, view/edit/remove worker)

---

### Weather
**GET** `/api/weather?farmId=...`
Response:
{
"location": "Algiers, Algeria",
"forecast": [
{ "date": "2025-11-25", "temp": 15, "icon": "cloud", "description": "Partly cloudy" }
]
}

text

---

### Analytics
**GET** `/api/analytics` (admin only)
Response:
{
"tasksCompleted": 19,
"fieldsActive": 7,
"workerStats": [{ "worker": "Ahmed", "tasks": 10 }],
"charts": { /* ... */ }
}

text

---

### Settings/Profile
**GET** `/api/settings` (admin only)
**GET** `/api/profile` (any user, returns own info as above)

---

## 4. Environment Variables

JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
PLATFORM_ADMIN_SECRET=your-platform-admin-secret-key
DATABASE_URL=postgres://user:password@localhost:5432/farm_db
PORT=3000
BCRYPT_ROUNDS=10
TOKEN_EXPIRY=3600
REFRESH_TOKEN_EXPIRY=604800
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100

text

---

## 5. Security Checklist

- Strong JWT secrets (32+ chars)
- HTTPS-only
- Rate limiting
- HttpOnly for refresh tokens
- Password complexity enforced
- Blacklist refresh tokens on logout
- Role validation for all CRUD
- CSRF protection (for cookies)
- Logging of auth events
- Account lockout after failed attempts
- No farm code leakage or reuse
- Dev-only endpoints protected, disabled in prod

---

**Document Version:** 2.0  
**Last Updated:** November 24, 2025  
**Status:** Production Ready ✅

---
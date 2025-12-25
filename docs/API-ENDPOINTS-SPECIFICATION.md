# 🔌 Admin Dashboard API Endpoints Specification

This document defines all the backend API endpoints required for the Admin Dashboard.

---

## 🔐 Authentication

All endpoints require:

- **Header**: `Authorization: Bearer <JWT_TOKEN>`
- **Role**: `platform_admin` (checked via JWT payload)

If unauthorized, return:

```json
{ "error": "Unauthorized", "code": 401 }
```

If forbidden (not platform_admin):

```json
{ "error": "Access denied. Platform admin only.", "code": 403 }
```

---

## 📊 Dashboard Endpoints

### **GET /admin/metrics**

Get aggregate statistics for dashboard cards.

**Response:**

```json
{
  "totalFarms": 523,
  "totalUsers": 12847,
  "totalTasks": 45621,
  "totalFields": 6789,
  "farmsToday": 12,
  "usersToday": 89,
  "tasksToday": 1234,
  "fieldsToday": 45
}
```

**SQL Queries:**

```sql
-- Total counts
SELECT COUNT(*) FROM farms;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM tasks;
SELECT COUNT(*) FROM fields WHERE active = true;

-- Today's counts (created >= today at 00:00:00)
SELECT COUNT(*) FROM farms WHERE created_at >= CURRENT_DATE;
SELECT COUNT(*) FROM users WHERE created_at >= CURRENT_DATE;
SELECT COUNT(*) FROM tasks WHERE created_at >= CURRENT_DATE;
SELECT COUNT(*) FROM fields WHERE created_at >= CURRENT_DATE AND active = true;
```

---

### **GET /admin/analytics/farm-growth**

Get monthly farm growth data for chart.

**Query Params:**

- `months` (optional): Number of months to fetch (default: 6)

**Response:**

```json
[
  { "month": "Jun", "farms": 45 },
  { "month": "Jul", "farms": 62 },
  { "month": "Aug", "farms": 78 },
  { "month": "Sep", "farms": 95 },
  { "month": "Oct", "farms": 112 },
  { "month": "Nov", "farms": 128 }
]
```

**SQL Query:**

```sql
SELECT
  TO_CHAR(created_at, 'Mon') as month,
  COUNT(*) as farms
FROM farms
WHERE created_at >= NOW() - INTERVAL '6 months'
GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
ORDER BY DATE_TRUNC('month', created_at);
```

---

### **GET /admin/farms/recent**

Get recently created farms.

**Query Params:**

- `limit` (optional): Number of farms to return (default: 5)

**Response:**

```json
[
  {
    "id": 123,
    "name": "Green Valley Farm",
    "owner": "Ahmed Hassan",
    "ownerEmail": "ahmed@email.com",
    "location": "Cairo, Egypt",
    "workers": 12,
    "fields": 8,
    "createdAt": "2024-11-20T14:30:00Z"
  }
]
```

**SQL Query:**

```sql
SELECT
  f.id,
  f.name,
  f.location,
  u.name as owner,
  u.email as owner_email,
  (SELECT COUNT(*) FROM users WHERE farm_id = f.id AND role = 'worker') as workers,
  (SELECT COUNT(*) FROM fields WHERE farm_id = f.id AND active = true) as fields,
  f.created_at
FROM farms f
LEFT JOIN users u ON f.id = u.farm_id AND u.role = 'admin'
ORDER BY f.created_at DESC
LIMIT 5;
```

---

### **GET /admin/activities**

Get recent platform activities.

**Query Params:**

- `limit` (optional): Number of activities (default: 10)

**Response:**

```json
[
  {
    "id": "act-1",
    "type": "farm_created",
    "title": "New Farm Created",
    "message": "Green Valley Farm was created by Ahmed Hassan",
    "timestamp": "2024-11-23T10:30:00Z",
    "metadata": {
      "farmId": 123,
      "userId": 456
    }
  },
  {
    "id": "act-2",
    "type": "user_registered",
    "title": "New User Registered",
    "message": "5 new workers joined Riverside Farm",
    "timestamp": "2024-11-23T09:15:00Z",
    "metadata": {
      "farmId": 89,
      "count": 5
    }
  }
]
```

**Implementation**: Create an `activities` table or generate from farms/users/tasks events.

---

## 👤 Profile Endpoints

### **GET /admin/profile**

Get authenticated platform admin's profile.

**Response:**

```json
{
  "id": 1,
  "name": "Dev Team",
  "email": "dev@farmhub.com",
  "role": "platform_admin",
  "phone": "+1234567890",
  "bio": "Managing FarmHub platform and ensuring smooth operations.",
  "avatarUrl": "https://storage.example.com/avatars/admin-1.jpg",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**SQL Query:**

```sql
SELECT id, name, email, role, phone, bio, avatar_url, created_at
FROM users
WHERE id = ? AND role = 'platform_admin';
```

---

### **PATCH /admin/profile**

Update platform admin's profile.

**Request Body:**

```json
{
  "name": "New Name",
  "phone": "+9876543210",
  "bio": "Updated bio"
}
```

**Validation:**

- `name`: Optional, string, 3-100 characters
- `phone`: Optional, valid phone format
- `bio`: Optional, string, max 500 characters

**Response:**

```json
{
  "id": 1,
  "name": "New Name",
  "email": "dev@farmhub.com",
  "role": "platform_admin",
  "phone": "+9876543210",
  "bio": "Updated bio",
  "avatarUrl": "https://...",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**SQL Query:**

```sql
UPDATE users
SET
  name = ?,
  phone = ?,
  bio = ?,
  updated_at = NOW()
WHERE id = ? AND role = 'platform_admin'
RETURNING *;
```

---

### **POST /admin/profile/avatar**

Upload profile avatar.

**Request:**

- Content-Type: `multipart/form-data`
- Field name: `avatar`
- Allowed formats: JPEG, PNG, WebP
- Max size: 5MB

**Response:**

```json
{
  "avatarUrl": "https://storage.example.com/avatars/admin-1.jpg",
  "message": "Avatar uploaded successfully"
}
```

**Implementation:**

1. Validate file type and size
2. Upload to cloud storage (AWS S3, Cloudinary, etc.)
3. Update user's `avatar_url` in database
4. Return new URL

---

## 🔔 Notification Endpoints

### **GET /admin/notifications**

Get all notifications for platform admin.

**Query Params:**

- `unreadOnly` (optional): boolean, filter unread only

**Response:**

```json
[
  {
    "id": "notif-123",
    "type": "farm",
    "title": "New Farm Created",
    "message": "A new farm 'Sunset Valley' has been registered by ahmed@email.com",
    "timestamp": "2024-11-23T10:30:00Z",
    "isRead": false
  },
  {
    "id": "notif-124",
    "type": "user",
    "title": "User Milestone",
    "message": "Platform reached 1,000 registered users!",
    "timestamp": "2024-11-23T09:00:00Z",
    "isRead": true
  }
]
```

**Database**: Create `notifications` table:

```sql
CREATE TABLE notifications (
  id VARCHAR(50) PRIMARY KEY,
  user_id INT REFERENCES users(id),
  type VARCHAR(20),
  title VARCHAR(255),
  message TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);
```

---

### **PATCH /admin/notifications/:id/read**

Mark a notification as read.

**Response:**

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

**SQL Query:**

```sql
UPDATE notifications
SET is_read = TRUE
WHERE id = ? AND user_id = ?;
```

---

### **PATCH /admin/notifications/read-all**

Mark all notifications as read.

**Response:**

```json
{
  "success": true,
  "message": "All notifications marked as read",
  "count": 12
}
```

**SQL Query:**

```sql
UPDATE notifications
SET is_read = TRUE
WHERE user_id = ? AND is_read = FALSE;
```

---

### **DELETE /admin/notifications/:id**

Delete a notification.

**Response:**

```json
{
  "success": true,
  "message": "Notification deleted"
}
```

**SQL Query:**

```sql
DELETE FROM notifications
WHERE id = ? AND user_id = ?;
```

---

## 🌾 Farm Management Endpoints

### **GET /admin/farms**

Get all farms with pagination.

**Query Params:**

- `page` (default: 1)
- `limit` (default: 10)
- `search` (optional): Search by farm name or location

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Green Valley Farm",
      "owner": "Ahmed Hassan",
      "email": "ahmed@email.com",
      "location": "Cairo, Egypt",
      "workers": 12,
      "fields": 8,
      "tasks": 45,
      "createdAt": "2024-11-20T14:30:00Z",
      "status": "active"
    }
  ],
  "pagination": {
    "total": 523,
    "page": 1,
    "limit": 10,
    "totalPages": 53
  }
}
```

---

### **GET /admin/farms/:id**

Get detailed information about a specific farm.

**Response:**

```json
{
  "id": 1,
  "name": "Green Valley Farm",
  "location": "Cairo, Egypt",
  "joinCode": "FARM-ABC123",
  "createdAt": "2024-11-20T14:30:00Z",
  "owner": {
    "id": 5,
    "name": "Ahmed Hassan",
    "email": "ahmed@email.com"
  },
  "workers": [{ "id": 10, "name": "Worker 1", "email": "worker1@email.com" }],
  "fields": [
    {
      "id": 20,
      "name": "North Field",
      "size": 5.5,
      "cropType": "Wheat",
      "status": "growing"
    }
  ],
  "stats": {
    "totalWorkers": 12,
    "totalFields": 8,
    "activeTasks": 15,
    "completedTasks": 30
  }
}
```

---

## 👥 User Management Endpoints

### **GET /admin/users**

Get all users with filters.

**Query Params:**

- `page` (default: 1)
- `limit` (default: 10)
- `role` (optional): Filter by role (admin, worker, platform_admin)
- `farmId` (optional): Filter by farm
- `search` (optional): Search by name or email

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Ahmed Hassan",
      "email": "ahmed@email.com",
      "role": "admin",
      "farm": "Green Valley Farm",
      "farmId": 10,
      "phone": "+1234567890",
      "createdAt": "2024-01-15T00:00:00Z",
      "status": "active"
    }
  ],
  "pagination": {
    "total": 12847,
    "page": 1,
    "limit": 10,
    "totalPages": 1285
  }
}
```

---

### **GET /admin/users/:id**

Get detailed user information.

**Response:**

```json
{
  "id": 1,
  "name": "Ahmed Hassan",
  "email": "ahmed@email.com",
  "role": "admin",
  "phone": "+1234567890",
  "farm": {
    "id": 10,
    "name": "Green Valley Farm",
    "location": "Cairo, Egypt"
  },
  "createdAt": "2024-01-15T00:00:00Z",
  "stats": {
    "tasksAssigned": 45,
    "tasksCompleted": 38,
    "fieldsManaged": 8
  }
}
```

---

## 📈 Analytics Endpoints

### **GET /admin/analytics**

Get comprehensive analytics data.

**Response:**

```json
{
  "userGrowth": [
    { "month": "Jun", "users": 234 },
    { "month": "Jul", "users": 456 }
  ],
  "taskVolume": [
    { "month": "Jun", "tasks": 1234 },
    { "month": "Jul", "tasks": 1567 }
  ],
  "activeFarms": [
    { "farm": "Green Valley", "tasks": 45 },
    { "farm": "Riverside", "tasks": 38 }
  ],
  "userDistribution": [
    { "name": "Farm Owners", "value": 523 },
    { "name": "Workers", "value": 12324 }
  ],
  "topLocations": [
    { "location": "Cairo", "farms": 120 },
    { "location": "Alexandria", "farms": 95 }
  ]
}
```

---

## 🔍 Search Endpoint

### **GET /admin/search**

Global search across farms and users.

**Query Params:**

- `q`: Search query (required)
- `type` (optional): 'farms' or 'users' or 'all' (default: 'all')

**Response:**

```json
{
  "farms": [
    {
      "id": 1,
      "name": "Green Valley Farm",
      "location": "Cairo",
      "owner": "Ahmed Hassan"
    }
  ],
  "users": [
    {
      "id": 5,
      "name": "Ahmed Hassan",
      "email": "ahmed@email.com",
      "role": "admin"
    }
  ]
}
```

---

## 🚨 Error Responses

All endpoints should return consistent error format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Validation error details"
  }
}
```

**Common Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (not platform_admin)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🧪 Testing with Postman/Thunder Client

### Example: Get Dashboard Metrics

```
GET http://localhost:5000/admin/metrics
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Example: Update Profile

```
PATCH http://localhost:5000/admin/profile
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
Body:
{
  "name": "New Admin Name",
  "bio": "Updated bio text"
}
```

---

## 📋 Implementation Priority

1. **Phase 1 (Critical):**

   - GET /admin/metrics
   - GET /admin/profile
   - PATCH /admin/profile

2. **Phase 2 (Important):**

   - GET /admin/farms
   - GET /admin/users
   - GET /admin/notifications
   - PATCH /admin/notifications/:id/read

3. **Phase 3 (Nice to Have):**
   - GET /admin/analytics
   - POST /admin/profile/avatar
   - GET /admin/search
   - DELETE /admin/notifications/:id

---

**All endpoints are already defined in `frontend/src/services/adminService.ts` 🎯**

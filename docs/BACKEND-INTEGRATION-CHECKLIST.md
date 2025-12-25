# Backend Integration Checklist for Admin Dashboard

## ✅ ALREADY BACKEND-READY

### 1. **API Service Layer** (`src/lib/api.ts`)

- ✅ Axios instance configured with base URL
- ✅ Request interceptor adds JWT token
- ✅ Response interceptor handles 401 errors
- ✅ Environment variable support for API URL

### 2. **Admin Service** (`src/services/adminService.ts`)

- ✅ Complete TypeScript interfaces matching backend schema
- ✅ All dashboard API endpoints defined
- ✅ Error handling implemented
- ✅ Follows REST conventions

### 3. **Authentication**

- ✅ Middleware protects /admin routes
- ✅ Token-based authentication
- ✅ Role-based access (platform_admin)

### 4. **Routing Structure**

- ✅ Proper Next.js App Router structure
- ✅ Separate routes for each page
- ✅ Clean URL structure

---

## 🔧 NEEDS BACKEND INTEGRATION

### Components Using Mock Data:

#### 1. **Dashboard Overview** (`page.tsx`)

**Current:** Hardcoded stats

```tsx
<MetricCard value="523" label="Farms" change="+12 today" />
```

**Needs:**

- Hook to fetch `adminService.getMetrics()`
- Loading states
- Error handling

---

#### 2. **Profile Page** (`MyProfilePage.tsx`)

**Current:** Local state with hardcoded data

```tsx
const [profileData] = useState({
  name: "Dev Team",
  email: "dev@farmhub.com",
  role: "Platform Admin",
});
```

**Needs:**

- Fetch from `GET /admin/profile`
- Update via `PATCH /admin/profile`
- Avatar upload via `POST /admin/profile/avatar`

---

#### 3. **Notifications** (`NotificationsPage.tsx`)

**Current:** Local state array

```tsx
const [notifications, setNotifications] = useState<Notification[]>([...])
```

**Needs:**

- Fetch from `GET /admin/notifications`
- Mark as read: `PATCH /admin/notifications/:id/read`
- Delete: `DELETE /admin/notifications/:id`

---

#### 4. **Top Bar**

**Current:** Hardcoded unread count and user info

```tsx
const unreadCount = 2; // Hardcoded
```

**Needs:**

- Real-time notification count
- User info from auth context/store
- WebSocket for live updates (optional)

---

#### 5. **Farm Growth Chart** (`FarmGrowthChart.tsx`)

**Current:** Mock data for chart

```tsx
const data = [
  { month: "Jan", farms: 45, users: 234 },
  // ...
];
```

**Needs:**

- Fetch from `GET /admin/analytics/farm-growth`
- Loading skeleton
- Empty state handling

---

#### 6. **Recent Farms Table** (`RecentFarmsTable.tsx`)

**Current:** Mock farm data

```tsx
const farms = [
  { name: "Green Valley Farm", owner: "Ahmed Hassan", ... },
  // ...
]
```

**Needs:**

- Fetch from `GET /admin/farms/recent?limit=5`
- Click to view farm details
- Refresh capability

---

#### 7. **Activity Feed** (`ActivityFeed.tsx`)

**Current:** Static activity list

```tsx
const activities = [
  { type: "farm", message: "...", ... },
  // ...
]
```

**Needs:**

- Fetch from `GET /admin/activities`
- Real-time updates (polling or WebSocket)
- Pagination for "Load More"

---

## 📋 BACKEND ENDPOINTS REQUIRED

### Dashboard

- `GET /admin/metrics` - Dashboard statistics
- `GET /admin/analytics/farm-growth` - Chart data
- `GET /admin/farms/recent` - Recent farms
- `GET /admin/activities` - Activity feed

### Farms

- `GET /admin/farms?page=1&limit=10` - All farms with pagination
- `GET /admin/farms/:id` - Single farm details
- `DELETE /admin/farms/:id` - Delete farm (if needed)

### Users

- `GET /admin/users?page=1&limit=10&role=admin` - All users with filters
- `GET /admin/users/:id` - Single user details
- `PATCH /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user

### Profile

- `GET /admin/profile` - Get admin profile
- `PATCH /admin/profile` - Update profile
- `POST /admin/profile/avatar` - Upload avatar

### Notifications

- `GET /admin/notifications` - Get all notifications
- `PATCH /admin/notifications/:id/read` - Mark as read
- `PATCH /admin/notifications/read-all` - Mark all as read
- `DELETE /admin/notifications/:id` - Delete notification

### Analytics

- `GET /admin/analytics` - Full analytics data
- `GET /admin/analytics/user-growth` - User growth chart
- `GET /admin/analytics/task-volume` - Task volume data

---

## 🔐 SECURITY REQUIREMENTS

1. **JWT Token Validation**

   - Verify token on every admin request
   - Check `role === 'platform_admin'`
   - Return 403 if not authorized

2. **Input Validation**

   - Validate all request bodies
   - Sanitize inputs to prevent SQL injection
   - Use Zod or Joi for validation

3. **Rate Limiting**

   - Limit API requests per IP/user
   - Prevent abuse of dashboard endpoints

4. **CORS Configuration**
   - Allow frontend domain only
   - Set proper headers

---

## 🎯 IMPLEMENTATION PRIORITY

### Phase 1: Critical (Implement First)

1. Dashboard metrics endpoint
2. Profile endpoints (GET/PATCH)
3. Authentication middleware
4. Farms list endpoint

### Phase 2: Important

1. Analytics endpoints
2. Notifications CRUD
3. Activity feed
4. User management endpoints

### Phase 3: Nice to Have

1. Real-time notifications (WebSocket)
2. Avatar upload with file storage
3. Export functionality
4. Advanced filtering

---

## 📦 EXPECTED DATA FORMATS

### Dashboard Metrics Response

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

### Profile Response

```json
{
  "id": 1,
  "name": "Dev Team",
  "email": "dev@farmhub.com",
  "role": "platform_admin",
  "phone": "+123456789",
  "bio": "Managing FarmHub platform",
  "avatarUrl": "https://...",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Notification Response

```json
[
  {
    "id": "notif-123",
    "type": "farm",
    "title": "New Farm Created",
    "message": "A new farm 'Sunset Valley' has been registered",
    "timestamp": "2024-11-23T10:30:00Z",
    "isRead": false
  }
]
```

---

## 🧪 TESTING CHECKLIST

- [ ] Test all API endpoints with Postman/Thunder Client
- [ ] Verify JWT token validation
- [ ] Test pagination on list endpoints
- [ ] Test error responses (401, 403, 404, 500)
- [ ] Verify CORS is working
- [ ] Test with invalid/expired tokens
- [ ] Load test with multiple concurrent requests
- [ ] Test avatar upload file size limits

---

## 📝 NOTES FOR BACKEND TEAM

1. **Database Schema is Ready** - Use the Prisma schema in `backend/prisma-schema.prisma`

2. **User Role** - Platform admins have `role = 'platform_admin'` and `farmId = NULL`

3. **Timestamps** - Return ISO 8601 format: `2024-11-23T10:30:00Z`

4. **Pagination** - Use standard format:

   ```json
   {
     "data": [...],
     "total": 100,
     "page": 1,
     "limit": 10,
     "totalPages": 10
   }
   ```

5. **Error Format** - Use consistent error structure:
   ```json
   {
     "error": "Error message",
     "code": "ERROR_CODE",
     "details": {...}
   }
   ```

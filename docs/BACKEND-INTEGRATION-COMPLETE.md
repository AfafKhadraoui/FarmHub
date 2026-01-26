# Admin Dashboard Backend Integration - Complete Guide

## ✅ Integration Status

The admin dashboard frontend is now **fully integrated** with the backend APIs. All components are fetching real data from the backend.

## 🔗 What's Been Connected

### 1. Dashboard Metrics (Main Page)

**Frontend Hook:** `useDashboardMetrics`
**Backend Endpoint:** `GET /admin/metrics`
**Data Displayed:**

- Total Farms & today's new farms
- Total Users & today's new users
- Total Tasks & today's new tasks
- Total Fields & today's new fields

**Component:** `page.tsx` now uses real-time data with loading states and error handling

### 2. Recent Farms Table

**Frontend Hook:** `useRecentFarms`
**Backend Endpoint:** `GET /admin/farms/recent`
**Data Displayed:**

- Farm name
- Owner name
- Location
- Created time (auto-calculated as "2h ago", "3d ago", etc.)

**Component:** `RecentFarmsTable.tsx` with loading skeletons and empty states

### 3. Activity Feed

**Frontend Hook:** `useActivities`
**Backend Endpoint:** `GET /admin/activities`
**Data Displayed:**

- Activity type
- Activity title
- Activity message
- Timestamp (auto-calculated)

**Component:** `ActivityFeed.tsx` with loading states and error handling

## 🚀 Testing the Integration

### Prerequisites

1. **Backend must be running:** `http://localhost:5000`
2. **Database must be populated** with sample data
3. **You must be logged in** as a `platform_admin` user

### Step 1: Start the Backend

```bash
cd backend
npm run dev
```

Backend should start on port 5000.

### Step 2: Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend should start on port 3000.

### Step 3: Login as Platform Admin

1. Go to `http://localhost:3000/admin/login`
2. Login with platform_admin credentials
3. JWT token will be stored in localStorage
4. You'll be redirected to `/admin/dashboard`

### Step 4: Verify Data Loading

**You should see:**

- ✅ Loading skeletons appear briefly
- ✅ Real numbers appear in metric cards (not "523", "12,847" anymore)
- ✅ Recent farms table shows actual farms from database
- ✅ Activity feed shows real activities from database

**If you see errors:**

- Check browser console for API errors
- Verify backend is running and accessible
- Check that JWT token is being sent (Network tab → Headers)
- Verify your user has `role: 'platform_admin'`

## 📁 Files Modified

### New Hooks Created:

```
frontend/src/hooks/
├── useDashboardMetrics.ts  ✅ (already existed, now being used)
├── useRecentFarms.ts        ✅ (newly created)
├── useActivities.ts         ✅ (newly created)
└── useFarmGrowth.ts         ✅ (newly created, for future chart integration)
```

### Components Updated:

```
frontend/src/components/admin/dashboard/
├── RecentFarmsTable.tsx     ✅ Now accepts real data with loading/error states
└── ActivityFeed.tsx         ✅ Now accepts real data with loading/error states
```

### Pages Updated:

```
frontend/src/app/admin/dashboard/
└── page.tsx                 ✅ Integrated all hooks, replaced hardcoded values
```

### Service Layer Updated:

```
frontend/src/services/
└── adminService.ts          ✅ Fixed TypeScript interfaces to match backend
```

## 🔧 Backend Endpoints Being Used

### 1. GET /admin/metrics

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

### 2. GET /admin/farms/recent

**Query Params:** `?limit=5` (default)
**Response:**

```json
[
  {
    "id": 1,
    "name": "Green Valley Farm",
    "owner": "Ahmed K.",
    "ownerEmail": "ahmed@example.com",
    "location": "Algiers",
    "workers": 5,
    "fields": 3,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### 3. GET /admin/activities

**Query Params:** `?limit=10` (default)
**Response:**

```json
[
  {
    "id": 1,
    "type": "farm_created",
    "title": "New farm created",
    "message": "Green Valley Farm was created by Ahmed K.",
    "timestamp": "2024-01-15T14:20:00Z",
    "metadata": {}
  }
]
```

## 🔐 Authentication Flow

All API requests include JWT token automatically via Axios interceptor:

```typescript
// In lib/api.ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

Backend middleware checks for `platform_admin` role:

```javascript
// In backend/src/middleware/dashboardMiddleware.js
requirePlatformAdmin(req, res, next) {
  if (req.user.role !== 'platform_admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}
```

## 🎨 UI States Implemented

### Loading State

- Skeleton loaders for metrics (4 animated cards)
- Skeleton loaders for recent farms table (5 rows)
- Skeleton loaders for activity feed (4 items)

### Error State

- Red alert boxes showing error messages
- User-friendly error text
- Doesn't crash the entire page

### Empty State

- "No farms created yet" for empty farms list
- "No recent activity" for empty activity feed

### Success State

- Real data displayed with proper formatting
- Numbers formatted with commas (e.g., "12,847")
- Relative timestamps (e.g., "2h ago", "3d ago")
- Owner names with fallback "N/A" if missing

## 🧪 Test Scenarios

### Scenario 1: Fresh Database

**Expected:**

- All metrics show "0"
- Recent farms shows "No farms created yet"
- Activity feed shows "No recent activity"

### Scenario 2: With Data

**Expected:**

- Metrics show actual counts
- Recent farms shows last 5 farms
- Activity feed shows last 10 activities

### Scenario 3: Backend Down

**Expected:**

- Error messages appear in red boxes
- Loading indicators stop
- Page doesn't crash

### Scenario 4: Invalid Token

**Expected:**

- API returns 401 Unauthorized
- User redirected to login page (via interceptor)

## 🐛 Troubleshooting

### Problem: Seeing "Failed to load metrics"

**Solution:**

1. Check if backend is running: `curl http://localhost:5000/admin/metrics`
2. Check JWT token in localStorage
3. Verify token is valid and not expired
4. Check backend logs for errors

### Problem: Seeing hardcoded values (523, 12,847)

**Solution:**

- Clear cache and hard reload (Ctrl+Shift+R)
- Check that you're viewing the latest code
- Verify hooks are being called in page.tsx

### Problem: CORS errors

**Solution:**

- Backend should have CORS configured for `http://localhost:3000`
- Check `backend/.env` has `FRONTEND_URL=http://localhost:3000`

### Problem: 403 Forbidden

**Solution:**

- Your user must have `role: 'platform_admin'`
- Check user role in database: `SELECT role FROM users WHERE id = <your_id>`

## 📊 Database Schema Requirements

For the integration to work, your PostgreSQL database needs:

### Users Table

```sql
- id: INT (primary key)
- name: VARCHAR
- email: VARCHAR
- role: ENUM ('platform_admin', 'admin', 'worker')
- createdAt: TIMESTAMP
```

### Farms Table

```sql
- id: INT (primary key)
- name: VARCHAR
- location: VARCHAR
- createdAt: TIMESTAMP
```

### Activities Table

```sql
- id: INT (primary key)
- type: VARCHAR
- title: VARCHAR
- message: TEXT
- timestamp: TIMESTAMP
- metadata: JSONB
```

## 🚦 Next Steps

### Already Completed ✅

- [x] Dashboard metrics integration
- [x] Recent farms table integration
- [x] Activity feed integration
- [x] Loading states
- [x] Error handling
- [x] TypeScript interfaces

### Optional Enhancements 🔮

- [ ] Farm growth chart integration (hook already created)
- [ ] Real-time updates with WebSocket
- [ ] Pagination for recent farms
- [ ] Filters for activity feed
- [ ] Export metrics to CSV
- [ ] Refresh button for manual data reload

## 📞 Support

If you encounter any issues:

1. Check browser console for errors
2. Check backend logs
3. Verify authentication token
4. Review this guide's troubleshooting section
5. Check the team Slack channel (#dev-support)

---

**Last Updated:** January 2025
**Integration Status:** ✅ Complete and Ready for Testing

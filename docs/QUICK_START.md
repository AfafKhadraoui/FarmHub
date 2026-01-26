# FarmHub Admin Dashboard - Quick Start Guide

## 🚀 Access the Dashboard

The admin dashboard is now available at:

```
http://localhost:3000/admin/dashboard
```

## ✅ What's Been Implemented

### 1. **Color System** ✅

- All custom colors added to `globals.css` as CSS variables
- Colors: Green (#4baf47), Yellow (#eec044), Blue (#2196F3), Purple (#9C27B0)
- Accessible via `var(--admin-primary)`, `var(--admin-secondary)`, etc.

### 2. **Shared Components** ✅

Located in `src/components/admin/dashboard/`:

- ✅ **Sidebar.tsx** - Navigation with icons
- ✅ **TopBar.tsx** - Header with search and profile
- ✅ **MetricCard.tsx** - Reusable stat cards with gradients
- ✅ **FarmGrowthChart.tsx** - Line chart component
- ✅ **RecentFarmsTable.tsx** - Table with data
- ✅ **ActivityFeed.tsx** - Real-time activity display

### 3. **Dashboard Pages** ✅

All pages accessible via sidebar navigation:

- ✅ **Overview** (default) - Metrics, charts, recent farms, activity feed
- ✅ **Farms** - Grid view with search and filters
- ✅ **All Users** - Paginated table with role filtering
- ✅ **Analytics** - Multiple charts and insights

## 🎨 Features

### Overview Page

- 4 metric cards (Farms, Users, Tasks, Fields)
- Farm growth line chart
- Recent farms table
- Real-time activity feed
- Gradient welcome banner

### Farms Page

- Search by farm name or owner
- Filter by status (Active/Inactive)
- Card grid layout (responsive)
- Each card shows: fields, tasks, workers
- Hover effects with "View Details" button

### All Users Page

- Search by name or email
- Filter by role (Farm Owner/Worker)
- Export to CSV button (ready for backend)
- Paginated table (8 per page)
- Role badges and status indicators

### Analytics Page

- Time range selector (7/30/90/365 days)
- User growth line chart
- Task volume bar chart
- Most active farms horizontal bar chart
- User distribution pie chart
- Farms by location progress bars

## 🛠️ Running the Dashboard

1. **Start the development server**:

```powershell
cd frontend
npm run dev
```

2. **Navigate to**:

```
http://localhost:3000/admin/dashboard
```

3. **Navigate between pages** using the sidebar menu

## 📦 Dependencies

All required dependencies are already installed:

- ✅ `recharts` (for charts)
- ✅ `lucide-react` (for icons)
- ✅ `tailwindcss` (for styling)
- ✅ Google Fonts (Manrope & Inter - loaded in page)

## 🎯 What You Can Do Now

### 1. Test the UI

- Click through all sidebar navigation items
- Test search and filter functionality
- Try pagination on Users page
- Check responsive design (resize browser)

### 2. Prepare for Backend Integration

**Create Admin Service** (`src/services/adminService.ts`):

```typescript
import api from "@/lib/api";

export const adminService = {
  // Metrics
  getMetrics: () => api.get("/admin/metrics"),

  // Farms
  getAllFarms: (params) => api.get("/admin/farms", { params }),
  getRecentFarms: () => api.get("/admin/farms/recent"),

  // Users
  getAllUsers: (params) => api.get("/admin/users", { params }),
  exportUsers: () => api.get("/admin/users/export", { responseType: "blob" }),

  // Analytics
  getAnalytics: (timeRange) =>
    api.get("/admin/analytics", { params: { timeRange } }),
  getFarmGrowth: () => api.get("/admin/analytics/farm-growth"),
  getUserGrowth: () => api.get("/admin/analytics/user-growth"),
  getMostActiveFarms: () => api.get("/admin/analytics/active-farms"),
};
```

**Update Dashboard Page** to fetch real data:

```typescript
// src/app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    adminService
      .getMetrics()
      .then((data) => setMetrics(data))
      .catch((error) => console.error(error));
  }, []);

  // Use fetched data instead of hardcoded values
}
```

### 3. Customize Design

All colors are in `globals.css`:

```css
:root {
  --admin-primary: #4baf47; /* Change to your brand color */
  --admin-secondary: #eec044; /* Change to your accent color */
  /* ... */
}
```

## 📁 File Locations

```
frontend/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── dashboard/
│   │   │       └── page.tsx         ← Main dashboard page
│   │   └── globals.css              ← Color variables here
│   │
│   └── components/
│       └── admin/
│           └── dashboard/
│               ├── Sidebar.tsx
│               ├── TopBar.tsx
│               ├── MetricCard.tsx
│               ├── FarmGrowthChart.tsx
│               ├── RecentFarmsTable.tsx
│               ├── ActivityFeed.tsx
│               ├── FarmsPage.tsx
│               ├── AllUsersPage.tsx
│               └── AnalyticsPage.tsx
│
└── ADMIN_DASHBOARD_README.md        ← Detailed documentation
```

## 🔍 Component Props Reference

### MetricCard

```tsx
<MetricCard
  icon={Store} // Lucide icon
  value="523" // String number
  label="Farms" // Description
  change="+12 today" // Change indicator
  isPositive={true} // Green/Red color
  gradientColors={["#eec044", "#d4a843"]}
/>
```

### FarmsPage

```tsx
<FarmsPage
  farms={[
    {
      id: 1,
      name: "Farm Name",
      owner: "Owner Name",
      location: "City, Country",
      created: "Jan 15, 2025",
      fields: 12,
      tasks: 45,
      workers: 8,
      status: "active" | "inactive",
    },
  ]}
/>
```

### AllUsersPage

```tsx
<AllUsersPage
  users={[
    {
      id: 1,
      name: "User Name",
      email: "user@email.com",
      role: "Farm Owner" | "Worker",
      farm: "Farm Name",
      joined: "2025-01-15",
      status: "active" | "inactive",
    },
  ]}
/>
```

## 🐛 Troubleshooting

### Issue: Charts not rendering

**Solution**: Recharts is already installed. If still not working:

```powershell
npm install recharts@latest
```

### Issue: Fonts not loading

**Solution**: Fonts are loaded via `<link>` tags in the page component. Check browser network tab.

### Issue: CSS variables not working

**Solution**: Make sure you're using Tailwind CSS v4. Check `package.json`:

```json
"tailwindcss": "^4"
```

### Issue: 404 on /admin/dashboard

**Solution**: Make sure you're accessing the correct route:

- ✅ `/admin/dashboard` (correct)
- ❌ `/admin` (wrong)
- ❌ `/dashboard` (wrong)

## 📊 Default Data

All components have default/demo data built-in. To use real data:

1. Create API endpoints in your backend
2. Create service functions in `adminService.ts`
3. Fetch data in page components
4. Pass data as props to components

## 🎯 Next Steps

1. ✅ Test the UI thoroughly
2. ⏳ Set up backend API endpoints
3. ⏳ Create `adminService.ts` file
4. ⏳ Replace demo data with real data
5. ⏳ Add authentication check (admin role only)
6. ⏳ Add loading states
7. ⏳ Add error handling
8. ⏳ Implement CSV export
9. ⏳ Add real-time updates (WebSocket/SSE)

## 📧 Need Help?

- Check `ADMIN_DASHBOARD_README.md` for detailed documentation
- Review component files for prop types and examples
- All components have JSDoc comments

---

**Status**: ✅ Fully Implemented and Ready to Use
**Version**: 1.0.0
**Last Updated**: November 23, 2025

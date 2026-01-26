# FarmHub Admin Dashboard - Implementation Guide

## Overview

This is a comprehensive platform-level admin dashboard for monitoring and managing the entire FarmHub system. It provides real-time insights into farms, users, tasks, and system activity.

## 📁 File Structure

```
frontend/src/
├── app/
│   ├── admin/
│   │   └── dashboard/
│   │       └── page.tsx              # Main dashboard page with routing
│   └── globals.css                    # Updated with admin color variables
│
└── components/
    └── admin/
        └── dashboard/
            ├── Sidebar.tsx            # Navigation sidebar
            ├── TopBar.tsx             # Top navigation bar with search
            ├── MetricCard.tsx         # Reusable metric display card
            ├── FarmGrowthChart.tsx    # Line chart for farm growth
            ├── RecentFarmsTable.tsx   # Table of recently created farms
            ├── ActivityFeed.tsx       # Real-time activity feed
            ├── FarmsPage.tsx          # All farms management page
            ├── AllUsersPage.tsx       # User management with pagination
            └── AnalyticsPage.tsx      # Advanced analytics with charts
```

## 🎨 Design System

### Color Palette (CSS Variables)

All colors are defined in `globals.css` and can be accessed via CSS variables:

- **Primary Green**: `var(--admin-primary)` → `#4baf47`
- **Primary Green Dark**: `var(--admin-primary-dark)` → `#3d9639`
- **Secondary Yellow**: `var(--admin-secondary)` → `#eec044`
- **Secondary Yellow Dark**: `var(--admin-secondary-dark)` → `#d4a843`
- **Text Dark**: `var(--admin-text-dark)` → `#1f1e17`
- **Text Muted**: `var(--admin-text-muted)` → `#878680`
- **Background**: `var(--admin-bg)` → `#f8f8f8`
- **Background Gray**: `var(--admin-bg-gray)` → `#f3f3f5`
- **Border**: `var(--admin-border)` → `#e5e7eb`
- **Blue**: `var(--admin-blue)` → `#2196F3`
- **Blue Dark**: `var(--admin-blue-dark)` → `#1976D2`
- **Purple**: `var(--admin-purple)` → `#9C27B0`
- **Purple Dark**: `var(--admin-purple-dark)` → `#7B1FA2`
- **Red**: `var(--admin-red)` → `#F44336`

### Typography

- **Headings**: Manrope (Google Fonts) - 700/800 weight
- **Body Text**: Inter (Google Fonts) - 400/500/600 weight
- Automatically loaded via `<link>` tags in the main page

## 🚀 Features Implemented

### 1. Overview Page

- **Welcome Banner**: Gradient background with system status
- **4 Metric Cards**:
  - Total Farms (yellow gradient)
  - Total Users (green gradient)
  - Tasks Today (blue gradient)
  - Fields Total (purple gradient)
- **Farm Growth Chart**: Line chart showing farm registration over time
- **Recent Farms Table**: Last 5 farms created with "View All" button
- **Activity Feed**: Real-time system events with color-coded icons

### 2. Farms Page

- **Search & Filter**: Search by name/owner, filter by status
- **Farm Cards Grid**: Responsive grid layout (1/2/3 columns)
- Each card shows:
  - Farm name and owner
  - Location with icon
  - Creation date
  - Stats (fields, tasks, workers)
  - Active/Inactive status badge
  - "View Details" button (hover effect)

### 3. All Users Page

- **Search Bar**: Filter by name or email
- **Role Filter**: All Roles / Farm Owners / Workers
- **Export Button**: CSV export functionality (placeholder)
- **Paginated Table**: 8 users per page with navigation
- **User Display**:
  - Avatar with role icon (Shield for owners, User for workers)
  - Name, email, farm, join date
  - Role badge (yellow for owners, green for workers)
  - Status indicator

### 4. Analytics Page

- **Time Range Selector**: 7 days / 30 days / 90 days / 1 year
- **User Growth Chart**: Line chart with trend percentage
- **Task Volume Chart**: Bar chart with monthly data
- **Most Active Farms**: Horizontal bar chart (top 10)
- **User Distribution**: Pie chart (Owners vs Workers)
- **Farms by Location**: Progress bars showing geographic distribution

## 🔌 Backend Integration Points

All components are designed to accept data as props for easy backend integration:

### MetricCard

```tsx
<MetricCard
  icon={Store}
  value={farmCount.toString()}
  label="Farms"
  change={`+${todayCount} today`}
  isPositive={true}
  gradientColors={["#eec044", "#d4a843"]}
/>
```

### FarmGrowthChart

```tsx
interface ChartData {
  month: string;
  farms: number;
}

<FarmGrowthChart data={chartData} />;
```

### RecentFarmsTable

```tsx
interface Farm {
  name: string;
  owner: string;
  location: string;
  created: string;
}

<RecentFarmsTable
  farms={recentFarms}
  onViewAll={() => setActivePage("farms")}
/>;
```

### ActivityFeed

```tsx
interface Activity {
  id: number;
  icon: LucideIcon;
  color: string;
  title: string;
  subtitle: string;
  time: string;
}

<ActivityFeed activities={activities} />;
```

### FarmsPage

```tsx
interface Farm {
  id: number;
  name: string;
  owner: string;
  email: string;
  location: string;
  created: string;
  fields: number;
  tasks: number;
  workers: number;
  status: "active" | "inactive";
}

<FarmsPage farms={farmsData} />;
```

### AllUsersPage

```tsx
interface UserData {
  id: number;
  name: string;
  email: string;
  role: "Farm Owner" | "Worker";
  farm: string;
  joined: string; // ISO date string
  status: "active" | "inactive";
}

<AllUsersPage users={usersData} />;
```

## 🛠️ API Integration Example

Here's how to integrate with your backend API:

```tsx
// Example: src/app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data
    const fetchData = async () => {
      try {
        const [metricsData, farmsData] = await Promise.all([
          adminService.getMetrics(),
          adminService.getRecentFarms()
        ]);

        setMetrics(metricsData);
        setFarms(farmsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    // ... render components with fetched data
  );
}
```

## 📊 Charts Configuration

### Recharts Setup

The dashboard uses Recharts for all visualizations:

- **LineChart**: User growth, farm growth
- **BarChart**: Task volume, active farms
- **PieChart**: User distribution

All charts are:

- Fully responsive (`ResponsiveContainer`)
- Styled with CSS variables
- Support tooltips with custom styling
- Use gradient fills where appropriate

### Chart Customization Example

```tsx
<Line
  type="monotone"
  dataKey="farms"
  stroke="var(--admin-primary)"
  strokeWidth={3}
  dot={{ fill: "var(--admin-primary)", r: 5 }}
/>
```

## 🔐 Authentication & Authorization

To restrict access to admin users only:

1. **Add middleware check** in `src/middleware.ts`:

```tsx
if (pathname.startsWith("/admin")) {
  const user = await getUserFromToken(token);
  if (user.role !== "platform_admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
}
```

2. **Server-side check** in page:

```tsx
// src/app/admin/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await getServerSession();

  if (!session || session.user.role !== "platform_admin") {
    redirect("/unauthorized");
  }

  // ... rest of component
}
```

## 📱 Responsive Design

All components are fully responsive:

- **Mobile** (< 768px): Single column layouts, stacked navigation
- **Tablet** (768px - 1024px): 2-column grids, collapsible sidebar
- **Desktop** (> 1024px): Full multi-column layouts, fixed sidebar

### Breakpoints Used

- `md:` → 768px
- `lg:` → 1024px
- `xl:` → 1280px

## 🎯 Next Steps for Backend Integration

1. **Create Admin Service**:

```tsx
// src/services/adminService.ts
import api from "@/lib/api";

export const adminService = {
  getMetrics: () => api.get("/admin/metrics"),
  getRecentFarms: () => api.get("/admin/farms/recent"),
  getAllFarms: (params) => api.get("/admin/farms", { params }),
  getAllUsers: (params) => api.get("/admin/users", { params }),
  getAnalytics: (timeRange) =>
    api.get("/admin/analytics", { params: { timeRange } }),
  getFarmGrowth: () => api.get("/admin/analytics/farm-growth"),
  getUserGrowth: () => api.get("/admin/analytics/user-growth"),
  exportUsers: () => api.get("/admin/users/export", { responseType: "blob" }),
};
```

2. **Add Loading States**:

- Use Skeleton components for loading
- Add error boundaries for failed requests
- Implement retry logic

3. **Real-time Updates**:

- Connect WebSocket for activity feed
- Use Server-Sent Events for live metrics
- Implement polling for periodic updates

4. **Data Refresh**:

- Add refresh button to TopBar
- Implement auto-refresh every 30 seconds
- Use SWR or React Query for cache management

## 🚨 Important Notes

- All components use **client-side rendering** (`'use client'`)
- Google Fonts are loaded in the main page component
- CSS variables ensure consistent theming
- All icons from `lucide-react` package
- Recharts is already installed in package.json
- Components are modular and reusable
- Default data is provided for demonstration

## 📝 Testing Checklist

- [ ] All pages render without errors
- [ ] Search and filters work correctly
- [ ] Pagination navigates properly
- [ ] Charts display data correctly
- [ ] Hover effects work on cards/buttons
- [ ] Sidebar navigation switches pages
- [ ] Mobile responsive layout works
- [ ] Color variables are applied correctly
- [ ] Google Fonts load properly
- [ ] Icons display correctly

## 🎨 Customization

To customize colors, edit `src/app/globals.css`:

```css
:root {
  --admin-primary: #YOUR_COLOR;
  --admin-secondary: #YOUR_COLOR;
  /* ... other variables */
}
```

Then use in components:

```tsx
<div className="text-[var(--admin-primary)]">{/* Content */}</div>
```

## 📧 Support

For questions about this implementation:

- Check component prop types for required data formats
- Review default data in each component for structure examples
- All components have JSDoc comments for clarity

---

**Implementation Status**: ✅ Complete and Ready for Backend Integration
**Last Updated**: November 23, 2025

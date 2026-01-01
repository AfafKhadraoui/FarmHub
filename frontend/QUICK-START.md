# 🚀 Quick Start - Admin Dashboard Backend Integration

## ✅ Status: COMPLETE & READY TO TEST

## 🎯 What Changed

Your admin dashboard now fetches **real data** from the PostgreSQL database via backend APIs instead of showing hardcoded values.

## 📦 Start Commands

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

✅ Backend running on: http://localhost:5000

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

✅ Frontend running on: http://localhost:3000

## 🔑 Login

1. Go to: `http://localhost:3000/admin/login`
2. Use credentials with `role: 'platform_admin'`
3. You'll be redirected to the dashboard

## 👀 What You'll See

### ✅ Success (Everything Working)

- **Metrics cards** show real numbers from your database
- **Recent farms table** shows actual farms (not "Green Valley Farm", "Sunrise Farms")
- **Activity feed** shows real activities
- Brief loading skeletons appear on page load
- No console errors

### ❌ Issues (Something Wrong)

- Red error boxes appear on the page
- Console shows API errors like "Failed to load metrics"
- Still seeing "523", "12,847" (cache - do Ctrl+Shift+R)
- 401/403 errors (check login/role)

## 🔌 API Endpoints Connected

| Data            | Endpoint                  | Hook                  |
| --------------- | ------------------------- | --------------------- |
| Dashboard stats | `GET /admin/metrics`      | `useDashboardMetrics` |
| Recent farms    | `GET /admin/farms/recent` | `useRecentFarms`      |
| Activities      | `GET /admin/activities`   | `useActivities`       |

## 🐛 Quick Troubleshooting

**Backend not starting?**

```bash
cd backend
npm install
cp .env.example .env  # if needed
npm run dev
```

**Frontend errors?**

```bash
cd frontend
npm install
npm run dev
```

**Database empty?**

- Run migrations: `npx prisma migrate dev`
- Seed database: `npm run seed` (if script exists)

**CORS errors?**

- Check `backend/.env` has `FRONTEND_URL=http://localhost:3000`

**Seeing old data?**

- Hard reload: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

## 📁 New Files Added

```
frontend/src/hooks/
├── useRecentFarms.ts      ← Fetch recent farms
├── useActivities.ts       ← Fetch activity feed
└── useFarmGrowth.ts       ← For future chart integration
```

## 🎓 How It Works

```typescript
// 1. Hook fetches data on component mount
const { data, loading, error } = useDashboardMetrics();

// 2. Show loading skeleton while fetching
{
  loading && <Skeleton />;
}

// 3. Show error if API fails
{
  error && <ErrorMessage />;
}

// 4. Display real data
{
  data && <MetricCard value={data.totalFarms} />;
}
```

## 📚 Documentation

- **Complete Guide**: `BACKEND-INTEGRATION-COMPLETE.md`
- **Summary**: `INTEGRATION-SUMMARY.md`
- **API Spec**: `API-ENDPOINTS-SPECIFICATION.md`

## ✨ Features Implemented

✅ Real-time data fetching  
✅ Loading skeletons  
✅ Error handling  
✅ Empty states  
✅ Number formatting (commas)  
✅ Relative timestamps ("2h ago")  
✅ JWT authentication  
✅ TypeScript types

## 🎉 You're Done!

Just start both servers and login. Your dashboard is production-ready!

---

**Need help?** Check the troubleshooting section above or see `BACKEND-INTEGRATION-COMPLETE.md`

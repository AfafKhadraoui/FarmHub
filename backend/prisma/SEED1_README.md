# Seed1 - Comprehensive Test Data

This seed file creates comprehensive test data for testing the FarmHub application.

## What it creates:

- ✅ 1 Platform Admin
- ✅ 1 Test Farm (join code: `TEST-FARM1`)
- ✅ 1 Farm Admin (for login)
- ✅ 8 Workers
- ✅ 5 Fields (various statuses)
- ✅ 20 Tasks:
  - 7 Pending tasks (various dates)
  - 5 In Progress tasks (some due today)
  - 8 Completed tasks (some completed today)
- ✅ Multiple task assignments to workers
- ✅ Activity logs

## Login Credentials:

### Farm Admin (USE THIS TO LOGIN):
- **Email:** `admin@testfarm.local`
- **Password:** `Admin123!`

### Workers (for testing worker view):
- **Email:** `worker1@testfarm.local` (or worker2-8)
- **Password:** `Worker123!`

**Note:** All passwords meet requirements (>8 characters, includes uppercase letters)

## How to Run:

### Step 1: Reset Database (if you have existing data)
```bash
cd backend
npm run reset-db
```
**Warning:** This will delete ALL data in your database!

### Step 2: Run the Seed
```bash
npm run seed1
```

### Step 3: Verify the Seed (optional)
```bash
npm run verify-seed
```

This will check if the seed data was created correctly and verify the password hash.

## Troubleshooting "Invalid email or password":

1. **Make sure you ran the seed:**
   ```bash
   npm run verify-seed
   ```
   If it says "NOT found", run `npm run seed1` again.

2. **Check the email format:**
   - ✅ Correct: `admin@testfarm.local`
   - ❌ Wrong: `admin@testfarm.com` (old format)

3. **Check the password:**
   - ✅ Correct: `Admin123!` (with exclamation mark)
   - ❌ Wrong: `admin123` or `Admin123` (missing exclamation)

4. **Reset and reseed:**
   ```bash
   npm run reset-db
   npm run seed1
   ```

## Notes:

- This seed **clears all existing data** before seeding
- Tasks are created with realistic dates (today, yesterday, tomorrow, next week)
- Some tasks are assigned to multiple workers
- Completed tasks have `updatedAt` set to today for testing "completed today" filters
- Pending tasks have `createdAt` set to today for testing "new today" filters

## Testing Scenarios:

1. **Summary Cards**: Click summary cards to see only today's items
2. **Tab Filters**: Click tabs to see all items for that status
3. **Task Creation**: Create new tasks via modal
4. **Task Assignment**: Assign tasks to multiple workers
5. **Worker Contact**: Click "Contact" button to see worker info modal
6. **Filtering**: Test various status filters and date-based filtering


# Backend API Endpoints Documentation

## 🌾 Fields API

### Base URL

```
/api/fields
```

### Endpoints

#### 1. Get All Fields (Active only)

```typescript
GET /api/fields
Query Parameters:
  - status?: 'idle' | 'planted' | 'growing' | 'harvesting'
  - cropType?: string
  - search?: string (searches name and cropType)

Response: Field[]
```

#### 2. Get Field by ID (with relations)

```typescript
GET /api/fields/:id

Response: FieldWithRelations {
  ...Field,
  farm: { id, name },
  tasks: Task[]
}
```

#### 3. Create New Field

```typescript
POST /api/fields
Body: {
  name: string,
  size: number,
  cropType: string | null,
  plantedDate: string | null,
  harvestDate: string | null
}

Response: Field
```

#### 4. Update Field

```typescript
PATCH /api/fields/:id
Body: {
  name?: string,
  size?: number,
  status?: FieldStatus,
  plantedDate?: string | null,
  harvestDate?: string | null
}

Response: Field
```

#### 5. Archive Field

```typescript
PATCH /api/fields/:id/archive

Sets active=false and creates history record
Response: void
```

#### 6. Restore Archived Field

```typescript
PATCH /api/fields/:id/restore

Sets active=true
Response: Field
```

#### 7. Get Field Statistics

```typescript
GET /api/fields/stats

Response: {
  total: number,
  idle: number,
  planted: number,
  growing: number,
  harvesting: number
}
```

#### 8. Get Field History

```typescript
GET /api/fields/:id/history

Response: FieldHistory[] {
  id: number,
  fieldName: string,
  action: string,
  description: string,
  timestamp: string,
  userId: number,
  userName: string
}
```

#### 9. Get Archived Fields

```typescript
GET /api/fields/archived

Response: Field[] (where active=false)
```

---

## 🔔 Notifications API

### Base URL

```
/api/notifications
```

### Endpoints

#### 1. Get All Notifications for User

```typescript
GET /api/notifications
Query Parameters:
  - isRead?: boolean
  - type?: NotificationType
  - startDate?: string (ISO)
  - endDate?: string (ISO)

Response: Notification[]
```

#### 2. Get Unread Notifications

```typescript
GET /api/notifications/unread?limit=10

Response: Notification[] (limited, sorted by timestamp DESC)
```

#### 3. Get Notification Statistics

```typescript
GET /api/notifications/stats

Response: {
  total: number,
  unread: number
}
```

#### 4. Mark Single Notification as Read

```typescript
PATCH /api/notifications/:id/read

Response: void
```

#### 5. Mark Multiple Notifications as Read

```typescript
PATCH /api/notifications/read
Body: {
  notificationIds: string[]
}

Response: void
```

#### 6. Mark All as Read

```typescript
PATCH /api/notifications/read-all

Response: void
```

#### 7. Delete Notification

```typescript
DELETE /api/notifications/:id

Response: void
```

#### 8. Delete Multiple Notifications

```typescript
DELETE /api/notifications/bulk
Body: {
  ids: string[]
}

Response: void
```

#### 9. Create Notification (Admin only)

```typescript
POST /api/notifications
Body: {
  userId: number,
  type: NotificationType,
  title: string,
  message: string,
  metadata?: Record<string, any>
}

Response: Notification
```

---

## 📊 Implementation Notes

### Field Management

1. **History Tracking**: When crop changes, set `active=false` on current record and create new record with `active=true`
2. **Computed Fields**: Backend should calculate:
   - `progress`: Based on plantedDate, harvestDate, current date
   - `activeTasks`: Count of tasks with status != 'completed'
   - `assignedWorkers`: Distinct count of workers from TaskAssignment

### Notifications

1. **Type System**: Use enum values from schema:

   - `task-assigned`, `task-overdue`, `task-completed`, `task-updated`
   - `field-update`, `weather-alert`, `system`
   - `harvest-schedule`, `equipment-alert`, `worker-report`, `schedule-update`

2. **Auto-generation**: Backend should create notifications for:

   - Task assignments
   - Task deadline approaching (24h, 2h warnings)
   - Task completions
   - Field status changes
   - Weather alerts (if integrated)

3. **User Filtering**: Always filter by `userId` from authenticated user's token

### Authentication

All endpoints require Bearer token in headers:

```
Authorization: Bearer <accessToken>
```

Extract `userId` and `farmId` from token to filter data.

### Error Responses

```typescript
{
  error: string,
  message: string,
  statusCode: number
}
```

Common status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

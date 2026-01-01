# Security Page API Documentation

This document describes the API endpoints needed for the Security page functionality.

## Endpoints

### 1. Get Security Settings
**GET** `/settings/security`

Returns the user's security preferences.

**Response:**
```json
{
  "loginAlerts": true
}
```

**Implementation Notes:**
- Returns user's security preferences
- If user has no preferences, return default values
- Requires authentication

---

### 2. Update Security Settings
**PUT** `/settings/security`

Updates the user's security preferences.

**Request Body:**
```json
{
  "loginAlerts": true
}
```

**Response:**
```json
{
  "success": true,
  "loginAlerts": true
}
```

**Implementation Notes:**
- Requires authentication
- Only updates the fields provided in the request body
- Returns updated settings

---

### 3. Change Password
**POST** `/auth/change-password`

Changes the user's password.

**Request Body:**
```json
{
  "currentPassword": "old_password_123",
  "newPassword": "new_secure_password_456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input (e.g., password too short, doesn't meet requirements)
- `401 Unauthorized`: Current password is incorrect
- `500 Internal Server Error`: Server error

**Implementation Notes:**
- Requires authentication
- Validate that `currentPassword` matches the user's current password
- Validate `newPassword` meets requirements (e.g., minimum length, complexity)
- Hash the new password before storing
- Consider invalidating all active sessions after password change (optional)

---

### 4. Get Active Sessions
**GET** `/auth/sessions`

Returns list of active sessions for the current user.

**Response:**
```json
{
  "sessions": [
    {
      "id": "session_1",
      "device": "Windows Desktop",
      "browser": "Chrome",
      "location": "Algiers, Algeria",
      "lastActive": "2025-01-15T10:30:00Z",
      "current": true
    },
    {
      "id": "session_2",
      "device": "iPhone",
      "browser": "Safari",
      "location": "Algiers, Algeria",
      "lastActive": "2025-01-15T08:15:00Z",
      "current": false
    }
  ]
}
```

**Implementation Notes:**
- Requires authentication
- Return all active sessions (sessions with valid tokens)
- `current: true` indicates the session making the request
- `device` should be detected from User-Agent (e.g., "Windows Desktop", "iPhone", "Android")
- `browser` should be detected from User-Agent (e.g., "Chrome", "Safari", "Firefox")
- `location` can be determined from IP geolocation (optional, can be "Unknown" if unavailable)
- `lastActive` should be the last time the session was used

---

### 5. Logout from Specific Session
**DELETE** `/auth/sessions/:sessionId`

Logs out from a specific session/device.

**Parameters:**
- `sessionId` (path parameter): The ID of the session to logout from

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Error Responses:**
- `404 Not Found`: Session not found
- `401 Unauthorized`: Not authorized to logout this session

**Implementation Notes:**
- Requires authentication
- Only allow users to logout their own sessions
- Invalidate the session token
- Remove the session from active sessions list

---

### 6. Logout from All Sessions
**POST** `/auth/logout-all`

Logs out from all active sessions except the current one (or including current if desired).

**Response:**
```json
{
  "success": true,
  "message": "Logged out from all devices"
}
```

**Implementation Notes:**
- Requires authentication
- Invalidate all session tokens for the user
- Optionally invalidate the current session as well (user will need to login again)
- Consider sending email notification if login alerts are enabled

---

## Database Schema Suggestions

### Sessions Table (if storing sessions)
```sql
CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  userId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  device VARCHAR(100),
  browser VARCHAR(50),
  location VARCHAR(100),
  ipAddress VARCHAR(45),
  userAgent TEXT,
  lastActive TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expiresAt TIMESTAMP NOT NULL,
  INDEX idx_userId (userId),
  INDEX idx_token (token),
  INDEX idx_expiresAt (expiresAt)
);
```

### Security Settings Table (if storing separately)
```sql
CREATE TABLE security_settings (
  userId INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  loginAlerts BOOLEAN DEFAULT TRUE,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## Implementation Priority

1. **Change Password** - High priority (essential security feature)
2. **Get/Update Security Settings** - Medium priority (nice to have)
3. **Active Sessions** - Medium priority (enhances security awareness)
4. **Logout Sessions** - Low priority (can be added later)

---

## Frontend Error Handling

The frontend includes fallback dummy data for demonstration purposes when the backend is unavailable. All endpoints gracefully handle 404 and 500 errors by showing demo mode messages.

---

## Security Considerations

1. **Password Requirements:**
   - Minimum 8 characters (enforced in frontend)
   - Consider additional requirements (uppercase, lowercase, numbers, special characters)

2. **Session Management:**
   - Sessions should expire after a period of inactivity
   - Consider implementing refresh tokens for better security

3. **Rate Limiting:**
   - Implement rate limiting on password change endpoint to prevent brute force attacks

4. **Password Hashing:**
   - Always hash passwords using bcrypt or similar
   - Never store plain text passwords

5. **Session Security:**
   - Use secure, HttpOnly cookies for session tokens
   - Implement CSRF protection


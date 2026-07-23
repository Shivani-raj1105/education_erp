# Department Management Portal — API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication

### POST /auth/login
Login with department code + username + password.

**Request body:**
```json
{
  "departmentCode": "CSE",
  "username": "hod_cse",
  "password": "hod@cse123"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGci...",
    "isHOD": true,
    "redirectTo": "/hod/dashboard",
    "faculty": {
      "id": "uuid",
      "name": "Dr. Rajesh Kumar",
      "employeeId": "EMP001",
      "email": "rajesh.kumar@college.edu",
      "designation": "Professor & HOD",
      "department": { "id": "uuid", "name": "Computer Science and Engineering", "code": "CSE" },
      "roles": [
        { "role": { "id": "uuid", "name": "HOD", "slug": "HOD" } },
        { "role": { "id": "uuid", "name": "Faculty", "slug": "FACULTY" } }
      ],
      "status": "ACTIVE"
    }
  }
}
```

**Error 401:**
```json
{ "success": false, "message": "Invalid credentials." }
```

---

### POST /auth/logout
Clears JWT cookie. Requires authentication.

**Response 200:**
```json
{ "success": true, "message": "Logged out successfully", "data": null }
```

---

### GET /auth/me
Returns the current authenticated user's full profile.

**Response 200:**
```json
{
  "success": true,
  "data": { /* Full Faculty object without passwordHash */ }
}
```

---

## Faculty

### GET /faculty
Get paginated faculty list (department-scoped — HOD sees only their department).

**Query params:**
| Param     | Type   | Default | Description                           |
|-----------|--------|---------|---------------------------------------|
| page      | number | 1       | Page number                           |
| limit     | number | 10      | Results per page (max 100)            |
| search    | string | —       | Search name/ID/designation/email      |
| status    | string | —       | ACTIVE / INACTIVE / ON_LEAVE          |
| sortBy    | string | name    | name/employeeId/designation/experience/joiningDate |
| sortOrder | string | asc     | asc / desc                            |

**Response 200:**
```json
{
  "success": true,
  "data": [ /* Faculty array */ ],
  "pagination": {
    "total": 8,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

### GET /faculty/:id
Get a single faculty member by UUID. Must belong to same department.

**Response 200:** Full Faculty object.
**Error 403:** Cross-department access attempt.
**Error 404:** Faculty not found.

---

### POST /faculty  *(HOD only)*
Create new faculty. Accepts `multipart/form-data` for photo upload.

**Form fields:**
```
employeeId     string  required
name           string  required
email          string  required (valid email)
designation    string  required
qualification  string  required
username       string  required (3-50 chars, alphanumeric + underscore)
password       string  required (min 6 chars)
joiningDate    string  required (ISO date)
phone          string  optional
specialization string  optional
experience     number  optional (0-60)
status         string  optional (ACTIVE/INACTIVE/ON_LEAVE)
photo          file    optional (jpg/png/webp, max 5MB)
```

**Response 201:** Created Faculty object.
**Error 409:** Employee ID / username / email already exists.

---

### PUT /faculty/:id  *(HOD only)*
Update faculty. Accepts `multipart/form-data`.

Same fields as POST (all optional). Omit password to keep current.

**Response 200:** Updated Faculty object.

---

### DELETE /faculty/:id  *(HOD only)*
Delete faculty by ID.

**Response 200:**
```json
{ "success": true, "data": { "message": "Faculty deleted successfully." } }
```
**Error 400:** Cannot delete HOD.
**Error 404:** Faculty not found.

---

## Coordinator Roles

### GET /roles
Get all active roles in the system.

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "HOD", "slug": "HOD", "description": "Head of Department", "isActive": true },
    { "id": "uuid", "name": "Timetable Coordinator", "slug": "TIMETABLE_COORDINATOR", ... },
    ...
  ]
}
```

---

### GET /roles/faculty/:id/roles
Get all roles assigned to a faculty member.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "facultyId": "uuid",
      "roleId": "uuid",
      "assignedBy": "uuid",
      "assignedAt": "2024-01-15T10:00:00Z",
      "role": { "id": "uuid", "name": "Timetable Coordinator", "slug": "TIMETABLE_COORDINATOR" }
    }
  ]
}
```

---

### POST /roles/faculty/:id/roles  *(HOD only)*
Assign a coordinator role to a faculty member.

**Request body:**
```json
{ "roleId": "uuid" }
```

**Response 201:** FacultyRole record.
**Error 409:** Faculty already has this role.
**Error 400:** Cannot assign HOD/FACULTY role via this endpoint.

---

### DELETE /roles/faculty/:id/roles/:roleId  *(HOD only)*
Remove a coordinator role from faculty.

**Response 200:**
```json
{ "success": true, "data": { "message": "Role 'Timetable Coordinator' removed successfully." } }
```

---

### PATCH /roles/faculty/:id/roles/sync  *(HOD only)*
Bulk sync roles — used by the context menu for instant toggle without page reload.
Adds all roles in `add[]`, removes all roles in `remove[]` atomically.

**Request body:**
```json
{
  "add":    ["role-uuid-1", "role-uuid-2"],
  "remove": ["role-uuid-3"]
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "faculty": { /* Updated Faculty object with new roles */ },
    "results": {
      "added":   ["TIMETABLE_COORDINATOR"],
      "removed": ["EXAM_COORDINATOR"],
      "errors":  []
    }
  }
}
```

---

## Dashboard

### GET /dashboard
Returns dashboard data based on the authenticated user's role.

**If HOD:**
```json
{
  "success": true,
  "data": {
    "department": { "id": "uuid", "name": "Computer Science and Engineering", "code": "CSE" },
    "stats": {
      "totalFaculty": 9,
      "activeFaculty": 8,
      "onLeave": 1,
      "inactive": 0,
      "coordinatorCount": 4,
      "totalStudents": 0,
      "totalSemesters": 8
    },
    "roleDistribution": [
      { "role": { "name": "Faculty", "slug": "FACULTY" }, "count": 9 },
      { "role": { "name": "Timetable Coordinator", "slug": "TIMETABLE_COORDINATOR" }, "count": 1 }
    ],
    "recentActivity": [
      {
        "id": "uuid",
        "action": "ASSIGN_ROLE",
        "performer": { "id": "uuid", "name": "Dr. Rajesh Kumar", "employeeId": "EMP001" },
        "target":    { "id": "uuid", "name": "Sathyaseelan M",   "employeeId": "EMP002" },
        "timestamp": "2024-01-20T09:30:00Z",
        "details":   { "roleName": "Timetable Coordinator", "roleSlug": "TIMETABLE_COORDINATOR" }
      }
    ]
  }
}
```

**If Faculty:**
```json
{
  "success": true,
  "data": {
    "profile": { /* Full Faculty object */ },
    "roles": [
      { "id": "uuid", "name": "Faculty", "slug": "FACULTY" },
      { "id": "uuid", "name": "Timetable Coordinator", "slug": "TIMETABLE_COORDINATOR" }
    ],
    "coordinatorRoles": [
      { "id": "uuid", "name": "Timetable Coordinator", "slug": "TIMETABLE_COORDINATOR" }
    ]
  }
}
```

---

## Error Response Format

All errors follow this structure:
```json
{
  "success": false,
  "message": "Human-readable error message",
  "timestamp": "2024-01-20T09:30:00Z",
  "errors": [                          // only on validation errors (422)
    { "field": "email", "message": "Valid email is required" }
  ]
}
```

### HTTP Status Codes Used
| Code | Meaning                              |
|------|--------------------------------------|
| 200  | Success                              |
| 201  | Created                              |
| 400  | Bad request / business rule violation|
| 401  | Unauthenticated                      |
| 403  | Forbidden (wrong role / dept)        |
| 404  | Not found                            |
| 409  | Conflict (duplicate)                 |
| 422  | Validation error                     |
| 429  | Rate limit exceeded                  |
| 500  | Internal server error                |

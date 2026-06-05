# Admin Batch 2 API Documentation
## User Management + Patient Profiles

## 1. Overview

This document covers the Admin-facing APIs for user management and patient profile visibility.

The APIs are mounted from:

```js
router.use("/admin/users", adminUserManagementRoutes);
router.use("/patient-profiles", patientProfileRoutes);
```

## 2. Authentication

All endpoints in this batch require:

```http
Authorization: Bearer <TOKEN>
```

The token must belong to the required role.

## 3. Roles

| Role | Description |
|---|---|
| `admin` | Any admin account |
| `super_admin` | Required for updating user status |
| `doctor` | Can access a specific patient profile by user ID |
| `assistant` | Can access a specific patient profile by user ID |
| `user` | Not allowed to access admin routes in this batch |

---

# Part A - Admin User Management

Base path:

```http
/api/admin/users
```

All `/api/admin/users/*` routes require JWT authentication first.

Read operations require any admin role. Status updates require super admin.

---

## A1. Get User Statistics

```http
GET /api/admin/users/stats
```

### Permission

```text
Admin
```

### Purpose

Returns aggregate user statistics and counts.

### Headers

```http
Authorization: Bearer <ADMIN_TOKEN>
Accept-Language: ar
```

### Expected success

```json
{
  "success": true,
  "data": {}
}
```

---

## A2. Get All Users

```http
GET /api/admin/users
```

### Permission

```text
Admin
```

### Query params

| Param | Type | Required | Notes |
|---|---:|---:|---|
| `page` | number | No | Minimum 1 |
| `limit` | number | No | Minimum 1, maximum 100 |
| `status` | string | No | `active`, `inactive`, `suspended`, `pending_verification` |
| `verified` | boolean | No | `true` or `false` |

### Example

```http
GET /api/admin/users?page=1&limit=20
```

### Expected success

```json
{
  "success": true,
  "data": {
    "users": [],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_items": 0,
      "items_per_page": 20,
      "has_next": false,
      "has_previous": false
    }
  }
}
```

---

## A3. Search Users

```http
GET /api/admin/users/search
```

### Permission

```text
Admin
```

### Query params

| Param | Type | Required | Notes |
|---|---:|---:|---|
| `query` | string | No | Searches name/email/phone |
| `email` | string | No | Must be valid email if provided |
| `phone` | string | No | Phone search |
| `uuid` | UUID | No | Exact UUID |
| `status` | string | No | Valid user status |
| `verified` | boolean | No | true/false |
| `page` | number | No | Minimum 1 |
| `limit` | number | No | Maximum 100 |

### Example

```http
GET /api/admin/users/search?query=abdallah&page=1&limit=10
```

---

## A4. Get Users By Status

```http
GET /api/admin/users/status/:status
```

### Permission

```text
Admin
```

### Valid status values

```text
active
inactive
suspended
pending_verification
```

### Example

```http
GET /api/admin/users/status/active?page=1&limit=10
```

### Expected validation failure

If `status` is not one of the allowed values:

```json
{
  "success": false
}
```

---

## A5. Get User Details By ID

```http
GET /api/admin/users/:id
```

### Permission

```text
Admin
```

### Path params

| Param | Type | Required |
|---|---:|---:|
| `id` | number | Yes |

### Expected success

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "uuid": "...",
      "email": "...",
      "status": "active",
      "verification": {},
      "activity": {},
      "timestamps": {}
    },
    "profile": {},
    "has_patient_profile": true
  }
}
```

---

## A6. Get User Medical / Patient Profile

```http
GET /api/admin/users/:id/medical
```

### Permission

```text
Admin
```

### Purpose

Returns the medical/patient profile for a specific user ID.

### Notes

This endpoint is admin-facing and reads patient profile data linked to `users.id`.

### Expected success

```json
{
  "success": true,
  "data": {
    "user": {},
    "patient_profile": {}
  }
}
```

If the user has no patient profile, the response may return `patient_profile` as null or a not-found style response depending on controller behavior.

---

## A7. Get User Logs

```http
GET /api/admin/users/:id/logs
```

### Permission

```text
Admin
```

### Query params

| Param | Type | Required |
|---|---:|---:|
| `action` | string | No |
| `page` | number | No |
| `limit` | number | No |

### Purpose

Returns admin action logs related to a specific user.

---

## A8. Update User Status

```http
PUT /api/admin/users/:id/status
```

### Permission

```text
Super Admin only
```

### Body

```json
{
  "status": "suspended",
  "reason": "Testing admin user status update from API"
}
```

### Valid status values

```text
active
inactive
suspended
pending_verification
```

### Validation rules

| Field | Rule |
|---|---|
| `status` | Required, valid enum |
| `reason` | Required, string, 10-500 chars |

### Expected success

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

### Expected forbidden for non-super admin

```json
{
  "error": "Insufficient admin permissions"
}
```

### Important test warning

Do not test status update on your main super admin account. Use a safe test user.

---

# Part B - Patient Profiles Admin Access

Base path:

```http
/api/patient-profiles
```

Only the two routes below are included in this Admin batch.

---

## B1. Get All Patient Profiles

```http
GET /api/patient-profiles/all
```

### Permission

```text
Admin only
```

### Query params

| Param | Type | Required |
|---|---:|---:|
| `page` | number | No |
| `limit` | number | No |
| `search` | string | No |

### Purpose

Allows admin to list all patient profiles with pagination and search.

### Expected success

```json
{
  "success": true,
  "data": {}
}
```

---

## B2. Get Patient Profile By User ID

```http
GET /api/patient-profiles/patient/:userId
```

### Permission

```text
Admin, Doctor, Assistant
```

### Path params

| Param | Type | Required |
|---|---:|---:|
| `userId` | number | Yes |

### Purpose

Allows admin, doctor, or assistant to retrieve a patient profile by the linked user ID.

### Expected success

```json
{
  "success": true,
  "data": {}
}
```

---

# Permission Matrix

| Endpoint | Admin | Super Admin | Doctor | Assistant | User |
|---|---:|---:|---:|---:|---:|
| `GET /api/admin/users` | Yes | Yes | No | No | No |
| `GET /api/admin/users/stats` | Yes | Yes | No | No | No |
| `GET /api/admin/users/search` | Yes | Yes | No | No | No |
| `GET /api/admin/users/status/:status` | Yes | Yes | No | No | No |
| `GET /api/admin/users/:id` | Yes | Yes | No | No | No |
| `GET /api/admin/users/:id/medical` | Yes | Yes | No | No | No |
| `GET /api/admin/users/:id/logs` | Yes | Yes | No | No | No |
| `PUT /api/admin/users/:id/status` | No unless super_admin | Yes | No | No | No |
| `GET /api/patient-profiles/all` | Yes | Yes | No | No | No |
| `GET /api/patient-profiles/patient/:userId` | Yes | Yes | Yes | Yes | No |

---

# Integration Notes

## Admin dashboard sections

Recommended frontend sections:

1. Users Overview
2. Users List
3. User Search
4. User Details
5. User Medical Profile
6. User Admin Logs
7. User Status Management
8. Patient Profiles List
9. Patient Profile Details

## Important

`/api/patient-profiles/patient/:userId` uses the `users.id` as `userId`, not `patient_profiles.id`.


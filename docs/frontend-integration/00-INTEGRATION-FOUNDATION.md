# Frontend API Integration Foundation

## 1. Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | `http://localhost:3006` | Backend API base URL |

Copy `.env.example` to `.env.local` and set the values:

```bash
cp .env.example .env.local
```

The API client (`src/lib/api.ts`) reads `NEXT_PUBLIC_API_BASE_URL` at runtime via `process.env.NEXT_PUBLIC_API_BASE_URL`.

---

## 2. Token Storage Keys

All tokens are stored in `localStorage` (client-side only) using these keys:

| Key | Purpose |
|---|---|
| `bashra_admin_access_token` | Admin JWT access token |
| `bashra_admin_refresh_token` | Admin JWT refresh token |
| `bashra_admin_user` | Serialized admin session object |

All storage access is wrapped in `typeof window !== 'undefined'` guards for SSR safety.

---

## 3. How to Call APIs

### Import the helpers

```typescript
import {
  apiGet, apiPost, apiPut, apiPatch, apiDelete, apiUpload,
  buildQueryString,
} from '@/lib/api';
```

### GET request

```typescript
const response = await apiGet<ApiSuccessResponse<User[]>>('/api/admin/users', {
  params: { page: 1, limit: 20 },
});
```

### POST request (JSON)

```typescript
const response = await apiPost<ApiSuccessResponse<User>>('/api/auth-admin/login', {
  email: 'admin@example.com',
  password: 'password',
}, { auth: false });
```

### PUT request

```typescript
const response = await apiPut<ApiSuccessResponse<User>>('/api/admin/users/1', {
  full_name: 'Updated Name',
});
```

### DELETE request

```typescript
const response = await apiDelete<ApiSuccessResponse<null>>('/api/admin/users/1');
```

### Upload (multipart/form-data)

```typescript
const formData = new FormData();
formData.append('profile_picture', file);

const response = await apiUpload<ApiSuccessResponse<{ profile_picture_url: string }>>(
  '/api/profile-admin/picture',
  formData
);
```

### Build query string manually

```typescript
const qs = buildQueryString({ page: 1, limit: 20, search: 'ahmed' });
// "?page=1&limit=20&search=ahmed"
```

---

## 4. How Errors Are Normalized

Every non-2xx response throws an `ApiError` instance:

```typescript
import { ApiError } from '@/lib/api';

try {
  await apiPost('/api/auth-admin/login', { email, password });
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.status);       // HTTP status code
    console.log(error.message);      // English fallback message
    console.log(error.message_ar);   // Arabic message (if present)
    console.log(error.message_en);   // English message (if present)
    console.log(error.reason);       // Backend reason code
    console.log(error.errors);       // Validation errors object
    console.log(error.getDisplayMessage('ar')); // Best Arabic message
  }
}
```

Error message extraction order:
1. `message_ar`
2. `message_en`
3. `message`
4. `error`
5. `'An unexpected error occurred'`

### Error detection helpers

File: `src/lib/error-utils.ts`

```typescript
import {
  getApiErrorMessage,
  isUnauthorizedError,   // 401
  isForbiddenError,      // 403
  isRateLimitError,      // 429
  isNotFoundError,       // 404
  isValidationError,     // 400
  isServerError,         // 500+
} from '@/lib/error-utils';

const message = getApiErrorMessage(error, 'ar');
if (isUnauthorizedError(error)) { /* redirect to login */ }
```

---

## 5. Dashboard Auth Guard

File: `src/components/auth/dashboard-auth-guard.tsx`

- Client component (`'use client'`)
- Checks for access token in `localStorage` on mount
- Redirects to `/[lang]/login` if no token found
- Shows a centered spinner while checking
- Wraps the dashboard layout

```typescript
// In layout.tsx
<DashboardAuthGuard>
  <Sidebar />
  <Header />
  <main>{children}</main>
  <Footer />
</DashboardAuthGuard>
```

---

## 6. Auth Token Helpers

File: `src/lib/api.ts`

| Function | Description |
|---|---|
| `getAdminAccessToken()` | Get access token from localStorage |
| `setAdminAccessToken(token)` | Set access token |
| `getAdminRefreshToken()` | Get refresh token |
| `setAdminRefreshToken(token)` | Set refresh token |
| `clearAdminTokens()` | Clear both tokens |
| `getStoredAdmin<T>()` | Get admin user object |
| `setStoredAdmin(admin)` | Set admin user object |
| `clearStoredAdmin()` | Clear admin user |
| `logoutAdmin()` | Clear all tokens + admin data |
| `isApiSuccessResponse(res)` | Type guard for success responses |

---

## 7. Admin Auth Service

File: `src/lib/admin-auth.ts`

| Function | Description |
|---|---|
| `loginAdmin(payload)` | POST `/api/auth-admin/login`, stores tokens + user |
| `logoutAdminLocal()` | Clears all stored auth data |
| `getCurrentAdminFromStorage()` | Returns stored admin session or null |
| `saveAdminSessionFromLoginResponse(res)` | Manually parse + store login response |
| `getAdminProfile()` | GET `/api/profile-admin` for current admin |
| `refreshAdminToken(refreshToken)` | POST `/api/auth-admin/refresh-token` |

Login payload:

```typescript
{
  email: string;
  password: string;
}
```

Login response (from backend docs):

```json
{
  "success": true,
  "message_ar": "تم تسجيل الدخول بنجاح",
  "message_en": "Login successful",
  "user": { "id": 2, "uuid": "...", "email": "...", "admin_type": "super_admin" },
  "tokens": { "accessToken": "...", "refreshToken": "..." }
}
```

---

## 8. Files Added / Changed

### New files

| File | Purpose |
|---|---|
| `.env.example` | Environment variable template |
| `src/types/api.ts` | Shared API types (ApiSuccessResponse, ApiErrorResponse, PaginationMeta, AdminSession) |
| `src/lib/api.ts` | Central API client + token storage helpers |
| `src/lib/admin-auth.ts` | Admin authentication service wrapper |
| `src/lib/error-utils.ts` | Error detection and message extraction utilities |
| `src/components/auth/dashboard-auth-guard.tsx` | Client-side route guard for dashboard |
| `docs/frontend-integration/00-INTEGRATION-FOUNDATION.md` | This documentation |

### Modified files

| File | Change |
|---|---|
| `src/app/[lang]/(dashboard)/layout.tsx` | Wrapped layout in `DashboardAuthGuard` |

---

## 9. What Future Phases Should Use

### Phase 1 — User Management
- Create `src/lib/admin-users.ts` using `apiGet`, `apiPost`, `apiPut`, `apiDelete`
- Use `AdminSession` from `@/types/api`
- Use `getApiErrorMessage` for error display
- Use `PaginatedResponse<...>` for list endpoints

### Phase 2 — Doctors, Appointments, etc.
- Follow same pattern: service file per domain in `src/lib/`
- Import `apiGet<T>()` etc. from `@/lib/api`
- Add domain-specific types to `src/types/` (e.g., `doctor.ts`, `appointment.ts`)
- Use `DashboardAuthGuard` is already active

### General Pattern

```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import type { ApiSuccessResponse, PaginationMeta } from '@/types/api';

// List
const { data, pagination } = await apiGet<{
  data: ItemType[];
  pagination: PaginationMeta;
}>('/api/admin/items', { params: { page, limit } });

// Create
const { data } = await apiPost<ApiSuccessResponse<ItemType>>('/api/admin/items', payload);

// Update
const { data } = await apiPut<ApiSuccessResponse<ItemType>>(`/api/admin/items/${id}`, payload);

// Delete
await apiDelete(`/api/admin/items/${id}`);
```

---

## 10. Route Protection Strategy

Because the token is stored in `localStorage` (client-only), Next.js middleware cannot read it. Therefore:

- **Middleware** (`src/middleware.ts`): Only handles locale redirect (unchanged)
- **Client guard** (`DashboardAuthGuard`): Used in dashboard layout to protect all dashboard routes
- **Auth pages** (`/login`, `/register`, etc.): Accessible without authentication
- **Future**: If HTTP‑only cookies become available, middleware can be upgraded

---

## 11. Assumptions

1. Backend runs at `http://localhost:3006` by default
2. Admin login endpoint is `POST /api/auth-admin/login`
3. Login response contains `user` and `tokens` fields (per Batch 1 docs)
4. All admin API routes require Bearer token in `Authorization` header
5. 401 responses should force client-side logout
6. The `DashboardAuthGuard` runs client-side (`'use client'`)
7. No backend endpoints were invented — only documented paths are used

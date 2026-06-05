# Batch 10 - Blocked Entities + Cross-Security Testing

This batch documents and tests the Blocked Entities module and its cross-security impact on authentication, tokens, active sessions, account status, and admin audit logs.

## Reviewed source files

- `routes/index.js`
- `routes/blockedEntitiesRoutes.js`
- `controllers/BlockedEntitiesController.js`
- `middleware/authMiddleware.js`
- `controllers/AuthController.js`
- `utils/SecurityService.js`
- `routes/authUserRoutes.js`
- `routes/authAdminRoutes.js`
- `SQL-Database-(Bashraai).sql`

## Main base path

```http
/api/admin/blocked-entities
```

## Related auth paths

```http
/api/auth-user/login
/api/auth-admin/login
/api/auth-doctor/login
/api/auth-assistant/login
```

## Included files

| File | Purpose |
|---|---|
| `01-blocked-entities-api-docs.md` | Full API documentation |
| `02-blocked-entities-cross-security-manual-testing.md` | Step-by-step manual and security testing |
| `03-blocked-entities-sql-verification.sql` | SQL verification queries |
| `04-blocked-entities-postman-collection.json` | Postman collection |
| `05-blocked-entities-test-matrix.csv` | Test matrix |

## Permission model

| Operation | Permission |
|---|---|
| List blocks | Any Admin |
| Statistics | Any Admin |
| Check block status | Any Admin |
| Get block details | Any Admin |
| Get entity history | Any Admin |
| Block entity | System Admin or Super Admin |
| Unblock entity | System Admin or Super Admin |
| Update block | System Admin or Super Admin |
| Bulk block/unblock | System Admin or Super Admin |
| Auto-unblock expired | System Admin or Super Admin |
| Block/unblock admin entity | Super Admin only |

## Important implementation notes

1. Blocking an entity sets the entity status to `suspended`.
2. Blocking an entity revokes active tokens in `auth_tokens`.
3. Blocking an entity ends active login sessions in `login_sessions`.
4. Authentication middleware rejects revoked tokens, suspended accounts, and active block records.
5. Login rejects suspended or blocked accounts through `SecurityService.authenticate`.
6. `warning` is accepted as `block_type`, but current implementation still creates an active block and sets the entity status to `suspended`.
7. Successful mutation routes use both route-level `adminActionLogger` and controller-level `logAdminAction`, so you may see duplicate or multiple `admin_logs` rows for the same operation.
8. `check` endpoint can auto-expire a temporary block by setting `is_active = 0`, but it does not restore the entity `status` to `active`. Use `auto-unblock` for full status restoration.

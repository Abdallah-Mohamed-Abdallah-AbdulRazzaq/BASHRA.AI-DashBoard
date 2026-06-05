# Batch 9 - Admin AI Usage

This batch documents and tests the Admin AI Usage module.

## Reviewed source files

- `routes/index.js`
- `routes/adminAIUsageRoutes.js`
- `controllers/AdminAIUsageController.js`
- `services/ai/AIUsageService.js`
- `routes/aiDermatologyRoutes.js`
- `AI-Chat-Update-Database.sql`

## Main base path

```http
/api/admin/ai-usage
```

## Related user validation path

```http
/api/ai-dermatology/usage
```

## Included files

| File | Purpose |
|---|---|
| `01-admin-ai-usage-api-docs.md` | Full API documentation |
| `02-admin-ai-usage-manual-testing.md` | Step-by-step manual testing guide |
| `03-admin-ai-usage-sql-verification.sql` | SQL verification queries |
| `04-admin-ai-usage-postman-collection.json` | Postman collection |
| `05-admin-ai-usage-test-matrix.csv` | Test matrix |

## Permission model

| Operation | Endpoint group | Permission |
|---|---|---|
| Overview | `GET /overview` | Admin |
| User usage details | `GET /users/:userId` | Admin |
| List/Get policies | `GET /policies`, `GET /policies/:id` | Admin |
| Create policy | `POST /policies` | Super Admin |
| Update policy | `PATCH /policies/:id` | Super Admin |
| Activate/Deactivate policy | `PATCH /policies/:id/status` | Super Admin |

## Current implementation notes

1. `scope_type = package` is accepted in admin policy CRUD, but the active policy lookup used by the AI usage service currently selects only `user` and `global` policies.
2. `max_tokens_per_request` is stored and returned, but current `assertCanUse` checks monthly request counts and event-specific counts only.
3. The Admin overview filters counters by `period_key`, but provider summary currently aggregates `ai_provider_logs` globally without a `period_key`/date filter.
4. Successful usage events increment counters. Failed/blocked events are stored in `ai_usage_events`, but do not increment counters.

## Recommended test order

1. Verify admin route mount and auth.
2. Get overview for current month.
3. Get user usage details.
4. List policies.
5. Create a user-scoped policy as Super Admin.
6. Verify the user receives this policy via `/api/ai-dermatology/usage`.
7. Update the policy limits.
8. Toggle policy status off and on.
9. Validate admin logs.
10. Test validation failures and permission failures.

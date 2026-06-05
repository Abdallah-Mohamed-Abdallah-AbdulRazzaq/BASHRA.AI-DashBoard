# Permission and Security Matrix

## 1. Role boundary matrix

| Token Role | Admin APIs | Doctor APIs | Patient APIs | Public APIs |
|---|---|---|---|---|
| No token | 401/403 | 401/403 | 401/403 | 200 |
| Patient/User | 403 | 403 | 200 if owner/allowed | 200 |
| Doctor | 403 except allowed shared/admin-doctor routes | 200 if owner/allowed | 403 | 200 |
| Admin | 200 by admin type/permission | 403 except admin-managed views | 403 except admin-managed views | 200 |
| Assistant | 403 except assistant routes | 403 except allowed assistant routes | 403 except multi-role routes | 200 |

## 2. Ownership matrix

| Resource | Patient must only access own? | Doctor must only access own/assigned? | Admin scope |
|---|---:|---:|---|
| User profile | Yes | No | Admin-managed |
| Patient medical profile | Yes | Assigned/authorized access only | Admin-managed |
| Addresses | Yes by entity type/id | Yes by entity type/id | Admin-managed if route allows |
| Appointments | Yes as patient | Yes as doctor | Admin-managed |
| Medical records | Final own records only for patient | Assigned patient/appointment records | Admin-managed |
| Prescriptions | Own prescriptions only for patient | Doctor-created/authorized | Admin-managed/doctor workflow |
| Ratings | Own write operations only | Own rating response only | Flag/status management |
| Conversations | Participant only | Participant only | Not generally participant API |
| AI sessions | Owner only | Only shared sessions | Admin AI usage only, not private content unless defined |
| AI secure files | Owner only | Shared-doctor route only | Not through patient file endpoint |
| AI shares | Owner can create/revoke | Doctor can view active shares assigned to them | Not patient share endpoint |

## 3. High-risk negative tests

```text
Patient token against /api/admin/*
Patient token against /api/doctor/*
Doctor/admin token against /api/ai-dermatology/sessions
Patient reads another patient's appointment
Patient reads another patient's medical record
Patient reads another patient's prescription
Patient mutates another patient's rating
Patient opens another patient's AI secure file
Patient sends message to another patient's AI session
Patient opens non-participant conversation messages
Patient uses socket markAsRead on non-participant conversation
```

## 4. Account state expectations

| State | Expected behavior |
|---|---|
| suspended | authenticateJWT rejects |
| blocked | authenticateJWT rejects |
| inactive/deactivated | routes with checkAccountActive reject except reactivation |
| token revoked | authenticateJWT rejects |
| token expired | authenticateJWT rejects |

## 5. Evidence required for security regression

For every security test:

```text
request method
request URL
token role
request body
HTTP status
response body
SQL before
SQL after
terminal error/log if any
```

Never accept:

```text
200 with another user's private data
201 creating data for another user
200 updating/deleting another user's data
access_count incrementing on unauthorized file access
usage counter incrementing on unauthorized AI request
```

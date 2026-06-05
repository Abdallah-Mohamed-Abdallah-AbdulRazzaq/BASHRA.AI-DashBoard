# Known Regressions and Review Points

This file lists review points discovered during documentation and test planning. It does not claim these are all active bugs; each item should be confirmed with the included tests.

## 1. `req.user.role` vs `req.user.entityType`

`authenticateJWT` stores role identity as:

```js
req.user.entityType
```

Some controllers were documented as checking:

```js
req.user.role
```

High-priority places to verify:

```text
GET /api/prescriptions
GET /api/prescriptions/:id
GET /api/ratings
GET /api/ratings/:id
```

Risk:

```text
Role-based filtering may not run as intended.
```

Expected action:

```text
Use entityType consistently or map role = entityType in authentication middleware.
```

## 2. profile-user route role enforcement

`/api/profile-user` routes were documented as using:

```text
authenticateJWT
checkAccountActive
```

but not visibly `authorizeUser` in the route file.

Risk:

```text
Doctor/admin/assistant token might reach user profile controller unless controller blocks it.
```

Expected action:

```text
Test non-user tokens. Add authorizeUser if needed.
```

## 3. AI secure file URL

The AI file response was updated to include:

```text
secure_file_url = BACKEND_URL + /api/ai-dermatology/files/:fileUuid
secure_file_path = /api/ai-dermatology/files/:fileUuid
```

Risk:

```text
Frontend may still use old relative secure_file_url or public file_url.
```

Expected action:

```text
Frontend should use secure_file_url for private medical files.
```

## 4. AI sharing result selection

Sharing without `result_uuid` should not select `small_talk` or `out_of_scope` if a medical result exists.

Expected priority:

```text
final_summary
document_analysis
image_analysis
chat_response
other
small_talk/out_of_scope last
```

## 5. Ratings doctor_id mismatch

Create rating checks appointment ownership/completion, but must also ensure:

```text
request doctor_id == appointment.doctor_id
```

Risk:

```text
Rating could be attached to wrong doctor if mismatch is not blocked.
```

## 6. Conversation self/admin recipient behavior

`POST /api/conversations` supports recipient types:

```text
user
admin
doctor
assistant
```

Review decisions:

```text
Should patients create conversations with admins?
Should users create self-conversations?
Should recipient active status be enforced?
```

## 7. Socket participant validation

Review Socket.IO events:

```text
typing
stopTyping
markAsRead
```

Risk:

```text
Some events may not verify participant membership before emitting/updating.
```

Expected action:

```text
Add participant checks before room events or DB updates.
```

## 8. Socket file message ownership

`sendMessage` supports `fileId`.

Risk:

```text
Sender may reference a file they do not own if not validated.
```

Expected action:

```text
Validate file ownership/visibility before message insert.
```

## 9. Upload middleware vs AI service MIME mismatch

Image middleware may allow GIF, but AI service accepts:

```text
jpeg
jpg
png
webp
```

Document middleware may allow Word/Excel, but AI service accepts:

```text
pdf
txt
```

Expected action:

```text
Either align middleware with service rules or keep current behavior documented.
```

## 10. Inactive user route consistency

Some routes use `checkAccountActive`; others depend only on `authenticateJWT`.

Expected action:

```text
Decide whether inactive/deactivated users should access addresses, chat-users, conversations, prescriptions, ratings, AI routes, etc.
```

## 11. Assistant standalone documentation

Assistant was covered in cross-security and shared role areas, but not as a full standalone documentation series.

Expected action:

```text
Create Assistant-side docs only if Assistant has full product workflows.
```

# AI Dermatology Integration Summary

## 1. Patient side APIs

```http
POST  /api/ai-dermatology/sessions
GET   /api/ai-dermatology/sessions
GET   /api/ai-dermatology/sessions/:uuid
POST  /api/ai-dermatology/sessions/:uuid/messages
POST  /api/ai-dermatology/sessions/:uuid/images
POST  /api/ai-dermatology/sessions/:uuid/documents
POST  /api/ai-dermatology/sessions/:uuid/complete
POST  /api/ai-dermatology/sessions/:uuid/share
GET   /api/ai-dermatology/sessions/:uuid/shares
PATCH /api/ai-dermatology/shares/:shareUuid/revoke
GET   /api/ai-dermatology/files/:fileUuid
GET   /api/ai-dermatology/usage
```

## 2. Doctor side APIs

```http
GET   /api/ai-dermatology/doctor/shared-sessions
GET   /api/ai-dermatology/doctor/shared-sessions/:shareUuid
GET   /api/ai-dermatology/doctor/files/:fileUuid
PATCH /api/ai-dermatology/doctor/results/:resultUuid/review
```

## 3. Admin AI usage APIs

```http
GET   /api/admin/ai-usage/overview
GET   /api/admin/ai-usage/users/:userId
POST  /api/admin/ai-usage/policies
PUT   /api/admin/ai-usage/policies/:id
PATCH /api/admin/ai-usage/policies/:id/status
```

## 4. Main response fields

AI results include:

```text
response_kind
conversation_reply
case_summary
possible_conditions
severity
red_flags
safe_advice
avoid
recommended_next_step
follow_up_questions
needs_doctor_review
confidence_level
disclaimer
```

## 5. response_kind values

```text
dermatology_chat
small_talk
out_of_scope
safety_triage
image_analysis
document_analysis
final_summary
```

## 6. File URL fields

Uploaded AI files include:

```json
{
  "file_url": "public/static URL",
  "secure_file_url": "full protected URL using BACKEND_URL",
  "secure_file_path": "/api/ai-dermatology/files/<fileUuid>"
}
```

Frontend should use:

```text
secure_file_url
```

for private AI medical files.

## 7. Doctor review

Doctor review stores:

```text
doctor_reviewed
doctor_agreement
reviewed_by_doctor_id
doctor_notes
reviewed_at
```

Supported agreement values documented in tests include:

```text
agree
partially_agree
disagree
not_reviewed
```

## 8. Usage counters

Usage policy fields:

```text
max_total_requests_per_month
max_chat_messages_per_month
max_image_analyses_per_month
max_document_analyses_per_month
max_files_per_session
max_tokens_per_request
```

Counters:

```text
total_requests
chat_messages_count
image_analyses_count
document_analyses_count
tokens_used
```

Events:

```text
chat_message
image_analysis
document_analysis
final_summary
```

## 9. Critical frontend handling

```text
Display conversational AI content from conversation_reply/content.
Use response_kind to choose UI component.
Show urgent warning for severity=urgent or recommended_next_step=urgent_care.
Show doctor review status where available.
Use secure_file_url for uploaded files.
Disable input when session.status=completed.
Handle 429 usage limit errors.
Handle share already_shared=true.
Handle revoked shares disappearing from doctor active list.
```

## 10. Final tested flows

```text
Create session
Send dermatology chat
Send follow-up
Small talk
Out-of-scope
Safety triage
Upload dermatology image
Upload dermatology document
Reject non-dermatology image/document gracefully
Complete session
Share session/result with doctor
Doctor view shared session
Doctor review AI result
Admin view AI usage
Admin create/update/deactivate/reactivate usage policy
Secure files with full URL
```

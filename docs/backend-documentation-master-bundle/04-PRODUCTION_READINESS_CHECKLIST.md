# Production Readiness Checklist

## 1. Environment

```text
[ ] NODE_ENV is production
[ ] PORT configured
[ ] FRONTEND_URL configured
[ ] BACKEND_URL configured correctly for live domain
[ ] SESSION_SECRET set
[ ] SECRET_KEY set
[ ] DB credentials set
[ ] OPENAI_API_KEY set only in secure environment
[ ] AI_PROVIDER configured
[ ] AI_MODEL configured
[ ] AI_USE_MOCK=false in production
[ ] AI_ENABLE_IMAGE_ANALYSIS as intended
[ ] AI_ENABLE_DOCUMENT_ANALYSIS as intended
[ ] AI_REQUIRE_PATIENT_CONSENT=true unless product explicitly disables it
```

## 2. Database

```text
[ ] Main SQL schema applied
[ ] AI-Chat update schema applied
[ ] Required indexes exist
[ ] Foreign keys/cascade behavior verified
[ ] Default AI usage policy exists
[ ] Admin users seeded securely
[ ] Test/demo tokens removed
[ ] Old mock data removed or isolated
```

## 3. Security

```text
[ ] Admin cross-security tests pass
[ ] Doctor cross-security tests pass
[ ] Patient cross-security tests pass
[ ] Suspended users blocked
[ ] Blocked entities blocked
[ ] Revoked tokens rejected
[ ] Inactive/deactivated users reviewed per route
[ ] File access ownership verified
[ ] AI secure file access ownership verified
[ ] Socket participant checks reviewed
[ ] No private data appears in public APIs
```

## 4. Known code review items before production

```text
[ ] profile-user route should be verified for authorizeUser behavior.
[ ] prescriptions GET routes should be verified for req.user.entityType vs req.user.role.
[ ] ratings GET routes should be verified for req.user.entityType vs req.user.role.
[ ] AI share selection should continue deprioritizing small_talk/out_of_scope.
[ ] Conversation self-conversation behavior should be decided.
[ ] Conversation admin-recipient behavior should be decided.
[ ] Socket typing/stopTyping participant validation should be reviewed.
[ ] Socket markAsRead participant validation should be reviewed.
[ ] fileId ownership in socket sendMessage should be reviewed.
```

## 5. AI Dermatology

```text
[ ] Text message flow tested
[ ] Follow-up context tested
[ ] small_talk tested
[ ] out_of_scope tested
[ ] safety_triage tested
[ ] Image analysis tested
[ ] Document analysis tested
[ ] Final summary tested
[ ] Secure file URL uses BACKEND_URL
[ ] Doctor share tested
[ ] Doctor review tested
[ ] Revoke share tested
[ ] Usage limits tested
[ ] Admin AI usage overview tested
[ ] Provider logs tested
```

## 6. Frontend integration

```text
[ ] All protected requests include Bearer token
[ ] Role-specific route guards exist
[ ] Patient uses secure_file_url for AI files
[ ] Doctor uses doctor AI file endpoint for shared files
[ ] Patient handles 401/403/404/429 consistently
[ ] Usage remaining limits displayed
[ ] AI response_kind handled in UI
[ ] Completed AI session blocks new input
[ ] Revoked share hidden from doctor active list
[ ] Public pages do not require auth
```

## 7. Monitoring and logs

```text
[ ] Request logging enabled
[ ] Auth failures logged without secrets
[ ] AI provider logs stored
[ ] AI usage events stored
[ ] Admin sensitive actions logged
[ ] Cleanup schedulers running
[ ] Error responses do not expose stack traces in production
```

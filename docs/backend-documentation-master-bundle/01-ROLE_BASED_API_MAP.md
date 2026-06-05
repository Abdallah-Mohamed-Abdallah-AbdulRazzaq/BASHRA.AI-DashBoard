# Role-Based API Map

## 1. Admin

Admin route groups documented:

```http
/api/auth-admin
/api/profile-admin
/api/admin/users
/api/admin/doctors
/api/admin/appointments
/api/admin/medical-records
/api/admin/blocked-entities
/api/admin/ai-usage
/api/files
/api/features
/api/packages
/api/package-features
/api/health-tips
/api/articles
/api/skin-diseases
/api/locations
```

Primary capabilities:

```text
Authentication and session management
Admin profile management
Manage users and patient profiles
Manage doctors and verification
Manage appointments and medical records
Manage content
Manage locations and files
Manage packages/features/subscriptions
Manage medications/prescriptions/ratings
Manage AI usage policies and logs
Manage blocked entities and security controls
```

## 2. Doctor

Doctor route groups documented:

```http
/api/auth-doctor
/api/profile-doctor
/api/profile-doctor/professional
/api/profile-doctor/verification-documents
/api/doctor-contact-details
/api/clinics
/api/doctor-schedules
/api/doctor-subscriptions
/api/doctor/appointments
/api/doctor/medical-records
/api/medications
/api/prescription-templates
/api/prescriptions
/api/ratings
/api/conversations
/api/chat-users
/api/ai-dermatology/doctor/*
```

Primary capabilities:

```text
Authentication and sessions
Complete doctor profile
Professional and verification data
Clinic/contact/address management
Schedule and availability
Subscription management
Appointment lifecycle
Medical records access and management
Medication and prescription workflows
Respond to ratings
Chat and conversations
Review shared AI dermatology results
```

## 3. Patient / User

Patient route groups documented:

```http
/api/auth-user
/api/profile-user
/api/patient-profiles
/api/addresses
/api/patient/appointments
/api/patient/medical-records
/api/prescriptions
/api/ratings
/api/conversations
/api/chat-users
/api/ai-dermatology/*
```

Primary capabilities:

```text
Authentication and sessions
Profile and picture management
Medical profile
Address management
Discover doctors/clinics/content/packages
Book/reschedule/cancel appointments
View final medical records
View prescriptions
Rate doctors
Chat with doctors/assistants/users where supported
Use AI Dermatology
Share AI results with doctors
View AI usage limits
```

## 4. Public

Public route groups documented:

```http
/api/public/packages
/api/public/features
/api/public/clinics
/api/public/doctor-schedules
/api/doctors-by-location
/api/countries-cities
/api/health-tips
/api/ratings/doctor/:doctor_id/stats
```

Expected public behavior:

```text
No token required
No private patient data
No private doctor operational data unless intended public
Read-only behavior
```

## 5. Assistant

Assistant was included in cross-security and conversation/chat-user tests.

Known assistant-related areas:

```http
/api/profile-assistant
/api/conversations
/api/chat-users
```

Recommended future step only if Assistant is a full product role:

```text
Create Assistant Batch 1..N similar to Doctor/Patient structure.
```

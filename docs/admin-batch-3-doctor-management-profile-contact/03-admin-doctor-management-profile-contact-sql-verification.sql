-- Admin Batch 3 SQL Verification
-- Doctor Management + Doctor Profile Verification + Contact Details

-- 1. Confirm admins and roles
SELECT
  id,
  uuid,
  email,
  admin_type,
  status,
  is_active,
  last_login_at,
  created_at
FROM admins
ORDER BY id DESC
LIMIT 20;

-- 2. Set test doctor ID
SET @test_doctor_id = 1;

-- 3. Doctor account snapshot
SELECT
  d.id,
  d.uuid,
  d.email,
  d.phone,
  d.status,
  d.is_active,
  d.email_verified_at,
  d.phone_verified_at,
  d.is_id_verified,
  d.last_login_at,
  d.last_activity_at,
  d.current_subscription_id,
  d.created_at,
  d.updated_at
FROM doctors d
WHERE d.id = @test_doctor_id;

-- 4. Doctor profile snapshot
SELECT
  dp.id AS profile_id,
  dp.doctor_id,
  dp.license_number,
  dp.profile_picture_url,
  dp.years_of_experience,
  dp.medical_school,
  dp.graduation_year,
  dp.board_certifications,
  dp.languages_spoken,
  dp.is_verified,
  dp.verification_date,
  dp.verified_by,
  va.email AS verified_by_email,
  dp.approval_status,
  dp.rating_average,
  dp.rating_count,
  dp.total_consultations,
  dp.is_available,
  dp.next_available_slot,
  dp.date_of_birth,
  dp.gender,
  dp.nationality,
  dp.emergency_contact_phone,
  dp.timezone,
  dp.language_preference,
  dp.created_at,
  dp.updated_at
FROM doctor_profiles dp
LEFT JOIN admins va ON va.id = dp.verified_by
WHERE dp.doctor_id = @test_doctor_id;

-- 5. Doctor profile translations
SELECT
  dpt.id,
  dpt.doctor_profile_id,
  dpt.language_code,
  dpt.full_name,
  dpt.specialty,
  dpt.sub_specialty,
  dpt.biography,
  dpt.emergency_contact_name,
  dpt.emergency_contact_relationship
FROM doctor_profile_translations dpt
WHERE dpt.doctor_profile_id IN (
  SELECT id FROM doctor_profiles WHERE doctor_id = @test_doctor_id
)
ORDER BY dpt.language_code;

-- 6. Doctor verification documents
SELECT
  dvd.id,
  dvd.doctor_id,
  dvd.document_type,
  dvd.file_url,
  dvd.status,
  dvd.rejection_reason,
  dvd.uploaded_at,
  dvd.verified_at,
  dvd.verified_by,
  a.email AS verified_by_email
FROM doctor_verification_documents dvd
LEFT JOIN admins a ON a.id = dvd.verified_by
WHERE dvd.doctor_id = @test_doctor_id
ORDER BY dvd.uploaded_at DESC;

-- 7. Doctor contact details
SELECT
  dcd.id,
  dcd.doctor_id,
  d.email AS doctor_email,
  dcd.whatsapp_number,
  dcd.additional_phone,
  dcd.personal_email,
  dcd.contact_notes,
  dcd.created_at,
  dcd.updated_at
FROM doctor_contact_details dcd
JOIN doctors d ON d.id = dcd.doctor_id
WHERE dcd.doctor_id = @test_doctor_id;

-- 8. Doctor counts by account status
SELECT
  status,
  COUNT(*) AS doctors_count
FROM doctors
GROUP BY status
ORDER BY doctors_count DESC;

-- 9. Doctor profile counts by approval status
SELECT
  approval_status,
  COUNT(*) AS profiles_count
FROM doctor_profiles
GROUP BY approval_status
ORDER BY profiles_count DESC;

-- 10. Verified/unverified doctor profile counts
SELECT
  is_verified,
  COUNT(*) AS profiles_count
FROM doctor_profiles
GROUP BY is_verified;

-- 11. Pending doctors list
SELECT
  d.id,
  d.uuid,
  d.email,
  d.phone,
  d.status,
  dp.approval_status,
  dp.is_verified,
  dpt.full_name,
  dpt.specialty,
  d.created_at
FROM doctors d
LEFT JOIN doctor_profiles dp ON dp.doctor_id = d.id
LEFT JOIN doctor_profile_translations dpt 
  ON dpt.doctor_profile_id = dp.id AND dpt.language_code = 'ar'
WHERE d.status = 'pending_verification'
   OR dp.approval_status = 'pending'
ORDER BY d.created_at DESC
LIMIT 30;

-- 12. Search doctor by email/name/license
SELECT
  d.id,
  d.uuid,
  d.email,
  d.phone,
  d.status,
  dp.license_number,
  dp.approval_status,
  dp.is_verified,
  dpt.full_name,
  dpt.specialty
FROM doctors d
LEFT JOIN doctor_profiles dp ON dp.doctor_id = d.id
LEFT JOIN doctor_profile_translations dpt 
  ON dpt.doctor_profile_id = dp.id AND dpt.language_code = 'ar'
WHERE d.email LIKE '%test%'
   OR d.phone LIKE '%test%'
   OR dp.license_number LIKE '%test%'
   OR dpt.full_name LIKE '%test%'
ORDER BY d.created_at DESC
LIMIT 30;

-- 13. Admin logs related to doctor management
SELECT
  id,
  admin_id,
  action,
  target_type,
  target_id,
  description,
  severity,
  created_at
FROM admin_logs
WHERE
  target_id = @test_doctor_id
  OR target_type IN ('doctor', 'doctor_profile', 'doctors')
  OR action LIKE '%DOCTOR%'
ORDER BY id DESC
LIMIT 80;

-- 14. Auth tokens related to doctor/admin security
SELECT
  id,
  doctor_id,
  admin_id,
  token_type,
  is_revoked,
  expires_at,
  created_at
FROM auth_tokens
WHERE doctor_id = @test_doctor_id OR admin_id IS NOT NULL
ORDER BY id DESC
LIMIT 50;

-- 15. Full doctor record with contact and profile summary
SELECT
  d.id AS doctor_id,
  d.uuid AS doctor_uuid,
  d.email,
  d.phone,
  d.status,
  d.is_active,
  dp.id AS profile_id,
  dp.license_number,
  dp.approval_status,
  dp.is_verified,
  dp.is_available,
  dpt.full_name,
  dpt.specialty,
  dpt.sub_specialty,
  dcd.whatsapp_number,
  dcd.additional_phone,
  dcd.personal_email
FROM doctors d
LEFT JOIN doctor_profiles dp ON dp.doctor_id = d.id
LEFT JOIN doctor_profile_translations dpt 
  ON dpt.doctor_profile_id = dp.id AND dpt.language_code = 'ar'
LEFT JOIN doctor_contact_details dcd ON dcd.doctor_id = d.id
WHERE d.id = @test_doctor_id;

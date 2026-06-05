-- Admin Batch 4 SQL Verification
-- Appointments + Medical Records

-- 1. Confirm admin accounts
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

-- 2. Set test variables
SET @test_patient_id = 1;
SET @test_doctor_id = 1;
SET @test_appointment_id = NULL;
SET @test_medical_record_id = NULL;

-- 3. Appointment statistics by status
SELECT
  status,
  COUNT(*) AS appointments_count
FROM appointments
GROUP BY status
ORDER BY appointments_count DESC;

-- 4. Appointment statistics by payment status
SELECT
  payment_status,
  COUNT(*) AS appointments_count,
  SUM(CASE WHEN payment_status = 'paid' THEN consultation_fee ELSE 0 END) AS paid_revenue,
  SUM(CASE WHEN payment_status = 'pending' THEN consultation_fee ELSE 0 END) AS pending_revenue
FROM appointments
GROUP BY payment_status
ORDER BY appointments_count DESC;

-- 5. Recent appointments
SELECT
  a.id,
  a.uuid,
  a.patient_id,
  u.email AS patient_email,
  a.doctor_id,
  d.email AS doctor_email,
  a.clinic_id,
  a.schedule_id,
  a.appointment_type,
  a.status,
  a.urgency_level,
  a.payment_status,
  a.scheduled_date,
  a.actual_start_time,
  a.duration_minutes,
  a.consultation_fee,
  a.currency_code,
  a.created_by_admin_id,
  a.cancelled_by_admin_id,
  a.cancelled_at,
  a.created_at,
  a.updated_at
FROM appointments a
LEFT JOIN users u ON u.id = a.patient_id
LEFT JOIN doctors d ON d.id = a.doctor_id
ORDER BY a.id DESC
LIMIT 30;

-- 6. Appointment translations for recent appointments
SELECT
  at.id,
  at.appointment_id,
  at.language_code,
  at.chief_complaint,
  at.symptoms_description,
  at.cancellation_reason,
  at.notes,
  at.created_at,
  at.updated_at
FROM appointment_translations at
WHERE at.appointment_id IN (
  SELECT id FROM appointments ORDER BY id DESC LIMIT 30
)
ORDER BY at.appointment_id DESC, at.language_code;

-- 7. Active schedules suitable for admin appointment creation
SELECT 
  ds.id AS schedule_id,
  ds.doctor_id,
  d.email AS doctor_email,
  d.status AS doctor_status,
  dp.approval_status,
  ds.clinic_id,
  ds.day_of_week,
  ds.start_time,
  ds.end_time,
  ds.session_duration,
  ds.session_price,
  ds.currency_code,
  ds.consultation_type,
  ds.is_active,
  ds.created_at
FROM doctor_schedules ds
JOIN doctors d ON d.id = ds.doctor_id
JOIN doctor_profiles dp ON dp.doctor_id = d.id
WHERE ds.is_active = 1
  AND d.status = 'active'
  AND dp.approval_status = 'approved'
ORDER BY ds.id DESC
LIMIT 20;

-- 8. Check slot conflicts before creating an appointment
-- Replace values before running.
-- SET @doctor_id = 1;
-- SET @scheduled_date = '2026-06-10';
-- SET @actual_start_time = '10:00:00';
-- SELECT id, uuid, status, scheduled_date, actual_start_time
-- FROM appointments
-- WHERE doctor_id = @doctor_id
--   AND scheduled_date = @scheduled_date
--   AND actual_start_time = @actual_start_time
--   AND status NOT IN ('cancelled', 'no_show');

-- 9. Medical records statistics by status
SELECT
  record_status,
  COUNT(*) AS records_count
FROM medical_records
GROUP BY record_status
ORDER BY records_count DESC;

-- 10. Medical records summary
SELECT
  mr.id,
  mr.uuid,
  mr.appointment_id,
  mr.patient_id,
  u.email AS patient_email,
  mr.doctor_id,
  d.email AS doctor_email,
  mr.visit_date,
  mr.record_status,
  mr.next_appointment_recommended,
  mr.follow_up_date,
  mr.created_at,
  mr.updated_at
FROM medical_records mr
LEFT JOIN users u ON u.id = mr.patient_id
LEFT JOIN doctors d ON d.id = mr.doctor_id
ORDER BY mr.visit_date DESC
LIMIT 30;

-- 11. Medical record translations for recent records
SELECT
  mrt.id,
  mrt.medical_record_id,
  mrt.language_code,
  mrt.chief_complaint,
  mrt.diagnosis,
  mrt.treatment_plan,
  mrt.follow_up_instructions,
  mrt.doctor_notes,
  mrt.created_at,
  mrt.updated_at
FROM medical_record_translations mrt
WHERE mrt.medical_record_id IN (
  SELECT id FROM medical_records ORDER BY id DESC LIMIT 30
)
ORDER BY mrt.medical_record_id DESC, mrt.language_code;

-- 12. Patient medical history check
SELECT
  mr.id,
  mr.uuid,
  mr.patient_id,
  mr.doctor_id,
  mr.visit_date,
  mr.record_status,
  mrt.chief_complaint,
  mrt.diagnosis,
  dpt.full_name AS doctor_name
FROM medical_records mr
LEFT JOIN medical_record_translations mrt 
  ON mrt.medical_record_id = mr.id AND mrt.language_code = 'ar'
LEFT JOIN doctor_profiles dp ON dp.doctor_id = mr.doctor_id
LEFT JOIN doctor_profile_translations dpt 
  ON dpt.doctor_profile_id = dp.id AND dpt.language_code = 'ar'
WHERE mr.patient_id = @test_patient_id
ORDER BY mr.visit_date DESC;

-- 13. Admin-created appointments
SELECT
  a.id,
  a.uuid,
  a.patient_id,
  a.doctor_id,
  a.status,
  a.scheduled_date,
  a.actual_start_time,
  a.created_by_admin_id,
  ad.email AS created_by_admin_email,
  a.created_at
FROM appointments a
LEFT JOIN admins ad ON ad.id = a.created_by_admin_id
WHERE a.created_by_admin_id IS NOT NULL
ORDER BY a.id DESC
LIMIT 30;

-- 14. Admin-cancelled appointments
SELECT
  a.id,
  a.uuid,
  a.status,
  a.cancelled_by_admin_id,
  ad.email AS cancelled_by_admin_email,
  a.cancelled_at,
  at_ar.cancellation_reason AS cancellation_reason_ar,
  at_en.cancellation_reason AS cancellation_reason_en
FROM appointments a
LEFT JOIN admins ad ON ad.id = a.cancelled_by_admin_id
LEFT JOIN appointment_translations at_ar 
  ON at_ar.appointment_id = a.id AND at_ar.language_code = 'ar'
LEFT JOIN appointment_translations at_en 
  ON at_en.appointment_id = a.id AND at_en.language_code = 'en'
WHERE a.cancelled_by_admin_id IS NOT NULL
ORDER BY a.cancelled_at DESC
LIMIT 30;

-- 15. Record by ID/UUID helper
-- Replace value before running:
-- SET @record_lookup = '1';
-- SELECT * FROM medical_records
-- WHERE id = @record_lookup OR uuid = @record_lookup;

-- 16. Appointment by ID/UUID helper
-- Replace value before running:
-- SET @appointment_lookup = '1';
-- SELECT * FROM appointments
-- WHERE id = @appointment_lookup OR uuid = @appointment_lookup;

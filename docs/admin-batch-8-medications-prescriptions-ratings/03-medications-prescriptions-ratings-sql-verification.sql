-- Batch 8 SQL Verification
-- Medications / Prescriptions / Ratings

-- =========================================================
-- 1. Medications
-- =========================================================

SELECT
  m.id,
  m.uuid,
  m.created_by_doctor_id,
  d.email AS creator_doctor_email,
  m.name_ar,
  m.name_en,
  m.scientific_name,
  m.category,
  m.form_type,
  m.available_dosages,
  m.indications,
  m.warning_alert,
  m.is_active,
  m.created_at,
  m.updated_at
FROM medications m
LEFT JOIN doctors d ON d.id = m.created_by_doctor_id
ORDER BY m.id DESC
LIMIT 50;

-- Search test medications
SELECT
  id,
  uuid,
  name_ar,
  name_en,
  category,
  form_type,
  is_active
FROM medications
WHERE name_ar LIKE '%دفعة 8%'
   OR name_en LIKE '%Batch 8%'
ORDER BY id DESC;

-- Duplicate medication names
SELECT
  name_ar,
  COUNT(*) AS count
FROM medications
GROUP BY name_ar
HAVING COUNT(*) > 1;

SELECT
  name_en,
  COUNT(*) AS count
FROM medications
GROUP BY name_en
HAVING COUNT(*) > 1;

-- Medication categories
SELECT DISTINCT category
FROM medications
WHERE category IS NOT NULL AND is_active = 1
ORDER BY category ASC;

-- Is medication used in templates?
-- SET @medication_id = 1;
-- SELECT COUNT(*) AS template_usage
-- FROM prescription_template_items
-- WHERE medication_id = @medication_id;

-- =========================================================
-- 2. Prescription Templates
-- =========================================================

SELECT
  pt.id,
  pt.uuid,
  pt.doctor_id,
  d.email AS doctor_email,
  pt.template_name,
  pt.description,
  pt.usage_count,
  pt.created_at,
  pt.updated_at
FROM prescription_templates pt
INNER JOIN doctors d ON d.id = pt.doctor_id
ORDER BY pt.id DESC
LIMIT 50;

SELECT
  pti.id AS template_item_id,
  pti.template_id,
  pt.template_name,
  pti.medication_id,
  m.name_ar AS medication_name_ar,
  m.name_en AS medication_name_en,
  pti.default_dosage,
  pti.default_frequency,
  pti.default_duration,
  pti.default_instructions,
  pti.default_quantity
FROM prescription_template_items pti
INNER JOIN prescription_templates pt ON pt.id = pti.template_id
INNER JOIN medications m ON m.id = pti.medication_id
ORDER BY pti.id DESC
LIMIT 100;

-- Duplicate medication inside same template should not exist after successful validation
SELECT
  template_id,
  medication_id,
  COUNT(*) AS count
FROM prescription_template_items
GROUP BY template_id, medication_id
HAVING COUNT(*) > 1;

-- =========================================================
-- 3. Prescriptions
-- =========================================================

SELECT
  p.id,
  p.uuid,
  p.prescription_number,
  p.medical_record_id,
  p.patient_id,
  u.email AS patient_email,
  p.doctor_id,
  d.email AS doctor_email,
  p.medication_id,
  p.medication_name,
  p.dosage,
  p.frequency,
  p.duration,
  p.quantity,
  p.route_of_administration,
  p.refills_allowed,
  p.refills_used,
  p.is_generic_allowed,
  p.status,
  p.prescribed_date,
  p.expiry_date,
  p.filled_date,
  p.created_at,
  p.updated_at
FROM prescriptions p
INNER JOIN users u ON u.id = p.patient_id
INNER JOIN doctors d ON d.id = p.doctor_id
ORDER BY p.id DESC
LIMIT 50;

SELECT
  pt.id,
  pt.prescription_id,
  p.prescription_number,
  pt.language_code,
  pt.instructions,
  pt.indication,
  pt.pharmacy_notes
FROM prescription_translations pt
INNER JOIN prescriptions p ON p.id = pt.prescription_id
ORDER BY pt.id DESC
LIMIT 100;

-- Prescriptions by status
SELECT
  status,
  COUNT(*) AS count
FROM prescriptions
GROUP BY status;

-- Verify medical record belongs to patient before creating prescription
-- SET @medical_record_id = 1;
-- SET @patient_id = 1;
-- SELECT id, patient_id, doctor_id, diagnosis, created_at
-- FROM medical_records
-- WHERE id = @medical_record_id AND patient_id = @patient_id;

-- =========================================================
-- 4. Ratings
-- =========================================================

SELECT
  r.id,
  r.uuid,
  r.appointment_id,
  r.patient_id,
  u.email AS patient_email,
  r.doctor_id,
  d.email AS doctor_email,
  r.rating,
  r.categories,
  r.would_recommend,
  r.is_anonymous,
  r.is_verified,
  r.doctor_responded_at,
  r.is_flagged,
  r.flagged_by_admin_id,
  r.flagged_at,
  r.status,
  r.helpful_votes,
  r.created_at,
  r.updated_at
FROM ratings r
INNER JOIN users u ON u.id = r.patient_id
INNER JOIN doctors d ON d.id = r.doctor_id
ORDER BY r.id DESC
LIMIT 50;

SELECT
  rt.id,
  rt.rating_id,
  r.uuid AS rating_uuid,
  rt.language_code,
  rt.review_title,
  rt.review_comment,
  rt.flagged_reason,
  rt.response_from_doctor
FROM rating_translations rt
INNER JOIN ratings r ON r.id = rt.rating_id
ORDER BY rt.id DESC
LIMIT 100;

-- Doctor rating stats from ratings table
SELECT
  doctor_id,
  COUNT(*) AS active_rating_count,
  ROUND(AVG(rating), 2) AS active_rating_average
FROM ratings
WHERE status = 'active'
GROUP BY doctor_id
ORDER BY doctor_id DESC;

-- Doctor profile rating stats
SELECT
  dp.doctor_id,
  d.email,
  dp.rating_average,
  dp.rating_count
FROM doctor_profiles dp
INNER JOIN doctors d ON d.id = dp.doctor_id
ORDER BY dp.doctor_id DESC
LIMIT 50;

-- Check completed appointments available for rating
SELECT
  a.id,
  a.uuid,
  a.patient_id,
  u.email AS patient_email,
  a.doctor_id,
  d.email AS doctor_email,
  a.status,
  a.scheduled_date,
  a.actual_start_time,
  a.appointment_type,
  r.id AS existing_rating_id
FROM appointments a
INNER JOIN users u ON u.id = a.patient_id
INNER JOIN doctors d ON d.id = a.doctor_id
LEFT JOIN ratings r ON r.appointment_id = a.id
WHERE a.status = 'completed'
ORDER BY a.id DESC
LIMIT 50;

-- Check rating uniqueness by appointment
SELECT
  appointment_id,
  COUNT(*) AS rating_count
FROM ratings
GROUP BY appointment_id
HAVING COUNT(*) > 1;

-- =========================================================
-- 5. Useful pre-test queries
-- =========================================================

-- Find doctors
SELECT
  d.id,
  d.uuid,
  d.email,
  d.status,
  d.is_active,
  COALESCE(dpt_ar.full_name, dpt_en.full_name, dpt_any.full_name) AS full_name
FROM doctors d
LEFT JOIN doctor_profiles dp ON dp.doctor_id = d.id
LEFT JOIN doctor_profile_translations dpt_ar
  ON dpt_ar.doctor_profile_id = dp.id AND dpt_ar.language_code = 'ar'
LEFT JOIN doctor_profile_translations dpt_en
  ON dpt_en.doctor_profile_id = dp.id AND dpt_en.language_code = 'en'
LEFT JOIN doctor_profile_translations dpt_any
  ON dpt_any.doctor_profile_id = dp.id
  AND dpt_any.id = (
    SELECT MIN(id)
    FROM doctor_profile_translations
    WHERE doctor_profile_id = dp.id
  )
ORDER BY d.id DESC
LIMIT 20;

-- Find patients
SELECT
  u.id,
  u.uuid,
  u.email,
  u.phone,
  u.status,
  u.is_active,
  COALESCE(upt_ar.full_name, upt_en.full_name, upt_any.full_name) AS full_name
FROM users u
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN user_profile_translations upt_ar
  ON upt_ar.profile_id = up.id AND upt_ar.language_code = 'ar'
LEFT JOIN user_profile_translations upt_en
  ON upt_en.profile_id = up.id AND upt_en.language_code = 'en'
LEFT JOIN user_profile_translations upt_any
  ON upt_any.profile_id = up.id
  AND upt_any.id = (
    SELECT MIN(id)
    FROM user_profile_translations
    WHERE profile_id = up.id
  )
ORDER BY u.id DESC
LIMIT 20;

-- Find medical records suitable for prescription tests
SELECT
  mr.id,
  mr.uuid,
  mr.patient_id,
  u.email AS patient_email,
  mr.doctor_id,
  d.email AS doctor_email,
  mr.diagnosis,
  mr.created_at
FROM medical_records mr
INNER JOIN users u ON u.id = mr.patient_id
INNER JOIN doctors d ON d.id = mr.doctor_id
ORDER BY mr.id DESC
LIMIT 50;

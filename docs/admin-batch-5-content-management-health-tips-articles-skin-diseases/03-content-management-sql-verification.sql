-- Admin Batch 5 SQL Verification
-- Content Management: Health Tips / Medical Articles / Skin Diseases

-- 1. Admin accounts
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

-- 2. Daily tips overview
SELECT
  COUNT(*) AS total,
  SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS active,
  SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) AS inactive,
  SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS today_created
FROM daily_tips;

-- 3. Recent daily tips
SELECT
  dt.id,
  dt.title_ar,
  dt.title_en,
  LEFT(dt.description_ar, 120) AS description_ar_preview,
  dt.is_active,
  dt.created_by,
  creator.email AS created_by_email,
  dt.updated_by,
  updater.email AS updated_by_email,
  dt.created_at,
  dt.updated_at
FROM daily_tips dt
LEFT JOIN admins creator ON creator.id = dt.created_by
LEFT JOIN admins updater ON updater.id = dt.updated_by
ORDER BY dt.id DESC
LIMIT 30;

-- 4. Active latest daily tip
SELECT
  id,
  title_ar,
  title_en,
  is_active,
  created_at
FROM daily_tips
WHERE is_active = 1
ORDER BY created_at DESC
LIMIT 1;

-- 5. Medical articles overview
SELECT
  COUNT(*) AS total,
  SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS active,
  SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) AS inactive,
  SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS today_created
FROM medical_articles;

-- 6. Recent medical articles
SELECT
  ma.id,
  ma.title_ar,
  ma.title_en,
  ma.sub_title_ar,
  ma.sub_title_en,
  LEFT(ma.description_ar, 120) AS description_ar_preview,
  ma.is_active,
  ma.created_by,
  creator.email AS created_by_email,
  ma.updated_by,
  updater.email AS updated_by_email,
  ma.created_at,
  ma.updated_at
FROM medical_articles ma
LEFT JOIN admins creator ON creator.id = ma.created_by
LEFT JOIN admins updater ON updater.id = ma.updated_by
ORDER BY ma.id DESC
LIMIT 30;

-- 7. Skin diseases overview
SELECT
  COUNT(*) AS total,
  SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS active,
  SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) AS inactive,
  SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS today_created
FROM skin_diseases_info;

-- 8. Recent skin diseases
SELECT
  sdi.id,
  sdi.title_ar,
  sdi.title_en,
  LEFT(sdi.description_ar, 120) AS description_ar_preview,
  sdi.website_link,
  sdi.is_active,
  sdi.created_by,
  creator.email AS created_by_email,
  sdi.updated_by,
  updater.email AS updated_by_email,
  sdi.created_at,
  sdi.updated_at
FROM skin_diseases_info sdi
LEFT JOIN admins creator ON creator.id = sdi.created_by
LEFT JOIN admins updater ON updater.id = sdi.updated_by
ORDER BY sdi.id DESC
LIMIT 30;

-- 9. Mixed active content for frontend home sections
SELECT 'daily_tip' AS type, id, title_ar, title_en, is_active, created_at
FROM daily_tips
WHERE is_active = 1
UNION ALL
SELECT 'medical_article' AS type, id, title_ar, title_en, is_active, created_at
FROM medical_articles
WHERE is_active = 1
UNION ALL
SELECT 'skin_disease' AS type, id, title_ar, title_en, is_active, created_at
FROM skin_diseases_info
WHERE is_active = 1
ORDER BY created_at DESC
LIMIT 30;

-- 10. Search-like SQL check
SET @search_term = '%اكزيما%';

SELECT 'daily_tip' AS type, id, title_ar, title_en, is_active, created_at
FROM daily_tips
WHERE is_active = 1
  AND (title_ar LIKE @search_term OR title_en LIKE @search_term OR description_ar LIKE @search_term OR description_en LIKE @search_term)
UNION ALL
SELECT 'medical_article' AS type, id, title_ar, title_en, is_active, created_at
FROM medical_articles
WHERE is_active = 1
  AND (title_ar LIKE @search_term OR title_en LIKE @search_term OR sub_title_ar LIKE @search_term OR sub_title_en LIKE @search_term OR description_ar LIKE @search_term OR description_en LIKE @search_term)
UNION ALL
SELECT 'skin_disease' AS type, id, title_ar, title_en, is_active, created_at
FROM skin_diseases_info
WHERE is_active = 1
  AND (title_ar LIKE @search_term OR title_en LIKE @search_term OR description_ar LIKE @search_term OR description_en LIKE @search_term)
ORDER BY created_at DESC;

-- 11. Content created by a specific admin
SET @admin_id = 1;

SELECT 'daily_tip' AS type, id, title_ar, title_en, is_active, created_by, updated_by, created_at, updated_at
FROM daily_tips
WHERE created_by = @admin_id
UNION ALL
SELECT 'medical_article' AS type, id, title_ar, title_en, is_active, created_by, updated_by, created_at, updated_at
FROM medical_articles
WHERE created_by = @admin_id
UNION ALL
SELECT 'skin_disease' AS type, id, title_ar, title_en, is_active, created_by, updated_by, created_at, updated_at
FROM skin_diseases_info
WHERE created_by = @admin_id
ORDER BY created_at DESC
LIMIT 50;

-- 12. Verify one content row by ID after create/update
-- SET @daily_tip_id = 1;
-- SELECT * FROM daily_tips WHERE id = @daily_tip_id;

-- SET @medical_article_id = 1;
-- SELECT * FROM medical_articles WHERE id = @medical_article_id;

-- SET @skin_disease_id = 1;
-- SELECT * FROM skin_diseases_info WHERE id = @skin_disease_id;

-- 13. Verify delete operation removed disposable test rows
-- SELECT * FROM daily_tips WHERE id = @daily_tip_id;
-- SELECT * FROM medical_articles WHERE id = @medical_article_id;
-- SELECT * FROM skin_diseases_info WHERE id = @skin_disease_id;

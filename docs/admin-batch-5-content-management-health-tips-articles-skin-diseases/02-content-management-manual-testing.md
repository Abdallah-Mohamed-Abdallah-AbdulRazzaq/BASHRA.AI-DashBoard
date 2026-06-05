# Admin Batch 5 Manual Testing Guide
## Content Management: Health Tips / Medical Articles / Skin Diseases

## 0. Required Postman variables

```text
base_url=http://localhost:3006
admin_token=<ADMIN_ACCESS_TOKEN>
user_token=<USER_ACCESS_TOKEN>
doctor_token=<DOCTOR_ACCESS_TOKEN>
assistant_token=<ASSISTANT_ACCESS_TOKEN>

daily_tip_id=<CREATED_OR_EXISTING_ID>
medical_article_id=<CREATED_OR_EXISTING_ID>
skin_disease_id=<CREATED_OR_EXISTING_ID>
admin_id=<ADMIN_ID>
```

---

# Part A - Basic Public Read Tests

## 1. Get daily tips

```http
GET {{base_url}}/api/health-tips/daily-tips?page=1&limit=10
```

Expected:

```text
200 OK
success = true
pagination exists
```

## 2. Get active daily tips

```http
GET {{base_url}}/api/health-tips/daily-tips/active?page=1&limit=10
```

Expected:

```text
Only active daily tips should be returned.
```

## 3. Get latest daily tip

```http
GET {{base_url}}/api/health-tips/daily-tips/latest
```

Expected:

```text
200 OK if active tip exists
404 if no active tip exists
```

## 4. Get daily tip by ID

```http
GET {{base_url}}/api/health-tips/daily-tips/{{daily_tip_id}}
```

Negative:

```http
GET {{base_url}}/api/health-tips/daily-tips/abc
```

Expected:

```text
400 invalid ID
```

---

## 5. Get medical articles

```http
GET {{base_url}}/api/health-tips/medical-articles?page=1&limit=10
```

## 6. Get active medical articles

```http
GET {{base_url}}/api/health-tips/medical-articles/active?page=1&limit=10
```

## 7. Get medical article by ID

```http
GET {{base_url}}/api/health-tips/medical-articles/{{medical_article_id}}
```

---

## 8. Get skin diseases

```http
GET {{base_url}}/api/health-tips/skin-diseases?page=1&limit=10
```

## 9. Get active skin diseases

```http
GET {{base_url}}/api/health-tips/skin-diseases/active?page=1&limit=10
```

## 10. Get skin disease by ID

```http
GET {{base_url}}/api/health-tips/skin-diseases/{{skin_disease_id}}
```

---

# Part B - Admin Daily Tips Management

## 11. Create daily tip

```http
POST {{base_url}}/api/health-tips/daily-tips
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "title_ar": "نصيحة اختبار عن ترطيب الجلد",
  "title_en": "Test skin hydration tip",
  "description_ar": "احرص على ترطيب الجلد يوميًا باستخدام مرطب مناسب لنوع بشرتك.",
  "description_en": "Moisturize your skin daily using a product suitable for your skin type.",
  "is_active": true
}
```

Expected:

```text
201 Created
success = true
data.id returned
created_by = admin id
updated_by = admin id
```

Save `data.id` as `daily_tip_id`.

SQL check:

```sql
SELECT * FROM daily_tips WHERE id = <daily_tip_id>;
```

---

## 12. Update daily tip

```http
PUT {{base_url}}/api/health-tips/daily-tips/{{daily_tip_id}}
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "title_ar": "نصيحة اختبار محدثة عن ترطيب الجلد",
  "title_en": "Updated test skin hydration tip",
  "description_ar": "استخدم مرطبًا مناسبًا بعد الاستحمام وحافظ على شرب الماء.",
  "description_en": "Use a suitable moisturizer after showering and stay hydrated.",
  "is_active": true
}
```

Expected:

```text
200 OK
success = true
updated_by = admin id
```

---

## 13. Toggle daily tip status

```http
PATCH {{base_url}}/api/health-tips/daily-tips/{{daily_tip_id}}/toggle-status
Authorization: Bearer {{admin_token}}
```

Run SQL before and after:

```sql
SELECT id, is_active, updated_by, updated_at FROM daily_tips WHERE id = <daily_tip_id>;
```

Expected:

```text
is_active flips from 1 to 0 or 0 to 1
```

---

## 14. Delete daily tip - destructive

Only delete disposable test row.

```http
DELETE {{base_url}}/api/health-tips/daily-tips/{{daily_tip_id}}
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
row removed from daily_tips
```

---

# Part C - Admin Medical Articles Management

## 15. Create medical article

```http
POST {{base_url}}/api/health-tips/medical-articles
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "title_ar": "مقال اختبار عن البشرة الحساسة",
  "title_en": "Test article about sensitive skin",
  "sub_title_ar": "نصائح للبشرة الحساسة",
  "sub_title_en": "Tips for sensitive skin",
  "description_ar": "البشرة الحساسة تحتاج إلى روتين لطيف وتجنب المنتجات المعطرة.",
  "description_en": "Sensitive skin needs a gentle routine and avoiding fragranced products.",
  "is_active": true
}
```

Save `data.id` as `medical_article_id`.

---

## 16. Update medical article

```http
PUT {{base_url}}/api/health-tips/medical-articles/{{medical_article_id}}
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "title_ar": "مقال اختبار محدث عن البشرة الحساسة",
  "title_en": "Updated test article about sensitive skin",
  "sub_title_ar": "روتين لطيف للبشرة الحساسة",
  "sub_title_en": "Gentle routine for sensitive skin",
  "description_ar": "اختر منتجات خالية من العطور وقم باختبار المنتج على منطقة صغيرة أولًا.",
  "description_en": "Choose fragrance-free products and patch test first.",
  "is_active": true
}
```

---

## 17. Toggle medical article status

```http
PATCH {{base_url}}/api/health-tips/medical-articles/{{medical_article_id}}/toggle-status
Authorization: Bearer {{admin_token}}
```

---

## 18. Delete medical article - destructive

```http
DELETE {{base_url}}/api/health-tips/medical-articles/{{medical_article_id}}
Authorization: Bearer {{admin_token}}
```

Use disposable test row only.

---

# Part D - Admin Skin Diseases Management

## 19. Create skin disease

```http
POST {{base_url}}/api/health-tips/skin-diseases
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "title_ar": "الأكزيما اختبار",
  "title_en": "Test Eczema",
  "description_ar": "الأكزيما حالة جلدية تسبب الحكة والجفاف والاحمرار وقد تحتاج إلى متابعة طبية.",
  "description_en": "Eczema is a skin condition that causes itching, dryness, and redness.",
  "website_link": "https://example.com/eczema",
  "is_active": true
}
```

Save `data.id` as `skin_disease_id`.

---

## 20. Update skin disease

```http
PUT {{base_url}}/api/health-tips/skin-diseases/{{skin_disease_id}}
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "title_ar": "الأكزيما اختبار محدث",
  "title_en": "Updated Test Eczema",
  "description_ar": "الأكزيما قد تسبب الحكة والجفاف وتحتاج إلى تجنب المهيجات وترطيب الجلد.",
  "description_en": "Eczema may cause itching and dryness and requires avoiding irritants.",
  "website_link": "https://example.com/eczema-updated",
  "is_active": true
}
```

---

## 21. Toggle skin disease status

```http
PATCH {{base_url}}/api/health-tips/skin-diseases/{{skin_disease_id}}/toggle-status
Authorization: Bearer {{admin_token}}
```

---

## 22. Delete skin disease - destructive

```http
DELETE {{base_url}}/api/health-tips/skin-diseases/{{skin_disease_id}}
Authorization: Bearer {{admin_token}}
```

Use disposable test row only.

---

# Part E - Advanced APIs

## 23. Get advanced statistics

```http
GET {{base_url}}/api/health-tips/advanced/statistics
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
data.daily_tips
data.medical_articles
data.skin_diseases
```

---

## 24. Search content as user

```http
GET {{base_url}}/api/health-tips/advanced/search?q=اكزيما&page=1&limit=20
Authorization: Bearer {{user_token}}
```

Expected:

```text
200 OK
success = true
data array
breakdown exists
search_term = اكزيما
```

Negative:

```http
GET {{base_url}}/api/health-tips/advanced/search?q=ا
Authorization: Bearer {{user_token}}
```

Expected:

```text
400 because q length is less than 2
```

---

## 25. Get recent content as user

```http
GET {{base_url}}/api/health-tips/advanced/recent?limit=10
Authorization: Bearer {{user_token}}
```

Expected:

```text
200 OK
active mixed content returned
```

---

## 26. Get content by admin

```http
GET {{base_url}}/api/health-tips/advanced/by-admin/{{admin_id}}?page=1&limit=20
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
breakdown exists
content created_by admin returned
```

---

## 27. Bulk update status

```http
PATCH {{base_url}}/api/health-tips/advanced/bulk-status
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "ids": [1],
  "type": "daily_tip",
  "status": true
}
```

Valid `type` values:

```text
daily_tip
medical_article
skin_disease
```

Expected:

```text
200 OK
affected_rows returned
```

Negative tests:

```json
{
  "ids": [],
  "type": "daily_tip",
  "status": true
}
```

Expected 400.

```json
{
  "ids": [1],
  "type": "wrong_type",
  "status": true
}
```

Expected 400.

```json
{
  "ids": [1],
  "type": "daily_tip",
  "status": "true"
}
```

Expected 400 because advanced route requires boolean.

---

## 28. Export content

```http
GET {{base_url}}/api/health-tips/advanced/export?type=all&is_active=true&format=json
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
data.daily_tips / medical_articles / skin_diseases depending on type
export_info exists
```

Unsupported format:

```http
GET {{base_url}}/api/health-tips/advanced/export?type=all&format=csv
Authorization: Bearer {{admin_token}}
```

Expected:

```text
400 unsupported export format
```

---

## 29. Validate content payload

```http
POST {{base_url}}/api/health-tips/advanced/validate
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "type": "skin_disease",
  "data": {
    "title_ar": "الأكزيما",
    "description_ar": "الأكزيما حالة جلدية تسبب الحكة والجفاف والاحمرار.",
    "website_link": "https://example.com/eczema"
  }
}
```

Expected:

```text
200 OK
success = true
```

Invalid body:

```json
{
  "type": "skin_disease",
  "data": {
    "title_ar": "ا",
    "description_ar": "قصير",
    "website_link": "not-a-url"
  }
}
```

Expected:

```text
400 with errors array
```

---

# Part F - Security Negative Tests

## 30. Normal user cannot create daily tip

```http
POST {{base_url}}/api/health-tips/daily-tips
Authorization: Bearer {{user_token}}
Content-Type: application/json
```

Use create body.

Expected:

```text
403 Forbidden
```

## 31. No token cannot create content

```http
POST {{base_url}}/api/health-tips/medical-articles
Content-Type: application/json
```

Expected:

```text
401 Unauthorized or auth middleware error
```

## 32. Public basic GET works without token

```http
GET {{base_url}}/api/health-tips/skin-diseases/active
```

Expected:

```text
200 OK
```

---

# Final SQL checks

```sql
SELECT COUNT(*) AS total, SUM(is_active = 1) AS active, SUM(is_active = 0) AS inactive FROM daily_tips;
SELECT COUNT(*) AS total, SUM(is_active = 1) AS active, SUM(is_active = 0) AS inactive FROM medical_articles;
SELECT COUNT(*) AS total, SUM(is_active = 1) AS active, SUM(is_active = 0) AS inactive FROM skin_diseases_info;
```

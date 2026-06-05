# Admin Batch 5 API Documentation
## Content Management: Health Tips / Medical Articles / Skin Diseases

## 1. Overview

This document covers content management APIs mounted under:

```http
/api/health-tips
/api/health-tips/advanced
```

The feature includes:

- Daily health tips
- Medical articles
- Skin diseases information
- Advanced mixed-content operations

---

## 2. Authentication and Authorization

### Basic content GET endpoints

In the reviewed `routes/healthTipsRoutes.js`, read endpoints have authentication commented out, so they are currently public:

```http
GET /api/health-tips/daily-tips
GET /api/health-tips/daily-tips/active
GET /api/health-tips/daily-tips/latest
GET /api/health-tips/daily-tips/:id
GET /api/health-tips/medical-articles
GET /api/health-tips/medical-articles/active
GET /api/health-tips/medical-articles/:id
GET /api/health-tips/skin-diseases
GET /api/health-tips/skin-diseases/active
GET /api/health-tips/skin-diseases/:id
```

### Admin write endpoints

Admin content write endpoints require:

```http
Authorization: Bearer <ADMIN_TOKEN>
```

and use:

```text
authenticateJWT
authorizeAnyAdmin
parseFormData
validation middleware
```

### Advanced endpoints

| Endpoint | Permission |
|---|---|
| `GET /advanced/statistics` | Any Admin |
| `GET /advanced/search` | User / Doctor / Assistant |
| `GET /advanced/recent` | User / Doctor / Assistant |
| `GET /advanced/by-admin/:adminId` | Any Admin |
| `PATCH /advanced/bulk-status` | Any Admin |
| `GET /advanced/export` | Any Admin |
| `POST /advanced/validate` | Any Admin |

---

# Part A - Daily Tips

Base:

```http
/api/health-tips/daily-tips
```

## A1. Get All Daily Tips

```http
GET /api/health-tips/daily-tips
```

### Query params

| Param | Type | Required | Notes |
|---|---:|---:|---|
| `page` | number | No | Default 1 |
| `limit` | number | No | Default 10 |
| `is_active` | boolean string | No | `true` or `false` |

### Example

```http
GET /api/health-tips/daily-tips?page=1&limit=10
```

### Expected success

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "pages": 0
  },
  "message": "تم جلب النصائح اليومية بنجاح"
}
```

### Validation

If `page <= 0` or `limit <= 0`, returns 400.

---

## A2. Get Active Daily Tips

```http
GET /api/health-tips/daily-tips/active
```

### Notes

The route sets:

```text
req.query.is_active = "true"
```

then calls the same list controller.

---

## A3. Get Latest Daily Tip

```http
GET /api/health-tips/daily-tips/latest
```

### Notes

Returns the latest active daily tip ordered by `created_at DESC`.

### Expected not found

```json
{
  "success": false,
  "message": "لا توجد نصائح يومية مسجلة"
}
```

---

## A4. Get Daily Tip by ID

```http
GET /api/health-tips/daily-tips/:id
```

### Path params

| Param | Type | Required |
|---|---:|---:|
| `id` | number | Yes |

### Invalid ID

Returns 400 if id is invalid or <= 0.

### Not found

Returns 404 if no row exists in `daily_tips`.

---

## A5. Create Daily Tip

```http
POST /api/health-tips/daily-tips
```

### Permission

```text
Any Admin
```

### Body

```json
{
  "title_ar": "نصيحة يومية عن ترطيب الجلد",
  "title_en": "Daily skin hydration tip",
  "description_ar": "احرص على ترطيب الجلد يوميًا خاصة بعد الاستحمام.",
  "description_en": "Moisturize your skin daily, especially after showering.",
  "is_active": true
}
```

### Required validation

| Field | Rule |
|---|---|
| `title_ar` | Required, 3-255 chars |
| `description_ar` | Required, min 10 chars |
| `title_en` | Optional, max 255 chars |
| `description_en` | Optional, min 10 chars if provided |
| `is_active` | Optional boolean |

### DB impact

Insert into `daily_tips`:

```text
title_ar
title_en
description_ar
description_en
created_by
updated_by
is_active
```

---

## A6. Update Daily Tip

```http
PUT /api/health-tips/daily-tips/:id
```

### Permission

```text
Any Admin
```

### Body

```json
{
  "title_ar": "نصيحة محدثة عن ترطيب الجلد",
  "title_en": "Updated skin hydration tip",
  "description_ar": "استخدم مرطبًا مناسبًا لنوع بشرتك.",
  "description_en": "Use a moisturizer suitable for your skin type.",
  "is_active": true
}
```

### Important note

The current controller update SQL sets all listed fields. Send a full update payload to avoid unintentionally writing null/undefined values depending on request parsing behavior.

---

## A7. Delete Daily Tip

```http
DELETE /api/health-tips/daily-tips/:id
```

### Permission

```text
Any Admin
```

### Warning

This endpoint executes a real delete:

```sql
DELETE FROM daily_tips WHERE id = ?
```

Use only a disposable test row.

---

## A8. Toggle Daily Tip Status

```http
PATCH /api/health-tips/daily-tips/:id/toggle-status
```

### Permission

```text
Any Admin
```

### DB impact

Flips `is_active` and updates `updated_by`, `updated_at`.

---

# Part B - Medical Articles

Base:

```http
/api/health-tips/medical-articles
```

## B1. Get All Medical Articles

```http
GET /api/health-tips/medical-articles
```

### Query params

| Param | Type | Required |
|---|---:|---:|
| `page` | number | No |
| `limit` | number | No |
| `is_active` | boolean string | No |

---

## B2. Get Active Medical Articles

```http
GET /api/health-tips/medical-articles/active
```

---

## B3. Get Medical Article by ID

```http
GET /api/health-tips/medical-articles/:id
```

---

## B4. Create Medical Article

```http
POST /api/health-tips/medical-articles
```

### Permission

```text
Any Admin
```

### Body

```json
{
  "title_ar": "مقال عن العناية بالبشرة الحساسة",
  "title_en": "Sensitive skin care article",
  "sub_title_ar": "نصائح مهمة للبشرة الحساسة",
  "sub_title_en": "Important tips for sensitive skin",
  "description_ar": "البشرة الحساسة تحتاج إلى منتجات لطيفة وتجنب العطور القوية.",
  "description_en": "Sensitive skin needs gentle products and avoiding strong fragrances.",
  "is_active": true
}
```

### Required validation

| Field | Rule |
|---|---|
| `title_ar` | Required, 3-255 chars |
| `description_ar` | Required, min 10 chars |
| `title_en` | Optional, max 255 chars |
| `sub_title_ar` | Optional, max 255 chars |
| `sub_title_en` | Optional, max 255 chars |
| `description_en` | Optional, min 10 chars if provided |
| `is_active` | Optional boolean |

### DB table

```text
medical_articles
```

---

## B5. Update Medical Article

```http
PUT /api/health-tips/medical-articles/:id
```

### Permission

```text
Any Admin
```

Use a full body payload similar to create.

---

## B6. Delete Medical Article

```http
DELETE /api/health-tips/medical-articles/:id
```

### Warning

This endpoint executes a real delete:

```sql
DELETE FROM medical_articles WHERE id = ?
```

---

## B7. Toggle Medical Article Status

```http
PATCH /api/health-tips/medical-articles/:id/toggle-status
```

Flips `is_active`.

---

# Part C - Skin Diseases Info

Base:

```http
/api/health-tips/skin-diseases
```

## C1. Get All Skin Diseases

```http
GET /api/health-tips/skin-diseases
```

---

## C2. Get Active Skin Diseases

```http
GET /api/health-tips/skin-diseases/active
```

---

## C3. Get Skin Disease by ID

```http
GET /api/health-tips/skin-diseases/:id
```

---

## C4. Create Skin Disease Info

```http
POST /api/health-tips/skin-diseases
```

### Permission

```text
Any Admin
```

### Body

```json
{
  "title_ar": "الأكزيما",
  "title_en": "Eczema",
  "description_ar": "الأكزيما حالة جلدية تسبب الحكة والجفاف والاحمرار.",
  "description_en": "Eczema is a skin condition that causes itching, dryness, and redness.",
  "website_link": "https://example.com/eczema",
  "is_active": true
}
```

### Required validation

| Field | Rule |
|---|---|
| `title_ar` | Required, 3-255 chars |
| `description_ar` | Required, min 10 chars |
| `title_en` | Optional, max 255 chars |
| `description_en` | Optional, min 10 chars if provided |
| `website_link` | Optional valid URL, max 500 chars |
| `is_active` | Optional boolean |

### DB table

```text
skin_diseases_info
```

---

## C5. Update Skin Disease Info

```http
PUT /api/health-tips/skin-diseases/:id
```

Use a full payload similar to create.

---

## C6. Delete Skin Disease Info

```http
DELETE /api/health-tips/skin-diseases/:id
```

### Warning

This endpoint executes a real delete:

```sql
DELETE FROM skin_diseases_info WHERE id = ?
```

---

## C7. Toggle Skin Disease Status

```http
PATCH /api/health-tips/skin-diseases/:id/toggle-status
```

Flips `is_active`.

---

# Part D - Advanced Health Content APIs

Base:

```http
/api/health-tips/advanced
```

## D1. Get Health Content Statistics

```http
GET /api/health-tips/advanced/statistics
```

### Permission

```text
Any Admin
```

### Returns

Stats for:

```text
daily_tips
medical_articles
skin_diseases
```

Each has:

```text
total
active
inactive
today_created
```

---

## D2. Search Health Content

```http
GET /api/health-tips/advanced/search?q=اكزيما&page=1&limit=20
```

### Permission

```text
Authenticated User / Doctor / Assistant
```

### Query params

| Param | Type | Required |
|---|---:|---:|
| `q` | string | Yes, min 2 chars |
| `page` | number | No |
| `limit` | number | No |

### Notes

Search covers active rows only from:

```text
daily_tips
medical_articles
skin_diseases_info
```

It returns:

```text
data
pagination
breakdown
search_term
```

### Invalid search

If `q` missing or less than 2 chars:

```json
{
  "success": false,
  "message": "يجب أن يكون مصطلح البحث على الأقل حرفين"
}
```

---

## D3. Get Recent Mixed Health Content

```http
GET /api/health-tips/advanced/recent?limit=10
```

### Permission

```text
Authenticated User / Doctor / Assistant
```

### Notes

Returns active mixed content from all 3 tables.

---

## D4. Get Content by Admin

```http
GET /api/health-tips/advanced/by-admin/:adminId?page=1&limit=20
```

### Permission

```text
Any Admin
```

### Notes

Returns content created by a specific admin across all 3 content types.

---

## D5. Bulk Update Status

```http
PATCH /api/health-tips/advanced/bulk-status
```

### Permission

```text
Any Admin
```

### Body

```json
{
  "ids": [1, 2, 3],
  "type": "daily_tip",
  "status": true
}
```

### Valid type values

```text
daily_tip
medical_article
skin_disease
```

### Validation

| Case | HTTP |
|---|---:|
| Missing/empty `ids` | 400 |
| Invalid `type` | 400 |
| `status` not boolean | 400 |

### DB impact

Updates `is_active`, `updated_by`, `updated_at` in the selected content table.

---

## D6. Export Health Content

```http
GET /api/health-tips/advanced/export?type=all&is_active=true&format=json
```

### Permission

```text
Any Admin
```

### Query params

| Param | Type | Required | Notes |
|---|---:|---:|---|
| `type` | string | No | `all`, `daily_tips`, `medical_articles`, `skin_diseases` |
| `is_active` | boolean string | No | `true` or `false` |
| `format` | string | No | Current supported value: `json` |

### Unsupported format

If `format` is not `json`, returns 400.

---

## D7. Validate Content Payload

```http
POST /api/health-tips/advanced/validate
```

### Permission

```text
Any Admin
```

### Body

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

### Notes

Validation checks:

- `title_ar` exists and length >= 3
- `description_ar` exists and length >= 10
- `website_link` format if `type = skin_disease`

---

# Permission Matrix

| Endpoint group | Public | User | Doctor | Assistant | Admin |
|---|---:|---:|---:|---:|---:|
| Basic GET daily tips/articles/skin diseases | Yes | Yes | Yes | Yes | Yes |
| Create/update/delete/toggle content | No | No | No | No | Yes |
| Advanced statistics | No | No | No | No | Yes |
| Advanced search | No | Yes | Yes | Yes | No unless middleware allows |
| Advanced recent | No | Yes | Yes | Yes | No unless middleware allows |
| Advanced by-admin | No | No | No | No | Yes |
| Advanced bulk-status | No | No | No | No | Yes |
| Advanced export | No | No | No | No | Yes |
| Advanced validate | No | No | No | No | Yes |

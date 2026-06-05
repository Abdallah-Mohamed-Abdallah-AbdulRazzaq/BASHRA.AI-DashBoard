# الدفعة 1 — Admin Authentication + Security + Admin Profile

هذه الحزمة توثق وتجهز اختبار الدفعة الأولى من منطق الأدمن في Backend مشروع Bashra AI.

## الملفات داخل الحزمة

1. `01-admin-auth-security-profile-api-docs.md`
   - توثيق تفصيلي لمسارات Admin Auth وAdmin Security وAdmin Profile.

2. `02-admin-auth-security-profile-manual-testing.md`
   - خطوات اختبار يدوية مرتبة باستخدام Postman أو أي API client.

3. `03-admin-auth-security-profile-sql-verification.sql`
   - أوامر SQL للتحقق من أثر كل اختبار داخل قاعدة البيانات.

4. `04-admin-auth-security-profile-postman-collection.json`
   - Postman Collection جاهزة كبداية لاختبار الدفعة الأولى.

5. `05-admin-auth-security-profile-test-matrix.csv`
   - Matrix مختصرة للـ endpoints، الصلاحيات، نوع الاختبار، والنتيجة المتوقعة.

## Base URL

```text
{{base_url}} = http://localhost:3006/api
```

## مصادر الكود المعتمدة في هذه الدفعة

- `routes/index.js`
- `routes/authAdminRoutes.js`
- `routes/profileAdminRoutes.js`
- `controllers/AuthController.js`
- `controllers/AdminSecurityController.js`
- `controllers/profileAdminController.js`
- `middleware/authMiddleware.js`
- `SQL-Database-(Bashraai).sql`

## ملاحظات مهمة

- هذه الدفعة تركز فقط على:
  - Admin Authentication
  - Admin Security
  - Admin Profile
- لا تشمل إدارة المستخدمين `/api/admin/users`، ولا إدارة الأطباء، ولا AI Usage. هذه ستكون في دفعات لاحقة.
- بعض اختبارات الأمن تغيّر حالة حسابات وتوكنات، لذلك لا تختبرها على حسابات production أو حساب الأدمن الأساسي بدون نسخة احتياطية.

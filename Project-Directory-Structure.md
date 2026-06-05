<!-- Clean Architecture -->

-

my-medical-dashboard/
├── public/                 # (Images, Fonts, Locales)
│   ├── images/
│   ├── fonts/
│   └── locales/            # (إذا قررنا وضع ملفات الترجمة هنا لاحقاً)
├── src/
│   ├── app/                # (Next.js App Router)
│   ├── components/         # (UI Components)
│   ├── lib/                # (Utils & Configs)
│   ├── hooks/              # (Custom Hooks)
│   ├── types/              # (TypeScript Interfaces)
│   ├── constants/          # (Static Data)
│   └── styles/             # (Global Styles)
├── .env.local              # (Environment Variables)
├── .eslintrc.json          # (Linting Rules)
├── .gitignore              # (Git Ignore)
├── next.config.mjs         # (Next.js Config)
├── package.json            # (Dependencies)
├── postcss.config.mjs      # (Tailwind Processing)
├── tailwind.config.ts      # (Tailwind Config)
└── tsconfig.json           # (TypeScript Config)

-

src/
├── app/
│   ├── [lang]/                  # (Dynamic Route) لدعم العربية والإنجليزية
│   │   ├── (auth)/              # Route Group للمصادقة (بدون Sidebar)
│   │   │   ├── login/
│   │   │   └── register/
│   │   │
│   │   ├── (dashboard)/         # Route Group للوحة التحكم (يحتوي على Sidebar)
│   │   │   ├── layout.tsx       # الملف الرئيسي الذي يجمع Sidebar + Navbar
│   │   │   ├── page.tsx         # صفحة الإحصائيات الرئيسية
│   │   │   ├── clinic/          # قسم العيادة
│   │   │   ├── hrm/             # الموارد البشرية
│   │   │   │   ├── staffs/
│   │   │   │   └── attendance/
│   │   │   └── finance/         # المالية
│   │   │
│   │   └── layout.tsx           # Layout لضبط اللغة والخطوط (Direction: RTL/LTR)
│   ├── api/                     # Next.js API Routes (إذا كنت ستبني Backend بسيط هنا)
│   ├── globals.css              # ملف التصميم الرئيسي ومتغيرات الألوان
│   └── favicon.ico
│
├── components/                  # مكونات الواجهة
│   ├── ui/                      # مكونات أساسية (Button, Input, Card) - Reusable
│   ├── layout/                  # مكونات الهيكل
│   │   ├── sidebar/             # كل ما يخص القائمة الجانبية المعقدة
│   │   │   ├── sidebar.tsx
│   │   │   ├── menu-item.tsx
│   │   │   └── mobile-sidebar.tsx
│   │   ├── header/              # الشريط العلوي
│   │   └── footer/
│   │
│   ├── dashboard/               # مكونات خاصة بصفحات الداشبورد (Charts, Widgets)
│   ├── clinic/                  # مكونات خاصة بالعيادة
│   └── shared/                  # مكونات مشتركة (مثل LanguageSwitcher, ThemeToggle)
│
├── lib/                         # دوال مساعدة و Configs
│   ├── api.ts                   # إعدادات Axios و Interceptors (backend integration)
│   ├── utils.ts                 # دوال مساعدة عامة (cn for tailwind)
│   └── dictionary.ts            # جلب ملفات الترجمة
│
├── hooks/                       # Custom Hooks
│   ├── use-sidebar.ts           # للتحكم في فتح وغلق القائمة
│   └── use-auth.ts              # للتحكم في جلسة المستخدم
│
├── types/                       # تعريفات TypeScript
│   ├── index.ts
│   └── navigation.ts            # تعريف هيكل القائمة الجانبية (مهم جداً للصورة التي أرسلتها)
│
├── constants/                   # الثوابت والبيانات الثابتة
│   └── menu-data.ts             # ملف يحتوي على مصفوفة القائمة الجانبية بالكامل
│
├── dictionaries/                # ملفات الترجمة JSON
│   ├── en.json
│   └── ar.json
│
├── middleware.ts                # للتحكم في اللغات والحماية (Protected Routes)
├── i18n.config.ts               # إعدادات اللغات
└── tailwind.config.ts           # إعدادات الألوان والثيمات

.-

my-medical-dashboard/
├── public/                     # المجلد العام (للصور والخطوط)
│   ├── images/
│   ├── fonts/
│   └── locales/                # (احتياطي لملفات الترجمة)
├── src/
│   ├── app/                    # (Next.js App Router)
│   │   ├── [lang]/             # (Dynamic Route) للغات
│   │   │   ├── (auth)/         # (Login/Register)
│   │   │   └── (dashboard)/    # (Protected Dashboard Routes)
│   │   ├── api/                # (Backend Routes if needed)
│   │   ├── globals.css         # (Main Styles)
│   │   └── layout.tsx          # (Root Layout)
│   ├── components/
│   │   ├── ui/                 # (Buttons, Inputs, Cards)
│   │   ├── layout/             # (Sidebar, Header, Footer)
│   │   ├── dashboard/          # (Charts, Widgets)
│   │   ├── clinic/             # (Specific Clinic Components)
│   │   └── shared/             # (ThemeToggle, LangSwitcher)
│   ├── lib/
│   │   ├── api.ts              # (Axios Instance)
│   │   ├── utils.ts            # (Tailwind Merger)
│   │   └── dictionary.ts       # (Translation Logic)
│   ├── hooks/                  # (useSidebar, useAuth)
│   ├── types/                  # (TS Interfaces)
│   ├── constants/              # (Menu Data, Static Configs)
│   ├── dictionaries/           # (JSON Translation Files)
│   ├── middleware.ts           # (Auth & i18n Middleware)
│   └── i18n.config.ts          # (Locale Config)
├── .env.local                  # (Environment Variables)
├── .eslintrc.json
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json

.-

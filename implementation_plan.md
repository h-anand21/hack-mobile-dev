# Portl — Master Implementation Plan
### Single Source of Truth · Expo SDK 55 · Phase-wise

> **Project**: Portl — *Your Society. One Tap Away.*
> **Frontend (Mobile)**: Expo SDK 55 · React Native · TypeScript · Expo Router · NativeWind
> **Backend (Server)**: Express.js · Node.js · TypeScript · ← ALL API KEYS YAHAN
> **Database**: Supabase PostgreSQL + RLS + Realtime + Auth + Storage
> **Auth**: Supabase Auth → Google OAuth + Phone OTP (Firebase NOT needed)
> **Roles**: Resident · Security Guard · Society Admin
> **Total Screens**: 55+
> **References merged**: PRD v1.0 · TRD v1.0 · UI Spec v1.0 · App Flow v1.0

---

## ⚡ Backend Decision: Supabase vs Firebase

> [!IMPORTANT]
> **Decision: Pure Supabase** — Firebase is NOT needed for this project.
> Supabase Auth already supports Google OAuth natively. No extra Firebase SDK needed.

| | ⚡ Supabase (CHOSEN ✅) | 🔥 Firebase |
|---|---|---|
| **Database** | PostgreSQL (relational, SQL) | Firestore (NoSQL, documents) |
| **Best for Portl** | ✅ Perfect — towers→flats→visitors are relational | ❌ NoSQL JOINs are painful |
| **Google Auth** | ✅ Built-in OAuth provider | ✅ Firebase Auth |
| **Phone OTP** | ✅ Supabase Auth OTP | ✅ Firebase Auth |
| **Realtime** | ✅ Postgres Realtime (WebSocket) | ✅ Firestore listeners |
| **Security** | ✅ Row Level Security (SQL policies) | ⚠️ Security Rules (complex) |
| **Analytics queries** | ✅ SQL — visitor counts, charts easy | ❌ Client-side aggregation |
| **Edge Functions** | ✅ Deno (send-push, validate-qr) | ✅ Cloud Functions |
| **Storage** | ✅ Supabase Storage | ✅ Firebase Storage |
| **Push Notifications** | ✅ Expo Push Service (free, no vendor lock) | ✅ FCM (Firebase) |
| **TypeScript types** | ✅ Auto-generated from schema | ❌ Manual |
| **Free tier** | 500MB DB, 2GB storage, 50k Edge calls | 1GB storage, 50k reads/day |

### Why NOT Firebase for Portl

```
Portl data is deeply relational:

towers → flats → residents → visitors → approvals → visitor_logs
                           → complaints
                           → bookings → amenities
                           → payments
                           → votes → polls

In Firestore (NoSQL): Every relationship = extra round-trip query.
  → Get visitor's flat? 2 reads.
  → Admin analytics? Client-side aggregation (slow, expensive).
  → Apply RLS? Write Security Rules per collection manually.

In Supabase (SQL):
  → One JOIN query gets everything.
  → Admin analytics = single SQL GROUP BY.
  → RLS = one SQL policy, done.
```

### Google OAuth via Supabase (no Firebase needed)

```typescript
// ONE line to trigger Google login
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'portl://auth/callback',
    queryParams: { access_type: 'offline', prompt: 'consent' }
  }
})
// Done. No Firebase SDK, no google-services.json needed.
```

**Setup steps:**
1. Supabase Dashboard → Authentication → Providers → Google → Enable
2. Add Google Client ID + Secret (from Google Cloud Console)
3. Add redirect URL: `https://your-project.supabase.co/auth/v1/callback`
4. In app: `expo-auth-session` + `expo-web-browser` for OAuth popup
5. JWT returned automatically, stored in `expo-secure-store`

---

## 🏗️ Full Project Architecture & Split

### System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│     EXPO APP   (portl-app/)   — Android & iOS ONLY                │
│     React Native + TypeScript + NativeWind + Expo Router           │
│     Sirf UI/UX — koi API key nahi                                  │
└─────────────┬────────────────────────┤─────────────────┘
             │ REST API calls              │ Direct
             │ /api/...                    │ (Auth + Realtime)
             ▼                             ▼
┌─────────────────────┐   ┌───────────────────────────────┐
│ EXPRESS BACKEND              │   │ SUPABASE (cloud managed)      │
│ (portl-backend/)             │   │                               │
│ Node.js + TypeScript         │   │  ✔ PostgreSQL (13 tables)    │
│                              │   │  ✔ Auth (Google + OTP)       │
│ ✔ Gemini API key            │   │  ✔ Realtime WebSocket         │
│ ✔ Expo Push token           │◄──►│  ✔ Storage (photos)          │
│ ✔ QR JWT secret             │   │  ✔ RLS security policies     │
│ ✔ Payment gateway key       │   │                               │
│ ✔ Supabase service_role_key │   │ (service_role_key only in    │
│ ✔ Cron jobs (node-cron)     │   │  Express backend .env)       │
└─────────────────────┘   └───────────────────────────────┘
```

---

### 📱 Expo — Sirf kya hai, kya nahi

> [!IMPORTANT]
> **Expo = Mobile Development Platform ONLY**
> Ye ek server nahi hai. Android + iOS app banana iska kaam hai.

| Expo KAR SAKTA hai ✅ | Expo NAHI KAR SAKTA ❌ |
|---|---|
| Android + iOS app banana | Server run karna |
| UI screens, animations | API keys safely rakhna (bundle mein visible!) |
| Camera, QR scan, biometrics | Background Node.js process |
| Push notification **receive** | Push notification **send** (server chahiye) |
| Supabase Realtime **listen** | Cron jobs / scheduled tasks |
| Supabase Auth call | Gemini/Payment API direct call (key expose!) |
| REST API se data lena | Database admin operations |
| expo-secure-store (JWT save) | Secrets protect karna from decompilation |

> [!CAUTION]
> Koi bhi Android APK ko unzip karke `EXPO_PUBLIC_*` variables dekh sakta hai.
> Isliye **sab API keys sirf Express backend `.env` mein** rahenge.
> Supabase `anon key` safe hai (RLS policies protect karti hain).

---

### ✂️ Clean Separation — Kya Kahan Jayega

#### 📱 Expo App `portl-app/` (Frontend)
```
Karega:
✔ UI render karna (NativeWind + Reanimated + Moti)
✔ Express REST API se data lena (axios/fetch)
✔ Supabase Auth directly (login / logout / OTP / Google OAuth)
✔ Supabase Realtime directly (visitor approval live update)
✔ Supabase Storage directly (photo upload — Supabase auth handles it)
✔ Push notification receive + handle (expo-notifications)
✔ Camera, QR scan (expo-camera, expo-barcode-scanner)
✔ Local state (Zustand)
✔ Server state cache (TanStack Query)
✔ Haptics, Lottie, skeleton loading

Nahi karega:
✖ Koi bhi API key store karna
✖ Push notification send karna
✖ AI API call karna
✖ Payment gateway direct call
✖ Cron / scheduled background jobs
```

#### ⚙️ Express Backend `portl-backend/` (Server — TypeScript)
```
Karega:
✔ Expo Push Service se push send karna (← EXPO_PUSH_TOKEN yahan)
✔ Gemini API — AI complaint tagging (← GEMINI_API_KEY yahan)
✔ QR JWT generate + validate (← JWT_QR_SECRET yahan)
✔ Payment gateway — Razorpay/Stripe (← PAYMENT_KEY yahan)
✔ Supabase service_role_key se admin DB operations (← yahan)
✔ Auto-reject expired approvals (node-cron)
✔ Reports generate (PDF via puppeteer)
✔ Webhook handlers
✔ JWT middleware — Supabase JWT verify (every request)
✔ Role middleware — guard/resident/admin check

Nahi karega:
✖ UI banana
✖ Supabase Realtime handle (Expo seedha karta hai)
```

#### ⚡ Supabase (Database + Auth + Storage — Cloud Managed)
```
✔ PostgreSQL database (13 tables)
✔ Auth: Google OAuth + Phone OTP + Email
✔ Realtime WebSocket (Expo app directly subscribe karta hai)
✔ File storage (visitor photos, invoices, QR images)
✔ Row Level Security (RLS policies)

Access:
✔ Expo App     → anon key (safe, RLS protected)
✔ Express API  → service_role_key (bypasses RLS, admin power)
```

---

### 🔐 .env Files — Kahan Kya Rahega

#### `portl-backend/.env` (Express Server — NEVER commit to GitHub)
```bash
# Supabase admin access (bypasses RLS)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...          # secret: never in Expo

# Third party APIs
EXPO_PUSH_ACCESS_TOKEN=...               # for sending push notifications
GEMINI_API_KEY=...                       # AI complaint tagging
RAZORPAY_KEY_SECRET=...                  # payment gateway
JWT_QR_SECRET=superstrongsecret123       # QR code signing
JWT_EXPIRY=1h                            # QR token validity

# Server config
PORT=3000
NODE_ENV=development
CORS_ORIGIN=exp://localhost:8081         # Expo dev URL
```

#### `portl-app/.env` (Expo — `EXPO_PUBLIC_` prefix = safe to expose)
```bash
# Supabase public keys (safe — RLS protects database)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...    # anon key: safe with RLS

# Express backend URL
EXPO_PUBLIC_API_BASE_URL=https://portl-api.railway.app

# App config
EXPO_PUBLIC_APP_ENV=development
```

---

### 📁 Two-Repo Structure

```
hakMobile/
├── portl-app/              ← Expo project (mobile frontend)
│   ├── app/
│   ├── components/
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts       # axios instance → Express BASE_URL
│   │   │   ├── visitors.ts     # api.post('/api/visitors/create')
│   │   │   ├── complaints.ts
│   │   │   ├── bookings.ts
│   │   │   ├── qr.ts           # api.post('/api/qr/generate')
│   │   │   └── admin.ts
│   │   └── supabase/
│   │       ├── client.ts       # createClient(ANON_KEY) only
│   │       ├── auth.ts         # signInWithOAuth, signInWithOTP
│   │       └── realtime.ts     # subscribeVisitors, subscribeApprovals
│   ├── .env                    # EXPO_PUBLIC_* keys only
│   └── package.json
│
└── portl-backend/          ← Express project (server)
    ├── src/
    │   ├── routes/
    │   │   ├── visitors.ts     # POST /api/visitors/create
    │   │   ├── approvals.ts    # POST /api/visitors/:id/approve
    │   │   ├── notifications.ts # POST /api/notifications/send
    │   │   ├── qr.ts           # POST /api/qr/generate
    │   │   ├── complaints.ts
    │   │   ├── bookings.ts
    │   │   ├── payments.ts
    │   │   ├── polls.ts
    │   │   ├── notices.ts
    │   │   └── admin.ts
    │   ├── services/
    │   │   ├── supabase.ts     # createClient(SERVICE_ROLE_KEY)
    │   │   ├── push.ts         # Expo Push API → sendPushNotification()
    │   │   ├── gemini.ts       # AI complaint categorization
    │   │   ├── qr.ts           # jwt.sign() + jwt.verify()
    │   │   └── payment.ts      # Razorpay integration
    │   ├── middleware/
    │   │   ├── auth.ts         # verifySupabaseJWT(req, res, next)
    │   │   └── roleCheck.ts    # requireRole('guard') etc.
    │   ├── jobs/
    │   │   └── autoReject.ts   # node-cron: expire pending approvals every 60s
    │   └── index.ts            # Express app entry: routes + middleware
    ├── .env                    # ALL secret API keys (never commit)
    ├── .env.example            # Template (commit this)
    ├── tsconfig.json
    └── package.json
```

---

### 🔄 API Flow Example (Visitor Approval)

```
[Guard taps "Send Approval Request"]
         │
         ▼
Expo App
  api.post('/api/visitors/create', { name, phone, flatId, photo })
         │ (axios + JWT header)
         ▼
Express /api/visitors/create
  1. verifyJWT middleware → extract userId (guard)
  2. Upload photo → Supabase Storage (service_role_key)
  3. INSERT into visitors table (service_role_key)
  4. INSERT into approvals table
  5. Fetch resident's fcm_token from users
  6. Call push.ts → Expo Push API ← EXPO_PUSH_TOKEN yahan
  7. Return { visitorId, status: 'pending' }
         │
         ▼
Expo App
  → Show waiting screen
  → Supabase Realtime direct listen (visitors table)
         │
         ▼
[Resident taps Approve]
         │
         ▼
Expo App
  api.post('/api/visitors/:id/approve')
         │
         ▼
Express /api/visitors/:id/approve
  1. verifyJWT → extract userId (resident)
  2. UPDATE visitors SET status='approved'
  3. INSERT visitor_log
  4. Send push to guard → push.ts
  5. Return { success: true }
         │
         ▼
Supabase Realtime (Guard's phone)
  → visitor UPDATE event fires automatically
  → Guard screen: "✅ Approved by Arjun"
```

---

## 🗓️ Phase-wise Implementation Plan

> **7 Phases · 7 Days · Both repos built in parallel where possible**

### Phase 0 — Foundation & Setup (Day 1 Morning)

**Goal**: Dono projects initialized, Supabase live, basic routing working

#### portl-backend/ setup
```bash
mkdir portl-backend && cd portl-backend
npm init -y
npm install express cors helmet dotenv jsonwebtoken node-cron
npm install @supabase/supabase-js axios
npm install -D typescript @types/express @types/node @types/jsonwebtoken ts-node nodemon
npx tsc --init
# Create src/index.ts → basic Express app
# Setup tsconfig.json
# Create .env + .env.example
```

#### portl-app/ setup
```bash
npx create-expo-app@latest portl-app --template blank-typescript
cd portl-app
# Install all dependencies (see Section 3)
# Setup NativeWind (tailwind.config.js + babel.config.js)
# Load fonts (PlusJakartaSans all weights)
# Create services/supabase/client.ts
# Create services/api/client.ts (axios → Express)
```

#### Supabase setup
```bash
# 1. Create project at supabase.com
# 2. Run all 12 migrations in order
# 3. Insert seed.sql (demo accounts)
# 4. Enable Realtime on: visitors, approvals, notifications
# 5. Enable Google OAuth in Dashboard
# 6. npx supabase gen types typescript > types/supabase.ts
```

**Deliverable**: Both servers run. Supabase tables created. Demo data seeded.

---

### Phase 1 — Auth + Onboarding (Day 1 Afternoon)

**Goal**: Full auth flow working (OTP + Google), role detection, navigation routing

#### portl-backend/ tasks
```
Routes:
  POST /api/auth/profile     → fetch user profile after login
  POST /api/auth/save-token  → save fcm_token to users table

Middleware:
  middleware/auth.ts         → verifySupabaseJWT()
  middleware/roleCheck.ts    → requireRole('guard' | 'resident' | 'admin')
```

#### portl-app/ tasks
```
Screens:
  Splash screen (Lottie logo, 2s)
  Onboarding (3 slides: swipe or Next button)
  Login screen:
    └ Phone input → Send OTP (Supabase direct)
    └ OTP screen (6-cell, auto-advance)
    └ Google OAuth button → expo-auth-session popup
    └ Email + Password

Logic:
  Supabase Auth (direct from app):
    supabase.auth.signInWithOtp({ phone })
    supabase.auth.verifyOtp({ phone, token })
    supabase.auth.signInWithOAuth({ provider: 'google' })
  
  After auth:
    Fetch role from users table
    Store JWT in expo-secure-store
    authStore.set({ user, role, session })
    Route: role === 'resident' → /(resident)/(tabs)/
           role === 'guard'    → /(guard)/(tabs)/
           role === 'admin'    → /(admin)/(tabs)/

Stores:
  authStore.ts (Zustand)
```

**Deliverable**: Login with all 3 demo accounts → correct dashboard.

---

### Phase 2 — Visitor Core Flow (Day 2)

**Goal**: Complete visitor approval cycle — Guard registers → Resident approves → Guard confirms

#### portl-backend/ tasks
```
POST  /api/visitors/create          → photo upload + DB insert + push send
POST  /api/visitors/:id/approve     → update status + send guard push
POST  /api/visitors/:id/reject      → update status + send guard push (with reason)
POST  /api/visitors/:id/entry       → mark entered + log
POST  /api/visitors/:id/exit        → mark exited + log
GET   /api/visitors                 → list (filter by status, flat, date)
GET   /api/visitors/:id             → single visitor with logs

Services:
  push.ts → sendPushNotification(token, title, body, data)
  (calls https://exp.host/--/api/v2/push/send)
```

#### portl-app/ tasks
```
Guard Screens:
  Register Visitor (4 steps):
    Step 1: expo-camera → capture photo
    Step 2: Name, Phone, Purpose, Vehicle input
    Step 3: Search resident (typeahead → Supabase query direct)
    Step 4: Review → api.post('/api/visitors/create')
  Waiting Screen: Supabase Realtime subscribe (visitors table)
  Approval Result Screen: green (Approved) / red (Rejected)

Resident Screens:
  Pending visitor banner on Home
  Visitors tab: Pending / Approved / Rejected / History
  Visitor Details: photo, info, timeline
  Approve → api.post('/api/visitors/:id/approve')
  Reject  → api.post('/api/visitors/:id/reject') + reason sheet

Components built:
  VisitorCard, VisitorTimeline, ApprovalActions
  AppHeader, SearchBar, FloatingBottomNav (all 3 roles)
```

**Deliverable**: Full visitor flow demo-ready on 2 devices.

---

### Phase 3 — QR + Guard Features (Day 3)

**Goal**: QR guest pass + Guard history fully working

#### portl-backend/ tasks
```
POST  /api/qr/generate      → jwt.sign({ visitorId, flatId, exp }) → return token
                               (JWT_QR_SECRET stays in .env)
POST  /api/qr/validate      → jwt.verify(token) → auto entry if valid
GET   /api/visitors/history → guard history with filters (date, purpose, flat)
```

#### portl-app/ tasks
```
Resident:
  Generate QR Pass screen:
    Form: guest name + phone + validity
    api.post('/api/qr/generate') → get token
    react-native-qrcode-svg display
    expo-sharing → share QR as image

Guard:
  QR Scanner tab:
    expo-barcode-scanner camera view
    Skia animated scan frame overlay
    On scan: api.post('/api/qr/validate')
    Valid: auto entry logged, show visitor name
    Invalid/Expired: error toast
  
  Visitor History:
    react-native-calendars date picker
    Purpose filter chips
    FlashList visitor rows
```

**Deliverable**: QR guest pass flow works end-to-end.

---

### Phase 4 — Resident Features (Day 4)

**Goal**: Complaints, Amenity Booking, Maintenance, Polls, Notices

#### portl-backend/ tasks
```
Complaints:
  POST /api/complaints           → create + optional AI tag
  GET  /api/complaints           → resident's complaints
  PATCH /api/complaints/:id      → admin update status
  POST /api/ai/tag-complaint     → Gemini API call (GEMINI_API_KEY here)

Bookings:
  GET  /api/amenities            → list amenities
  GET  /api/amenities/:id/slots  → available slots for date
  POST /api/bookings             → create booking + push confirm
  DELETE /api/bookings/:id       → cancel

Maintenance:
  GET  /api/maintenance/dues     → resident's dues
  POST /api/maintenance/pay      → initiate payment (Razorpay)
  POST /api/maintenance/webhook  → Razorpay webhook → mark paid

Polls + Notices:
  GET  /api/polls                → active + closed
  POST /api/polls/:id/vote
  GET  /api/notices
  (Create → Admin only in Phase 5)
```

#### portl-app/ tasks
```
Screens:
  Complaints: list (Open/InProgress/Resolved tabs) + new + detail+timeline
  Amenities: 2-col grid → Amenity detail → date calendar → slot picker → confirm
  Maintenance: dues list → invoice view → method select → pay
  Polls: active list → vote → animated results
  Notices: board → category filter → notice detail

Components:
  FacilityCard (expo-image + LinearGradient)
  PollResultBar (Reanimated animated width)
  PaymentCard + PaymentMethodRow
  ComplaintCard + StatusTimeline
  AnnouncementCard + QuickActionGrid
```

**Deliverable**: All resident features working.

---

### Phase 5 — Admin Module (Day 5)

**Goal**: Admin dashboard + all management screens

#### portl-backend/ tasks
```
Analytics:
  GET  /api/admin/analytics       → visitor counts, complaint stats, revenue
  GET  /api/admin/reports         → date-range reports

Management:
  GET/POST /api/admin/residents   → manage residents
  POST /api/admin/notices         → create + publish + push all
  POST /api/admin/polls           → create + publish + push all
  PATCH /api/admin/complaints/:id → assign staff + update + push resident
  GET/POST /api/admin/amenities
  GET/POST /api/admin/guards
```

#### portl-app/ tasks
```
Admin screens:
  Analytics Dashboard (Victory Native charts):
    Line chart: daily visitors
    Bar chart: complaints by category
    Area chart: revenue
  Resident management: list + add + edit + deactivate
  Complaint management: assign + status + push notify
  Notice creation: form + publish + push
  Poll creation: options + end date + publish
  Amenity management
  Tower + flat management
```

**Deliverable**: Admin can manage everything from dashboard.

---

### Phase 6 — Realtime, Push & Animations (Day 6)

**Goal**: Everything feels live + smooth

#### portl-backend/ tasks
```
Cron Jobs (node-cron):
  Every 60s: auto-reject expired pending approvals (>2 min)
  Daily 9AM: send maintenance due reminders
  Booking time -1h: send booking reminder push
```

#### portl-app/ tasks
```
Realtime (Supabase direct — NOT via Express):
  useRealtime.ts:
    subscribeVisitors() → guard waiting screen
    subscribeApprovals() → resident pending count
    subscribeNotifications() → in-app notification feed

Push:
  registerToken.ts → save fcm_token via /api/auth/save-token
  handlePush.ts → deep link routing on tap

Animations:
  Card press: scale(0.97) → withSpring(1)
  Approve button: scale → green flash → confetti Lottie
  Reject: horizontal shake ±6px ×3
  Poll bars: withSpring width animation
  Bottom nav: withSpring active indicator slide
  Screen transition: shared element (Reanimated)
  Skeleton: moti/skeleton on all list screens
  Haptics: selectionAsync, notificationAsync, impactAsync
```

**Deliverable**: Real-time sync on 2 devices. All animations smooth.

---

### Phase 7 — Testing, Demo & Submission (Day 7)

**Goal**: APK built, demo rehearsed, GitHub clean

#### portl-backend/ tasks
```
Deploy Express to Railway/Render:
  1. Push to GitHub
  2. Railway: new project from GitHub
  3. Add all .env variables in Railway dashboard
  4. Railway gives HTTPS URL → update EXPO_PUBLIC_API_BASE_URL
```

#### portl-app/ tasks
```
Build:
  eas build --platform android --profile preview
  (Preview = APK, faster than AAB)

Test checklist:
  ✔ Login all 3 demo accounts
  ✔ Guard registers → Resident approves → Guard confirms (live on 2 devices)
  ✔ QR guest pass: generate → scan → auto entry
  ✔ Push notification received on physical device
  ✔ Realtime approval update < 1 second
  ✔ Complaint raise → admin resolves → resident push
  ✔ Amenity booking end-to-end
  ✔ Admin analytics update in real time

Demo (5 min script):
  See Section 32 below
```

**Deliverable**: APK URL + GitHub repo + README + demo video.

---

## 1. Project Vision & Objectives

### Problem Statement

Apartment communities still rely on fragmented communication systems:

| Problem | Current Reality |
|---|---|
| Guard-Resident calls | Guards call residents manually — calls get missed |
| Visitor delays | Delivery partners & guests wait at gate unnecessarily |
| Paper registers | No digital audit trail for entries/exits |
| Complaint tracking | Tracked across WhatsApp groups |
| Manual bookings | Amenity bookings done on calls |
| Scattered notices | Shared across 5+ channels with no source of truth |

### Vision

> To become the **operating system for modern residential communities** — connecting residents, security staff, and administrators through one intelligent mobile platform.

### Objectives

- 🎯 Reduce visitor approval time from **minutes → seconds**
- 📋 Eliminate all **manual visitor registers**
- 📡 Improve resident communication across all channels
- 💻 Digitize **100%** of society operations
- ✨ Deliver a **premium mobile experience** people love daily

### Success Metrics

| Metric | Target |
|---|---|
| Visitor approval time reduction | 80% |
| Digital visitor log coverage | 100% |
| Resident adoption (pilot society) | 90% |
| Manual guard call reduction | 50% |
| App crash rate | < 1% |
| Approval flow time | < 5 seconds |

---

## 2. System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    EXPO SDK 55 APP                           │
│                 React Native + TypeScript                    │
│                                                              │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────────────┐  │
│  │   Resident   │  │    Guard    │  │       Admin        │  │
│  │  Dashboard   │  │  Dashboard  │  │     Dashboard      │  │
│  │  (25 screens)│  │ (12 screens)│  │   (18 screens)     │  │
│  └──────────────┘  └─────────────┘  └────────────────────┘  │
│                          │                                   │
│                     Expo Router v3                           │
│               (File-based, typed routes)                     │
│                          │                                   │
│          ┌───────────────┼───────────────┐                  │
│          ▼               ▼               ▼                  │
│      Zustand         TanStack        Supabase               │
│    (Local State)    (Server State)    Realtime              │
│                          │                                   │
│                Service Layer                                 │
│              /services/supabase/                             │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                          │
│                                                              │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────────────┐ │
│  │ Supabase     │  │ PostgreSQL │  │  Supabase Storage    │ │
│  │   Auth       │  │ + RLS      │  │  (photos, invoices)  │ │
│  │ OTP/Email/   │  │            │  │                      │ │
│  │ Google OAuth │  └─────┬──────┘  └──────────────────────┘ │
│  └──────────────┘        │                                  │
│                     Realtime WS                             │
│                     (visitors, notifications)               │
│                          │                                  │
│                    Edge Functions                           │
│                    (Deno runtime)                           │
│                          │                                  │
│                 Expo Push Notification                      │
│                       Service                               │
└──────────────────────────────────────────────────────────────┘
```

**State Architecture:**
```
Zustand          → auth session, user role, UI state, local prefs
TanStack Query   → all server data with cache (visitors, tickets, polls)
Supabase RT      → live subscriptions (approvals, notifications)
```

---

## 3. Final Tech Stack

### ✅ What to Install

| Category | Library | Why |
|---|---|---|
| Framework | `expo` (SDK 55) | OTA updates, managed workflow |
| Navigation | `expo-router` v3 | File-based, typed routes, deep linking |
| Language | TypeScript | Type safety across 55+ screens |
| Styling | `nativewind` v4 + `tailwindcss` | Tailwind in RN, same spacing everywhere, dark mode easy |
| UI Primitives | `react-native-reusables` | Button, Input, Avatar, Badge, Card, Switch, Tabs, Dialog, Sheet — NativeWind compatible |
| Icons | `lucide-react-native` | Matches design language exactly — NO Material, NO FontAwesome |
| Animation | `react-native-reanimated` | Card animation, approve animation, screen transitions, bottom nav |
| Animation | `moti` | Fade, scale, skeleton, entrance animations |
| Gestures | `react-native-gesture-handler` | Swipe, drag, bottom sheet |
| Lists | `@shopify/flash-list` | 10× faster than FlatList, visitor list, polls, history |
| Bottom Sheet | `@gorhom/bottom-sheet` | Visitor details, approve popup, payment popup |
| Blur | `expo-blur` | Floating bottom nav glass effect, transparent headers |
| Gradient | `expo-linear-gradient` | Facility cards overlay, profile hero, lime CTA |
| Images | `expo-image` | Blurhash placeholder, much faster than Image |
| Forms | `react-hook-form` + `zod` | Zero re-renders, schema validation |
| State Local | `zustand` | No boilerplate, faster than Redux |
| State Server | `@tanstack/react-query` | Cache, refetch, optimistic updates |
| Charts | `victory-native` | Admin analytics dashboard |
| Calendar | `react-native-calendars` | Amenity booking slot picker |
| Notifications | `expo-notifications` | Push notifications cross-platform |
| QR Scanner | `expo-barcode-scanner` | Guard QR entry scan |
| QR Generator | `react-native-qrcode-svg` | Resident guest pass QR |
| Lottie | `lottie-react-native` | Success, empty states, confetti, loading |
| SVG | `react-native-svg` | Required by victory-native and qr |
| Backend | `@supabase/supabase-js` | Supabase client SDK |
| Auth | Supabase Auth (built-in) | **Google OAuth** + Phone OTP + Email. No Firebase needed. |
| Google OAuth helper | `expo-auth-session` + `expo-web-browser` | Supabase Google OAuth popup handler |
| Database | Supabase PostgreSQL + RLS | SQL, relational, auto-gen types, Edge Functions |
| Storage | Supabase Storage | Visitor photos, invoices, QR images |
| Skia | `@shopify/react-native-skia` | QR scanner overlay animation |
| Haptics | `expo-haptics` | Approve/reject/payment tactile feedback |
| Secure Store | `expo-secure-store` | JWT token encrypted storage |
| Safe Area | `react-native-safe-area-context` | Notch, home bar handling |
| Sharing | `expo-sharing` | Share QR guest pass |
| Camera | `expo-camera` | Visitor photo capture |
| Image Edit | `expo-image-manipulator` | Compress before upload |
| Fonts | `expo-font` | Plus Jakarta Sans loading |
| Skeleton | `moti/skeleton` | Loading shimmer |

### ❌ Do NOT Install

```
React Native Paper     — Limits custom design, adds bundle weight
NativeBase             — Heavy, theme conflicts with NativeWind
UI Kitten              — Opinionated, not NativeWind compatible
React Native Elements  — Outdated
Gluestack              — Use Reusables instead
Shoutem                — Not maintained
Ant Design Mobile      — Too heavy
React Native Material  — Not needed
```

> [!IMPORTANT]
> **Custom > Library** for: Search bar, Bottom nav, Cards, Stat cards, Settings rows. Build with NativeWind + Lucide + Reanimated.

---

## 4. Database Schema

### Tables Overview (13 tables)

```
CORE               VISITOR             COMMUNITY
────               ───────             ─────────
users              visitors            complaints
towers             visitor_logs        notices
flats              approvals           polls
residents                              votes

AMENITIES          FINANCE             NOTIFICATIONS
─────────          ───────             ─────────────
amenities          payments            notifications
bookings
```

### SQL Schema

#### `users`
```sql
id            UUID PRIMARY KEY DEFAULT uuid_generate_v4()
name          TEXT NOT NULL
email         TEXT UNIQUE
phone         TEXT UNIQUE
role          TEXT CHECK (role IN ('resident', 'guard', 'admin'))
avatar_url    TEXT
fcm_token     TEXT
is_active     BOOLEAN DEFAULT true
created_at    TIMESTAMPTZ DEFAULT now()
updated_at    TIMESTAMPTZ DEFAULT now()
```

#### `towers`
```sql
id            UUID PRIMARY KEY DEFAULT uuid_generate_v4()
tower_name    TEXT NOT NULL
total_floors  INTEGER
created_at    TIMESTAMPTZ DEFAULT now()
```

#### `flats`
```sql
id            UUID PRIMARY KEY DEFAULT uuid_generate_v4()
flat_number   TEXT NOT NULL
floor_number  INTEGER
tower_id      UUID REFERENCES towers(id) ON DELETE CASCADE
is_occupied   BOOLEAN DEFAULT false
created_at    TIMESTAMPTZ DEFAULT now()
```

#### `residents`
```sql
id              UUID PRIMARY KEY DEFAULT uuid_generate_v4()
user_id         UUID REFERENCES users(id) ON DELETE CASCADE
flat_id         UUID REFERENCES flats(id)
is_owner        BOOLEAN DEFAULT false
is_primary      BOOLEAN DEFAULT false
vehicle_numbers TEXT[]
move_in_date    DATE
created_at      TIMESTAMPTZ DEFAULT now()
```

#### `visitors`
```sql
id             UUID PRIMARY KEY DEFAULT uuid_generate_v4()
name           TEXT NOT NULL
phone          TEXT
photo_url      TEXT
vehicle        TEXT
purpose        TEXT CHECK (purpose IN ('guest','delivery','cab','service','other'))
resident_id    UUID REFERENCES users(id)
flat_id        UUID REFERENCES flats(id)
guard_id       UUID REFERENCES users(id)
status         TEXT CHECK (status IN ('pending','approved','rejected','entered','exited','expired'))
entry_time     TIMESTAMPTZ
exit_time      TIMESTAMPTZ
qr_token       TEXT
qr_expires_at  TIMESTAMPTZ
pre_approved   BOOLEAN DEFAULT false
created_at     TIMESTAMPTZ DEFAULT now()
```

#### `visitor_logs`
```sql
id             UUID PRIMARY KEY DEFAULT uuid_generate_v4()
visitor_id     UUID REFERENCES visitors(id) ON DELETE CASCADE
action         TEXT CHECK (action IN ('requested','approved','rejected','entered','exited','expired'))
performed_by   UUID REFERENCES users(id)
note           TEXT
timestamp      TIMESTAMPTZ DEFAULT now()
```

#### `approvals`
```sql
id             UUID PRIMARY KEY DEFAULT uuid_generate_v4()
visitor_id     UUID REFERENCES visitors(id) ON DELETE CASCADE
requested_by   UUID REFERENCES users(id)
approved_by    UUID REFERENCES users(id)
status         TEXT CHECK (status IN ('pending','approved','rejected','expired'))
response_time  INTEGER
created_at     TIMESTAMPTZ DEFAULT now()
updated_at     TIMESTAMPTZ DEFAULT now()
```

#### `complaints`
```sql
id             UUID PRIMARY KEY DEFAULT uuid_generate_v4()
resident_id    UUID REFERENCES users(id)
flat_id        UUID REFERENCES flats(id)
title          TEXT NOT NULL
description    TEXT
category       TEXT CHECK (category IN ('plumbing','electrical','housekeeping','security','noise','lift','other'))
priority       TEXT CHECK (priority IN ('low','medium','high','critical'))
status         TEXT CHECK (status IN ('open','assigned','in_progress','resolved','closed'))
images         TEXT[]
assigned_to    UUID REFERENCES users(id)
ai_category    TEXT
created_at     TIMESTAMPTZ DEFAULT now()
resolved_at    TIMESTAMPTZ
```

#### `notices`
```sql
id             UUID PRIMARY KEY DEFAULT uuid_generate_v4()
title          TEXT NOT NULL
description    TEXT NOT NULL
category       TEXT CHECK (category IN ('general','maintenance','event','emergency','rules'))
attachments    TEXT[]
is_pinned      BOOLEAN DEFAULT false
published_by   UUID REFERENCES users(id)
published_at   TIMESTAMPTZ
expires_at     TIMESTAMPTZ
created_at     TIMESTAMPTZ DEFAULT now()
```

#### `polls`
```sql
id             UUID PRIMARY KEY DEFAULT uuid_generate_v4()
question       TEXT NOT NULL
options        JSONB NOT NULL   -- [{id, text, vote_count}]
created_by     UUID REFERENCES users(id)
is_active      BOOLEAN DEFAULT true
is_anonymous   BOOLEAN DEFAULT false
ends_at        TIMESTAMPTZ
created_at     TIMESTAMPTZ DEFAULT now()
```

#### `votes`
```sql
id             UUID PRIMARY KEY DEFAULT uuid_generate_v4()
poll_id        UUID REFERENCES polls(id) ON DELETE CASCADE
resident_id    UUID REFERENCES users(id)
option_id      TEXT NOT NULL
created_at     TIMESTAMPTZ DEFAULT now()
UNIQUE(poll_id, resident_id)
```

#### `amenities`
```sql
id             UUID PRIMARY KEY DEFAULT uuid_generate_v4()
name           TEXT NOT NULL
description    TEXT
icon           TEXT
images         TEXT[]
capacity       INTEGER
price          NUMERIC(10,2) DEFAULT 0
is_active      BOOLEAN DEFAULT true
created_at     TIMESTAMPTZ DEFAULT now()
```

#### `bookings`
```sql
id             UUID PRIMARY KEY DEFAULT uuid_generate_v4()
amenity_id     UUID REFERENCES amenities(id)
resident_id    UUID REFERENCES users(id)
date           DATE NOT NULL
start_time     TIME NOT NULL
end_time       TIME NOT NULL
slot           TEXT
status         TEXT CHECK (status IN ('pending','confirmed','cancelled'))
attendees      INTEGER DEFAULT 1
notes          TEXT
created_at     TIMESTAMPTZ DEFAULT now()
```

#### `payments`
```sql
id             UUID PRIMARY KEY DEFAULT uuid_generate_v4()
resident_id    UUID REFERENCES users(id)
flat_id        UUID REFERENCES flats(id)
month          TEXT               -- "2025-07"
amount         NUMERIC(10,2)
status         TEXT CHECK (status IN ('pending','paid','overdue'))
due_date       DATE
payment_method TEXT
payment_ref    TEXT
invoice_url    TEXT
paid_at        TIMESTAMPTZ
created_at     TIMESTAMPTZ DEFAULT now()
```

#### `notifications`
```sql
id             UUID PRIMARY KEY DEFAULT uuid_generate_v4()
user_id        UUID REFERENCES users(id)
title          TEXT NOT NULL
body           TEXT
type           TEXT CHECK (type IN ('visitor','booking','complaint','notice','poll','maintenance','emergency'))
data           JSONB
is_read        BOOLEAN DEFAULT false
created_at     TIMESTAMPTZ DEFAULT now()
```

### RLS Policies

```sql
-- Residents: only own flat's visitors
CREATE POLICY "resident_visitors" ON visitors
  FOR SELECT USING (resident_id = auth.uid());

-- Guards: see all visitors
CREATE POLICY "guard_visitors" ON visitors
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'guard')
  );

-- Admins: full access on all tables
CREATE POLICY "admin_all" ON visitors
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Notifications: own only
CREATE POLICY "own_notifications" ON notifications
  FOR ALL USING (user_id = auth.uid());

-- Payments: resident sees own, admin sees all
CREATE POLICY "payment_access" ON payments
  FOR SELECT USING (
    resident_id = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Votes: unique per user per poll (enforced by UNIQUE constraint + RLS)
CREATE POLICY "vote_own" ON votes
  FOR INSERT WITH CHECK (resident_id = auth.uid());
```

### Supabase Realtime Enable
```sql
ALTER TABLE visitors    REPLICA IDENTITY FULL;
ALTER TABLE approvals   REPLICA IDENTITY FULL;
ALTER TABLE notifications REPLICA IDENTITY FULL;
ALTER TABLE visitor_logs REPLICA IDENTITY FULL;
```

---

## 5. Folder Structure

### Database Relationship Map
```
users (auth.users extended)
  ├── residents → flats → towers
  ├── visitors (as guard_id, resident_id)
  ├── complaints (as resident_id, assigned_to)
  ├── bookings → amenities
  ├── payments → flats
  ├── votes → polls
  └── notifications

visitors
  ├── visitor_logs (audit trail)
  └── approvals (approval record)
```

```
portl/
├── app/
│   ├── _layout.tsx                    # Root: fonts, QueryClient, SafeArea, AuthListener
│   ├── index.tsx                      # → redirect: check session → onboarding or dashboard
│   │
│   ├── (auth)/
│   │   ├── _layout.tsx                # No bottom nav, light bg
│   │   ├── login.tsx                  # OTP + Email + Google OAuth button
│   │   ├── otp.tsx                    # 6-digit OTP entry screen
│   │   ├── signup.tsx                 # New account (name + phone)
│   │   └── google-callback.tsx        # Supabase OAuth redirect handler (expo-auth-session)
│   │
│   ├── (onboarding)/
│   │   ├── _layout.tsx
│   │   ├── slide-1.tsx                # Approve visitors in one tap
│   │   ├── slide-2.tsx                # Your community, connected
│   │   └── slide-3.tsx                # Payments, bookings & notices
│   │
│   ├── (resident)/
│   │   ├── _layout.tsx                # Role guard: role !== 'resident' → login
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx            # Hides default tab bar, renders ResidentBottomBar
│   │   │   ├── index.tsx              # Home Dashboard
│   │   │   ├── visitors.tsx           # Gate Updates: Visitors / Parcel / Helpers
│   │   │   ├── community.tsx          # Community: Today / Upcoming / History
│   │   │   ├── amenities.tsx          # Facilities grid
│   │   │   └── more.tsx               # More: quick grid to all features
│   │   ├── visitor-details/
│   │   │   └── [id].tsx               # Visitor detail: photo, timeline, approve/reject
│   │   ├── generate-pass.tsx          # QR Guest Pass: create + display + share
│   │   ├── complaints/
│   │   │   ├── index.tsx              # My complaints: Open / In Progress / Resolved
│   │   │   ├── new.tsx                # Raise complaint: category → priority → photo → submit
│   │   │   └── [id].tsx               # Complaint detail + status timeline + comments
│   │   ├── amenity/
│   │   │   └── [id].tsx               # Amenity detail + date + slot picker + confirm
│   │   ├── booking/
│   │   │   └── [id].tsx               # Booking detail + cancel
│   │   ├── polls/
│   │   │   ├── index.tsx              # Active polls + closed polls
│   │   │   └── [id].tsx               # Vote screen + animated result bars
│   │   ├── notices/
│   │   │   ├── index.tsx              # Notice board: pinned + all + filter chips
│   │   │   └── [id].tsx               # Notice detail + attachment
│   │   ├── maintenance.tsx            # Dues list + invoice + pay
│   │   ├── notifications.tsx          # Notification feed grouped by day
│   │   ├── emergency.tsx              # Emergency contacts + SOS
│   │   └── profile.tsx                # Profile: edit + settings + sign out
│   │
│   ├── (guard)/
│   │   ├── _layout.tsx                # Role guard: role !== 'guard' → login
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx            # GuardBottomBar
│   │   │   ├── index.tsx              # Guard Dashboard: stats + pending + activity
│   │   │   ├── register.tsx           # Register Visitor: multi-step form
│   │   │   ├── scan.tsx               # QR Scanner (expo-barcode-scanner + Skia frame)
│   │   │   ├── history.tsx            # Visitor history with filters
│   │   │   └── profile.tsx
│   │   ├── visitor/
│   │   │   └── [id].tsx               # Visitor detail (guard view)
│   │   └── search-resident.tsx        # Typeahead resident search
│   │
│   ├── (admin)/
│   │   ├── _layout.tsx                # Role guard: role !== 'admin' → login
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx            # AdminBottomBar
│   │   │   ├── index.tsx              # Analytics Dashboard: charts + live feed
│   │   │   ├── residents.tsx          # Resident management: list + search + tower filter
│   │   │   ├── visitors.tsx           # Full visitor log: all flats, all dates
│   │   │   ├── management.tsx         # Hub: Notices + Polls + Complaints + Amenities
│   │   │   └── settings.tsx           # Society profile + feature toggles
│   │   ├── resident/
│   │   │   └── [id].tsx               # Resident detail + edit + deactivate
│   │   ├── add-resident.tsx           # Add resident: name + flat + phone
│   │   ├── towers.tsx                 # Tower + flat management
│   │   ├── guards.tsx                 # Guard management
│   │   ├── complaint/
│   │   │   └── [id].tsx               # Complaint detail: assign + status + notify
│   │   ├── create-notice.tsx          # Create + publish notice
│   │   ├── create-poll.tsx            # Create poll + options + end date
│   │   ├── amenity/
│   │   │   └── [id].tsx               # Amenity config + slots
│   │   └── reports.tsx                # Date-range reports + export
│   │
│   └── modals/
│       ├── approve-visitor.tsx        # Confirmation bottom sheet
│       ├── reject-visitor.tsx         # Reason picker bottom sheet
│       └── qr-viewer.tsx              # Full-screen QR display + share
│
├── components/
│   ├── ui/
│   │   ├── buttons/
│   │   │   ├── Button.tsx             # Primary (lime) / Secondary / Danger + loading
│   │   │   ├── IconButton.tsx         # 40×40 circle icon button (header)
│   │   │   └── FAB.tsx                # Floating action button
│   │   ├── cards/
│   │   │   ├── Card.tsx               # Base white card (rounded-[28px])
│   │   │   ├── DarkCard.tsx           # Dark card #1E1E1E (rounded-[20px])
│   │   │   └── StatCard.tsx           # Lime accent stat card (#E7FF45)
│   │   ├── search/
│   │   │   └── SearchBar.tsx          # Custom: #ECECEC bg + Lucide Search
│   │   ├── avatar/
│   │   │   └── Avatar.tsx             # expo-image + initials fallback
│   │   ├── badge/
│   │   │   └── Badge.tsx              # Status pill: Approved ✓ / Pending ○ / Rejected ×
│   │   ├── header/
│   │   │   ├── AppHeader.tsx          # Avatar + Hello name + Chat + Bell buttons
│   │   │   └── ScreenHeader.tsx       # ← back + centered title + optional right icon
│   │   ├── bottom-bar/
│   │   │   ├── ResidentBottomBar.tsx  # expo-blur + Reanimated, 5 tabs
│   │   │   ├── GuardBottomBar.tsx     # expo-blur + Reanimated, 5 tabs
│   │   │   └── AdminBottomBar.tsx     # expo-blur + Reanimated, 5 tabs
│   │   ├── input/
│   │   │   ├── Input.tsx              # NativeWind: bg-border rounded-input h-12
│   │   │   └── OTPInput.tsx           # 6-cell auto-advance OTP
│   │   ├── sheet/
│   │   │   └── BottomSheet.tsx        # @gorhom/bottom-sheet wrapper
│   │   └── skeleton/
│   │       └── Skeleton.tsx           # moti/skeleton shimmer
│   │
│   ├── visitor-card/
│   │   ├── VisitorCard.tsx            # List item: avatar + name + purpose + status
│   │   ├── VisitorTimeline.tsx        # Step timeline (requested→approved→entered→exited)
│   │   └── ApprovalActions.tsx        # Approve + Reject button row
│   │
│   ├── payment-card/
│   │   ├── PaymentCard.tsx            # Dark card: amount + breakdown + lime CTA
│   │   └── PaymentMethodRow.tsx       # Method row: icon + label + selected checkmark
│   │
│   ├── announcement-card/
│   │   └── AnnouncementCard.tsx       # Dark bg, title + timestamp pill + body + Read More
│   │
│   ├── quick-action/
│   │   └── QuickActionGrid.tsx        # 2×N grid of dark circle icon actions
│   │
│   ├── poll/
│   │   ├── PollCard.tsx               # Active poll card with vote CTA
│   │   └── PollResultBar.tsx          # Animated result bar (Reanimated withSpring)
│   │
│   ├── facility-card/
│   │   └── FacilityCard.tsx           # expo-image + LinearGradient overlay
│   │
│   ├── complaint/
│   │   ├── ComplaintCard.tsx          # Priority badge + category + status
│   │   └── StatusTimeline.tsx         # Admin complaint status steps
│   │
│   └── animations/
│       ├── FadeIn.tsx                 # Moti: opacity 0→1 entrance
│       ├── SlideUp.tsx                # Moti: translateY 40→0 entrance
│       ├── ShimmerSkeleton.tsx        # Reanimated: left→right shimmer
│       └── ConfettiBlast.tsx          # Lottie confetti trigger
│
├── hooks/
│   ├── useAuth.ts                     # Session, role, sign in/out
│   ├── useGoogleAuth.ts               # expo-auth-session Google OAuth flow
│   ├── useVisitors.ts                 # TanStack: visitors by status
│   ├── useApprovals.ts                # TanStack: approve/reject mutations
│   ├── useComplaints.ts               # TanStack: complaints CRUD
│   ├── useBookings.ts                 # TanStack: bookings + slots
│   ├── usePolls.ts                    # TanStack: polls + vote mutation
│   ├── useNotices.ts                  # TanStack: notices by category
│   ├── useMaintenance.ts              # TanStack: dues + payment
│   ├── useNotifications.ts            # TanStack: notifications + mark read
│   ├── useRealtime.ts                 # Supabase Realtime subscriptions
│   ├── useGuardDashboard.ts           # Guard-specific stats
│   └── useAdminAnalytics.ts           # Admin charts data
│
├── services/
│   ├── supabase/
│   │   ├── client.ts                  # createClient() + expo-secure-store adapter
│   │   ├── auth.ts                    # signInWithOTP, signInWithGoogle, signOut, getUser
│   │   ├── visitors.ts                # getVisitors, createVisitor, approve, reject, markEntry, markExit
│   │   ├── approvals.ts               # createApproval, updateApproval, getApprovalByVisitor
│   │   ├── complaints.ts              # getComplaints, createComplaint, updateStatus, addComment
│   │   ├── bookings.ts                # getBookings, createBooking, cancelBooking, getSlots
│   │   ├── polls.ts                   # getPolls, submitVote, getPollResults
│   │   ├── notices.ts                 # getNotices, createNotice, pinNotice, publishNotice
│   │   ├── maintenance.ts             # getDues, markPaid, getPaymentHistory
│   │   ├── residents.ts               # getResidents, getResident, createResident, updateFlat
│   │   ├── admin.ts                   # getAnalytics, getAllVisitors, assignComplaint
│   │   ├── realtime.ts                # subscribeVisitors, subscribeApprovals, subscribeNotifications
│   │   └── qr.ts                      # generateQRToken (Edge Function call), validateQR
│   ├── notifications/
│   │   ├── registerToken.ts           # getExpoPushTokenAsync + save to users.fcm_token
│   │   ├── handlePush.ts              # addNotificationResponseReceivedListener + router.push
│   │   └── scheduleLocal.ts           # Booking reminder: scheduleNotificationAsync
│   └── storage/
│       ├── uploadPhoto.ts             # expo-image-manipulator compress + supabase.storage.upload
│       └── getSignedUrl.ts            # supabase.storage.createSignedUrl (1h)
│
├── store/
│   ├── authStore.ts                   # user, session, role, residentProfile, isLoading
│   ├── visitorStore.ts                # pendingCount, latestVisitor, approvalResult
│   ├── notificationStore.ts           # notifications[], unreadCount
│   ├── bookingStore.ts                # myBookings, selectedAmenity, selectedSlot
│   ├── complaintStore.ts              # complaints[], activeComplaint
│   ├── pollStore.ts                   # activePolls[], votedPolls[]
│   ├── noticeStore.ts                 # notices[], pinnedNotices[]
│   ├── adminStore.ts                  # analytics, residentList, guardList
│   └── uiStore.ts                     # toastQueue, activeModal, isOnline
│
├── constants/
│   ├── theme/
│   │   ├── colors.ts                  # All hex values from UI spec
│   │   ├── fonts.ts                   # Font family strings
│   │   ├── spacing.ts                 # 4 8 12 16 20 24 32 40 48
│   │   └── radius.ts                  # card:28 btn:22 input:20 chip:9999
│   ├── amenities.ts                   # Amenity slugs + icons
│   └── roles.ts                       # 'resident' | 'guard' | 'admin'
│
├── types/
│   ├── user.ts                        # User, Resident, Guard, Admin interfaces
│   ├── visitor.ts                     # Visitor, VisitorStatus, VisitorLog
│   ├── complaint.ts                   # Complaint, ComplaintCategory, ComplaintStatus
│   ├── booking.ts                     # Booking, BookingSlot, Amenity
│   ├── poll.ts                        # Poll, PollOption, Vote
│   ├── notice.ts                      # Notice, NoticeCategory
│   ├── maintenance.ts                 # Payment, PaymentStatus
│   └── supabase.ts                    # ⚠️ Auto-generated: npx supabase gen types typescript
│
├── utils/
│   ├── formatDate.ts                  # dayjs relative + absolute formatting
│   ├── formatCurrency.ts              # ₹ INR / $ USD formatter
│   ├── generateQR.ts                  # QR token generator utility
│   ├── roleGuard.ts                   # checkRole(role, allowed[])
│   ├── errorMessages.ts               # Supabase error code → human message
│   └── validators.ts                  # Phone, flat number, name validators
│
├── assets/
│   ├── images/                        # App icon, splash image
│   ├── fonts/
│   │   └── PlusJakartaSans/           # Regular Medium SemiBold Bold ExtraBold .ttf
│   ├── icons/                         # Custom SVGs if needed
│   └── lottie/
│       ├── splash.json                # App logo animation
│       ├── success-check.json         # Green checkmark on approve
│       ├── confetti.json              # Celebration on approval
│       ├── empty-visitors.json        # Empty visitor list
│       └── empty-state.json           # Generic empty state
│
├── supabase/                          # Supabase CLI project folder
│   ├── config.toml                    # Supabase CLI config
│   ├── seed.sql                       # Demo data: 3 users, 1 tower, 4 flats
│   ├── migrations/
│   │   ├──  20250101_001_users.sql         # users table + role enum
│   │   ├── 20250101_002_society.sql        # towers + flats
│   │   ├── 20250101_003_residents.sql      # residents table
│   │   ├── 20250101_004_visitors.sql       # visitors + visitor_logs
│   │   ├── 20250101_005_approvals.sql      # approvals table
│   │   ├── 20250101_006_complaints.sql     # complaints
│   │   ├── 20250101_007_community.sql      # notices + polls + votes
│   │   ├── 20250101_008_amenities.sql      # amenities + bookings
│   │   ├── 20250101_009_payments.sql       # payments
│   │   ├── 20250101_010_notifications.sql  # notifications
│   │   ├── 20250101_011_rls_policies.sql   # ALL RLS policies
│   │   └── 20250101_012_realtime.sql       # REPLICA IDENTITY FULL for RT tables
│   └── functions/
│       ├── send-push/
│       │   └── index.ts               # DB webhook → Expo Push API batch send
│       ├── generate-qr/
│       │   └── index.ts               # Sign JWT → return QR token
│       ├── validate-qr/
│       │   └── index.ts               # Verify QR JWT signature + expiry
│       ├── ai-tag-complaint/
│       │   └── index.ts               # Gemini API → auto-categorize complaint
│       └── auto-reject-expired/
│           └── index.ts               # Cron 60s → expire pending approvals
│
├── docs/                              # Reference documents
│   ├── prd.md
│   ├── trd.md
│   ├── ui_spec.md
│   ├── app_flow.md
│   ├── implementation_plan.md
│   ├── architecture.png
│   ├── database.png
│   └── screenshots/
│
├── app.json
├── tailwind.config.js
├── babel.config.js
├── metro.config.js
├── tsconfig.json
├── eas.json
├── .env.example
└── README.md
```

│   │
│   ├── (auth)/
│   │   ├── _layout.tsx                # No bottom nav
│   │   ├── login.tsx                  # Phone/Email/Google login
│   │   ├── otp.tsx                    # 6-digit OTP entry
│   │   └── signup.tsx                 # New account
│   │
│   ├── (onboarding)/
│   │   ├── _layout.tsx
│   │   ├── slide-1.tsx                # Visitor approval intro
│   │   ├── slide-2.tsx                # Community connected
│   │   └── slide-3.tsx                # Payments & bookings
│   │
│   ├── (resident)/
│   │   ├── _layout.tsx                # Role guard: redirect if not resident
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx            # Custom floating bottom nav
│   │   │   ├── index.tsx              # Home Dashboard
│   │   │   ├── visitors.tsx           # Gate Updates (Visitors/Parcel/Helpers)
│   │   │   ├── community.tsx          # Community: Today/Upcoming/History
│   │   │   ├── amenities.tsx          # Facilities grid
│   │   │   └── more.tsx               # Grid of all features
│   │   ├── visitor-details/[id].tsx
│   │   ├── generate-pass.tsx          # QR Guest Pass
│   │   ├── complaints/
│   │   │   ├── index.tsx              # Complaint list
│   │   │   ├── new.tsx                # Raise complaint
│   │   │   └── [id].tsx               # Complaint detail + timeline
│   │   ├── amenity/[id].tsx           # Amenity booking screen
│   │   ├── booking/[id].tsx           # Booking detail
│   │   ├── polls/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx               # Vote + results
│   │   ├── notices/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   ├── maintenance.tsx
│   │   ├── notifications.tsx
│   │   ├── emergency.tsx
│   │   └── profile.tsx
│   │
│   ├── (guard)/
│   │   ├── _layout.tsx                # Role guard: redirect if not guard
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx              # Guard Dashboard
│   │   │   ├── register.tsx           # Add Visitor (multi-step)
│   │   │   ├── scan.tsx               # QR Scanner
│   │   │   ├── history.tsx            # Visitor History
│   │   │   └── profile.tsx
│   │   ├── visitor/[id].tsx           # Visitor detail (guard view)
│   │   └── search-resident.tsx
│   │
│   ├── (admin)/
│   │   ├── _layout.tsx                # Role guard: redirect if not admin
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx              # Analytics Dashboard
│   │   │   ├── residents.tsx
│   │   │   ├── visitors.tsx
│   │   │   ├── management.tsx         # Notices/Polls/Complaints/Amenities
│   │   │   └── settings.tsx
│   │   ├── resident/[id].tsx
│   │   ├── add-resident.tsx
│   │   ├── towers.tsx
│   │   ├── guards.tsx
│   │   ├── complaint/[id].tsx
│   │   ├── create-notice.tsx
│   │   ├── create-poll.tsx
│   │   ├── amenity/[id].tsx
│   │   └── reports.tsx
│   │
│   └── modals/
│       ├── approve-visitor.tsx        # Approval confirmation sheet
│       ├── reject-visitor.tsx         # Rejection reason sheet
│       └── qr-viewer.tsx              # Full-screen QR display
│
├── components/
│   ├── ui/
│   │   ├── buttons/
│   │   │   ├── Button.tsx             # Primary/Secondary/Danger + loading state
│   │   │   ├── IconButton.tsx         # Circle icon button (header)
│   │   │   └── FAB.tsx                # Floating action button
│   │   ├── cards/
│   │   │   ├── Card.tsx               # Base card (white, rounded-[28px])
│   │   │   ├── DarkCard.tsx           # Dark card (#1E1E1E, rounded-[20px])
│   │   │   └── StatCard.tsx           # Lime accent stat card
│   │   ├── search/
│   │   │   └── SearchBar.tsx          # Custom: View+Input+Lucide Search
│   │   ├── avatar/
│   │   │   └── Avatar.tsx             # Expo Image + initials fallback
│   │   ├── badge/
│   │   │   └── Badge.tsx              # Status pill (Approved/Pending/Rejected)
│   │   ├── header/
│   │   │   ├── AppHeader.tsx          # Light header: avatar+name+icons
│   │   │   └── ScreenHeader.tsx       # Back arrow + title
│   │   ├── bottom-bar/
│   │   │   ├── ResidentBottomBar.tsx  # expo-blur + reanimated, no library
│   │   │   ├── GuardBottomBar.tsx
│   │   │   └── AdminBottomBar.tsx
│   │   ├── input/
│   │   │   ├── Input.tsx              # Custom: bg-[#ECECEC] rounded-[20px]
│   │   │   └── OTPInput.tsx           # 6-cell OTP component
│   │   ├── sheet/
│   │   │   └── BottomSheet.tsx        # @gorhom/bottom-sheet wrapper
│   │   └── skeleton/
│   │       └── Skeleton.tsx           # moti/skeleton shimmer
│   │
│   ├── visitor-card/
│   │   ├── VisitorCard.tsx            # List item: avatar+name+purpose+status
│   │   ├── VisitorTimeline.tsx        # Status step timeline
│   │   └── ApprovalActions.tsx        # Approve + Reject buttons
│   │
│   ├── payment-card/
│   │   ├── PaymentCard.tsx            # Dark card: amount+breakdown+CTA
│   │   └── PaymentMethodRow.tsx       # Method selection row
│   │
│   ├── announcement-card/
│   │   └── AnnouncementCard.tsx       # Dark bg, title+timestamp+description
│   │
│   ├── quick-action/
│   │   └── QuickActionGrid.tsx        # 2×N grid of dark circle actions
│   │
│   ├── poll/
│   │   ├── PollCard.tsx
│   │   └── PollResultBar.tsx          # Animated width bar (Reanimated)
│   │
│   ├── facility-card/
│   │   └── FacilityCard.tsx           # Image + LinearGradient overlay
│   │
│   ├── complaint/
│   │   ├── ComplaintCard.tsx
│   │   └── StatusTimeline.tsx
│   │
│   └── animations/
│       ├── FadeIn.tsx                 # Moti fade entrance
│       ├── SlideUp.tsx                # Moti slide up entrance
│       ├── ShimmerSkeleton.tsx        # Reanimated shimmer
│       └── ConfettiBlast.tsx          # Lottie confetti
│
├── hooks/
│   ├── useAuth.ts
│   ├── useVisitors.ts
│   ├── useApprovals.ts
│   ├── useComplaints.ts
│   ├── useBookings.ts
│   ├── usePolls.ts
│   ├── useNotices.ts
│   ├── useMaintenance.ts
│   ├── useNotifications.ts
│   ├── useRealtime.ts
│   ├── useGuardDashboard.ts
│   └── useAdminAnalytics.ts
│
├── services/
│   ├── supabase/
│   │   ├── client.ts                  # Supabase client init + secure store session
│   │   ├── auth.ts
│   │   ├── visitors.ts
│   │   ├── approvals.ts
│   │   ├── complaints.ts
│   │   ├── bookings.ts
│   │   ├── polls.ts
│   │   ├── notices.ts
│   │   ├── maintenance.ts
│   │   ├── residents.ts
│   │   ├── admin.ts
│   │   └── realtime.ts
│   ├── notifications/
│   │   ├── registerToken.ts
│   │   ├── handlePush.ts
│   │   └── scheduleLocal.ts
│   └── storage/
│       ├── uploadPhoto.ts
│       └── getSignedUrl.ts
│
├── store/
│   ├── authStore.ts                   # user, session, role, profile
│   ├── visitorStore.ts                # pendingCount, latestVisitor
│   ├── notificationStore.ts           # unreadCount, notifications[]
│   ├── bookingStore.ts                # selectedAmenity, selectedSlot
│   ├── complaintStore.ts
│   ├── pollStore.ts
│   ├── noticeStore.ts
│   ├── adminStore.ts                  # analytics, residentList
│   └── uiStore.ts                     # toast queue, modal state
│
├── constants/
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── spacing.ts
│   │   └── radius.ts
│   ├── amenities.ts
│   └── roles.ts
│
├── types/
│   ├── user.ts
│   ├── visitor.ts
│   ├── complaint.ts
│   ├── booking.ts
│   ├── poll.ts
│   ├── notice.ts
│   ├── maintenance.ts
│   └── supabase.ts                    # Auto-gen: npx supabase gen types typescript
│
├── utils/
│   ├── formatDate.ts
│   ├── formatCurrency.ts
│   ├── generateQR.ts
│   ├── roleGuard.ts
│   ├── errorMessages.ts
│   └── validators.ts
│
├── assets/
│   ├── images/
│   ├── fonts/
│   │   └── PlusJakartaSans/           # all weights
│   ├── icons/
│   └── lottie/
│       ├── splash.json
│       ├── success-check.json
│       ├── confetti.json
│       ├── empty-visitors.json
│       └── empty-state.json
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   └── 003_realtime_enable.sql
│   └── functions/
│       ├── send-push/index.ts
│       ├── ai-tag-complaint/index.ts
│       ├── generate-qr/index.ts
│       ├── validate-qr/index.ts
│       └── auto-reject-expired/index.ts
│
├── docs/
│   ├── prd.md
│   ├── trd.md
│   ├── ui_spec.md
│   ├── app_flow.md
│   ├── architecture.png
│   ├── database.png
│   └── screenshots/
│
├── app.json
├── tailwind.config.js
├── babel.config.js
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 6. Navigation Architecture

```
App Launch
    │
    ▼
Splash (Lottie logo, 2s)
    │
    ├── First time ──► Onboarding (3 slides) ──► Login
    │
    └── Returning ───► Session check
                            │
                      Valid session ──► Role Dashboard
                      Expired ────────► Login
```

### Login → Role Detection
```
OTP / Email / Google verified
    │
    ▼
Fetch role from users table
    │
  ┌─┼──┐
  ▼ ▼  ▼
 RES GRD ADM
```

### Tab Bars

**Resident (5 tabs):**
```
🏠 Home  |  🚪 Visitors  |  👥 Community  |  🏢 Amenities  |  ⋯ More
```

**Guard (5 tabs):**
```
🏠 Dashboard  |  ➕ Register  |  📷 QR Scan  |  📜 History  |  👤 Profile
```

**Admin (5 tabs):**
```
📊 Dashboard  |  👥 Residents  |  🚪 Visitors  |  📢 Management  |  ⚙️ Settings
```

---

## 7. Authentication Flow

```
User opens app
    │
    ▼
Check expo-secure-store for JWT
    │
    ├── Found + Valid → Supabase session refresh → fetch role → navigate
    │
    └── Not found / Expired → Login Screen
              │
              ├── Phone OTP
              │     └── Enter phone → send OTP → enter 6 digits → verify
              │
              ├── Email + Password
              │     └── Enter email + password → sign in
              │
              └── Google OAuth
                    └── Supabase OAuth popup → callback → JWT
                              │
                    JWT stored in expo-secure-store (encrypted)
                              │
                    Fetch role from users table
                              │
                              ▼
                    authStore.set({ user, role, session })
                              │
                  ┌───────────┼───────────┐
                  ▼           ▼           ▼
           Resident        Guard        Admin
           Dashboard      Dashboard   Dashboard
```

**Route Protection in `_layout.tsx`:**
```tsx
// Each role's _layout.tsx checks authStore.role
// Wrong role → router.replace('/(auth)/login')
// No session → router.replace('/(auth)/login')
```

---

## 8. Role-Based Access Control

| Feature | Resident | Guard | Admin |
|---|---|---|---|
| Approve / reject visitors | ✅ | ❌ | ✅ |
| Register visitor | ❌ | ✅ | ✅ |
| Mark entry / exit | ❌ | ✅ | ✅ |
| Scan QR pass | ❌ | ✅ | ✅ |
| Generate QR guest pass | ✅ | ❌ | ✅ |
| View own visitor history | ✅ | ❌ | ✅ |
| View all visitor history | ❌ | ✅ | ✅ |
| Search residents | ❌ | ✅ | ✅ |
| Raise complaint | ✅ | ❌ | ✅ |
| Resolve complaint | ❌ | ❌ | ✅ |
| View notices | ✅ | ✅ | ✅ |
| Create notices | ❌ | ❌ | ✅ |
| Vote in polls | ✅ | ❌ | ✅ |
| Create polls | ❌ | ❌ | ✅ |
| Book amenities | ✅ | ❌ | ✅ |
| Manage amenities | ❌ | ❌ | ✅ |
| Pay maintenance | ✅ | ❌ | ✅ |
| View analytics | ❌ | ❌ | ✅ |

> Enforced at **two levels**: Expo Router `_layout.tsx` middleware (UI) + Supabase RLS policies (database).

---

## 9. UI Design System

### Design Language (from Screenshots)

> [!IMPORTANT]
> This is **NOT a dark mode app**. It uses dual-mode: light top + dark bottom on same screen.

**Pattern observed:**
```
Screen = Light section (#F5F5F2) on top
       + Dark section (#171717 rounded-t-[28px]) on bottom
       + Floating glass bottom nav (absolute, pill shape)
```

Some screens fully light: Gate Updates, Facilities, Community
Some screens fully dark: Payments, Profile

### Color Tokens

| Token | Hex | Usage |
|---|---|---|
| `background` | `#F5F5F2` | App background, light screens |
| `dark` | `#171717` | Dark sections, fully dark screens |
| `dark-card` | `#1E1E1E` | Cards within dark sections |
| `dark-input` | `#2A2A2A` | Inputs and chips on dark bg |
| `accent` | `#E7FF45` | Primary CTA, active states, key numbers |
| `white` | `#FFFFFF` | Cards on light bg, text on dark |
| `text-primary` | `#111111` | Primary text on light background |
| `text-secondary` | `#666666` | Subtitles, secondary labels |
| `text-muted` | `#999999` | Timestamps, placeholders |
| `border` | `#ECECEC` | Search bar bg, card borders |
| `success` | `#22C55E` | Approved badge |
| `warning` | `#F59E0B` | Pending badge |
| `danger` | `#EF4444` | Rejected, critical alerts |

### tailwind.config.js
```js
module.exports = {
  content: ['./app/**/*.{tsx,ts}', './components/**/*.{tsx,ts}'],
  theme: {
    extend: {
      colors: {
        background:  '#F5F5F2',
        dark:        '#171717',
        'dark-card': '#1E1E1E',
        'dark-input':'#2A2A2A',
        accent:      '#E7FF45',
        'text-primary':   '#111111',
        'text-secondary': '#666666',
        'text-muted':     '#999999',
        border:      '#ECECEC',
        success:     '#22C55E',
        warning:     '#F59E0B',
        danger:      '#EF4444',
      },
      fontFamily: {
        'jakarta':        ['PlusJakartaSans-Regular'],
        'jakarta-medium': ['PlusJakartaSans-Medium'],
        'jakarta-semi':   ['PlusJakartaSans-SemiBold'],
        'jakarta-bold':   ['PlusJakartaSans-Bold'],
        'jakarta-extra':  ['PlusJakartaSans-ExtraBold'],
      },
      borderRadius: {
        'card':   '28px',
        'btn':    '22px',
        'input':  '20px',
        'chip':   '999px',
        'nav':    '999px',
      }
    }
  }
}
```

### Typography Scale

| Style | Size | Weight | NativeWind |
|---|---|---|---|
| Display | 40px | ExtraBold | `text-[40px] font-extrabold` |
| H1 | 24px | Bold | `text-2xl font-bold` |
| H2 | 20px | Bold | `text-xl font-bold` |
| H3 | 17px | SemiBold | `text-[17px] font-semibold` |
| Body | 15px | Regular | `text-[15px]` |
| Caption | 13px | Regular | `text-[13px]` |
| Label SM | 11px | Medium | `text-[11px] font-medium` |
| Greeting | 20px | Bold | `text-xl font-bold` |

### Border Radius Reference

| Element | Radius | NativeWind |
|---|---|---|
| Main cards | 28px | `rounded-[28px]` |
| Payment / profile cards | 24px | `rounded-[24px]` |
| Stat cards / buttons | 22px | `rounded-[22px]` |
| Announcement / search / grid | 20px | `rounded-[20px]` |
| Visitor / settings rows | 16px | `rounded-2xl` |
| Pills / chips / avatars | 999px | `rounded-full` |
| Bottom nav | 999px | `rounded-full` |

### Spacing Scale
```
4 · 8 · 12 · 16 · 20 · 24 · 28 · 32 · 40 · 48 · 64
```

---

## 10. Component Specifications

### 10.1 Header (AppHeader)
```
Light bg variant (Home):
  [Avatar 40px circle] [Hello, Name / Society] [Chat btn 40px] [Bell btn 40px]
  Avatar: rounded-full, expo-image
  Name: text-xl font-bold text-[#111]
  Society: text-xs text-[#999]
  Buttons: w-10 h-10 rounded-full bg-white shadow-sm

Dark bg variant (Profile/Payments):
  Same layout, all text/icons white
```

### 10.2 Search Bar (custom — NO library)
```
bg-[#ECECEC] rounded-[20px] h-12 px-4 flex-row items-center gap-2
Lucide Search icon: 18px, color #999
TextInput: flex-1, text-sm, placeholder #999
```

### 10.3 Accent Stat Cards (Lime)
```
flex-row gap-3 (2 cards)
Each: flex-1 bg-accent rounded-[22px] p-4 flex-row items-center justify-between
  Left: text-2xl font-bold text-[#111] + text-xs label
  Right: w-9 h-9 rounded-full bg-[#111] + ArrowRight 18px white
```

### 10.4 Dark Section
```
bg-dark rounded-t-[28px] flex-1 px-5 pt-6
Starts after stat cards on Home
```

### 10.5 Pill Chip Tabs (horizontal scroll)
```
ScrollView horizontal, gap-3
Each chip: flex-row items-center gap-2 bg-dark-input rounded-full h-10 px-4
  Icon: Lucide 18px white + Text text-sm font-medium text-white
Active: bg-white text-[#111] (or accent outline)
```

### 10.6 Announcement Card
```
bg-dark-card rounded-[20px] p-4 mt-4
  Row: title text-lg font-bold white + timestamp pill (bg-dark-input rounded-full px-3 py-1)
  Body: text-sm text-[#999] mt-2
  CTA: w-full bg-white rounded-full h-12 items-center justify-center (Read More + ArrowRight)
```

### 10.7 Quick Actions Grid
```
flex-row flex-wrap gap-3 mt-4
Each: w-[48%] bg-dark-card rounded-[20px] p-4 items-center
  Circle: w-11 h-11 rounded-full bg-dark-input items-center justify-center
  Icon: Lucide 22px white
  Label: text-xs text-[#999] mt-2 text-center
```

### 10.8 Floating Glass Bottom Nav (NO library)
```tsx
// Absolute positioned, expo-blur, reanimated
Position: absolute bottom-4 left-5 right-5
Height: 64px (h-16)
Radius: full (rounded-full)
Overflow: hidden
Inner: BlurView intensity=60 tint="dark"/"light"
Each tab: flex-1 items-center justify-center
Active: w-11 h-11 rounded-full bg-[#111] icon=white OR bg-accent icon=#111
Inactive: icon color #666
Transition: withSpring on tab change (Reanimated)
```

### 10.9 Visitor Card (list item)
```
bg-white rounded-2xl p-4 mb-3 flex-row items-center gap-3
  Avatar: w-12 h-12 rounded-full (expo-image)
  Middle: name text-base font-semibold + phone text-sm text-[#666] + tag pill
  Tag pill: bg-border rounded-full px-2 py-0.5 text-xs text-[#666]
  Right: status (CheckCircle icon + text-[#22C55E]) + time text-xs text-[#999]
```

### 10.10 Facility Card (grid item)
```
rounded-[20px] overflow-hidden height=180
  expo-image: absolute fill, contentFit=cover
  LinearGradient: transparent → rgba(0,0,0,0.75) absolute fill
  Text overlay bottom-0: name text-base font-bold white + price text-sm accent
```

### 10.11 Payment Dark Card
```
bg-dark rounded-[24px] p-5
  "Total Pending" text-sm text-[#999]
  "$4,500" text-[40px] font-extrabold text-white
  Breakdown rows: label text-[#999] + amount text-white
  CTA: w-full bg-accent rounded-full h-13 items-center justify-center
       "Pay $ 4,500" font-bold text-[#111]
```

### 10.12 Profile Hero Card
```
LinearGradient(['#1a2a1a', '#171717']) rounded-[24px] p-6 items-center
  Avatar: w-18 h-18 rounded-full border-2 border-white
  Name: text-xl font-bold text-white mt-3
  Email: text-sm text-[#999] mt-1
```

### 10.13 Settings Row
```
bg-dark-card rounded-2xl p-4 mb-3 flex-row items-center gap-3
  Icon circle: w-10 h-10 rounded-full bg-dark-input items-center justify-center
  Middle: title text-base font-semibold white + subtitle text-sm text-[#666]
  Right: ChevronRight 18px color #666
```

### 10.14 Tab Pills (active/inactive)
```
Active pill: bg-[#111] rounded-full px-5 py-2 text-white font-semibold
Inactive: transparent px-5 py-2 text-[#666]
Gate Updates screen: Visitors | Parcel | Helpers
Community: Today | Upcoming | History
```

### 10.15 Gate Updates CTA Card
```
bg-white rounded-[20px] p-5 flex-row items-start gap-4
  Left (flex-1):
    title: text-lg font-bold text-[#111]
    button: bg-[#111] rounded-full px-4 py-2 text-white text-sm
  Right: expo-image 100×80 (person illustration)
```

---

## 11. Screen Specifications

### 11.1 Home Dashboard (Resident)
```
STATUS BAR: Light (dark icons)
SAFE AREA: top padding

[LIGHT SECTION — bg: #F5F5F2]
  AppHeader: Avatar + Hello, {name} / {society} + Chat + Bell
  SearchBar: h-12 bg-border rounded-input
  Stat Cards: $170.00 Dues | 01 Open Violation (both accent bg)

[DARK SECTION — bg: dark, rounded-t-[28px]]
  Chips scroll: Helpdesk | Facilities | Polls | ...
  Section: "Announcements" + "View all"
  AnnouncementCard: Water Maintenance + 2h ago + description + Read More
  Section: "Quick Actions" + "View all"
  QuickActionsGrid: Add Member | Tools | ...

[BOTTOM] FloatingNav: Home active
```

### 11.2 Gate Updates (Visitors Tab)
```
STATUS BAR: Light
FULL LIGHT SCREEN (bg: background)

  ScreenHeader: ← | "Gate Updates" | —
  Tab row: [Visitors ●] [Parcel] [Helpers]
  
  Section: "Expected Visitors"
  GateCTACard: "Streamline Visitor Entry" + Pre-Approve Entry btn + image
  
  Section: "My Visitors" + date pill "23 Nov 2025"
  VisitorCards (FlashList): each with photo + name + pre-approved by

[BOTTOM] FloatingNav: Visitors tab active
```

### 11.3 Facilities Screen
```
STATUS BAR: Light
FULL LIGHT SCREEN

  ScreenHeader: ← | "Facilities" | —
  SearchRow: [SearchBar flex-1] [Bookings btn — bg-dark rounded-full]
  
  FacilityGrid (FlashList numColumns=2):
    Swimming Pool | Squash Court
    Pickle Bell Court | Community Club
    Basketball Court | Barbeque Pit

[BOTTOM] FloatingNav: Amenities tab active
```

### 11.4 Payments Screen
```
STATUS BAR: Dark (white icons)
FULL DARK SCREEN (bg: dark)

  ScreenHeader: ← white | "Payments" white | —
  PaymentDarkCard: Total Pending $4,500 + breakdown + lime Pay button
  
  Section: "Payment Method" + "View all"
  MethodRows:
    [Credit/Debit Card — selected, lime checkmark] 
    [UPI → chevron]
    [Net Banking → chevron]

[BOTTOM] FloatingNav: dark glass variant
```

### 11.5 Community Screen
```
STATUS BAR: Light
FULL LIGHT SCREEN

  ScreenHeader: ← | "Community" | —
  SearchBar: "Search Visitors...."
  Tab row: [Today ●] [Upcoming] [History]
  
  VisitorList (FlashList):
    Alex Johnson | +91 98765 43210 | Plumber | Approved ✓ | 2:30 PM
    Liam Johnson | +91 98765 43211 | Guest | Pending ○ | 2:30 PM
  
  Fixed bottom button: [+ Add Visitor] bg-dark rounded-full h-13

[BOTTOM] FloatingNav: Community tab active (accent circle)
```

### 11.6 Profile Screen
```
STATUS BAR: Dark
FULL DARK SCREEN (bg: dark)

  ScreenHeader: ← | "Profile" | Edit icon
  ProfileHeroCard: gradient + avatar 72px + name + email
  
  SettingsRows:
    👤 Edit Profile — Update your info
    🔔 Notifications — Manage your notifications
    🔒 Privacy & Security — Control your data
    ❓ Help & Support — Get help or contact us

[BOTTOM] FloatingNav: dark glass, grid icon active
```

---

## 12. App Flows — All Roles

### Resident Flows

**Visitor Approval:**
```
Home → pending banner → Approve/Reject
     OR Visitors tab → Pending → VisitorCard → Approve
         │
    Approve: confetti + push to guard
    Reject:  reason sheet + push to guard
```

**Guest Pre-Approval:**
```
Visitors → Pre-Approve Entry → enter details → Generate QR
→ Share QR (expo-sharing) → Guest arrives → Guard scans → Auto entry
```

**Complaint:**
```
Home → Quick Action → Complaint → Category → Priority → Photo → Submit
→ Admin notified → Status timeline updates → Resident gets push on each status
```

**Amenity Booking:**
```
Facilities → Select card → Choose date (calendar) → Choose slot
→ Confirm → Booking confirmed → Push reminder 1h before
```

**Maintenance Payment:**
```
Home stat card OR Quick Action → Maintenance → Pending Dues
→ View Invoice → Choose method (UPI/Card/Net Banking) → Pay
→ Payment success → Receipt generated
```

### Guard Flows

**Register Visitor (Multi-step):**
```
Step 1: Take photo (expo-camera) or skip
Step 2: Name + Phone + Purpose + Vehicle
Step 3: Search resident (typeahead)
Step 4: Review → Send Approval Request
Step 5: Waiting screen (countdown 2min)
         ├── Approved: Allow Entry → entry logged
         └── Rejected: Entry denied → show reason
```

**QR Entry:**
```
QR Scan tab → camera opens → scan QR
→ Edge Function validates token
→ Valid: auto entry logged, show visitor name
→ Invalid/Expired: show error
```

### Admin Flows

**Complaint Resolution:**
```
Management → Complaints → Open complaint → Assign staff
→ Update status → Resident gets push notification
```

**Notice Publishing:**
```
Management → Notices → Create Notice → Title + body + category
→ Pin toggle → Attachment upload → Publish
→ ALL residents get push notification
```

---

## 13. Phase 0 — Foundation & Setup

> **Day 1 Morning** | Goal: Working Expo project, all deps installed, Supabase live

### 0.1 Project Init
```bash
npx create-expo-app@latest portl --template blank-typescript
cd portl
```

Set in `package.json`: `"main": "expo-router/entry"`

### 0.2 app.json
```json
{
  "expo": {
    "name": "Portl",
    "slug": "portl",
    "scheme": "portl",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "plugins": [
      "expo-router",
      "expo-font",
      ["expo-notifications", { "sounds": [] }],
      "expo-secure-store",
      "expo-camera",
      "expo-barcode-scanner"
    ]
  }
}
```

### 0.3 Install All Dependencies
```bash
# Core navigation
npx expo install expo-router react-native-safe-area-context react-native-screens

# Styling
npm install nativewind tailwindcss

# UI
npm install react-native-reusables

# Animation + Gesture
npx expo install react-native-reanimated moti react-native-gesture-handler

# Lists + Images
npx expo install @shopify/flash-list expo-image expo-blur expo-linear-gradient

# Icons
npm install lucide-react-native react-native-svg

# Forms + State
npm install react-hook-form zod @hookform/resolvers zustand @tanstack/react-query

# Backend
npx expo install @supabase/supabase-js expo-secure-store

# Notifications
npx expo install expo-notifications expo-device expo-constants

# Media
npx expo install expo-camera expo-barcode-scanner expo-sharing expo-image-manipulator

# Font
npx expo install expo-font expo-splash-screen

# Bottom Sheet
npm install @gorhom/bottom-sheet

# Charts + Calendar
npm install victory-native react-native-calendars

# Lottie + Haptics + QR
npx expo install lottie-react-native expo-haptics
npm install react-native-qrcode-svg

# Skia
npm install @shopify/react-native-skia
```

### 0.4 Supabase Setup
1. Create project at `supabase.io`
2. Run migration `001_initial_schema.sql`
3. Run migration `002_rls_policies.sql`
4. Enable Realtime on `visitors`, `approvals`, `notifications`
5. Generate types: `npx supabase gen types typescript > types/supabase.ts`
6. Store keys in `.env`

### 0.5 NativeWind Config
```js
// tailwind.config.js — full config (see Section 9)
// babel.config.js: add nativewind/babel preset
// metro.config.js: add withNativeWind wrapper
```

### 0.6 Fonts
```tsx
// app/_layout.tsx
await Font.loadAsync({
  'PlusJakartaSans-Regular':   require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
  'PlusJakartaSans-Medium':    require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
  'PlusJakartaSans-SemiBold':  require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
  'PlusJakartaSans-Bold':      require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
  'PlusJakartaSans-ExtraBold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
})
```

### 0.7 Bootstrap Stores
- `authStore`: user, session, role, isLoading
- `uiStore`: toastQueue, activeModal

### 0.8 TanStack Query Setup
```tsx
// app/_layout.tsx
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, gcTime: 300_000 } }
})
return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
```

---

## 14. Phase 1 — Auth, Onboarding & Theme

> **Day 1 Afternoon** | Goal: Login → OTP → Role routing working

### 1.1 Splash Screen
- `expo-splash-screen` keeps native splash visible
- JS loads → Lottie plays (Portl logo animation)
- 2.5s total → navigate to onboarding or home
- Background: `#F5F5F2`

### 1.2 Onboarding (3 slides)
Each slide:
- Full-screen light bg (`#F5F5F2`)
- Lottie illustration top 55%
- Bold title 28px
- Subtitle text-secondary
- Progress dots bottom
- "Next" / "Get Started" button (dark pill)

Slides:
1. "Approve visitors in one tap" 
2. "Your community, connected"
3. "Payments, bookings, notices"

### 1.3 Login Screen
```
Light bg (#F5F5F2)
Logo top center

Card (bg-white rounded-[28px] p-6 shadow-sm):
  Phone input: bg-border rounded-input h-12
  [Send OTP] → bg-dark rounded-btn h-13 text-white font-bold
  — or —
  [G  Continue with Google] → border rounded-btn h-13
  [Email Login] → text link

Form validation: Zod + React Hook Form
```

### 1.4 OTP Screen
```
6-cell OTP input (custom component)
Auto-submit on last digit
Resend countdown 30s
Lottie success on verify
```

### 1.5 Role Detection
```tsx
const { data: userData } = await supabase
  .from('users')
  .select('role')
  .eq('id', session.user.id)
  .single()

authStore.set({ role: userData.role })

router.replace(
  userData.role === 'resident' ? '/(resident)/(tabs)/' :
  userData.role === 'guard'    ? '/(guard)/(tabs)/'    :
                                  '/(admin)/(tabs)/'
)
```

### 1.6 Route Guards
```tsx
// Each (resident)/_layout.tsx
const { role } = useAuthStore()
useEffect(() => {
  if (role && role !== 'resident') router.replace('/(auth)/login')
}, [role])
```

---

## 15. Phase 2 — Resident Module

> **Day 2** | 25 screens | Visitor → Complaints → Amenities → Maintenance → Polls

### 2.1 Home Dashboard
Build order:
1. `AppHeader` component
2. `SearchBar` component
3. Stat cards row (2 lime cards)
4. Dark section container (`rounded-t-[28px]`)
5. Horizontal chip scroll
6. `AnnouncementCard` + `ReadMoreButton`
7. `QuickActionsGrid` (2×3)
8. Pending approval urgent banner
9. TanStack Query: `useVisitors`, `useMaintenance`

### 2.2 Gate Updates (Visitors Screen)
- Tab row: Visitors / Parcel / Helpers
- Expected visitors CTA card (Pre-Approve Entry)
- FlashList of visitor cards
- Pull-to-refresh
- Each visitor card: swipe left=reject, swipe right=approve (Gesture Handler)

### 2.3 Visitor Details
- Hero photo (expo-image, full width)
- Name, phone, purpose badge, vehicle
- Arrival time, host flat
- Status timeline (VisitorTimeline component)
- Action buttons: Approve / Reject / Call Guard
- Generate QR Pass button

### 2.4 Guest Pass Screen
- Form: guest name, phone, validity (Today/24h/48h)
- Generate → call `generate-qr` Edge Function
- Display QR (react-native-qrcode-svg)
- Share via expo-sharing (as image)
- Countdown timer on expiry

### 2.5 Complaints
- List: Open/In Progress/Resolved tabs
- FlashList with ComplaintCard
- New complaint: category grid → priority → description → photos → submit
- Complaint detail: StatusTimeline + comment thread
- Edge Function: `ai-tag-complaint` auto-categorizes

### 2.6 Polls
- Active polls with vote CTA
- Vote screen: options as selectable rows → submit
- Result screen: PollResultBar (animated width, Reanimated)
- Victory Native XL pie chart for closed polls

### 2.7 Notices
- List with pinned notices on top
- Category filter chips
- Notice detail: rich text + attachment download

### 2.8 Facilities (Amenities)
- 2-col FacilityCard grid
- Search + Bookings button header row
- Select amenity → date calendar → slot picker → confirm
- My Bookings: upcoming + past

### 2.9 Maintenance
- Due cards: OVERDUE (red) / PENDING (amber) / PAID (green)
- View invoice
- Payment methods: UPI (deep link) / Card / Net Banking
- Receipt download after payment

### 2.10 Notifications Screen
- Grouped: Today / Yesterday / Earlier
- Each item: icon by type + title + body + time
- Tap → deep link to screen
- Mark all read

---

## 16. Phase 3 — Guard Module

> **Day 3** | 12 screens

### 3.1 Guard Dashboard
- Stats: Inside Now / Pending Approvals / Today's Entry / Today's Exit
- Pending approvals list with countdown timers (2min)
- Recent activity feed (FlashList)
- Quick: Add Visitor / QR Scan / Emergency

### 3.2 Register Visitor (Multi-step form)
```
Step 1: Camera view → capture photo
Step 2: Name, Phone, Purpose picker, Vehicle
Step 3: Search resident (typeahead → Supabase query)
Step 4: Review card → Send Approval Request
Step 5: Waiting screen — countdown timer
         ├── Supabase Realtime listener
         ├── Approved → green screen → Allow Entry btn
         └── Rejected → red screen → reason shown
```

### 3.3 QR Scanner
- `expo-barcode-scanner` camera view
- Skia animated scan frame
- Token validate via Edge Function
- Success: auto entry, visitor info shown
- Fail: error toast

### 3.4 Visitor History
- Date filter (react-native-calendars)
- Purpose chips filter
- FlashList with compact visitor rows
- Visitor detail on tap

### 3.5 Search Resident
- Debounced input → Supabase `.ilike()` query
- Results: avatar + name + flat number
- Tap to select in register visitor flow

---

## 17. Phase 4 — Admin Module

> **Day 4** | 18 screens

### 4.1 Analytics Dashboard
Victory Native XL charts:
- Line chart: Daily visitors (7 days)
- Bar chart: Complaints by category
- Area chart: Maintenance revenue
- Pie chart: Bookings by amenity

Live activity feed (Realtime subscription)

### 4.2 Resident Management
- List with search + tower filter
- Add resident: multi-step form
- Resident detail: profile + history tabs
- Edit, deactivate

### 4.3 Tower & Flat Management
- Tower list → drill to flat list
- Add / edit flat
- Mark occupied/vacant

### 4.4 Complaint Management
- All complaints, all flats
- Assign staff from dropdown
- Update status
- Add internal note
- Push notify resident on status change

### 4.5 Notice & Poll Management
- Create notice: rich input + attachment + pin + expiry
- Create poll: question + up to 6 options + end date
- Publish → all residents push notification

### 4.6 Amenity Management
- Enable/disable amenities
- Configure slots per day
- View booking calendar

### 4.7 Guard Management
- Guard list with shift info
- Add/edit guard (linked to users table)

### 4.8 Reports
- Date range picker
- Export: Visitor / Complaint / Revenue reports
- Table preview → Edge Function generates PDF → Storage → download

---

## 18. Phase 5 — Realtime & Notifications

> **Day 5** | Goal: Live sync + push notifications working

### 5.1 Supabase Realtime Subscriptions

```typescript
// services/supabase/realtime.ts

// Guard: listen for approval result
supabase.channel('approval-result')
  .on('postgres_changes', {
    event: 'UPDATE', schema: 'public', table: 'visitors',
    filter: `guard_id=eq.${guardId}`
  }, (payload) => {
    visitorStore.setApprovalResult(payload.new.status)
  }).subscribe()

// Resident: listen for new visitor requests
supabase.channel('visitor-request')
  .on('postgres_changes', {
    event: 'INSERT', schema: 'public', table: 'visitors',
    filter: `resident_id=eq.${userId}`
  }, (payload) => {
    visitorStore.incrementPending()
    showInAppToast('Visitor at gate!')
  }).subscribe()

// Admin: listen for all visitor activity
supabase.channel('admin-visitors')
  .on('postgres_changes', {
    event: '*', schema: 'public', table: 'visitors'
  }, (payload) => {
    adminStore.refreshAnalytics()
  }).subscribe()
```

### 5.2 Push Notification Setup

```typescript
// services/notifications/registerToken.ts
export async function registerPushToken(userId: string) {
  const { status } = await Notifications.requestPermissionsAsync()
  if (status !== 'granted') return

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId
  })

  await supabase
    .from('users')
    .update({ fcm_token: token.data })
    .eq('id', userId)
}
```

**Edge Function: `send-push`**
```typescript
// supabase/functions/send-push/index.ts
// Triggered by DB webhook on notifications INSERT
// Calls Expo Push API: https://exp.host/--/api/v2/push/send
// Batch up to 100 tokens per call
```

### 5.3 Notification Events

| Event | Trigger | Recipient | Deep Link |
|---|---|---|---|
| Visitor arrived | visitor INSERT | Resident | `/visitor-details/[id]` |
| Visitor approved | approvals UPDATE | Guard | Guard dashboard |
| Visitor rejected | approvals UPDATE | Guard | Guard dashboard |
| Approval expired | cron 60s | Guard | Guard dashboard |
| Complaint updated | complaints UPDATE | Resident | `/complaints/[id]` |
| Booking confirmed | bookings INSERT | Resident | `/booking/[id]` |
| Booking reminder | scheduled 1h before | Resident | `/booking/[id]` |
| Notice published | notices INSERT | All residents | `/notices/[id]` |
| Poll live | polls INSERT | All residents | `/polls/[id]` |
| Poll ending soon | cron | Non-voters | `/polls/[id]` |
| Maintenance due | cron 3 days before | Resident | `/maintenance` |

### 5.4 Auto-Reject Expired Approvals
```typescript
// supabase/functions/auto-reject-expired/index.ts
// Cron: every 60 seconds
// UPDATE visitors SET status='expired' WHERE status='pending' AND created_at < now()-120s
```

### 5.5 Deep Link Handling
```typescript
// services/notifications/handlePush.ts
Notifications.addNotificationResponseReceivedListener((response) => {
  const { type, id } = response.notification.request.content.data
  const routes = {
    visitor: `/(resident)/visitor-details/${id}`,
    complaint: `/(resident)/complaints/${id}`,
    booking: `/(resident)/booking/${id}`,
    notice: `/(resident)/notices/${id}`,
    poll: `/(resident)/polls/${id}`,
    maintenance: `/(resident)/maintenance`,
  }
  router.push(routes[type])
})
```

---

## 19. Phase 6 — Animations & Polish

> **Day 6** | Goal: Every interaction feels smooth and premium

### 6.1 Screen Transitions
- Expo Router shared element transitions
- VisitorCard → VisitorDetails: hero image expands
- FacilityCard → Booking: card lifts and expands
- Tab changes: fade-through (not slide)

### 6.2 Microinteractions

| Element | Animation | Library |
|---|---|---|
| Card press | scale(0.97) → scale(1.0) | Reanimated |
| Approve button | scale → green flash → confetti | Moti + Lottie |
| Reject button | horizontal shake (±6px × 3) | Reanimated |
| Poll vote | bar width animates to new % | Reanimated |
| Notification bell | ring rotation | Moti |
| Bottom nav switch | active circle slides | Reanimated |
| QR code appear | scale(0.85→1) + fadeIn | Moti |
| FAB expand | rotate 45° | Reanimated |
| Pull-to-refresh | Lottie custom spinner | lottie-react-native |
| Success | Lottie checkmark | lottie-react-native |
| Confetti on approve | particle burst | lottie-react-native |
| Skeleton loader | shimmer left→right | moti/skeleton |
| Hero transition | sharedTransition | Reanimated |

### 6.3 Haptic Feedback
```typescript
// expo-haptics
Haptics.selectionAsync()           // tab switch, option select
Haptics.notificationAsync('SUCCESS') // approve, booking confirm
Haptics.notificationAsync('ERROR')   // reject, error
Haptics.impactAsync('MEDIUM')        // FAB press, swipe confirm
```

### 6.4 Skeleton Loading
Every list screen has a skeleton state:
- Exact layout match of real content
- `moti/skeleton` shimmer
- Show min 300ms, then fade crossfade

### 6.5 Empty States
Every list: unique Lottie + friendly message + CTA

### 6.6 Glass Bottom Nav Polish
```tsx
// Smooth tab indicator using Reanimated
// withSpring for active circle position
// BlurView intensity adjusts based on scroll (Animated header)
```

---

## 20. Phase 7 — Testing, Demo & Submission

> **Day 7** | Goal: APK built, demo recorded, GitHub ready

### 7.1 Test Checklist
- [ ] Login with all 3 demo accounts
- [ ] Guard registers visitor → resident approves → guard confirms entry
- [ ] Guard registers visitor → resident rejects → guard sees rejection
- [ ] QR guest pass generated → guard scans → auto entry
- [ ] Resident raises complaint → admin resolves → resident gets push
- [ ] Admin publishes notice → all residents get push
- [ ] Resident books amenity → gets confirmation push → reminder 1h before
- [ ] Resident pays maintenance → receipt shown
- [ ] Poll created → resident votes → result animated
- [ ] Admin analytics update live when visitor enters

### 7.2 EAS Build
```bash
# Install EAS CLI
npm install -g eas-cli
eas login

# Configure
eas build:configure

# Build preview APK
eas build --platform android --profile preview

# Download APK URL shown after build
```

`eas.json`:
```json
{
  "build": {
    "preview": {
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "aab" },
      "ios": {}
    }
  }
}
```

### 7.3 Demo Video Script (5 min)
```
00:00–00:30  Splash + onboarding (30s)
00:30–01:00  Login as Guard → Guard dashboard tour (30s)
01:00–01:45  Guard registers visitor → Resident gets push → Approves (45s)
01:45–02:00  Guard sees live approval → marks entry (15s)
02:00–02:15  Visitor exits → logged (15s)
02:15–02:45  Admin sees live count + analytics (30s)
02:45–03:15  QR guest pass flow (30s)
03:15–03:45  Resident books Swimming Pool (30s)
03:45–04:00  Resident raises complaint (15s)
04:00–04:15  Admin resolves + publishes notice (15s)
04:15–04:30  Resident pays maintenance (15s)
04:30–05:00  Final app tour → Portl branding (30s)
```

---

## 21. State Management Strategy

### Zustand Stores (9 stores)

| Store | State |
|---|---|
| `authStore` | user, session, role, residentProfile, isLoading |
| `visitorStore` | pendingCount, latestVisitor, approvalResult |
| `notificationStore` | notifications[], unreadCount |
| `bookingStore` | myBookings, selectedAmenity, selectedSlot |
| `complaintStore` | complaints, activeComplaint |
| `pollStore` | activePolls, votedPolls |
| `noticeStore` | notices, unreadCount |
| `adminStore` | analytics, residentList, guardList |
| `uiStore` | toastQueue, activeModal, isOnline |

### TanStack Query Keys

```typescript
// Visitors
queryKey: ['visitors', flatId, status]
queryKey: ['visitor', visitorId]

// Complaints
queryKey: ['complaints', residentId, status]
queryKey: ['complaint', complaintId]

// Community
queryKey: ['notices', category]
queryKey: ['polls', 'active']
queryKey: ['poll', pollId]

// Amenities
queryKey: ['amenities']
queryKey: ['bookings', residentId]
queryKey: ['slots', amenityId, date]

// Admin
queryKey: ['admin', 'analytics']
queryKey: ['admin', 'residents', filters]
queryKey: ['admin', 'all-visitors', filters]
```

### Cache Strategy

| Query | staleTime | gcTime |
|---|---|---|
| Visitor list | 30s | 5 min |
| Amenity list | 10 min | 1 hour |
| Notices | 5 min | 30 min |
| Polls | 1 min | 10 min |
| Analytics | 2 min | 10 min |
| Maintenance | 5 min | 30 min |

---

## 22. API Architecture

### Service Layer Pattern

```
Component / Hook
    │
    ▼
TanStack Query (useQuery / useMutation)
    │
    ▼
Service Function in /services/supabase/
    │
    ▼
Supabase Client (.from().select()...)
    │
    ▼
PostgreSQL (RLS applied server-side)
```

### Service Files

| File | Key Functions |
|---|---|
| `auth.ts` | `signIn()`, `signOut()`, `verifyOTP()`, `getSession()` |
| `visitors.ts` | `getVisitors()`, `createVisitor()`, `approveVisitor()`, `rejectVisitor()`, `markEntry()`, `markExit()` |
| `complaints.ts` | `getComplaints()`, `createComplaint()`, `updateStatus()`, `addComment()` |
| `bookings.ts` | `getBookings()`, `createBooking()`, `cancelBooking()`, `getAvailableSlots()` |
| `polls.ts` | `getPolls()`, `submitVote()`, `getPollResults()` |
| `notices.ts` | `getNotices()`, `createNotice()`, `pinNotice()`, `publishNotice()` |
| `maintenance.ts` | `getDues()`, `markPaid()`, `getPaymentHistory()` |
| `realtime.ts` | `subscribeVisitors()`, `subscribeApprovals()`, `subscribeNotifications()` |

### Supabase Edge Functions

| Function | Trigger | Purpose |
|---|---|---|
| `send-push` | DB webhook on `notifications` INSERT | Expo Push API batch send |
| `ai-tag-complaint` | HTTP on complaint create | AI auto-categorize (Gemini/OpenAI) |
| `generate-qr` | HTTP | Sign JWT for QR token, return base64 |
| `validate-qr` | HTTP | Verify QR JWT signature + expiry |
| `auto-reject-expired` | Cron every 60s | Auto-reject stale approvals |

---

## 23. Functional Requirements

| ID | Requirement | Role |
|---|---|---|
| FR-01 | Resident can log in via OTP / email / Google | Resident |
| FR-02 | Guard can log in with credentials | Guard |
| FR-03 | Admin can log in with credentials | Admin |
| FR-04 | Guard can register visitor with photo, name, purpose, vehicle | Guard |
| FR-05 | Resident receives push notification on visitor arrival | Resident |
| FR-06 | Resident can approve or reject visitor in-app | Resident |
| FR-07 | Guard can mark visitor entry after approval | Guard |
| FR-08 | Guard can mark visitor exit | Guard |
| FR-09 | Guard can scan QR for pre-approved guests | Guard |
| FR-10 | Resident can generate QR guest pass | Resident |
| FR-11 | Resident can browse and book amenities by date/slot | Resident |
| FR-12 | Admin can create, pin, and publish society notices | Admin |
| FR-13 | All residents receive push on notice publication | Resident |
| FR-14 | Resident can raise complaint with category, priority, photos | Resident |
| FR-15 | Admin can update complaint status and notify resident | Admin |
| FR-16 | Resident can vote in active polls | Resident |
| FR-17 | Admin can create polls with options and end date | Admin |
| FR-18 | Resident can view and pay maintenance dues | Resident |
| FR-19 | Admin can view visitor analytics in real time | Admin |
| FR-20 | All users receive appropriate push notifications | All |

---

## 24. Non-Functional Requirements

| Requirement | Target |
|---|---|
| App launch time | < 2 seconds |
| Visitor approval end-to-end | < 5 seconds |
| Realtime sync latency | < 1 second |
| Offline support | Partial (cached data viewable) |
| Crash rate | < 1% |
| Responsive UI | 100% across screen sizes |
| Dark mode | Supported (within dual-mode design) |
| Accessibility | Screen reader, WCAG contrast ratios |
| Data security | RLS on ALL tables |
| Token security | expo-secure-store (Keychain/Keystore) |

---

## 25. Security Best Practices

| Area | Implementation |
|---|---|
| JWT Auth | Supabase JWT, stored in `expo-secure-store` |
| Row Level Security | Enabled + configured on ALL tables |
| HTTPS Only | All calls over TLS 1.3 |
| Secure Token Storage | iOS Keychain / Android Keystore via `expo-secure-store` |
| Client Validation | Zod schemas on all form fields |
| Server Validation | Edge Functions validate all inputs |
| Role-Based Access | `_layout.tsx` middleware + RLS double enforcement |
| SQL Injection | Supabase parameterized queries only |
| File Upload | MIME type check + 5MB size limit |
| QR Security | Short-lived JWT (1h), server-side validation |
| 401 Handling | Auto sign-out + redirect to login |
| No secrets in app | All secrets in Supabase Edge Functions only |

---

## 26. Performance Optimizations

| Optimization | Implementation |
|---|---|
| Fast lists | FlashList with `estimatedItemSize` per screen |
| Image caching | `expo-image` with `blurhash` placeholder |
| React Query cache | staleTime per query, background refetch |
| Lazy loading | Expo Router auto code-splits each route |
| Memoized components | `React.memo` on all FlashList item renderers |
| Zustand selectors | `useShallow` for object slice subscriptions |
| Pagination | `.range(0, 19)` + load more on all lists |
| DB projections | Never `select('*')` — always specify columns |
| Image compression | `expo-image-manipulator` before upload (80%, max 1200px) |
| No inline functions | No anonymous arrows in FlashList renderItem |

---

## 27. Offline & Caching Strategy

| Data | Cache | Offline Behavior |
|---|---|---|
| User profile | Zustand persist (MMKV) | Always available |
| Visitor list | TanStack 30s stale | Show cached + "offline" banner |
| Notices | TanStack 5min stale | Read cached notices |
| Polls | TanStack 1min stale | View past results |
| Amenity list | TanStack 10min | Browse facilities |
| Analytics | TanStack 2min | Show last data |

**Offline Detection:**
```typescript
import NetInfo from '@react-native-community/netinfo'
NetInfo.addEventListener(state => {
  uiStore.setIsOnline(state.isConnected)
})
```

When offline: disable write actions (approve, submit, pay), show cached data with "Last updated X ago" label.

---

## 28. Push Notifications Plan

### Token Registration
```typescript
// On every login
const token = await Notifications.getExpoPushTokenAsync({ projectId })
await supabase.from('users').update({ fcm_token: token.data }).eq('id', userId)
```

### Notification Events Table

| Event | Who Gets It | Title | Body |
|---|---|---|---|
| Visitor arrived | Resident | `🔔 Visitor at Gate` | `{name} is at your door. Approve?` |
| Approved | Guard | `✅ Entry Approved` | `{resident} approved entry` |
| Rejected | Guard | `❌ Entry Denied` | `Resident denied entry` |
| Approval timeout | Guard | `⏱️ No Response` | `Resident didn't respond (2 min)` |
| Complaint updated | Resident | `🔧 Complaint Update` | `Your complaint is now {status}` |
| Booking confirmed | Resident | `📅 Booking Confirmed` | `{amenity} on {date} at {time}` |
| Booking reminder | Resident | `⏰ Reminder` | `{amenity} booking in 1 hour` |
| Notice published | All residents | `📢 New Notice` | `{title}` |
| Poll live | All residents | `🗳️ New Poll` | `Vote now: {question}` |
| Poll ending | Non-voters | `⏰ Poll Ending` | `Last chance to vote!` |
| Maintenance due | Resident | `💰 Payment Due` | `₹{amount} due for {month}` |

### Local Scheduled Notifications
```typescript
// Booking reminder: 1 hour before
await Notifications.scheduleNotificationAsync({
  content: { title: '⏰ Reminder', body: `${amenity} in 1 hour` },
  trigger: { date: new Date(bookingTime - 60 * 60 * 1000) }
})
```

---

## 29. Error Handling Strategy

| Scenario | Handling |
|---|---|
| Network error | TanStack retry (3 attempts, exponential backoff) |
| Offline | NetInfo → cached data + offline banner at top |
| Empty list | Lottie empty state + CTA |
| Loading | moti/skeleton shimmer (layout-matched) |
| Form validation | Zod → React Hook Form inline red errors |
| Toast | Custom `Toast.tsx` — top of screen, 3s auto-dismiss |
| API error boundary | `ErrorBoundary` per screen group |
| 401 Unauthorized | Auto sign-out + redirect to login |
| 500 Server error | Friendly card + retry button |
| Permission denied | Redirect with explanation message |

---

## 30. Deployment Plan

### Frontend (EAS)

```bash
# Development
npx expo start

# Preview APK (hackathon submission)
eas build --platform android --profile preview

# OTA update (post-hackathon)
eas update --branch production
```

### Backend (Supabase)

| Service | Notes |
|---|---|
| Database | Supabase Cloud, auto-backups |
| Auth | Supabase Auth (built-in) |
| Storage | Supabase Storage — visitor photos, invoices |
| Edge Functions | `supabase functions deploy send-push` |
| Push | Expo Push Service (free) |

### `.env.example`
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_APP_ENV=development
# Edge functions only (server-side):
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
EXPO_PUSH_ACCESS_TOKEN=your-expo-token
```

### Demo Credentials
| Role | Email | Password |
|---|---|---|
| Resident | `resident@portl.app` | `demo123` |
| Guard | `guard@portl.app` | `demo123` |
| Admin | `admin@portl.app` | `demo123` |

---

## 31. Screens Index

### Resident (25 screens)
| # | Screen | Route |
|---|---|---|
| R01 | Splash | `/` |
| R02 | Onboarding 1 | `/(onboarding)/slide-1` |
| R03 | Onboarding 2 | `/(onboarding)/slide-2` |
| R04 | Onboarding 3 | `/(onboarding)/slide-3` |
| R05 | Login | `/(auth)/login` |
| R06 | OTP | `/(auth)/otp` |
| R07 | Home Dashboard | `/(resident)/(tabs)/` |
| R08 | Gate Updates | `/(resident)/(tabs)/visitors` |
| R09 | Visitor Details | `/(resident)/visitor-details/[id]` |
| R10 | Generate QR Pass | `/(resident)/generate-pass` |
| R11 | Community | `/(resident)/(tabs)/community` |
| R12 | Notices List | `/(resident)/notices/` |
| R13 | Notice Detail | `/(resident)/notices/[id]` |
| R14 | Polls List | `/(resident)/polls/` |
| R15 | Poll Vote + Result | `/(resident)/polls/[id]` |
| R16 | Facilities | `/(resident)/(tabs)/amenities` |
| R17 | Amenity Booking | `/(resident)/amenity/[id]` |
| R18 | Booking Detail | `/(resident)/booking/[id]` |
| R19 | Complaints List | `/(resident)/complaints/` |
| R20 | New Complaint | `/(resident)/complaints/new` |
| R21 | Complaint Detail | `/(resident)/complaints/[id]` |
| R22 | Maintenance | `/(resident)/maintenance` |
| R23 | Notifications | `/(resident)/notifications` |
| R24 | Emergency | `/(resident)/emergency` |
| R25 | Profile | `/(resident)/profile` |

### Guard (12 screens)
| # | Screen | Route |
|---|---|---|
| G01 | Guard Dashboard | `/(guard)/(tabs)/` |
| G02 | Register Visitor | `/(guard)/(tabs)/register` |
| G03 | QR Scanner | `/(guard)/(tabs)/scan` |
| G04 | Visitor History | `/(guard)/(tabs)/history` |
| G05 | Guard Profile | `/(guard)/(tabs)/profile` |
| G06 | Visitor Detail | `/(guard)/visitor/[id]` |
| G07 | Search Resident | `/(guard)/search-resident` |
| G08 | Waiting Screen | (step within register) |
| G09 | Approval Result | (step within register) |
| G10 | Entry Confirmed | (step within register) |
| G11 | QR Result | (within scan tab) |
| G12 | Emergency | `/(guard)/emergency` |

### Admin (18 screens)
| # | Screen | Route |
|---|---|---|
| A01 | Analytics Dashboard | `/(admin)/(tabs)/` |
| A02 | Resident List | `/(admin)/(tabs)/residents` |
| A03 | Resident Detail | `/(admin)/resident/[id]` |
| A04 | Add Resident | `/(admin)/add-resident` |
| A05 | Visitor Log | `/(admin)/(tabs)/visitors` |
| A06 | Management Hub | `/(admin)/(tabs)/management` |
| A07 | Complaints List | `/(admin)/complaints` |
| A08 | Complaint Detail | `/(admin)/complaint/[id]` |
| A09 | Notices List | `/(admin)/notices` |
| A10 | Create Notice | `/(admin)/create-notice` |
| A11 | Polls List | `/(admin)/polls` |
| A12 | Create Poll | `/(admin)/create-poll` |
| A13 | Amenity Management | `/(admin)/amenities` |
| A14 | Amenity Detail | `/(admin)/amenity/[id]` |
| A15 | Tower & Flats | `/(admin)/towers` |
| A16 | Guard Management | `/(admin)/guards` |
| A17 | Reports | `/(admin)/reports` |
| A18 | Admin Settings | `/(admin)/(tabs)/settings` |

**Total: 55 Screens ✅**

---

## 32. Demo Story (End-to-End)

> 5-minute flow for hackathon judges. Practice this until flawless.

```
[00:00] Guard Ravi opens Portl
        → Dashboard: "Morning Gate | 12 Inside Now | 2 Pending"

[00:30] Guard taps "Register Visitor"
        → Photo captured
        → Name: Swiggy Delivery, Purpose: Delivery
        → Search "A-203" → selects Arjun Sharma
        → Taps "Send Approval Request"
        → Waiting screen: ⏱️ 1:58 countdown begins

[01:00] Resident Arjun's phone gets push notification (< 1 second)
        → "🔔 Swiggy Delivery is at your gate. Approve?"
        → Opens Portl → sees photo, purpose, arrival time

[01:20] Arjun taps "Approve"
        → Confetti burst 🎊
        → "✅ Entry Approved!"
        → expo-haptics: SUCCESS vibration

[01:30] Guard's screen updates INSTANTLY (Supabase Realtime)
        → Green screen: "✅ Approved by Arjun Sharma"
        → Guard taps "Allow Entry"
        → Entry logged: 3:47 PM

[01:45] Visitor exits 15 min later
        → Guard finds in list → "Mark Exit"
        → Exit logged: 4:02 PM

[02:00] Admin dashboard (open on second device)
        → Today count: 13 (+1 just now, live)
        → Activity feed: "Swiggy Delivery · A-203 · Exited 4:02 PM"
        → Line chart bar grows in real time

[02:30] QR Guest Pass demo
        → Resident: Visitors → Pre-Approve Entry
        → Enter "Priya Sharma", valid 24h
        → QR generated → Share → Guard scans
        → Auto entry (no call needed) ✅

[03:00] Resident books Swimming Pool
        → Facilities → Swimming Pool → 14 Jul → 6-7 AM
        → Confirm → "✅ Booking Confirmed"
        → Local reminder set: 5 AM tomorrow

[03:30] Resident raises complaint
        → Quick Action → Plumbing → High → Photo → Submit
        → "🔧 Complaint #1042 raised"

[04:00] Admin resolves complaint
        → Admin: Management → Complaint #1042 → Resolved
        → Resident push: "Complaint resolved ✅"

[04:15] Admin publishes notice
        → "Plumbing repair completed in Block A"
        → All residents get push notification

[04:30] Resident pays maintenance
        → Home → $170 Dues → Pay → UPI → Success
        → Receipt available

[05:00] Close on app icon + tagline
        → "Portl — Your Society. One Tap Away."
```

---

## 33. Submission Checklist

### Code & Repository
- [ ] Public GitHub repository with clean commit history
- [ ] `.env.example` committed (never `.env`)
- [ ] `supabase/migrations/` included
- [ ] TypeScript strict mode — no `any` types
- [ ] All 55 screens implemented and functional

### Build & Testing
- [ ] EAS preview APK generated and downloadable
- [ ] All 3 demo accounts working
- [ ] End-to-end demo flow tested (guard → resident → admin)
- [ ] Push notifications working on physical device
- [ ] Realtime sync tested across 2 devices simultaneously

### Demo Materials
- [ ] Demo video 3-5 minutes uploaded (YouTube/Drive)
- [ ] README with setup instructions
- [ ] Screenshots: min 10 screens
- [ ] Architecture diagram (`docs/architecture.png`)
- [ ] Database ER diagram (`docs/database.png`)

### Documentation (in `/docs`)
- [ ] `prd.md` — Product Requirements
- [ ] `trd.md` — Technical Requirements
- [ ] `ui_spec.md` — UI Specification
- [ ] `app_flow.md` — App Flow
- [ ] `implementation_plan.md` — This document

### Demo Credentials
| Role | Email | Password |
|---|---|---|
| Resident | `resident@portl.app` | `demo123` |
| Guard | `guard@portl.app` | `demo123` |
| Admin | `admin@portl.app` | `demo123` |

---

*Master Implementation Plan v2.0 · Portl · Your Society. One Tap Away.*
*Merged from: PRD v1.0 · TRD v1.0 · UI Spec v1.0 · App Flow v1.0*

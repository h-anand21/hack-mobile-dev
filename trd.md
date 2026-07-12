# Portl — Smart Society Management Platform
## Technical Requirements Document (TRD)

> **Version**: 1.0
> **Platform**: Android · iOS
> **Framework**: Expo SDK 55 · React Native · TypeScript
> **Reference PRD**: [prd.md](file:///E:/hakMobile/prd.md)
> **Reference Implementation Plan**: [implementation_plan.md](file:///E:/hakMobile/implementation_plan.md)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Folder Structure](#4-folder-structure)
5. [Feature Modules](#5-feature-modules)
6. [Navigation Architecture](#6-navigation-architecture)
7. [Authentication Flow](#7-authentication-flow)
8. [Role-Based Access Control](#8-role-based-access-control)
9. [Database Schema](#9-database-schema)
10. [State Management](#10-state-management)
11. [API Layer](#11-api-layer)
12. [Realtime Events](#12-realtime-events)
13. [Push Notifications](#13-push-notifications)
14. [UI Design System](#14-ui-design-system)
15. [Theme Colors](#15-theme-colors)
16. [Animations](#16-animations)
17. [Security](#17-security)
18. [Performance](#18-performance)
19. [Error Handling](#19-error-handling)
20. [Deployment](#20-deployment)
21. [Third-Party Libraries](#21-third-party-libraries)
22. [Hackathon Demo Architecture](#22-hackathon-demo-architecture)

---

## 1. Overview

**Portl** is a mobile-first apartment society management platform built using **Expo React Native**.

The application provides role-based access for **Residents**, **Security Guards**, and **Society Admins** while supporting:

- Real-time visitor approvals
- Complaints & helpdesk
- Amenity bookings
- Maintenance payments
- Community communication (notices, polls)

The architecture is designed for **scalability**, **modularity**, and **production deployment**.

> [!IMPORTANT]
> This TRD describes **how** the system is built. For **what** the product does, refer to [prd.md](file:///E:/hakMobile/prd.md).

---

## 2. Technology Stack

### Frontend

| Layer | Technology | Version |
|---|---|---|
| Framework | Expo | SDK 55 |
| Language | React Native + TypeScript | Latest |
| Navigation | Expo Router | v3 |
| Styling | NativeWind + Tailwind CSS | v4 |
| UI Components | React Native Reusables | Latest |
| Icons | Lucide React Native | Latest |

### State Management

| Purpose | Library |
|---|---|
| Local / UI State | Zustand |
| Server State + Caching | TanStack Query (React Query v5) |

### Backend

| Service | Provider |
|---|---|
| Authentication | Supabase Auth (Email, OTP, Google OAuth) |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime (WebSocket) |
| Edge Functions | Supabase Edge Functions (Deno) |

### Mobile-Specific

| Category | Library |
|---|---|
| Push Notifications | Expo Notifications |
| Image Rendering | Expo Image (with blurhash) |
| Animation | React Native Reanimated 3 + Moti |
| Gestures | React Native Gesture Handler |
| Bottom Sheets | @gorhom/bottom-sheet |
| Lists | FlashList (by Shopify) |
| Forms | React Hook Form + Zod |
| Calendar | React Native Calendars |
| Charts | Victory Native XL |
| QR | Expo Camera + Expo Barcode Scanner |
| Blur | Expo Blur |
| Gradients | Expo Linear Gradient |

---

## 3. System Architecture

```
┌────────────────────────────────────────────────────────────┐
│                        MOBILE APP                          │
│                   Expo React Native                        │
│                                                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐  │
│  │  Resident  │  │   Guard    │  │       Admin        │  │
│  │  Dashboard │  │  Dashboard │  │     Dashboard      │  │
│  └────────────┘  └────────────┘  └────────────────────┘  │
│                        │                                   │
│                   Expo Router                              │
│                        │                                   │
│            Zustand  +  TanStack Query                      │
│                        │                                   │
│               Service Layer (API)                          │
│              /services/supabase/                           │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                         │
│                                                            │
│  ┌─────────────┐  ┌────────────┐  ┌──────────────────┐   │
│  │ Supabase    │  │ PostgreSQL │  │ Supabase Storage │   │
│  │   Auth      │  │  Database  │  │  (photos, docs)  │   │
│  └─────────────┘  └─────┬──────┘  └──────────────────┘   │
│                         │                                  │
│                    Realtime WS                             │
│                         │                                  │
│                  Edge Functions                            │
│                         │                                  │
│               Expo Push Notification                       │
│                      Service                               │
└────────────────────────────────────────────────────────────┘
```

---

## 4. Folder Structure

```
portl/
├── app/
│   ├── _layout.tsx                    # Root — fonts, QueryClient, theme
│   ├── index.tsx                      # Entry → splash redirect
│   │
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── otp.tsx
│   │   └── signup.tsx
│   │
│   ├── (onboarding)/
│   │   ├── _layout.tsx
│   │   ├── slide-1.tsx
│   │   ├── slide-2.tsx
│   │   └── slide-3.tsx
│   │
│   ├── (resident)/
│   │   ├── _layout.tsx
│   │   └── (tabs)/
│   │       ├── index.tsx              # Home
│   │       ├── visitors.tsx
│   │       ├── amenities.tsx
│   │       ├── notifications.tsx
│   │       └── profile.tsx
│   │
│   ├── (guard)/
│   │   ├── _layout.tsx
│   │   └── (tabs)/
│   │       ├── index.tsx              # Dashboard
│   │       ├── register.tsx
│   │       ├── scan.tsx
│   │       ├── history.tsx
│   │       └── profile.tsx
│   │
│   └── (admin)/
│       ├── _layout.tsx
│       └── (tabs)/
│           ├── index.tsx              # Analytics
│           ├── residents.tsx
│           ├── visitors.tsx
│           ├── management.tsx
│           └── settings.tsx
│
├── components/
│   ├── ui/
│   │   ├── buttons/
│   │   │   ├── Button.tsx
│   │   │   ├── IconButton.tsx
│   │   │   └── FAB.tsx
│   │   ├── cards/
│   │   │   ├── Card.tsx
│   │   │   ├── GlassCard.tsx
│   │   │   └── StatCard.tsx
│   │   ├── inputs/
│   │   │   ├── Input.tsx
│   │   │   ├── OTPInput.tsx
│   │   │   └── SearchBar.tsx
│   │   └── avatars/
│   │       └── Avatar.tsx
│   │
│   ├── visitor/
│   │   ├── VisitorCard.tsx
│   │   ├── VisitorTimeline.tsx
│   │   └── ApprovalActions.tsx
│   │
│   ├── poll/
│   │   ├── PollCard.tsx
│   │   └── PollResultBar.tsx
│   │
│   ├── notice/
│   │   └── NoticeCard.tsx
│   │
│   ├── payment/
│   │   └── MaintenanceCard.tsx
│   │
│   └── animations/
│       ├── FadeIn.tsx
│       ├── SlideUp.tsx
│       ├── ShimmerSkeleton.tsx
│       └── ConfettiBlast.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useVisitors.ts
│   ├── useComplaints.ts
│   ├── useBookings.ts
│   ├── usePolls.ts
│   ├── useNotices.ts
│   ├── useMaintenance.ts
│   ├── useNotifications.ts
│   └── useRealtime.ts
│
├── services/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── visitors.ts
│   │   ├── complaints.ts
│   │   ├── bookings.ts
│   │   ├── polls.ts
│   │   ├── notices.ts
│   │   ├── maintenance.ts
│   │   └── realtime.ts
│   └── notifications/
│       ├── registerToken.ts
│       └── handlePush.ts
│
├── store/
│   ├── authStore.ts
│   ├── visitorStore.ts
│   ├── bookingStore.ts
│   ├── complaintStore.ts
│   ├── paymentStore.ts
│   ├── noticeStore.ts
│   ├── pollStore.ts
│   ├── notificationStore.ts
│   └── adminStore.ts
│
├── constants/
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── spacing.ts
│   │   └── radius.ts
│   └── roles.ts
│
├── types/
│   ├── user.ts
│   ├── visitor.ts
│   ├── complaint.ts
│   ├── booking.ts
│   ├── poll.ts
│   ├── notice.ts
│   └── supabase.ts
│
├── utils/
│   ├── formatDate.ts
│   ├── formatCurrency.ts
│   ├── generateOTP.ts
│   └── roleGuard.ts
│
├── assets/
│   ├── images/
│   ├── fonts/
│   ├── icons/
│   └── lottie/
│       ├── splash.json
│       ├── success.json
│       ├── empty.json
│       └── confetti.json
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_schema.sql
│   │   ├── 002_rls.sql
│   │   └── 003_realtime.sql
│   └── functions/
│       ├── send-push/
│       ├── ai-tag-complaint/
│       └── generate-qr/
│
├── app.json
├── tailwind.config.js
├── babel.config.js
├── tsconfig.json
└── .env.example
```

---

## 5. Feature Modules

### 🔐 Authentication Module

| Responsibility | Implementation |
|---|---|
| Login | Supabase Auth (email + OTP + Google) |
| Register | Supabase Auth + users table insert |
| Session Management | JWT auto-refresh via Supabase client |
| Token Refresh | Automatic via `@supabase/supabase-js` |
| Secure Storage | `expo-secure-store` (encrypted) |
| Libraries | `@supabase/supabase-js`, `expo-secure-store` |

---

### 🏠 Resident Module

| Feature | Screen(s) |
|---|---|
| Dashboard | Home with greeting, stats, quick actions |
| Visitors | Pending / Approved / Rejected / History tabs |
| Complaints | Raise, view timeline, chat with admin |
| Polls | Vote, view live results |
| Notices | Browse, read, mark read |
| Payments | View dues, pay, download receipt |
| Amenities | Browse, select slot, confirm booking |
| Notifications | Grouped by day, tap to deep link |

---

### 🛡️ Guard Module

| Feature | Screen(s) |
|---|---|
| Visitor Registration | Multi-step: Photo → Info → Purpose → Resident → Submit |
| QR Scan | Camera → validate token → instant entry |
| Resident Search | Typeahead by name / flat number |
| Entry | Mark entry after approval |
| Exit | Mark exit with timestamp |
| Visitor History | Filter by date / purpose / resident |

---

### 👨‍💼 Admin Module

| Feature | Screen(s) |
|---|---|
| Resident Management | List, search, add, edit, deactivate |
| Complaint Management | List, assign staff, update status |
| Notice Board | Create, pin, publish, delete |
| Analytics | Charts: visitors, complaints, revenue, bookings |
| Amenities | Configure amenities and slot availability |
| Payments | View dues, mark paid, generate invoices |

---

## 6. Navigation Architecture

```
Splash Screen
      │
      ▼
Onboarding (3 slides)          [First time only]
      │
      ▼
Authentication
      ├── Login (Email / OTP / Google)
      └── OTP Verification
              │
              ▼
        Fetch User Role
        (users table → role column)
              │
     ┌────────┼──────────┐
     ▼        ▼          ▼
 Resident   Guard      Admin
  Tabs      Tabs       Tabs
```

### Resident Tab Bar
```
🏠 Home  |  🚪 Visitors  |  🏢 Amenities  |  🔔 Notifications  |  👤 Profile
```

### Guard Tab Bar
```
🏠 Dashboard  |  ➕ Register  |  📷 QR Scan  |  📜 History  |  👤 Profile
```

### Admin Tab Bar
```
📊 Dashboard  |  👥 Residents  |  🚪 Visitors  |  📢 Management  |  ⚙️ Settings
```

---

## 7. Authentication Flow

```
User Opens App
      │
      ▼
Check expo-secure-store for existing session
      │
      ├── Session exists → Supabase session refresh → Navigate to role dashboard
      │
      └── No session → Login Screen
                │
                ├── Email + Password Login
                │
                ├── Phone OTP Login
                │       │
                │       ▼
                │   Enter 6-digit OTP
                │       │
                │       ▼
                │   Supabase verifyOtp()
                │
                └── Google OAuth Login
                        │
                        ▼
                Supabase Auth validates
                        │
                        ▼
                JWT Token Generated
                        │
                        ▼
                Store in expo-secure-store
                        │
                        ▼
                Fetch role from users table
                        │
                        ▼
                Store in authStore (Zustand)
                        │
              ┌─────────┼──────────┐
              ▼         ▼          ▼
          Resident    Guard      Admin
          Dashboard  Dashboard  Dashboard
```

---

## 8. Role-Based Access Control

| Feature / Screen | Resident | Guard | Admin |
|---|---|---|---|
| View own visitor requests | ✅ | ❌ | ✅ |
| Approve / reject visitors | ✅ | ❌ | ✅ |
| Register new visitor | ❌ | ✅ | ✅ |
| Mark entry / exit | ❌ | ✅ | ✅ |
| Scan QR pass | ❌ | ✅ | ✅ |
| Raise complaints | ✅ | ❌ | ✅ |
| Resolve complaints | ❌ | ❌ | ✅ |
| View notices | ✅ | ✅ | ✅ |
| Create / publish notices | ❌ | ❌ | ✅ |
| Vote in polls | ✅ | ❌ | ✅ |
| Create polls | ❌ | ❌ | ✅ |
| Book amenities | ✅ | ❌ | ✅ |
| Manage amenities | ❌ | ❌ | ✅ |
| View own maintenance | ✅ | ❌ | ✅ |
| Manage all payments | ❌ | ❌ | ✅ |
| Manage residents / flats | ❌ | ❌ | ✅ |
| View analytics | ❌ | ❌ | ✅ |
| Search residents | ❌ | ✅ | ✅ |

> [!NOTE]
> All restrictions enforced at two levels: **Expo Router middleware** (UI layer) + **Supabase RLS policies** (database layer).

---

## 9. Database Schema

### `users`
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
```

### `towers`
```sql
id            UUID PRIMARY KEY DEFAULT uuid_generate_v4()
tower_name    TEXT NOT NULL
total_floors  INTEGER
created_at    TIMESTAMPTZ DEFAULT now()
```

### `flats`
```sql
id            UUID PRIMARY KEY DEFAULT uuid_generate_v4()
flat_number   TEXT NOT NULL
floor_number  INTEGER
tower_id      UUID REFERENCES towers(id)
is_occupied   BOOLEAN DEFAULT false
created_at    TIMESTAMPTZ DEFAULT now()
```

### `residents`
```sql
id             UUID PRIMARY KEY DEFAULT uuid_generate_v4()
user_id        UUID REFERENCES users(id)
flat_id        UUID REFERENCES flats(id)
is_owner       BOOLEAN DEFAULT false
vehicle_numbers TEXT[]
created_at     TIMESTAMPTZ DEFAULT now()
```

### `visitors`
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
status         TEXT CHECK (status IN ('pending','approved','rejected','entered','exited'))
entry_time     TIMESTAMPTZ
exit_time      TIMESTAMPTZ
qr_token       TEXT
pre_approved   BOOLEAN DEFAULT false
created_at     TIMESTAMPTZ DEFAULT now()
```

### `visitor_logs`
```sql
id             UUID PRIMARY KEY DEFAULT uuid_generate_v4()
visitor_id     UUID REFERENCES visitors(id)
guard_id       UUID REFERENCES users(id)
action         TEXT CHECK (action IN ('requested','approved','rejected','entered','exited'))
performed_by   UUID REFERENCES users(id)
note           TEXT
timestamp      TIMESTAMPTZ DEFAULT now()
```

### `complaints`
```sql
id             UUID PRIMARY KEY DEFAULT uuid_generate_v4()
resident_id    UUID REFERENCES users(id)
flat_id        UUID REFERENCES flats(id)
title          TEXT NOT NULL
description    TEXT
category       TEXT
priority       TEXT CHECK (priority IN ('low','medium','high','critical'))
status         TEXT CHECK (status IN ('open','assigned','in_progress','resolved','closed'))
images         TEXT[]
assigned_to    UUID REFERENCES users(id)
ai_category    TEXT
created_at     TIMESTAMPTZ DEFAULT now()
resolved_at    TIMESTAMPTZ
```

### `notices`
```sql
id             UUID PRIMARY KEY DEFAULT uuid_generate_v4()
title          TEXT NOT NULL
description    TEXT NOT NULL
category       TEXT
attachments    TEXT[]
is_pinned      BOOLEAN DEFAULT false
published_by   UUID REFERENCES users(id)
published_at   TIMESTAMPTZ
expires_at     TIMESTAMPTZ
created_at     TIMESTAMPTZ DEFAULT now()
```

### `polls`
```sql
id             UUID PRIMARY KEY DEFAULT uuid_generate_v4()
question       TEXT NOT NULL
options        JSONB NOT NULL
created_by     UUID REFERENCES users(id)
is_active      BOOLEAN DEFAULT true
is_anonymous   BOOLEAN DEFAULT false
ends_at        TIMESTAMPTZ
created_at     TIMESTAMPTZ DEFAULT now()
```

### `votes`
```sql
id             UUID PRIMARY KEY DEFAULT uuid_generate_v4()
poll_id        UUID REFERENCES polls(id)
resident_id    UUID REFERENCES users(id)
option_id      TEXT NOT NULL
created_at     TIMESTAMPTZ DEFAULT now()
UNIQUE(poll_id, resident_id)
```

### `amenities`
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

### `bookings`
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

### `payments`
```sql
id             UUID PRIMARY KEY DEFAULT uuid_generate_v4()
resident_id    UUID REFERENCES users(id)
flat_id        UUID REFERENCES flats(id)
month          TEXT
amount         NUMERIC(10,2)
status         TEXT CHECK (status IN ('pending','paid','overdue'))
due_date       DATE
payment_method TEXT
payment_ref    TEXT
invoice_url    TEXT
paid_at        TIMESTAMPTZ
created_at     TIMESTAMPTZ DEFAULT now()
```

### `notifications`
```sql
id             UUID PRIMARY KEY DEFAULT uuid_generate_v4()
user_id        UUID REFERENCES users(id)
title          TEXT NOT NULL
body           TEXT
type           TEXT
data           JSONB
is_read        BOOLEAN DEFAULT false
created_at     TIMESTAMPTZ DEFAULT now()
```

### RLS Policy Summary

```sql
-- Residents only see their own visitors
CREATE POLICY "resident_visitor_policy" ON visitors
  USING (resident_id = auth.uid());

-- Guards see all visitors
CREATE POLICY "guard_visitor_policy" ON visitors
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'guard'
  ));

-- Notifications: users see only their own
CREATE POLICY "notification_policy" ON notifications
  USING (user_id = auth.uid());

-- Residents see only their own payments
CREATE POLICY "payment_policy" ON payments
  USING (resident_id = auth.uid());
```

---

## 10. State Management

### Zustand Stores

| Store | State Held |
|---|---|
| `authStore` | user, session, role, residentProfile, isLoading |
| `visitorStore` | pendingCount, latestVisitor, approvalStatus |
| `bookingStore` | myBookings, selectedAmenity, selectedSlot |
| `complaintStore` | complaints, activeComplaint |
| `paymentStore` | dues, paymentHistory |
| `noticeStore` | notices, unreadCount |
| `pollStore` | activePolls, votedPolls |
| `notificationStore` | notifications, unreadCount |
| `adminStore` | analytics, residentList, guardList |

### TanStack Query Keys

```typescript
['visitors', flatId, status]          // visitor list
['visitor', visitorId]                 // visitor detail
['complaints', residentId]
['complaint', complaintId]
['bookings', residentId]
['amenity-slots', amenityId, date]
['notices', category]
['polls', 'active']
['poll', pollId]
['admin', 'analytics']
['admin', 'residents', filters]
['admin', 'complaints', status]
```

### Cache Strategy

| Query | Stale Time | GC Time |
|---|---|---|
| Visitor list | 30s | 5 min |
| Notices | 5 min | 30 min |
| Polls | 1 min | 10 min |
| Amenity list | 10 min | 1 hour |
| Admin analytics | 2 min | 10 min |

---

## 11. API Layer

### Service Layer Pattern

```
Component
    │
    ▼
Custom Hook (useVisitors, useComplaints...)
    │
    ▼
TanStack Query (useQuery / useMutation)
    │
    ▼
Service Function (/services/supabase/visitors.ts)
    │
    ▼
Supabase Client (.from('visitors').select()...)
    │
    ▼
PostgreSQL (with RLS applied)
```

### Service Files

| File | Key Exports |
|---|---|
| `auth.ts` | `signIn()`, `signOut()`, `verifyOTP()`, `getSession()` |
| `visitors.ts` | `getVisitors()`, `createVisitor()`, `approveVisitor()`, `rejectVisitor()`, `markEntry()`, `markExit()` |
| `complaints.ts` | `getComplaints()`, `createComplaint()`, `updateStatus()`, `addComment()` |
| `bookings.ts` | `getBookings()`, `createBooking()`, `cancelBooking()`, `getAvailableSlots()` |
| `polls.ts` | `getPolls()`, `submitVote()`, `getPollResults()` |
| `notices.ts` | `getNotices()`, `createNotice()`, `pinNotice()` |
| `maintenance.ts` | `getDues()`, `markPaid()`, `getHistory()` |
| `realtime.ts` | `subscribeToVisitors()`, `subscribeToApprovals()`, `unsubscribe()` |

### Edge Functions

| Function | Trigger | Purpose |
|---|---|---|
| `send-push` | DB webhook on `notifications` INSERT | Sends Expo push notification |
| `ai-tag-complaint` | HTTP on complaint create | Auto-categorize using AI |
| `generate-qr` | HTTP | Returns signed JWT QR token |
| `validate-qr` | HTTP | Validates QR on guard scan |
| `auto-reject-expired` | Cron every 60s | Rejects approvals older than 2 min |

---

## 12. Realtime Events

Tables with Realtime enabled: `visitors`, `notifications`, `visitor_logs`

```
Guard Registers Visitor
        │
        ▼
INSERT into visitors (status = 'pending')
        │
        ▼
Supabase Realtime fires event
        │
        ▼
INSERT into notifications (user_id = resident)
        │
        ▼
DB Webhook → Edge Function: send-push
        │
        ▼
Expo Push Notification sent to Resident
        │
        ▼
Resident taps Approve
        │
        ▼
UPDATE visitors SET status = 'approved'
        │
        ▼
Supabase Realtime fires on Guard subscription
        │
        ▼
Guard screen updates LIVE (< 1 second)
        │
        ▼
Guard taps "Allow Entry"
        │
        ▼
UPDATE visitors SET status = 'entered', entry_time = now()
        │
        ▼
INSERT into visitor_logs (action = 'entered')
        │
        ▼
Admin dashboard subscription fires → analytics +1 live
```

---

## 13. Push Notifications

### Token Registration

```typescript
const token = await Notifications.getExpoPushTokenAsync()
await supabase
  .from('users')
  .update({ fcm_token: token.data })
  .eq('id', user.id)
```

### Notification Triggers

| Event | Recipient | Title | Body |
|---|---|---|---|
| Visitor arrived | Resident | `🔔 Visitor at Gate` | `{name} is at your door. Approve?` |
| Visitor approved | Guard | `✅ Entry Approved` | `{resident} approved {visitor}` |
| Visitor rejected | Guard | `❌ Entry Denied` | `Resident declined entry` |
| Approval timeout | Guard | `⏱️ No Response` | `Resident didn't respond (2 min)` |
| Complaint updated | Resident | `🔧 Complaint Update` | `Your complaint is now {status}` |
| Booking confirmed | Resident | `📅 Booking Confirmed` | `{amenity} on {date} at {time}` |
| Booking reminder | Resident | `⏰ Reminder` | `{amenity} booking in 1 hour` |
| Notice published | All residents | `📢 New Notice` | `{title}` |
| Poll live | All residents | `🗳️ New Poll` | `Vote now: {question}` |
| Poll ending soon | Non-voters | `⏰ Poll Ending` | `Last chance to vote!` |
| Maintenance due | Resident | `💰 Payment Due` | `₹{amount} due for {month}` |

### Deep Link on Tap

| Type | Route |
|---|---|
| Visitor arrived | `/(resident)/visitor-details/[id]` |
| Complaint updated | `/(resident)/ticket-details/[id]` |
| Booking confirmed | `/(resident)/booking-details/[id]` |
| New notice | `/(resident)/notice-details/[id]` |
| Poll live | `/(resident)/poll-details/[id]` |
| Maintenance due | `/(resident)/maintenance` |

---

## 14. UI Design System

### Theme

| Property | Value |
|---|---|
| Style | Modern SaaS · Apple-Inspired · Minimal |
| Corners | Rounded Cards |
| Navigation | Glassmorphism (Expo Blur) |
| Typography | Plus Jakarta Sans |

### Corner Radius

| Element | Radius |
|---|---|
| Cards | 28px |
| Buttons | 22px |
| Inputs | 18px |
| Chips / Badges | 999px (pill) |
| Bottom Sheet | 28px (top corners) |

### Spacing Scale

```
4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64
```

### Component Specs

**Button**
```
Height:       52px
Radius:       22px
Primary BG:   #E7FF45
Primary Text: #171717 (Bold)
Secondary:    Border 1px #ECECEC, Text #111111
Danger:       BG #FEE2E2, Text #EF4444
Press state:  scale(0.97) via Reanimated
```

**Card**
```
Background:   #FFFFFF
Border:       1px solid #ECECEC
Radius:       28px
Padding:      16px
Shadow:       0 4px 16px rgba(0,0,0,0.06)
Press state:  scale(0.98) + shadow lift
```

**Input**
```
Background:   #F5F5F2
Border:       1px solid #ECECEC
Focus Border: 2px solid #171717
Radius:       18px
Height:       52px
```

---

## 15. Theme Colors

| Token | Hex | Usage |
|---|---|---|
| **Primary** | `#E7FF45` | CTAs, active states, highlights |
| **Background** | `#F5F5F2` | App background |
| **Dark** | `#171717` | Dark text, dark mode background |
| **Text** | `#111111` | Body text |
| **Border** | `#ECECEC` | Card borders, dividers |
| **Surface** | `#FFFFFF` | Card backgrounds |
| **Success** | `#22C55E` | Approved, paid, resolved |
| **Warning** | `#F59E0B` | Pending, due soon |
| **Danger** | `#EF4444` | Rejected, overdue, critical |
| **Muted** | `#94A3B8` | Placeholder, secondary text |

**Tailwind config registration:**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary:    '#E7FF45',
        background: '#F5F5F2',
        dark:       '#171717',
        surface:    '#FFFFFF',
        border:     '#ECECEC',
        success:    '#22C55E',
        warning:    '#F59E0B',
        danger:     '#EF4444',
        muted:      '#94A3B8',
      }
    }
  }
}
```

---

## 16. Animations

### Libraries
- **React Native Reanimated 3** — worklet-based, 60fps
- **Moti** — declarative `from`/`animate`/`exit` syntax
- **React Native Gesture Handler** — swipe, drag, pinch

### Microinteractions

| Element | Animation | Library |
|---|---|---|
| Card press | Scale 0.97 → 1.0 on release | Reanimated |
| Card lift | Shadow depth increase | Reanimated |
| Ripple effect | Radial opacity pulse on tap | Reanimated |
| Approve button | Scale → green flash → confetti | Moti + Reanimated |
| Reject button | Horizontal shake (±6px, 3 cycles) | Reanimated |
| Notification bell | Ring rotation on new notification | Moti |
| Bottom navigation | Indicator slides between tabs | Reanimated |
| Hero transition | Shared element Visitor Card → Detail | sharedTransition |
| Screen entry | FadeIn + SlideUp (Y: +16 → 0) | Moti |
| Skeleton loader | Shimmer gradient (left → right) | Reanimated |
| Poll vote | Bar width animates to new % | Reanimated |
| QR code appear | Scale 0.85 → 1.0 + FadeIn | Moti |
| FAB expand | Rotate 45° to show sub-actions | Reanimated |
| Pull to refresh | Lottie custom spinner | lottie-react-native |
| Success screen | Lottie checkmark animation | lottie-react-native |
| Confetti blast | Particle burst on approval | lottie-react-native |
| Floating bottom nav | Glass blur + scale on tab press | Expo Blur + Reanimated |

---

## 17. Security

| Area | Implementation |
|---|---|
| **JWT Authentication** | Supabase-issued JWT, stored in `expo-secure-store` |
| **Row Level Security** | RLS enabled and configured on all Supabase tables |
| **HTTPS Only** | All Supabase API calls over TLS 1.3 |
| **Secure Token Storage** | `expo-secure-store` (iOS Keychain / Android Keystore) |
| **Client Input Validation** | Zod schemas on all form fields |
| **Server Validation** | Edge Functions validate all inputs server-side |
| **Role-Based Access** | Middleware in each `_layout.tsx` + RLS policies |
| **SQL Injection Protection** | Supabase parameterized queries only |
| **File Upload Validation** | MIME type check + 5MB size limit before upload |
| **API Authorization** | JWT required for all Supabase requests |
| **QR Token Security** | Short-lived JWT (1h expiry), validated server-side |
| **Expired Session** | Auto-redirect to login on 401 response |

---

## 18. Performance

| Optimization | Implementation |
|---|---|
| **Fast Lists** | FlashList with `estimatedItemSize` configured per screen |
| **Image Caching** | `expo-image` with `contentFit`, `blurhash` placeholder |
| **React Query Cache** | `staleTime` per query type, background refetch |
| **Lazy Loading** | Expo Router code-splits each route automatically |
| **Memoized Components** | `React.memo` on all FlashList item renderers |
| **Optimized Re-renders** | Zustand selectors, `useShallow` for object state |
| **Pagination** | `.range(0, 19)` on all list queries + load more |
| **DB Projections** | Always `select('col1, col2')` — never `select('*')` |
| **Image Compression** | `expo-image-manipulator` before upload (80% quality, max 1200px) |
| **No inline functions** | No anonymous arrow functions in FlashList renderItem |

---

## 19. Error Handling

| Scenario | Handling |
|---|---|
| **Network Error** | TanStack Query retry (3 attempts, exponential backoff) |
| **Offline** | `@react-native-community/netinfo` → cached data + offline banner |
| **Empty State** | Lottie animation + friendly message + CTA per list screen |
| **Loading State** | Shimmer skeleton matching screen layout |
| **Form Validation** | Zod schema → React Hook Form inline error messages |
| **Toast Messages** | Custom `Toast.tsx` (top of screen, auto-dismiss 3s) |
| **API Error Boundaries** | `ErrorBoundary` wrapper on each major screen group |
| **401 Unauthorized** | Auto sign-out + redirect to login |
| **503 / Server Error** | Friendly error card + retry button |

---

## 20. Deployment

### Frontend (EAS Build)

| Step | Command |
|---|---|
| Development | `npx expo start` |
| Preview APK | `eas build --platform android --profile preview` |
| Production | `eas build --platform all --profile production` |
| OTA Update | `eas update --branch production` |

```json
// eas.json
{
  "build": {
    "preview": {
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "aab" },
      "ios": { "simulator": false }
    }
  }
}
```

### Backend

| Service | Provider | Notes |
|---|---|---|
| Database | Supabase Cloud (PostgreSQL) | Auto-managed, backups |
| Auth | Supabase Auth | Built-in, no extra config |
| Storage | Supabase Storage | Visitor photos, invoices |
| Edge Functions | Supabase (Deno runtime) | `supabase functions deploy` |
| Push Notifications | Expo Push Service | Free, no limit |

### Environment Variables

```bash
# .env.example
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
EXPO_PUBLIC_APP_ENV=development
```

---

## 21. Third-Party Libraries

| Category | Library | Purpose |
|---|---|---|
| Framework | `expo` SDK 55 | Core Expo runtime |
| Navigation | `expo-router` | File-based routing |
| Styling | `nativewind` | Tailwind in React Native |
| UI Components | `react-native-reusables` | Accessible UI primitives |
| Icons | `lucide-react-native` | Icon library |
| Animation | `react-native-reanimated` | 60fps worklet animations |
| Animation | `moti` | Declarative animations |
| Gestures | `react-native-gesture-handler` | Swipe, drag interactions |
| Lists | `@shopify/flash-list` | High-performance lists |
| Bottom Sheet | `@gorhom/bottom-sheet` | Gesture-driven sheets |
| Blur | `expo-blur` | Glassmorphism effect |
| Gradient | `expo-linear-gradient` | Background gradients |
| Images | `expo-image` | Optimized image rendering |
| Forms | `react-hook-form` | Performant forms |
| Validation | `zod` | Schema-based validation |
| State | `zustand` | Lightweight state management |
| API Cache | `@tanstack/react-query` | Server state + caching |
| Charts | `victory-native` | Admin analytics charts |
| Calendar | `react-native-calendars` | Amenity slot picker |
| QR Scanner | `expo-barcode-scanner` | Guard QR scan |
| QR Generator | `react-native-qrcode-svg` | Resident guest pass |
| Lottie | `lottie-react-native` | Animations, empty states |
| Skia | `@shopify/react-native-skia` | Custom graphics / charts |
| Backend | `@supabase/supabase-js` | Supabase client SDK |
| Notifications | `expo-notifications` | Push notification handling |
| Haptics | `expo-haptics` | Tactile feedback |
| Secure Storage | `expo-secure-store` | Encrypted token storage |
| Sharing | `expo-sharing` | Share QR guest pass |
| Camera | `expo-camera` | Visitor photo capture |
| Image Edit | `expo-image-manipulator` | Compress before upload |

---

## 22. Hackathon Demo Architecture

```
┌─────────────────────────────────────────────────────────────┐
│            DEMO FLOW — End-to-End Architecture              │
└─────────────────────────────────────────────────────────────┘

[1] Guard opens Portl → sees Guard Dashboard
    Shift: Morning Gate | Currently Inside: 4

[2] Guard taps "Register Visitor"
    → Name: Swiggy Delivery
    → Purpose: Delivery
    → Flat: A-203 (searched instantly)
    → INSERT into visitors (status: 'pending')

[3] Supabase DB Webhook fires immediately
    → Edge Function: send-push called
    → Expo Push API → Resident Arjun's device

[4] Resident's phone gets push notification
    → "🔔 Swiggy Delivery is at your gate. Approve?"
    → Resident opens Portl, sees visitor photo + purpose

[5] Resident taps "Approve"
    → UPDATE visitors SET status = 'approved'
    → Confetti animation plays
    → Push notification sent back to guard

[6] Guard screen updates LIVE (Realtime < 1s)
    → "✅ Approved by Arjun Sharma"
    → Guard taps "Allow Entry"
    → UPDATE visitors SET entry_time = now(), status = 'entered'

[7] Visitor exits 20 minutes later
    → Guard taps "Mark Exit"
    → UPDATE visitors SET exit_time = now(), status = 'exited'
    → INSERT into visitor_logs

[8] Admin Dashboard (open in parallel)
    → Realtime subscription on visitors table
    → Today's visitor count +1 (live, no refresh)
    → Activity feed: "Swiggy Delivery — A-203 — Exited 3:47 PM"
    → Analytics chart bar height increases

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This architecture demonstrates:
  ✅ End-to-end realtime synchronization (< 1s latency)
  ✅ Push notifications via Expo Notifications
  ✅ Role-based isolated dashboards
  ✅ Complete digital audit trail
  ✅ Live admin analytics
  ✅ Production-grade Supabase data flow
  ✅ RLS security on all data
```

---

*TRD Version 1.0 · Portl · Your Society. One Tap Away.*

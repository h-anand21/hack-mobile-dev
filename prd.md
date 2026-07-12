# Portl — Smart Society Management Platform
## Product Requirements Document (PRD)

> **Version**: 1.0
> **Project Type**: Mobile Application
> **Platform**: Expo React Native (Android & iOS)
> **Prepared For**: Hackathon Submission
> **Prepared By**: Team Portl
> **App Name**: Portl — *Your Society. One Tap Away.*

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Vision](#3-vision)
4. [Objectives](#4-objectives)
5. [Target Users](#5-target-users)
6. [Product Goals](#6-product-goals)
7. [User Personas](#7-user-personas)
8. [User Journey](#8-user-journey)
9. [Core Modules](#9-core-modules)
10. [Nice-to-Have Features](#10-nice-to-have-features)
11. [Functional Requirements](#11-functional-requirements)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [Tech Stack](#13-tech-stack)
14. [Database Tables](#14-database-tables)
15. [Navigation Flow](#15-navigation-flow)
16. [Design System](#16-design-system)
17. [Success Metrics](#17-success-metrics)
18. [Future Roadmap](#18-future-roadmap)
19. [Hackathon Demo Flow](#19-hackathon-demo-flow)
20. [Deliverables](#20-deliverables)

---

## 1. Executive Summary

**Portl** is a modern, mobile-first Society Management Platform that digitizes apartment community operations. It replaces traditional gate calls, WhatsApp groups, paper registers, and manual approvals with a seamless real-time mobile experience.

The platform enables **Residents**, **Security Guards**, and **Society Admins** to communicate, manage visitors, approve entries, raise complaints, receive notices, book amenities, and manage society operations from **one unified application**.

> [!IMPORTANT]
> **Primary Goal**: Reduce waiting time at society gates while improving security, communication, and operational efficiency.

---

## 2. Problem Statement

Apartment communities still rely on fragmented communication systems:

| Problem | Current Reality |
|---|---|
| 📞 Guard-Resident Communication | Guards call residents manually |
| 📵 Missed Calls | Residents miss calls, visitors wait |
| 📦 Delivery Delays | Delivery partners wait unnecessarily |
| 🗒️ Manual Logs | Entry registers maintained on paper |
| 💬 Complaint Tracking | Tracked across WhatsApp groups |
| 📅 Amenity Booking | Done manually or on calls |
| 📢 Notices | Shared across multiple channels with no single source |
| 🔓 Security Risks | No digital audit trail for entries |

These processes create **delays**, **poor communication**, and **security risks**.

---

## 3. Vision

> To become the **operating system for modern residential communities** by connecting residents, security staff, and administrators through one intelligent mobile platform.

---

## 4. Objectives

- 🎯 **Reduce visitor approval time** from minutes to seconds
- 📋 **Eliminate manual visitor registers** entirely
- 📡 **Improve resident communication** across all society channels
- 💻 **Digitize society operations** end-to-end
- ✨ **Provide a delightful premium mobile experience**

---

## 5. Target Users

### Resident
> Lives inside the society.

**Responsibilities:**
- Approve or reject visitor entry requests
- View and acknowledge society notices
- Book community amenities
- Raise maintenance complaints
- Pay monthly maintenance dues
- Participate in community polls

---

### Security Guard
> Manages gate operations.

**Responsibilities:**
- Register arriving visitors
- Verify resident approvals
- Mark visitor entry and exit
- Scan QR-based guest passes
- Search resident directory

---

### Society Admin
> Manages entire society operations.

**Responsibilities:**
- Manage residents, flats, and towers
- Resolve and track complaints
- Collect and track payments
- Configure amenities and bookings
- Create and manage polls
- Publish society notices
- View society-wide analytics

---

## 6. Product Goals

### Primary Goals
| # | Goal | Description |
|---|---|---|
| P1 | Smart Visitor Management | End-to-end digital visitor flow |
| P2 | Fast Approvals | Sub-5-second approval confirmation |
| P3 | Better Community Communication | Notices, polls, direct alerts |
| P4 | Digital Society Operations | Complaints, bookings, payments |

### Secondary Goals
| # | Goal | Description |
|---|---|---|
| S1 | Premium UX | Apple-grade design quality |
| S2 | Push Notifications | Real-time alerts across all events |
| S3 | Realtime Updates | Live sync across guard ↔ resident ↔ admin |
| S4 | Analytics | Data-driven admin insights |

---

## 7. User Personas

### 🏠 Resident — Ananya, 32, Software Engineer

| Attribute | Detail |
|---|---|
| Age Range | 25–60 |
| Tech Comfort | Medium to High |
| Key Needs | Secure society, easy visitor approvals, amenity booking, complaint tracking |
| Pain Points | Missed guard calls, WhatsApp spam, delayed visitors, no complaint tracking |
| Goal | One app to manage all society interactions |

---

### 🛡️ Security Guard — Ravi, 38, Gate Security

| Attribute | Detail |
|---|---|
| Tech Comfort | Low to Medium |
| Key Needs | Fast approval workflow, easy resident search, QR verification |
| Pain Points | Paper registers, manual phone calls, no digital records |
| Goal | Simple interface to handle gate operations efficiently |

---

### 👨‍💼 Admin — Suresh, 55, Society Secretary

| Attribute | Detail |
|---|---|
| Tech Comfort | Low to Medium |
| Key Needs | Centralized management of all society activities |
| Pain Points | Excel sheets, manual tracking, multiple communication channels |
| Goal | One dashboard to see and manage everything |

---

## 8. User Journey

```
  Visitor Arrives at Gate
           │
           ▼
  Guard Registers Visitor
  (Name, Photo, Purpose, Vehicle)
           │
           ▼
  Approval Request Sent
  (to resident's app)
           │
           ▼
  Resident Gets Push Notification
  (Visitor photo, name, purpose shown)
           │
      ┌────┴────┐
      ▼         ▼
  APPROVED   REJECTED
      │         │
      ▼         ▼
  Guard Gets   Guard Gets
  Confirmation  Rejection
      │
      ▼
  Visitor Enters
  (Entry logged with timestamp)
           │
           ▼
  Visitor Exits
  (Exit logged with timestamp)
           │
           ▼
  History Saved Automatically
  (Visible to resident + admin)
```

---

## 9. Core Modules

### 🔐 Authentication

| Feature | Details |
|---|---|
| Email Login | Email + password |
| OTP Login | Phone-based OTP |
| Google Login | OAuth via Supabase |
| Role-Based Access | Resident / Guard / Admin — isolated dashboards |
| Session | JWT stored securely via expo-secure-store |

---

### 🏘️ Resident Dashboard

| Feature | Description |
|---|---|
| Personalized Greeting | Name + time-of-day |
| Today's Visitors | Live count + FlashList |
| Pending Approvals | Urgent banner with approve/reject CTA |
| Announcements | Latest society notice |
| Maintenance Due | Amount + due date card |
| Quick Actions | 6 icon grid: Guest Pass, Complaint, Booking, Dues, Notices, Emergency |
| Recent Activity | Last 5 visitor/booking/complaint events |
| Emergency Contacts | Police, Fire, Admin, Security |

---

### 🚪 Visitor Management

| Feature | Description |
|---|---|
| Visitor Request | Guard sends, resident receives push |
| Approve / Reject | One-tap with reason for rejection |
| Expected Visitors | Pre-registered guest passes |
| QR Pass | Generate QR for expected guests |
| History | Full entry/exit log with timestamps |
| Exit Tracking | Guard marks exit, auto-logged |
| Visitor Details | Photo, vehicle, purpose, arrival time |

---

### 📦 Delivery & Service Approval

Supported delivery and service types:

```
Amazon    Flipkart    Swiggy    Zomato
Blinkit   Uber        Rapido    Other Cab
Service Staff (Plumber, Electrician, etc.)
```

---

### 🛡️ Guard Dashboard

| Feature | Description |
|---|---|
| Visitor Registration | Multi-step: Photo → Info → Purpose → Resident → Send |
| Resident Search | Typeahead search by name or flat |
| Approval Status | Live countdown + result display |
| QR Scan | Scan pre-approved QR, instant entry |
| Entry Marking | Log entry with timestamp |
| Exit Marking | Log exit with timestamp |
| Visitor History | Full daily log with filters |

---

### 🔧 Complaint Management (Helpdesk)

| Feature | Description |
|---|---|
| Raise Complaint | Category + title + description + photos |
| Priority Levels | Low / Medium / High / Critical |
| Timeline View | Step-by-step status progression |
| Comments | Chat thread with admin/staff |
| Status | Open → Assigned → In Progress → Resolved → Closed |
| Notifications | Push on every status change |

**Complaint Categories:**
```
Plumbing · Electrical · Housekeeping · Security · Noise · Lift · Other
```

---

### 📢 Notice Board

| Feature | Description |
|---|---|
| Important Notices | Pinned notices at top |
| Attachments | PDF, image support |
| Pinned Notice | Admin can pin critical notices |
| Categories | General / Maintenance / Event / Emergency / Rules |
| Rich Detail | Full notice content + share option |

---

### 🗳️ Community Polls

| Feature | Description |
|---|---|
| Create Poll | Admin creates question + options + end date |
| Vote | Single selection |
| Live Results | Real-time vote count |
| Anonymous Voting | Option to hide voter identity |
| Charts | Victory Native XL bar/pie charts for results |

---

### 🏊 Amenity Booking

**Available Amenities:**

| Amenity | Icon |
|---|---|
| Gym | 🏋️ |
| Swimming Pool | 🏊 |
| Club House | 🏠 |
| Party Hall | 🎉 |
| BBQ Area | 🔥 |
| Badminton Court | 🏸 |
| Basketball Court | 🏀 |
| Garden | 🌿 |

**Booking Features:**

| Feature | Description |
|---|---|
| Calendar | react-native-calendars date picker |
| Available Slots | Color-coded slot availability |
| Booking History | Past + upcoming bookings |
| Cancellation | With confirmation prompt |
| Reminder | Push notification 1 hour before |

---

### 💰 Maintenance & Payments

| Feature | Description |
|---|---|
| Due Amount | Monthly dues with breakdown |
| Payment History | Past receipts with dates |
| Invoices | Downloadable PDFs |
| Payment Methods | UPI / Card / Net Banking |
| Overdue Alert | Amber notification banner |

---

### 🔔 Notifications

| Trigger | Recipient |
|---|---|
| Visitor Request | Resident |
| Visitor Approved | Guard |
| Visitor Rejected | Guard |
| Booking Confirmed | Resident |
| Booking Reminder | Resident (1h before) |
| Complaint Update | Resident |
| Maintenance Due | Resident |
| New Notice | All Residents |
| Poll Going Live | All Residents |
| Poll Ending Soon | Non-voters |

---

### 👷 Staff Directory

| Role | Available |
|---|---|
| Electrician | ✅ |
| Plumber | ✅ |
| Housekeeping | ✅ |
| Gardener | ✅ |
| Security | ✅ |
| Emergency Numbers | ✅ |

---

### 📊 Admin Dashboard

**Manage Sections:**

```
Residents      Flats          Towers
Visitors       Amenities      Complaints
Payments       Polls          Staff
Security Guards               Reports
```

**Analytics Cards:**
- Daily Visitors (Line Chart — 7 days)
- Complaints by Category (Bar Chart)
- Maintenance Revenue (Area Chart)
- Bookings by Amenity (Pie Chart)
- Peak Visitor Hours (Heatmap)

---

## 10. Nice-to-Have Features

> [!NOTE]
> These are stretch goals — implement only if core features are complete before deadline.

| Feature | Priority |
|---|---|
| QR Guest Pass | High |
| AI Complaint Categorization | High |
| Face Verification | Medium |
| Emergency SOS Button | Medium |
| Visitor Analytics | Medium |
| Frequent Visitor Detection | Low |
| Digital ID Cards | Low |
| Parking Management | Low |
| Vehicle Passes | Low |

---

## 11. Functional Requirements

| ID | Requirement | Role |
|---|---|---|
| FR-01 | Resident can log in with OTP / email / Google | Resident |
| FR-02 | Guard can log in with credentials | Guard |
| FR-03 | Admin can log in with credentials | Admin |
| FR-04 | Guard can register a visitor with photo, purpose, vehicle | Guard |
| FR-05 | Resident receives push notification on visitor arrival | Resident |
| FR-06 | Resident can approve or reject visitor in-app | Resident |
| FR-07 | Guard can mark visitor entry after approval | Guard |
| FR-08 | Guard can mark visitor exit | Guard |
| FR-09 | Resident can browse and book amenities | Resident |
| FR-10 | Admin can create, edit, and publish notices | Admin |
| FR-11 | Resident can raise a complaint with photos | Resident |
| FR-12 | Admin can update complaint status | Admin |
| FR-13 | Resident can vote in active polls | Resident |
| FR-14 | Resident can view maintenance dues | Resident |
| FR-15 | Resident can pay maintenance dues | Resident |
| FR-16 | Guard can scan QR for pre-approved guests | Guard |
| FR-17 | Resident can generate QR guest pass | Resident |
| FR-18 | Admin can manage residents, flats, towers | Admin |
| FR-19 | Admin can view visitor analytics | Admin |
| FR-20 | All users receive push notifications | All |

---

## 12. Non-Functional Requirements

| Requirement | Target |
|---|---|
| App Launch Time | < 2 seconds |
| Visitor Approval Flow | < 5 seconds end-to-end |
| Realtime Sync Latency | < 1 second |
| Offline Support | Partial (cached data viewable) |
| Crash Rate | < 1% |
| Responsive UI | 100% across all screen sizes |
| Dark Mode | Supported |
| Accessibility | Screen reader support, contrast ratios |
| Data Security | RLS policies on all Supabase tables |
| Token Security | expo-secure-store (encrypted) |

---

## 13. Tech Stack

### Frontend

| Category | Technology |
|---|---|
| Framework | Expo SDK 55 |
| Language | React Native + TypeScript |
| Navigation | Expo Router v3 (file-based) |
| Styling | NativeWind v4 (Tailwind in RN) |
| UI Primitives | React Native Reusables |
| State (Local) | Zustand |
| State (Server) | TanStack Query (React Query v5) |
| Animations | Reanimated 3 + Moti |
| Gestures | React Native Gesture Handler |
| Lists | FlashList (by Shopify) |
| Images | Expo Image (with blurhash) |
| Icons | Lucide React Native |
| Blur Effects | Expo Blur |
| Gradients | Expo Linear Gradient |
| Bottom Sheet | @gorhom/bottom-sheet |
| Charts | Victory Native XL |
| Calendar | react-native-calendars |
| Forms | React Hook Form + Zod |
| Skia | React Native Skia |
| Lottie | lottie-react-native |
| QR Scanner | expo-barcode-scanner |
| Haptics | expo-haptics |

### Backend

| Category | Technology |
|---|---|
| Backend-as-a-Service | Supabase |
| Authentication | Supabase Auth (OTP, Email, Google OAuth) |
| Database | PostgreSQL (via Supabase) |
| Realtime | Supabase Realtime (WebSocket subscriptions) |
| Storage | Supabase Storage (visitor photos, invoices) |
| Edge Functions | Supabase Edge Functions (Deno) |
| Push Notifications | Expo Notifications + Expo Push API |

---

## 14. Database Tables

```
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE SCHEMA                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CORE                    VISITOR                            │
│  ─────                   ───────                            │
│  Users                   Visitors                           │
│  Roles                   VisitorLogs                        │
│  Residents               VisitorApprovals                   │
│  Flats                                                      │
│  Towers                  COMMUNITY                          │
│  Vehicles                ─────────                          │
│                          Complaints                         │
│  AMENITIES               ComplaintComments                  │
│  ─────────               Polls                              │
│  Amenities               Votes                              │
│  Bookings                NoticeBoard                        │
│                                                             │
│  FINANCE                 STAFF & SUPPORT                    │
│  ───────                 ──────────────                     │
│  Maintenance             Staff                              │
│  Payments                ServiceProviders                   │
│                          EmergencyContacts                  │
│  NOTIFICATIONS                                              │
│  ─────────────                                              │
│  Notifications                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Total: 21 Tables**

---

## 15. Navigation Flow

```
┌─────────────┐
│   SPLASH    │  ← Lottie animation
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ ONBOARDING  │  ← 3 slides (first time only)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    LOGIN    │  ← OTP / Email / Google
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ ROLE DETECT │  ← Fetch role from users table
└──────┬──────┘
       │
  ┌────┼────┐
  │    │    │
  ▼    ▼    ▼

RESIDENT        GUARD          ADMIN
────────        ─────          ─────
Home            Dashboard      Dashboard
Visitors        Register       Residents
Community       Visitor        Visitors
Amenities       Approval       Complaints
Profile         Entry          Payments
                Exit           Amenities
Visitor         History        Settings
Booking
Complaint
Payments
Profile
```

---

## 16. Design System

### Theme

| Attribute | Value |
|---|---|
| Style | Modern SaaS · Premium · Minimal · Apple-Inspired |
| Corners | Rounded Cards (28px radius) |
| Depth | Soft Shadows |
| Navigation | Glass Effect (Expo Blur) |

---

### 🎨 Color Palette

| Token | Hex | Usage |
|---|---|---|
| **Primary** | `#E7FF45` | CTAs, highlights, active states |
| **Background** | `#F5F5F2` | App background (light) |
| **Dark** | `#171717` | Text, dark backgrounds |
| **Text** | `#111111` | Body text |
| **Border** | `#ECECEC` | Card borders, dividers |
| **Surface** | `#FFFFFF` | Card backgrounds |
| **Success** | `#22C55E` | Approved, paid, resolved |
| **Warning** | `#F59E0B` | Pending, due, warning |
| **Danger** | `#EF4444` | Rejected, overdue, critical |
| **Muted** | `#94A3B8` | Placeholder, secondary text |

> [!NOTE]
> **Dark Mode**: Flip Background → `#0A0A0F`, Surface → `#13131A`, Text → `#F8FAFC`

---

### Typography

| Style | Font | Weight | Size |
|---|---|---|---|
| Display | Plus Jakarta Sans | Bold (700) | 32px |
| Heading 1 | Plus Jakarta Sans | SemiBold (600) | 24px |
| Heading 2 | Plus Jakarta Sans | SemiBold (600) | 20px |
| Heading 3 | Plus Jakarta Sans | SemiBold (600) | 17px |
| Body | Plus Jakarta Sans | Regular (400) | 15px |
| Caption | Plus Jakarta Sans | Regular (400) | 13px |
| Label | Plus Jakarta Sans | Medium (500) | 11px |

---

### Component Specs

**Button**
```
Height:    52px
Radius:    14px
Primary:   Background #E7FF45 · Text #171717
Secondary: Border 1px #ECECEC · Text #111111
Danger:    Background #FEE2E2 · Text #EF4444
Press:     scale(0.97)
```

**Card**
```
Background: #FFFFFF
Border:     1px solid #ECECEC
Radius:     28px
Padding:    16px
Shadow:     0 4px 16px rgba(0,0,0,0.06)
```

**Input**
```
Background: #F5F5F2
Border:     1px solid #ECECEC
Focus:      1px solid #171717
Radius:     14px
Height:     52px
```

---

### Spacing Scale

```
4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64
```

---

## 17. Success Metrics

| Metric | Target |
|---|---|
| Visitor approval time reduction | 80% |
| Digital visitor log coverage | 100% |
| Resident adoption in pilot society | 90% |
| Reduction in manual guard calls | 50% |
| Complaint resolution transparency | Measurable via dashboard |
| App crash rate | < 1% |

---

## 18. Future Roadmap

### Phase 2 (Post-Hackathon)

| Feature | Priority |
|---|---|
| Visitor Face Recognition | High |
| AI Security Monitoring | High |
| Parking Management | High |
| Resident Marketplace | Medium |
| Resident Chat | Medium |
| Emergency Broadcast | Medium |
| Community Events | Medium |
| Smart Intercom Integration | Low |
| IoT Gate Access Control | Low |

---

## 19. Hackathon Demo Flow

> **Total Time**: 5 minutes

```
Step 1  ──  Login as Security Guard (30s)
            Show guard dashboard, shift info, current visitor count

Step 2  ──  Register a Visitor (45s)
            Name: Swiggy Delivery · Purpose: Delivery · Flat: A-203
            Show multi-step form, photo capture, resident search

Step 3  ──  Resident Receives Notification (30s)
            Show push notification arriving on resident phone
            Resident opens app, sees visitor photo and purpose

Step 4  ──  Resident Approves Visitor (30s)
            One tap approve → confetti animation → approved toast

Step 5  ──  Guard Receives Confirmation (30s)
            Guard screen updates LIVE (Supabase Realtime)
            Shows "✅ Approved by Arjun Sharma"
            Guard taps "Allow Entry" → entry logged

Step 6  ──  Visitor Exits (20s)
            Guard taps visitor in list → "Mark Exit"
            Exit time logged with timestamp

Step 7  ──  Admin Dashboard Updates Live (30s)
            Today's visitor count +1
            Activity feed shows "Swiggy Delivery — A-203 — Exited"
            Analytics chart refreshes

Step 8  ──  Resident Books Amenity (30s)
            Gym booking for tomorrow, slot selection, confirm

Step 9  ──  Resident Raises Complaint (20s)
            Water leakage · High Priority · Add photo · Submit

Step 10 ──  Admin Resolves Complaint + Sends Notice (30s)
            Admin marks resolved → sends society notice
            Resident gets two push notifications
```

---

## 20. Deliverables

| # | Deliverable | Status |
|---|---|---|
| ✅ | Public GitHub Repository | Required |
| ✅ | Expo Project Source Code | Required |
| ✅ | Android APK | Required |
| ✅ | Demo Video (3–5 minutes) | Required |
| ✅ | README with Setup Instructions | Required |
| ✅ | Screenshots of All Major Screens | Required |
| ✅ | Demo Credentials (Resident, Guard, Admin) | Required |
| ✅ | Database Schema (ER Diagram) | Required |
| ✅ | System Architecture Diagram | Required |
| ✅ | UI Design (Figma or Screenshots) | Required |
| ✅ | Presentation Deck (8–10 Slides) | Required |

---

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| Resident | `resident@portl.app` | `demo123` |
| Security Guard | `guard@portl.app` | `demo123` |
| Society Admin | `admin@portl.app` | `demo123` |

---

### GitHub Structure

```
portl/
├── README.md
├── app.json
├── .env.example
├── docs/
│   ├── architecture.png
│   ├── database.png
│   ├── flow.png
│   └── screenshots/
│       ├── resident-home.png
│       ├── visitor-approval.png
│       ├── guard-dashboard.png
│       ├── admin-analytics.png
│       ├── qr-guest-pass.png
│       ├── amenity-booking.png
│       ├── complaint-detail.png
│       ├── notice-board.png
│       ├── poll-voting.png
│       └── maintenance.png
├── app/
│   └── (source code)
└── supabase/
    ├── migrations/
    └── functions/
```

---

*PRD Version 1.0 · Portl · Your Society. One Tap Away.*

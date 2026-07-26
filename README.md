# 🏰 Gately — Smart Connected Society & Gate Security Platform

> **AI-Powered, Real-Time Society Management & Visitor Security System for Modern Gated Communities.**

[![React Native](https://img.shields.io/badge/React_Native-Expo_SDK_55-61DAFB?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%26_Realtime-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Express.js](https://img.shields.io/badge/Node.js-Express-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini_AI-API-8E75B2?style=for-the-badge&logo=google)](https://ai.google.dev/)

---

## 📌 What Gately Really Does

**Gately** is an enterprise-grade mobile & cloud ecosystem designed for modern gated communities. It solves the critical security and communication breakdown between **Residents**, **Security Guards**, and **Society Admins**.

### 💡 Core Value Proposition
1. **Zero-Wait Gate Verification**: Replaces slow paper logs and intercom calls with instant **1-Tap Pre-Approved QR Passes**.
2. **Real-Time Guard Duty Control**: Gives security guards camera-based QR scanning, pending approval processing, and resident directory verification.
3. **AI-Powered Complaint Management**: Integrates **Google Gemini AI** to automatically categorize resident maintenance complaints (Plumbing, Electrical, Security) with priority tagging.
4. **Community Amenities & Engagement**: Features live slot booking for Swimming Pools, Tennis Courts, Gyms, plus interactive Society Polls and Announcement Bulletins.
5. **1-Tap Gate Emergency SOS**: Instantly broadcasts gate security alarms to all residents and society admins in real time.

---

## 📱 Complete Screen-by-Screen Map & Feature Directory

Gately consists of **25+ fully functional, production-ready screens** across 3 role-based portals:

### 🔑 1. Authentication & Onboarding
| Screen File | Description & Functionality |
| :--- | :--- |
| `app/index.tsx` | **3-Step Onboarding Carousel**: Visual feature introduction with Gately brand identity, smooth animations, and Skip/Get Started controls. |
| `app/(auth)/login.tsx` | **Multi-Role Login Portal**: Supports 1-Tap Demo Logins for Resident, Guard, and Admin, plus Email/Password, Phone OTP, and Google OAuth. |

---

### 🏠 2. Resident Portal (10 Screens)
| Screen File | Description & Functionality |
| :--- | :--- |
| `app/(resident)/(tabs)/index.tsx` | **Resident Home Dashboard**: Quick action buttons, active guest status, community announcements, and gate activity feeds. |
| `app/(resident)/(tabs)/visitors.tsx` | **Visitor Pre-Approvals & Passes**: Manage active pre-approval passes for family, cabs, and delivery agents with live status badges. |
| `app/(resident)/(tabs)/community.tsx` | **Community Hub**: Read official society notice broadcasts and vote on active community proposals and polls in real-time. |
| `app/(resident)/(tabs)/profile.tsx` | **Resident Profile & Flat Details**: View flat membership details, emergency contacts, app settings, and sign-out options. |
| `app/(resident)/generate-pass.tsx` | **QR Guest Pass Generator**: Create digital guest passes with expected date, time, purpose, and instant WhatsApp/QR sharing. |
| `app/(resident)/raise-complaint.tsx` | **AI Complaint Filing**: File maintenance issues with photo attachments. Google Gemini AI auto-tags categories and priority. |
| `app/(resident)/amenities.tsx` | **Amenity Slot Booking**: Book time slots for Swimming Pool, Badminton Court, Gym, and Clubhouse with instant confirmation. |
| `app/(resident)/visitor-history.tsx` | **Historical Entry Logbook**: Filterable timeline of all past visitor entries, exits, and pre-approvals for your flat. |
| `app/(resident)/help-support.tsx` | **24/7 Help & Emergency Contacts**: Direct 1-tap call buttons for Gate Security Desk, Society Admin, and Emergency Services. |
| `app/(resident)/notifications.tsx` | **In-App Notification Center**: Real-time push notification log for visitor approvals, gate alerts, and society notices. |

---

### 🛡️ 3. Guard Duty Control Center (8 Screens)
| Screen File | Description & Functionality |
| :--- | :--- |
| `app/(guard)/(tabs)/index.tsx` | **Guard Duty Dashboard**: Shift banner, 4 live activity metric cards, 2x2 quick actions grid, and recent entry/exit timeline. |
| `app/(guard)/(tabs)/scanner.tsx` | **QR Pass Camera Scanner**: Point-and-scan QR verification with flashlight toggle, flip camera, and auto-entry confirmation. |
| `app/(guard)/(tabs)/visitors.tsx` | **Waiting Gate Visitors**: View and process visitors currently waiting at the gate for resident approvals. |
| `app/(guard)/(tabs)/history.tsx` | **Visitor History Logbook**: Comprehensive gate entry/exit logs with date filtering and 1-tap **Export History** action. |
| `app/(guard)/(tabs)/profile.tsx` | **Guard Roster Profile**: Duty shift metrics (1.5 Years exp, 98% rating), check-in times, and gate post assignments. |
| `app/(guard)/register-visitor.tsx` | **Step-by-Step Visitor Registration**: 4-step form with visitor photo capture, ID proof type, and resident dropdown. |
| `app/(guard)/resident-search.tsx` | **Resident Verification Directory**: Real-time search by Name, Flat No, or Phone to verify residents at the gate. |
| `app/(guard)/pending-approvals.tsx` | **Pending Requests Review**: Filterable requests (Visitors, Vehicles, Deliveries) with 1-tap **Approve / Reject** buttons. |
| `app/(guard)/entry-exit.tsx` | **Entry / Exit Confirmation**: Profile verification summary with 2-column **🟢 Confirm Entry** & **🔴 Confirm Exit** cards. |

---

### 👑 4. Admin Command Center (5 Screens)
| Screen File | Description & Functionality |
| :--- | :--- |
| `app/(admin)/(tabs)/index.tsx` | **Admin Command Dashboard**: Hero banner card with 4 society metrics, 4 overview cards, 2x4 quick actions grid, and recent activity log. |
| `app/(admin)/(tabs)/residents.tsx` | **Resident Directory Management**: Search and manage resident accounts across all society towers and blocks. |
| `app/(admin)/(tabs)/guards.tsx` | **Active Guard Roster**: Monitor active guards, shift schedules, gate post assignments, and onboard new guards. |
| `app/(admin)/(tabs)/reports.tsx` | **Society Analytics & Reports**: Audit weekly entry rates, guard duty logs, and export PDF/Excel system compliance reports. |
| `app/(admin)/(tabs)/settings.tsx` | **Society Profile Settings**: Manage society information, gate security rules, and admin panel configurations. |

---

## 🛠️ Complete Environment Variables (.env) Setup Guide

To run Gately locally, you need to configure the environment files for both the backend server and the mobile app.

### 1️⃣ Backend Environment File (`portl-backend/.env`)

Create a file named `.env` inside the `portl-backend/` folder and paste the following:

```env
# ===================================================
# GATELY BACKEND ENVIRONMENT CONFIGURATION
# ===================================================

# 1. Supabase Cloud Configuration
SUPABASE_URL=https://ricagpbfghdfporjtmua.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpY2FncGJmZ2hkZnBvcmp0bXVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDkwMDQzNCwiZXhwIjoyMTAwNDc2NDM0fQ.13E9-HDd16yeGfQAuWXGjEMugIOFBW22osPG92ISkdI

# 2. Database Direct PostgreSQL Connection (For Automated CLI Migrations)
DATABASE_URL=postgres://postgres:%23Hanand%408252@db.ricagpbfghdfporjtmua.supabase.co:5432/postgres

# 3. Third-Party AI & Cloud Services
GEMINI_API_KEY=your_google_gemini_api_key_here
EXPO_PUSH_ACCESS_TOKEN=your_expo_push_token_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_here

# 4. Security & JWT Settings
JWT_QR_SECRET=super_secret_jwt_key_for_gately_qr
JWT_EXPIRY=1h

# 5. Server Port Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=exp://localhost:8081
```

#### 🔑 Environment Variable Explanations:
- `SUPABASE_URL`: Your Supabase Cloud project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: Admin Service Role Key used by the backend to perform database operations bypassing Row Level Security.
- `DATABASE_URL`: Direct PostgreSQL connection string used by `npm run db:push` to migrate database schemas from VS Code.
- `GEMINI_API_KEY`: Google Gemini API key used for automatic complaint categorization.

---

### 2️⃣ Mobile App Environment File (`portl-app/.env`)

Create a file named `.env` inside the `portl-app/` folder and paste the following:

```env
# ===================================================
# GATELY MOBILE APP ENVIRONMENT CONFIGURATION
# ===================================================

# 1. Backend Server API Base URL (Use your host PC IP address for Expo Go mobile physical devices)
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000

# 2. Supabase Cloud Configuration
EXPO_PUBLIC_SUPABASE_URL=https://ricagpbfghdfporjtmua.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpY2FncGJmZ2hkZnBvcmp0bXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MDA0MzQsImV4cCI6MjEwMDQ3NjQzNH0.bT6X8eYgE2_e69123456789
EXPO_PUBLIC_APP_ENV=development
```

---

## 🗄️ Database Schema & 1-Click Migration

Gately uses **13 PostgreSQL tables** in Supabase:

```text
societies ────────┬─── users ─────────┬─── flat_members
                  ├─── flats ─────────┤
                  ├─── visitors ──────┼─── visitor_logs
                  ├─── qr_passes      ├─── complaints
                  ├─── notices        ├─── amenity_bookings
                  ├─── polls ─────────┴─── poll_votes
                  └─── amenities
```

### ⚡ Automatic CLI Migration Command

Run this command inside `portl-backend` to automatically execute all SQL migrations and seed demo accounts to Supabase Cloud:

```bash
cd portl-backend
npm run db:push
```

---

## 🚀 Installation & Local Running Guide

### 1️⃣ Clone Repository
```bash
git clone https://github.com/h-anand21/hack-mobile-dev.git
cd hack-mobile-dev
```

### 2️⃣ Start Backend Server
```bash
cd portl-backend
npm install
npm run db:push
npm run dev
```
Server runs on `http://localhost:3000`.

### 3️⃣ Start Mobile Application
```bash
cd portl-app
npm install
npx expo start --clear
```

Scan the QR code displayed in the terminal using **Expo Go** on your Android or iOS device!

---

## 🔑 Demo Test Accounts

Tap any of the **1-Tap Demo Buttons** on the Login screen:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **🏠 Resident** | `resident@gately.com` | `pass123` | Full Resident Portal, QR Pass Generator, Amenities, AI Complaints |
| **🛡️ Security Guard** | `guard@gately.com` | `pass123` | Gate Camera QR Scanner, Resident Directory, SOS Broadcast |
| **👑 Admin** | `admin@gately.com` | `pass123` | Society Analytics, Guard Rosters, Compliance Reports |

---

## 🏆 Hackathon Winning Features

- ⚡ **Sub-Second QR Gate Verification**: Zero-wait entry scans for guests and resident passes.
- 🎨 **State-of-the-Art Design**: Custom Glassmorphism UI system with smooth micro-animations.
- 🤖 **Real AI Integration**: Practical Google Gemini AI application for complaint routing.
- 🔄 **Production-Ready Codebase**: Complete Express backend, Supabase WebSocket real-time sync, and 25+ mobile screens.

---

### 💚 Built for Hackathon Excellence by Team Gately

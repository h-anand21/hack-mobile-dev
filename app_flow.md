# Portl – Complete App Flow
## Society Management Platform (Hackathon Edition)

> This flow is designed so the app feels like a real production product, not just a collection of screens.

---

## Table of Contents

1. [App Entry Flow](#-app-entry-flow)
2. [Resident App Flow](#-resident-app-flow)
3. [Visitor Flow](#-visitor-flow)
4. [Guest Pre-Approval](#guest-pre-approval)
5. [Delivery Flow](#-delivery-flow)
6. [Complaint Flow](#-complaint-flow)
7. [Amenity Booking Flow](#-amenity-booking-flow)
8. [Maintenance Payment](#-maintenance-payment)
9. [Notice Board](#-notice-board)
10. [Community Poll](#-community-poll)
11. [Notification Flow](#-notification-flow)
12. [Guard App Flow](#-guard-app-flow)
13. [Admin Flow](#-admin-flow)
14. [Real-Time Workflow](#-real-time-workflow)
15. [Bottom Navigation](#-bottom-navigation)
16. [Complete Demo Flow](#-complete-demo-flow-hackathon-presentation)

---

## 🚀 App Entry Flow

```
Open App
      │
      ▼
Splash Screen
      │
      ▼
Onboarding (3 Screens)
      │
      ▼
Authentication
      │
      ├───────────────┐
      │               │
      ▼               ▼
   Login           Register
      │
      ▼
OTP / Email Verification
      │
      ▼
Fetch User Role
      │
      ├────────────┬─────────────┐
      ▼            ▼             ▼
 Resident    Security Guard    Admin
```

---

## 👤 Resident App Flow

### Resident Dashboard

```
Resident Dashboard
        │
        ├───────────────┐
        │               │
        ▼               ▼
Today's Visitors     Notifications
        │
        ▼
Visitor Request
        │
        ├──────────────┐
        ▼              ▼
     Approve         Reject
        │
        ▼
Guard Gets Approval
        │
        ▼
Visitor Entry Logged
```

### Resident Home

```
Home
 │
 ├── Visitor Requests
 │
 ├── Quick Actions
 │
 ├── Announcements
 │
 ├── Polls
 │
 ├── Maintenance Due
 │
 ├── Upcoming Booking
 │
 └── Emergency
```

---

## 🚪 Visitor Flow

```
Visitors
     │
     ├──── Pending
     │
     ├──── Approved
     │
     ├──── Rejected
     │
     └──── History
```

### Visitor Details

```
Visitor Card
      │
      ▼
   Photo
   Vehicle
   Purpose
   Arrival Time
   Call Guard
   Approve
   Reject
   Generate QR
```

### Guest Pre-Approval

```
Create Guest Pass
      │
      ▼
Enter Guest Details
      │
      ▼
Generate QR
      │
      ▼
Share QR
      │
      ▼
Guest Arrives
      │
      ▼
Guard Scans
      │
      ▼
Auto Entry
```

---

## 📦 Delivery Flow

```
Delivery Arrives
      │
      ▼
Guard Registers
      │
      ▼
Resident Gets Notification
      │
      ▼
Approve
      │
      ▼
Guard Opens Gate
      │
      ▼
Delivery Completed
```

---

## 🛠 Complaint Flow

```
Helpdesk
     │
     ▼
Raise Complaint
     │
     ▼
Category
     │
     ▼
Priority
     │
     ▼
Upload Images
     │
     ▼
Submit
     │
     ▼
Admin Receives
     │
     ▼
Assign Staff
     │
     ▼
Resolved
```

---

## 📅 Amenity Booking Flow

```
Amenities
      │
      ▼
Select Facility
      │
      ▼
Choose Date
      │
      ▼
Choose Time Slot
      │
      ▼
Confirm Booking
      │
      ▼
Payment (Optional)
      │
      ▼
Booking Success
```

---

## 💳 Maintenance Payment

```
Maintenance
      │
      ▼
Pending Dues
      │
      ▼
View Invoice
      │
      ▼
Choose Payment
      │
      ▼
UPI / Card
      │
      ▼
Payment Success
      │
      ▼
Receipt
```

---

## 📢 Notice Board

```
Notice Board
      │
      ▼
Important Notices
      │
      ▼
Open Notice
      │
      ▼
Attachment
      │
      ▼
Mark Read
```

---

## 🗳 Community Poll

```
Polls
     │
     ▼
Open Poll
     │
     ▼
Vote
     │
     ▼
Confirmation
     │
     ▼
Results
```

---

## 🔔 Notification Flow

```
Notification
│
├── Visitor Request
│
├── Visitor Approved
│
├── Complaint Update
│
├── Maintenance Due
│
├── Booking Reminder
│
├── Notice
│
├── Poll Ending
│
└── Emergency Alert
```

---

## 👮 Guard App Flow

### Dashboard → Main Actions

```
Guard Login
      │
      ▼
Dashboard
      │
      ├──────────────┐
      ▼              ▼
Register Visitor   QR Scanner
      │
      ▼
Resident Search
      │
      ▼
Submit Request
      │
      ▼
Waiting Approval
      │
      ▼
Resident Approves
      │
      ▼
Entry
      │
      ▼
Exit
```

### Register Visitor

```
Take Photo
     ↓
Name
     ↓
Phone
     ↓
Purpose
     ↓
Vehicle Number
     ↓
Resident Search
     ↓
Submit
```

### QR Entry

```
Scan QR
     ↓
Guest Verified
     ↓
Open Gate
     ↓
Entry Logged
```

### Visitor History

```
Today
     ↓
Yesterday
     ↓
This Week
     ↓
Search
     ↓
Visitor Details
```

---

## 🛡 Admin Flow

### Admin Dashboard Overview

```
Admin Dashboard
        │
        ├──────────────┬─────────────┬────────────┐
        ▼              ▼             ▼            ▼
   Residents       Visitors      Complaints   Analytics
```

### Analytics

```
Analytics
     ↓
Today's Visitors
     ↓
Payments
     ↓
Complaints
     ↓
Bookings
     ↓
Polls
     ↓
Revenue
```

### Resident Management

```
Residents
     ↓
Search
     ↓
Open Resident
     ↓
Assign Flat
     ↓
Edit
     ↓
Deactivate
```

### Complaint Management

```
Complaint List
     ↓
Open
     ↓
Assign Staff
     ↓
Update Status
     ↓
Notify Resident
```

### Notice Flow

```
Create Notice
     ↓
Upload Attachment
     ↓
Select Audience
     ↓
Publish
     ↓
Residents Receive Push
```

### Poll Flow

```
Create Poll
     ↓
Add Options
     ↓
Publish
     ↓
Voting Starts
     ↓
Results
```

---

## 🔄 Real-Time Workflow

```
Visitor Arrives
        │
        ▼
Guard Registers Visitor
        │
        ▼
Realtime Event
        │
        ▼
Resident Push Notification
        │
        ▼
Resident Approves
        │
        ▼
Supabase Updates
        │
        ▼
Guard Screen Refresh
        │
        ▼
Visitor Entry
        │
        ▼
Visitor Exit
        │
        ▼
Admin Dashboard Analytics Updated
```

---

## 📱 Bottom Navigation

### 🏠 Resident

| Tab | Icon | Screen |
|---|---|---|
| Home | 🏠 | Dashboard |
| Visitors | 🚪 | Visitor requests & history |
| Amenities | 🏢 | Booking & amenity list |
| Notifications | 🔔 | Notification feed |
| Profile | 👤 | Settings & profile |

### 👮 Guard

| Tab | Icon | Screen |
|---|---|---|
| Dashboard | 🏠 | Stats & pending approvals |
| Register | ➕ | Multi-step visitor form |
| QR Scan | 📷 | Camera QR scanner |
| History | 📜 | Visitor log with filters |
| Profile | 👤 | Guard info & sign out |

### 🛡 Admin

| Tab | Icon | Screen |
|---|---|---|
| Dashboard | 📊 | Analytics & activity feed |
| Residents | 👥 | Resident management |
| Visitors | 🚪 | Full visitor log |
| Management | 📢 | Notices, Polls, Complaints |
| Settings | ⚙️ | Society settings |

---

## 🎬 Complete Demo Flow (Hackathon Presentation)

```
Open App
      │
      ▼
Login as Guard
      │
      ▼
Register Visitor
      │
      ▼
Resident Gets Push Notification
      │
      ▼
Approve Visitor
      │
      ▼
Guard Receives Approval
      │
      ▼
Visitor Entry
      │
      ▼
Resident Books Swimming Pool
      │
      ▼
Resident Raises Complaint
      │
      ▼
Admin Resolves Complaint
      │
      ▼
Admin Publishes Notice
      │
      ▼
Residents Receive Notification
      │
      ▼
Resident Pays Maintenance
      │
      ▼
Admin Dashboard Updates Analytics
```

> [!NOTE]
> This flow covers all hackathon requirements while keeping the experience realistic and easy to demonstrate in a 5-minute demo. It also gives you a clear screen hierarchy for designing the UI and implementing navigation.

---

*Portl · Your Society. One Tap Away.*

# Portl — UI Specification Document
## Extracted from Reference Screenshots · Design System v1.0

> **Design Language**: Apple-inspired · Minimal SaaS · Dual Mode (Light/Dark sections)
> **Primary Font**: Plus Jakarta Sans
> **Accent Color**: `#E7FF45` (Lime Yellow)
> **Key Pattern**: White/Light background screens with embedded dark cards

---

## Table of Contents

1. [Design Language Analysis](#1-design-language-analysis)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Radius](#4-spacing--radius)
5. [Component Specs](#5-component-specs)
   - [Header](#51-header)
   - [Search Bar](#52-search-bar)
   - [Accent Stat Cards](#53-accent-stat-cards-lime-yellow)
   - [Dark Section](#54-dark-section)
   - [Pill Chip Tabs](#55-pill-chip-tabs)
   - [Announcement Card](#56-announcement-card)
   - [Read More Button](#57-read-more-button)
   - [Quick Actions Grid](#58-quick-actions-grid)
   - [Floating Glass Bottom Nav](#59-floating-glass-bottom-nav)
   - [Visitor List Card](#510-visitor-list-card)
   - [Facilities Grid Card](#511-facilities-grid-card)
   - [Payment Card](#512-payment-card-dark)
   - [Community Visitor Row](#513-community-visitor-row)
   - [Profile Dark Card](#514-profile-dark-card)
   - [Settings Row Item](#515-settings-row-item)
6. [Screen Specs — Pixel by Pixel](#6-screen-specs--pixel-by-pixel)
   - [Home Dashboard](#61-home-dashboard)
   - [Gate Updates](#62-gate-updates-visitor-screen)
   - [Facilities](#63-facilities-screen)
   - [Payments](#64-payments-screen)
   - [Community Visitors](#65-community--visitors-screen)
   - [Profile](#66-profile-screen)
7. [NativeWind Class Reference](#7-nativewind-class-reference)
8. [Bottom Navigation Implementation](#8-bottom-navigation-implementation)
9. [Library Mapping](#9-library-mapping)

---

## 1. Design Language Analysis

### What Makes This UI Unique

From the screenshots, the design follows a very specific pattern:

```
SCREEN STRUCTURE
────────────────
Light Background (#F5F5F2)
    │
    ├── Header (White, no border, avatar + name)
    │
    ├── Search Bar (Rounded, light gray)
    │
    ├── Accent Cards Row (Lime #E7FF45 — dues + violations)
    │
    └── Dark Section (#171717) — Takes 60% of screen
        ├── Horizontal pill chips (Helpdesk, Facilities...)
        ├── Announcement card (dark rounded, white text)
        ├── Quick Actions grid
        └── More content...

BOTTOM
    └── Floating Glass Nav Bar (translucent, pill shaped)
```

### Dual-Mode Pattern (NOT dark mode)
> [!IMPORTANT]
> This is NOT a dark mode app. It uses **both light and dark on the same screen**.
> - Top section: Light (`#F5F5F2` or `#FFFFFF`)
> - Bottom section: Dark (`#171717`) with white text
> - Some screens are fully light (Gate Updates, Facilities, Community)
> - Some screens are mixed (Home Dashboard)
> - Profile screen is fully dark

### Key Design Traits
- Extreme rounding on everything (28-32px cards, 22px buttons, 20px inputs)
- Lime yellow `#E7FF45` used ONLY for primary accent — never overused
- Dark circles for icon containers (not colored)
- Status badges are minimal pill shapes
- Bottom nav is floating, NOT full-width background
- Active tab has circular fill (#111 or #E7FF45 glow)
- Typography hierarchy: Bold title → Regular subtitle → Muted caption

---

## 2. Color System

### Primary Palette

| Token | Hex | Usage |
|---|---|---|
| `background` | `#F5F5F2` | App background, light screens |
| `dark` | `#171717` | Dark sections, dark cards |
| `dark-card` | `#1E1E1E` | Elevated dark cards |
| `dark-input` | `#2A2A2A` | Input on dark background |
| `accent` | `#E7FF45` | Primary CTA, active state, key numbers |
| `white` | `#FFFFFF` | Cards on light bg, text on dark |
| `text-primary` | `#111111` | Primary text on light bg |
| `text-secondary` | `#666666` | Secondary text, subtitles |
| `text-muted` | `#999999` | Placeholder, timestamps |
| `border` | `#ECECEC` | Card borders on light bg |
| `success` | `#22C55E` | Approved badge |
| `pending` | `#F59E0B` | Pending badge |
| `danger` | `#EF4444` | Rejected, alerts |

### NativeWind Custom Colors (tailwind.config.js)
```js
colors: {
  background: '#F5F5F2',
  dark:       '#171717',
  'dark-card': '#1E1E1E',
  'dark-input':'#2A2A2A',
  accent:     '#E7FF45',
  'text-primary': '#111111',
  'text-secondary': '#666666',
  'text-muted': '#999999',
  border:     '#ECECEC',
  success:    '#22C55E',
  warning:    '#F59E0B',
  danger:     '#EF4444',
}
```

---

## 3. Typography

**Font**: Plus Jakarta Sans (all weights)

| Style | Size | Weight | Color | Usage |
|---|---|---|---|---|
| `display` | 32px | 800 ExtraBold | `#111` or `#FFF` | Large numbers ($170, $4,500) |
| `h1` | 24px | 700 Bold | `#111` / `#FFF` | Screen titles |
| `h2` | 20px | 700 Bold | `#111` / `#FFF` | Section titles (Announcements, Quick Actions) |
| `h3` | 17px | 600 SemiBold | `#111` / `#FFF` | Card titles |
| `body` | 15px | 400 Regular | `#666` | Body text, descriptions |
| `caption` | 13px | 400 Regular | `#999` | Timestamps, muted labels |
| `label-sm` | 11px | 500 Medium | varies | Pill labels, badge text |
| `greeting` | 20px | 700 Bold | `#111` | "Hello, Chris" |
| `society` | 13px | 400 Regular | `#999` | "Riverdale Residency" |

### NativeWind Typography Classes
```
text-[32px] font-extrabold   → display
text-2xl font-bold           → h1
text-xl font-bold            → h2
text-[17px] font-semibold    → h3
text-[15px] font-normal      → body
text-[13px] font-normal      → caption
text-[11px] font-medium      → label-sm
```

---

## 4. Spacing & Radius

### Border Radius
| Element | Radius | NativeWind |
|---|---|---|
| Cards | 28px | `rounded-[28px]` |
| Buttons (primary) | 22px | `rounded-[22px]` |
| Inputs / Search | 20px | `rounded-[20px]` |
| Pill Chips / Tags | 999px | `rounded-full` |
| Avatar | 50% | `rounded-full` |
| Icon Containers | 50% | `rounded-full` |
| Bottom Nav Container | 999px | `rounded-full` |
| Bottom Nav Active | 50% | `rounded-full` |
| Stat Cards | 22px | `rounded-[22px]` |
| Announcement Card | 20px | `rounded-[20px]` |
| Facilities Grid Item | 20px | `rounded-[20px]` |
| Payment Section Card | 24px | `rounded-[24px]` |

### Spacing Scale (px)
```
4   8   12   16   20   24   28   32   40   48
```

### Screen Horizontal Padding
```
px-5  (20px) — Standard screen padding
```

### Section Gap
```
gap-3 (12px) — Between items
gap-4 (16px) — Between sections
gap-5 (20px) — Between major sections
```

---

## 5. Component Specs

### 5.1 Header

**Observed in**: Home, Gate Updates, Facilities, Payments, Profile

```
LIGHT HEADER (Home screen)
──────────────────────────
Background: transparent (inherits #F5F5F2)
Height: ~72px
Padding: px-5, pt-safe

Layout: [Avatar 40px] [Name+Society col] [flex-1] [Chat icon 40px] [Bell icon 40px]

Avatar:
  Size: 40 × 40
  Radius: full (circle)
  Border: 2px white

Name:
  "Hello, Chris"  → text-xl font-bold text-[#111]
  "Riverdale Residency" → text-xs text-[#999]

Icon Buttons (Chat + Bell):
  Container: 40×40, bg-white, rounded-full, shadow-sm
  Icon: Lucide, 20px, color: #111
  Bell badge: 6px red dot, absolute top-1 right-1

DARK HEADER (in dark section)
───────────────────────────────
Text color: white (#FFF)
Icons: white
```

**NativeWind:**
```
<View className="flex-row items-center px-5 pt-safe pb-3 gap-3">
  <Image className="w-10 h-10 rounded-full" />
  <View className="flex-1">
    <Text className="text-xl font-bold text-[#111]">Hello, Chris</Text>
    <Text className="text-xs text-[#999]">Riverdale Residency</Text>
  </View>
  <TouchableOpacity className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm">
    <MessageCircle size={20} color="#111" />
  </TouchableOpacity>
  <TouchableOpacity className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm">
    <Bell size={20} color="#111" />
  </TouchableOpacity>
</View>
```

---

### 5.2 Search Bar

**Observed in**: Home, Visitors, Facilities, Community

```
Shape:    Rounded pill (radius 20px)
BG:       #ECECEC (light gray)
Height:   48px
Padding:  px-4
Icon:     Lucide Search, 18px, #999, left side
Text:     "Search" or "Search Visitors...." → text-[#999], text-sm
```

**NativeWind:**
```
<View className="flex-row items-center bg-[#ECECEC] rounded-[20px] h-12 px-4 gap-2">
  <Search size={18} color="#999" />
  <TextInput
    placeholder="Search"
    placeholderTextColor="#999"
    className="flex-1 text-sm text-[#111] font-medium"
  />
</View>
```

---

### 5.3 Accent Stat Cards (Lime Yellow)

**Observed in**: Home — "Dues" and "Open Violation" cards

```
Layout: 2 cards side by side (flex-row, gap-3)
Each card: flex-1

Card Spec:
  BG:       #E7FF45 (lime yellow)
  Radius:   22px
  Padding:  p-4
  Height:   ~80px

Content:
  Left: [Amount/Number bold] [Label below in small]
  Right: [Black circle arrow button, 36×36, rounded-full, bg-black]
    Arrow icon: Lucide ArrowRight, 18px, white

Typography:
  Amount:  text-2xl font-bold text-[#111]
  Label:   text-xs text-[#111] opacity-70
```

**NativeWind:**
```
<View className="flex-row gap-3">
  <TouchableOpacity className="flex-1 bg-[#E7FF45] rounded-[22px] p-4 flex-row items-center justify-between">
    <View>
      <Text className="text-2xl font-bold text-[#111]">$170.00</Text>
      <Text className="text-xs text-[#111] opacity-70 mt-1">Dues</Text>
    </View>
    <View className="w-9 h-9 rounded-full bg-[#111] items-center justify-center">
      <ArrowRight size={18} color="white" />
    </View>
  </TouchableOpacity>
  {/* Same for second card */}
</View>
```

---

### 5.4 Dark Section

**Observed in**: Home Dashboard lower half

```
Background: #171717
Border Radius: top-left 28, top-right 28 → rounded-t-[28px]
Starts: After stat cards
Takes: ~60% screen height
Padding: px-5, pt-6
```

**NativeWind:**
```
<View className="bg-[#171717] rounded-t-[28px] flex-1 px-5 pt-6">
  {/* All dark content here */}
</View>
```

---

### 5.5 Pill Chip Tabs

**Observed in**: Dark section — Helpdesk, Facilities, Polls horizontal scroll

```
Layout: ScrollView horizontal, gap-3

Chip Spec:
  BG:       #2A2A2A (dark gray — inactive)
  BG Active: (implied from screenshots — slightly lighter or bordered)
  Radius:   full (pill)
  Height:   40px
  Padding:  px-4
  
Content:
  [Icon 18px white] [Label text-sm text-white font-medium]
  
Icons from screenshots:
  Helpdesk → Headphones (Lucide)
  Facilities → Waves or Activity
  Po(lls) → (truncated, likely BarChart2)
```

**NativeWind:**
```
<ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
  <View className="flex-row gap-3">
    {chips.map(chip => (
      <TouchableOpacity className="flex-row items-center gap-2 bg-[#2A2A2A] rounded-full h-10 px-4">
        <Headphones size={18} color="white" />
        <Text className="text-sm font-medium text-white">Helpdesk</Text>
      </TouchableOpacity>
    ))}
  </View>
</ScrollView>
```

---

### 5.6 Announcement Card

**Observed in**: Dark section — "Water Maintenance" card

```
BG:       #1E1E1E (slightly lighter than dark section)
Radius:   20px
Padding:  p-4
Margin:   mt-4

Content Layout:
  Row 1: [Title text-lg font-bold white] [Timestamp pill right]
  Row 2: [Description text-sm text-[#999] mt-2]
  Row 3: [Read More button — below]

Timestamp Pill:
  BG: #2A2A2A
  Radius: full
  Padding: px-3 py-1
  Text: "2h ago" text-xs text-[#999]
```

**NativeWind:**
```
<View className="bg-[#1E1E1E] rounded-[20px] p-4 mt-4">
  <View className="flex-row items-start justify-between">
    <Text className="text-lg font-bold text-white flex-1 mr-3">
      Water Maintenance
    </Text>
    <View className="bg-[#2A2A2A] rounded-full px-3 py-1">
      <Text className="text-xs text-[#999]">2h ago</Text>
    </View>
  </View>
  <Text className="text-sm text-[#999] mt-2 leading-5">
    Tomorrow, water supply will be interrupted from 10 AM to 2 PM for maintenance.
  </Text>
</View>
```

---

### 5.7 Read More Button

**Observed in**: Below announcement card on dark background

```
BG:       #FFFFFF (white)
Radius:   full (pill)
Height:   48px
Width:    full (100%)
Margin:   mt-3

Content:
  Center: [Text "Read More" font-semibold text-[#111]] [Arrow icon →]
  Layout: flex-row items-center justify-center gap-2
```

**NativeWind:**
```
<TouchableOpacity className="w-full bg-white rounded-full h-12 flex-row items-center justify-center gap-2 mt-3">
  <Text className="font-semibold text-[#111]">Read More</Text>
  <ArrowRight size={16} color="#111" />
</TouchableOpacity>
```

---

### 5.8 Quick Actions Grid

**Observed in**: Dark section — 2-column grid of dark circles with icons

```
Layout: 2 rows × N columns (horizontal scroll or grid)

Each Action:
  Container: ~80×80, rounded-[20px], bg-[#1E1E1E]
  Icon circle: 44×44, rounded-full, bg-[#2A2A2A]
  Icon: Lucide, 22px, white
  Label: text-xs text-[#999] mt-2 text-center

Spacing: gap-3
```

**NativeWind:**
```
<View className="flex-row flex-wrap gap-3 mt-4">
  {actions.map(action => (
    <TouchableOpacity className="w-[calc(50%-6px)] bg-[#1E1E1E] rounded-[20px] p-4 items-center">
      <View className="w-11 h-11 rounded-full bg-[#2A2A2A] items-center justify-center">
        <UserPlus size={22} color="white" />
      </View>
      <Text className="text-xs text-[#999] mt-2 text-center">Add Member</Text>
    </TouchableOpacity>
  ))}
</View>
```

---

### 5.9 Floating Glass Bottom Nav

**Observed in**: ALL screens — floating at bottom

```
STRUCTURE
─────────
Position: absolute, bottom: 16, left: 20, right: 20
BG: rgba(23,23,23,0.85) → semi-transparent dark
  (On light screens: rgba(230,230,225,0.85))
BlurView: intensity 60, tint "dark" / "light"
Radius: full (999px)
Height: 64px
Padding: px-4

TABS (5 tabs):
Each tab: flex-1, items-center, justify-center

Active Tab:
  BG circle: 44×44, rounded-full, bg-[#111] (dark nav) or bg-[#111] (light nav)
  Icon: 22px, accent color or white
  
Inactive Tab:
  No BG
  Icon: 22px, #666 (muted)

Tab Icons (from screenshots):
  Home     → House (Lucide)
  Pencil   → PenLine or Edit
  People   → Users
  Chat     → MessageCircle  
  Grid     → LayoutGrid or Grid3x3

Active indicator:
  Home tab active → circle bg-[#111], icon white
  When on light screen → circle bg-[#111], icon white OR
                          circle bg-[#E7FF45], icon #111 (accent variant)
```

**Implementation (No library needed):**
```tsx
// components/ui/bottom-bar/BottomBar.tsx
import { BlurView } from 'expo-blur'
import Animated from 'react-native-reanimated'

const TABS = [
  { name: 'home',    icon: House,         route: '/(resident)/(tabs)/' },
  { name: 'pencil',  icon: PenLine,       route: '/(resident)/(tabs)/complaints' },
  { name: 'people',  icon: Users,         route: '/(resident)/(tabs)/visitors' },
  { name: 'chat',    icon: MessageCircle, route: '/(resident)/(tabs)/community' },
  { name: 'grid',    icon: LayoutGrid,    route: '/(resident)/(tabs)/more' },
]

// Wrap with BlurView + absolute positioning
// Active tab gets dark circle 44×44 rounded-full
// Use Reanimated for smooth scale/opacity on press
```

**NativeWind positioning:**
```
className="absolute bottom-4 left-5 right-5 h-16 rounded-full overflow-hidden flex-row items-center px-4"
```

---

### 5.10 Visitor List Card

**Observed in**: Gate Updates screen, Community screen

```
BG:       white (#FFF) on light background
Radius:   16px
Padding:  p-4
Border:   none (shadow only)
Shadow:   0 2px 8px rgba(0,0,0,0.06)
Margin:   mb-3

Content Layout:
  Row: [Avatar 48px] [Name+Phone+Tag col] [Status badge right] [Time right]

Avatar:
  Size: 48×48
  Radius: full
  Image or initials fallback

Name: text-base font-semibold text-[#111]
Phone: text-sm text-[#666] mt-0.5
Tag: pill chip — "Plumber" or "Guest"
  BG: #ECECEC, radius: full, px-2 py-0.5
  Text: text-xs text-[#666]

Status Badge:
  Approved: text-[#22C55E] with ✓ icon
  Pending:  text-[#999] with ✓ icon
  
Time:
  text-xs text-[#999]
  Below status badge
```

**NativeWind:**
```
<View className="bg-white rounded-2xl p-4 mb-3 shadow-sm flex-row items-center gap-3">
  <Image className="w-12 h-12 rounded-full" source={...} />
  <View className="flex-1">
    <Text className="text-base font-semibold text-[#111]">Alex Johnson</Text>
    <Text className="text-sm text-[#666] mt-0.5">+91 98765 43210</Text>
    <View className="bg-[#ECECEC] self-start rounded-full px-2 py-0.5 mt-1.5">
      <Text className="text-xs text-[#666]">Plumber</Text>
    </View>
  </View>
  <View className="items-end gap-1">
    <View className="flex-row items-center gap-1">
      <CheckCircle size={14} color="#22C55E" />
      <Text className="text-sm font-medium text-[#22C55E]">Approved</Text>
    </View>
    <Text className="text-xs text-[#999]">2:30 PM</Text>
  </View>
</View>
```

---

### 5.11 Facilities Grid Card

**Observed in**: Facilities screen — 2-column grid

```
Layout: 2 columns, gap-3
Each Card:
  Width: ~(screenWidth - 40 - 12) / 2 ≈ (375-52)/2 = 161px
  Height: ~180px (fixed)
  Radius: 20px
  Overflow: hidden

Content: Image fills entire card (cover)
Overlay: LinearGradient bottom → top
  from: rgba(0,0,0,0.7)
  to: transparent

Text (on overlay, bottom of card):
  Name: text-base font-bold white
  Price: text-sm text-[#E7FF45] (accent) or text-white opacity-70
  Both: px-3 pb-3 absolute bottom
```

**NativeWind + Expo LinearGradient:**
```tsx
<TouchableOpacity
  className="rounded-[20px] overflow-hidden"
  style={{ width: (width - 52) / 2, height: 180 }}>
  <Image className="absolute inset-0 w-full h-full" contentFit="cover" source={...} />
  <LinearGradient
    colors={['transparent', 'rgba(0,0,0,0.75)']}
    className="absolute inset-0"
  />
  <View className="absolute bottom-0 left-0 right-0 p-3">
    <Text className="text-base font-bold text-white">Swimming Pool</Text>
    <Text className="text-sm text-[#E7FF45]">Free</Text>
  </View>
</TouchableOpacity>
```

---

### 5.12 Payment Card (Dark)

**Observed in**: Payments screen — "Total Pending" dark card

```
BG:       #171717
Radius:   24px
Padding:  p-5
Width:    full

Content:
  Label:  "Total Pending" → text-sm text-[#999]
  Amount: "$4,500" → text-[40px] font-extrabold text-white
  Breakdown rows:
    [Label] [Amount right-aligned]
    Color: text-[#999] and text-white
    Separator: subtle divider line #2A2A2A
  CTA Button:
    BG: #E7FF45
    Text: "Pay $ 4,500" → font-bold text-[#111]
    Radius: full
    Height: 52px
    Width: full
    Margin: mt-4
```

**NativeWind:**
```
<View className="bg-[#171717] rounded-[24px] p-5">
  <Text className="text-sm text-[#999]">Total Pending</Text>
  <Text className="text-[40px] font-extrabold text-white mt-1">$4,500</Text>
  
  <View className="mt-4 gap-2">
    <View className="flex-row justify-between">
      <Text className="text-sm text-[#999]">Maintenance Fee</Text>
      <Text className="text-sm text-white font-medium">$3,500</Text>
    </View>
    <View className="flex-row justify-between">
      <Text className="text-sm text-[#999]">Parking Fee</Text>
      <Text className="text-sm text-white font-medium">$1,000</Text>
    </View>
  </View>
  
  <TouchableOpacity className="w-full bg-[#E7FF45] rounded-full h-13 items-center justify-center mt-5">
    <Text className="text-base font-bold text-[#111]">Pay $ 4,500</Text>
  </TouchableOpacity>
</View>
```

---

### 5.13 Community Visitor Row

**Observed in**: Community screen — Today/Upcoming/History tabs

```
BG:       white (#FFF)
Radius:   16px
Padding:  p-4
MB:       mb-3

Row: [Avatar 48px] [Name+Phone] [Badge right]

Badges:
  "Approved" → CheckCircle icon + text, color #22C55E
  "Pending"  → Clock icon + text, color #999

Sub-row below name:
  Tag: "Plumber" or "Guest" → pill #ECECEC
  Time: "2:30 PM" → text-xs #999
```

---

### 5.14 Profile Dark Card

**Observed in**: Profile screen — top hero section

```
BG:          dark gradient (subtle green-dark to black)
             LinearGradient: ['#1a2a1a', '#171717']
Radius:      24px
Padding:     p-6
Align:       center

Content:
  Avatar: 72×72, rounded-full, border 3px white
  Name:   text-xl font-bold text-white mt-3
  Email:  text-sm text-[#999] mt-1
```

**NativeWind:**
```
<LinearGradient
  colors={['#1a2a1a', '#171717']}
  className="rounded-[24px] p-6 items-center">
  <Image className="w-18 h-18 rounded-full border-2 border-white" />
  <Text className="text-xl font-bold text-white mt-3">Chris Pradana</Text>
  <Text className="text-sm text-[#999] mt-1">chrispradana11@gmail.com</Text>
</LinearGradient>
```

---

### 5.15 Settings Row Item

**Observed in**: Profile screen — list of settings

```
Each Row:
  BG:       #1E1E1E
  Radius:   16px
  Padding:  p-4
  MB:       mb-3

Layout: [Icon circle] [Title+Sub col] [ChevronRight]

Icon Circle:
  Size: 40×40, rounded-full, bg-[#2A2A2A]
  Icon: Lucide, 20px, white

Title:   text-base font-semibold text-white
Sub:     text-sm text-[#666] mt-0.5

ChevronRight:
  Size: 18px, color #666
```

**NativeWind:**
```
<TouchableOpacity className="bg-[#1E1E1E] rounded-2xl p-4 mb-3 flex-row items-center gap-3">
  <View className="w-10 h-10 rounded-full bg-[#2A2A2A] items-center justify-center">
    <User size={20} color="white" />
  </View>
  <View className="flex-1">
    <Text className="text-base font-semibold text-white">Edit Profile</Text>
    <Text className="text-sm text-[#666] mt-0.5">Update your info</Text>
  </View>
  <ChevronRight size={18} color="#666" />
</TouchableOpacity>
```

---

## 6. Screen Specs — Pixel by Pixel

### 6.1 Home Dashboard

```
STATUS BAR: Light (dark icons on light bg)

SECTION 1 — Light Top (bg: #F5F5F2)
├── Header [Avatar | Hello, Chris / Riverdale Residency | Chat btn | Bell btn]
├── Search Bar (bg: #ECECEC, rounded-[20px], h-12)
├── Accent Cards Row (2 × lime cards: Dues | Open Violation)
└── Padding bottom: 20px

SECTION 2 — Dark Bottom (bg: #171717, rounded-t-[28px])
├── Horizontal chip scroll: [Helpdesk] [Facilities] [Polls] ...
├── Section header: "Announcements" (white) | "View all" (accent or muted)
├── Announcement Card (bg: #1E1E1E)
│   ├── Title + timestamp pill
│   ├── Description text
│   └── Read More button (white pill)
├── Section header: "Quick Actions" | "View all"
└── Quick Actions grid (2×2+ dark circles)

BOTTOM NAV: Floating glass dark pill
Active: Home icon
```

---

### 6.2 Gate Updates (Visitor Screen)

```
STATUS BAR: Light

FULL LIGHT SCREEN (bg: #F5F5F2)
├── Back arrow (← circle 40px, bg-white)
├── Title: "Gate Updates" (center, text-xl font-bold text-[#111])
│
├── Tab Row: [Visitors ●] [Parcel] [Helpers]
│   Active: black pill bg-[#111] text-white
│   Inactive: transparent, text-[#666]
│
├── Section: "Expected Visitors"
│   └── CTA Card (bg-white, rounded-[20px], p-5)
│       ├── Image (person at gate, right side, 100×80)
│       ├── Title: "Streamline Visitor Entry at the Gate"
│       └── Button: "Pre-Approve Entry" (bg-[#111], text-white, rounded-full, px-4 py-2)
│
├── Section: "My Visitors" + Date pill
│   └── Visitor Cards (white, rounded-2xl):
│       Each: [Photo 60×60] [Company + Person + Pre-Approved by] [→ arrow]

BOTTOM NAV: Floating glass light pill
```

---

### 6.3 Facilities Screen

```
STATUS BAR: Light

FULL LIGHT SCREEN (bg: #F5F5F2)
├── Back arrow + Title "Facilities" (center)
│
├── Search Row: [Search input flex-1] [Bookings button (black, rounded-full, with calendar icon)]
│
└── 2-Column Grid (FlatList/FlashList numColumns=2)
    Each Cell: Image card with gradient overlay
    Images: Swimming Pool, Squash Court, Pickle Bell Court, Community Club,
            Basketball Cort, Barbeque Pit
    Name: text-base font-bold white (bottom-left)
    Price: text-sm accent/white (below name)

BOTTOM NAV: Floating glass light pill
```

---

### 6.4 Payments Screen

```
STATUS BAR: Dark (white icons on dark bg)

FULL DARK SCREEN (bg: #171717)
├── Back arrow (white) + Title "Payments" (white, center)
│
├── DARK PAYMENT CARD (bg: #171717, border: 1px #2A2A2A or none)
│   ├── "Total Pending" (text-sm, #999)
│   ├── "$4,500" (text-[40px] font-extrabold white)
│   ├── Breakdown: Maintenance $3,500 | Parking $1,000
│   └── [Pay $ 4,500] → ACCENT LIME BUTTON (full width, rounded-full)
│
├── Section: "Payment Method" + "View all"
│   └── Method Cards (bg: #1E1E1E, rounded-2xl):
│       ├── Credit/Debit Card (selected → lime circle checkmark ✓ on right)
│       ├── UPI → chevron →
│       └── Net Banking → chevron →

BOTTOM NAV: Floating glass dark pill
```

---

### 6.5 Community / Visitors Screen

```
STATUS BAR: Light

FULL LIGHT SCREEN (bg: #F5F5F2)
├── Back arrow + Title "Community" (center)
│
├── Search Bar ("Search Visitors....")
│
├── Tab Row: [Today ●] [Upcoming] [History]
│   Active: black pill
│
└── Visitor List (FlashList):
    Each Item: white card, rounded-2xl, avatar+name+phone+tag+status+time
    Status: Approved (green) | Pending (gray)
    
    Bottom Fixed Button:
      "+ Add Visitor" → black full-width button, rounded-full, h-13
      Yellow "+" icon or white icon

BOTTOM NAV: Floating glass light pill
Active: People icon (users) → has accent circle background
```

---

### 6.6 Profile Screen

```
STATUS BAR: Dark (white icons)

FULL DARK SCREEN (bg: #171717)
├── Back arrow (white) + Title "Profile" (white, center) + Edit icon (white)
│
├── PROFILE HERO CARD (LinearGradient, rounded-[24px])
│   ├── Avatar 72px (circular, white border)
│   ├── Name: Chris Pradana (white, xl, bold)
│   └── Email: (gray, sm)
│
└── Settings List:
    Each Row: dark card (#1E1E1E), icon circle (#2A2A2A), title+subtitle, chevron
    Items:
      👤 Edit Profile — Update your info
      🔔 Notifications — Manage your notifications
      🔒 Privacy & Security — Control your data
      ❓ Help & Support — Get help or contact us

BOTTOM NAV: Floating glass dark pill
Active: Grid icon (rightmost)
```

---

## 7. NativeWind Class Reference

### Quick Reference Cheatsheet

```
BACKGROUNDS
bg-background     → #F5F5F2
bg-dark           → #171717
bg-dark-card      → #1E1E1E
bg-dark-input     → #2A2A2A
bg-accent         → #E7FF45
bg-white
bg-border         → #ECECEC

TEXT
text-primary      → #111111
text-secondary    → #666666
text-muted        → #999999
text-white
text-accent       → #E7FF45

RADIUS
rounded-full      → pills, circles, avatars, bottom-nav
rounded-[28px]    → main cards
rounded-[24px]    → payment cards
rounded-[22px]    → stat cards, primary buttons
rounded-[20px]    → announcement cards, search, grid items
rounded-2xl       → visitor cards, settings rows (16px)

HEIGHT
h-12  → search bar (48px)
h-13  → buttons (52px)
h-16  → bottom nav (64px)
h-10  → icon buttons (40px)
h-11  → large icon circles (44px)

AVATAR
w-10 h-10   → 40px header avatar icon buttons
w-12 h-12   → 48px visitor list avatars
w-18 h-18   → 72px profile hero avatar
```

---

## 8. Bottom Navigation Implementation

### No library needed — custom implementation

```tsx
// components/ui/bottom-bar/BottomBar.tsx

import { View, TouchableOpacity } from 'react-native'
import { BlurView } from 'expo-blur'
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const RESIDENT_TABS = [
  { key: 'home',      icon: House,         route: '/(resident)/(tabs)/' },
  { key: 'pencil',    icon: PenLine,       route: '/(resident)/(tabs)/complaints' },
  { key: 'people',    icon: Users,         route: '/(resident)/(tabs)/visitors' },
  { key: 'chat',      icon: MessageCircle, route: '/(resident)/(tabs)/community' },
  { key: 'grid',      icon: LayoutGrid,    route: '/(resident)/(tabs)/more' },
]

// Position: absolute bottom-4 left-5 right-5
// BlurView wraps everything
// Active tab: dark circle 44×44 behind icon
// Inactive: just icon, color #666
// Transition: Reanimated spring on tab change
```

**CSS Positioning:**
```
Position:  absolute
Bottom:    16px
Left:      20px  
Right:     20px
Height:    64px
Radius:    999px (full pill)
Overflow:  hidden (for BlurView)
Tint:      dark (on dark screens) / light (on light screens)
```

---

## 9. Library Mapping

### What builds what

| UI Element | Library |
|---|---|
| Bottom Nav blur | `expo-blur` (BlurView) |
| Bottom Nav animation | `react-native-reanimated` |
| Screen transitions | `react-native-reanimated` (sharedTransition) |
| Card press animation | `react-native-reanimated` (withSpring scale) |
| Visitor list | `@shopify/flash-list` |
| Facilities grid | `@shopify/flash-list` (numColumns=2) |
| Facility card gradient | `expo-linear-gradient` |
| Profile hero gradient | `expo-linear-gradient` |
| Lime pay button | Custom (NativeWind only) |
| Search bar | Custom (NativeWind + Lucide) |
| Stat cards | Custom (NativeWind only) |
| Settings rows | Custom (NativeWind only) |
| Icons everywhere | `lucide-react-native` |
| Avatar images | `expo-image` (with blurhash) |
| Form inputs | `react-hook-form` + `zod` |
| Visitor approval sheet | `@gorhom/bottom-sheet` |
| Haptic on approve | `expo-haptics` |
| Skeleton loading | `moti/skeleton` |
| Success animation | `lottie-react-native` |
| Charts (admin) | `victory-native` |
| Calendar (booking) | `react-native-calendars` |

### ❌ Do NOT install
```
React Native Paper
NativeBase
UI Kitten
React Native Elements
Shoutem
Ant Design Mobile
Gluestack (unless replacing reusables)
```

---

*UI Spec v1.0 · Portl · Extracted from Reference Screenshots*

# MotoCare AstraPay — Project Context

> **For:** Google Gemini / Antigravity continuation
> **Goal:** Integrate AstraPay sandbox API, make both web + mobile production-ready
> **Last updated:** 2026-06-06-17

---

## 1. Project Overview

**Name:** MotoCare AstraPay
**Type:** Consumer-facing mobile app for motorcycle owners to book service/maintenance and pay via AstraPay
**Hackathon:** AstraPay Hackathon
**Author:** Muhamad Septian Pamungkas

**Live URL:** https://seppam.github.io/motocare-astrapay/

---

## 2. ⚠️ Critical: No Source Code Available

This folder contains **only the compiled web export**. There is no Expo project source, no `package.json`, no `app/` directory, and no `node_modules` with actual project dependencies.

**What this means:**
- You **cannot** continue development from this folder directly
- The GitHub repo `seppam/motocare-astrapay` (both `main` and `gh-pages` branches) also contains only compiled output — no source
- **You must rebuild the Expo project from scratch**

The good news: the deployed app is functional, so Gemini can use it as a reference UI to rebuild from.

---

## 3. What the Deployed App Does (Known from Bundle Analysis)

Based on the compiled bundle and metadata:

- **Purpose:** Motorcycle service booking + AstraPay QRIS payment
- **Bundler:** Metro (standard Expo/React Native)
- **Platforms supported:** Android, iOS, Web (from `metadata.json`)
- **Icon library:** Ionicons (confirmed from font assets)
- **UI language:** Indonesian
- **Primary color:** Emerald green `#10b981` (AstraPay brand)
- **Theme:** Likely dark navy to match POS Astrapay (same hackathon, same author)

**Probable user flow:**
1. User opens app → sees service categories (oil change, tire service, general service, etc.)
2. User selects service → picks workshop/technician + date/time
3. User sees price estimate → proceeds to checkout
4. User scans merchant's QRIS OR enters AstraPay details to pay
5. Booking confirmed → gets digital receipt
6. User can view booking history

---

## 4. Rebuild Plan

Since there's no source, Gemini should create a **new Expo project** and build the app from scratch using the deployed app as a UI reference.

### 4.1 Create the Project

```bash
# Option A: With Expo Router (recommended, file-based routing)
npx create-expo-app@latest MotoCareAstraPay --template blank
cd MotoCareAstraPay

# Option B: With TypeScript
npx create-expo-app@latest MotoCareAstraPay --template blank-typescript
```

### 4.2 Install Dependencies

```bash
# Navigation
npx expo install expo-router expo-linking expo-constants expo-status-bar

# UI / Icons
npx expo install @expo/vector-icons

# Storage
npx expo install @react-native-async-storage/async-storage

# QR Code (for displaying merchant QRIS)
npx expo install react-native-qrcode-svg expo-image

# Forms / Date Picker
npx expo install react-native-paper react-native-safe-area-context
```

### 4.3 Recommended App Structure

```
MotoCareAstraPay/
├── app/
│   ├── _layout.tsx           # Root layout with tab navigator
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Tab bar layout
│   │   ├── index.tsx         # Home: service categories
│   │   ├── booking.tsx       # My bookings / history
│   │   └── profile.tsx       # User profile + linked AstraPay
│   ├── service/
│   │   └── [id].tsx          # Service detail + book now
│   └── payment/
│       └── [bookingId].tsx   # Checkout + AstraPay QRIS payment
├── components/
│   ├── ServiceCard.tsx        # Service category card
│   ├── BookingCard.tsx        # Active / completed booking card
│   ├── PaymentQRIS.tsx        # QRIS display + countdown
│   ├── WorkshopCard.tsx       # Partner workshop option
│   └── BookingStepper.tsx     # Step indicator (book → pay → confirm)
├── constants/
│   ├── services.ts            # Static service package data
│   └── theme.ts               # Colors, spacing, typography
├── lib/
│   └── astrapay.ts            # AstraPay API integration
└── app.json
```

### 4.4 Suggested Service Categories

```typescript
const SERVICES = [
  {
    id: 'oli-ganti',
    name: 'Ganti Oli',
    icon: 'water-outline',
    description: 'Penggantian oli mesin & filter oli',
    estimatedPrice: 'Rp 35.000 - 80.000',
    estimatedTime: '15 - 30 menit',
  },
  {
    id: 'ban',
    name: 'Service Ban',
    icon: 'construct-outline',
    description: 'Pemeriksan & perbaikan ban, tambal ban',
    estimatedPrice: 'Rp 15.000 - 50.000',
    estimatedTime: '15 - 45 menit',
  },
  {
    id: 'service-ringan',
    name: 'Service Ringan',
    icon: 'build-outline',
    description: 'Tune-up ringan, cek rem, rantai, lampu',
    estimatedPrice: 'Rp 25.000 - 60.000',
    estimatedTime: '30 - 60 menit',
  },
  {
    id: 'bebas-anjir',
    name: 'Bebas Anjir',
    icon: 'flash-outline',
    description: 'Service lengkap, premium package',
    estimatedPrice: 'Rp 100.000 - 250.000',
    estimatedTime: '1 - 2 jam',
  },
];
```

---

## 5. AstraPay Integration Points

### 5.1 QRIS Consumer Payment

The user pays the workshop by **scanning the workshop's AstraPay QRIS code** (consumer-to-merchant QRIS flow).

```
Flow:
1. User completes booking → sees total price
2. App displays workshop's QRIS code (fetched from API or static for demo)
3. User opens AstraPay app → scans the QRIS code
4. Payment is confirmed → booking status updated to "Lunas"
5. Digital receipt shown
```

**API to use:** AstraPay QRIS (merchant-presented mode) — https://www.astrapay.com/docs/api/

### 5.2 Environment Variables (`.env`)

```bash
NEXT_PUBLIC_ASTRAPAY_SANDBOX_URL=https://api-sandbox.astrapay.com
NEXT_PUBLIC_ASTRAPAY_MERCHANT_ID=workshop_merchant_id
ASTRAPAY_API_KEY=your_sandbox_api_key
```

---

## 6. Design System

To match the POS Astrapay aesthetic (same hackathon, same author):

```typescript
const COLORS = {
  background:   '#0a1128',  // Dark navy — page background
  surface:      '#111827',  // Card background
  border:       '#1e3a5f',  // Dividers, borders
  primary:      '#10b981',  // Emerald green — CTA, success
  primaryHover: '#059669',  // CTA hover
  text:         '#ffffff',  // Primary text
  textMuted:    '#94a3b8',  // Secondary text
  danger:       '#ef4444',  // Error, out-of-stock
  warning:      '#f59e0b',  // Pending states
};
```

**Font:** Inter or Manrope (Google Fonts)
**Icons:** Ionicons (confirmed from original build)

---

## 7. Deployment

### Web (current — GitHub Pages)
```bash
# Static export
npx expo export --platform web

# The output goes to dist/ or web-build/
# Copy contents to gh-pages branch
```

### Mobile (Android APK / AAB)
```bash
# Build Android APK via EAS
eas build --platform android --profile preview

# Or local build
npx expo prebuild --platform android
eas build --local --platform android --profile preview
```

---

## 8. Next Steps for Gemini

1. **Read the deployed app** at https://seppam.github.io/motocare-astrapay/ to understand the current UI/screens
2. **Create the new Expo project** with the structure in section 4.3
3. **Fetch AstraPay sandbox docs** at https://www.astrapay.com/docs/api/
4. **Build the service listing + booking UI first** (mock data is fine initially)
5. **Integrate QRIS payment** using the AstraPay sandbox API
6. **Deploy web** to Vercel or GitHub Pages
7. **Build mobile APK** via EAS for testing

---

## 9. Author

**Muhamad Septian Pamungkas** — Built for AstraPay Hackathon
